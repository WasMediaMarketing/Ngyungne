import { NextRequest, NextResponse } from "next/server";
import { createBlogPostController } from "@/lib/factories/blogPostFactory";
import { isAuthenticated, validateBlogPostUpdate } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";

/**
 * @openapi
 * /api/blogpost/{blogPostId}:
 *   get:
 *     summary: Get blog post by ID
 *     tags:
 *       - BlogPost
 *     parameters:
 *       - in: path
 *         name: blogPostId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const blogPostController = createBlogPostController();
  return blogPostController.getBlogPostById(req);
}

/**
 * @openapi
 * /api/blogpost/{blogPostId}:
 *   patch:
 *     summary: Update blog post by ID (supports file uploads)
 *     tags:
 *       - BlogPost
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               readTime:
 *                 type: string
 *               author:
 *                 type: object
 *               image:
 *                 type: string
 *                 format: binary
 *               authorImage:
 *                 type: string
 *                 format: binary
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               views:
 *                 type: integer
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Blog post updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
export async function PATCH(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const uploadFields = [
    { fileField: "image", bodyField: "image" },
    { fileField: "authorImage", bodyField: "author.image" },
  ];
  const jsonFields = ["tags", "categories", "author", "metaKeywords"];
  const numericFields = ["views"];
  const booleanFields = ["isVisible"];

  const processedRequest = await handleMultipartRequest(
    req,
    uploadFields,
    jsonFields,
    numericFields,
    booleanFields
  );

  if (processedRequest instanceof NextResponse) return processedRequest;

  const validationResponse = await validateBlogPostUpdate(processedRequest);
  if (validationResponse) return validationResponse;

  const blogPostController = createBlogPostController();
  return blogPostController.updateBlogPost(processedRequest);
}

/**
 * @openapi
 * /api/blogpost/{blogPostId}:
 *   put:
 *     summary: Update blog post by ID (JSON only, e.g. `isVisible`)
 *     tags:
 *       - BlogPost
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               readTime:
 *                 type: string
 *               author:
 *                 type: object
 *               image:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               views:
 *                 type: integer
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function PUT(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validationResponse = await validateBlogPostUpdate(req);
  if (validationResponse) return validationResponse;

  const blogPostController = createBlogPostController();
  return blogPostController.updateBlogPost(req);
}

/**
 * @openapi
 * /api/blogpost/{blogPostId}:
 *   delete:
 *     summary: Delete a blog post by ID
 *     tags:
 *       - BlogPost
 *     parameters:
 *       - in: path
 *         name: blogPostId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */
export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const blogPostController = createBlogPostController();
  return blogPostController.deleteBlogPost(req);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb", // or whatever limit you want
    },
  },
};
