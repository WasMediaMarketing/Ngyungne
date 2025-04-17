import { createBlogPostController } from "@/lib/factories/blogPostFactory"; // Assuming factory is created
import { validateBlogPostInput, isAuthenticated } from "@/lib/middlewares"; // Middleware for validation and auth
import { handleMultipartRequest } from "@/lib/utils/multipartHandler"; // Utility for handling multipart form data
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /api/blogpost:
 *   post:
 *     summary: Create a new blog post
 *     description: This endpoint creates a new blog post with title, content, author details, tags, categories, and other required information.
 *     operationId: createBlogPost
 *     tags:
 *       - BlogPost
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image for the blog post ( processed later)
 *               authorImage:
 *                 type: string
 *                 format: binary
 *                 description: Image for the blog post (optional, processed later)
 *               title:
 *                 type: string
 *                 description: Title of the blog post
 *               description:
 *                 type: string
 *                 description: Short description of the blog post
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date of the blog post
 *               readTime:
 *                 type: string
 *                 description: Estimated read time of the blog post
 *               author:
 *                 type: object
 *                 description: Author details (name, bio, etc.)
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Author's name
 *                   bio:
 *                     type: string
 *                     description: Short bio of the author
 *                   image:
 *                     type: string
 *                     description: Author's image URL
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags related to the blog post
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Categories the blog post belongs to
 *               content:
 *                 type: string
 *                 description: Content of the blog post
 *               views:
 *                 type: integer
 *                 description: Number of views for the blog post (optional)
 *               isVisible:
 *                 type: boolean
 *                 description: Whether the blog post is visible or not (optional)
 *     responses:
 *       200:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Unauthorized or invalid token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export async function POST(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const uploadFields = [
    { fileField: "image", bodyField: "image" },
    { fileField: "authorImage", bodyField: "author.image" },
  ];
  const jsonFields = ["tags", "categories", "author", "metaKeywords"]; // Additional fields for blog post
  const numericFields = ["views"]; // Numeric fields for blog post
  const booleanFields = ["isVisible"]; // Optional visibility flag

  const processedRequest = await handleMultipartRequest(
    req,
    uploadFields,
    jsonFields,
    numericFields,
    booleanFields
  );

  if (processedRequest instanceof NextResponse) return processedRequest;

  const validationResponse = await validateBlogPostInput(processedRequest);

  if (validationResponse) return validationResponse;

  const blogPostController = createBlogPostController();
  return blogPostController.createBlogPost(processedRequest);
}

/**
 * @openapi
 * /api/blogpost:
 *   get:
 *     summary: Retrieve all blog posts or published blog posts
 *     description: Fetches all blog posts for authenticated users, or only published blog posts for unauthenticated users.
 *     operationId: getBlogPosts
 *     tags:
 *       - BlogPost
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of blog posts (all blog posts for authenticated users, only published blog posts for unauthenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   views:
 *                     type: integer
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   categories:
 *                     type: array
 *                     items:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  const blogPostController = createBlogPostController();

  if (authResult) {
    return blogPostController.getPublishedBlogPosts(); // Only published for unauthenticated
  }

  return blogPostController.getBlogPosts(); // Get all for authenticated users
}

/**
 * @openapi
 * /api/blogpost:
 *   delete:
 *     summary: Delete multiple blog posts
 *     description: This endpoint deletes multiple blog posts by their IDs, which are passed in the query parameters.
 *     operationId: deleteBlogPosts
 *     tags:
 *       - BlogPost
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: blogPostIds
 *         required: true
 *         description: Comma-separated list of blog post IDs to be deleted.
 *         schema:
 *           type: string
 *           example: "1,2,3"
 *     responses:
 *       200:
 *         description: Blog posts deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the deletion
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input or missing blogPostIds
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const blogPostController = createBlogPostController();
  return blogPostController.deleteBlogPosts(req);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb", // or whatever limit you want
    },
  },
};
