import { IBlogPostService } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../utils/errorHandler";
import { handleResponse } from "../utils/responseHandler";
import { httpMessages } from "../utils/HttpMessage";
import { Types } from "mongoose";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";

export class BlogPostController {
  private blogPostService: IBlogPostService;
  constructor(blogPostService: IBlogPostService) {
    this.blogPostService = blogPostService;
  }

  /**
   * @summary Create a new blog post
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the created blog post
   */
  async createBlogPost(req: ExtendedNextRequest): Promise<NextResponse> {
    try {
      const blogPostData = await req.json();
      const blogPost = await this.blogPostService.createBlogPost(blogPostData);
      return handleResponse(blogPost, httpMessages.CREATED());
    } catch (error) {
      return handleError(undefined, req);
    }
  }

  /**
   * @summary Get all blog posts
   * @description Retrieves all blog posts from the system
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the list of blog posts
   */
  async getBlogPosts(): Promise<NextResponse> {
    try {
      const blogPosts = await this.blogPostService.getBlogPosts();
      return handleResponse(blogPosts);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Get all published blog posts
   * @description Retrieves all published blog posts from the system
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the list of published blog posts
   */
  async getPublishedBlogPosts(): Promise<NextResponse> {
    try {
      const blogPosts = await this.blogPostService.getBlogPosts(true);
      return handleResponse(blogPosts);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Get a blog post by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the blog post details
   */
  async getBlogPostById(req: NextRequest): Promise<NextResponse> {
    try {
      const blogPostId = req.nextUrl.pathname.split("/").pop();
      if (!blogPostId || !Types.ObjectId.isValid(blogPostId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Blog Post ID is either missing or invalid")
        );
      }

      // Fetch the blog post using the blogPostId
      const blogPost = await this.blogPostService.getBlogPostById(
        new Types.ObjectId(blogPostId)
      );
      return handleResponse(blogPost);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Update a blog post by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the updated blog post
   */
  async updateBlogPost(
    req: ExtendedNextRequest | NextRequest
  ): Promise<NextResponse> {
    try {
      const blogPostId = req.nextUrl.pathname.split("/").pop();
      if (!blogPostId || !Types.ObjectId.isValid(blogPostId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Blog Post ID is either missing or invalid")
        );
      }

      const blogPostData = await req.json();
      const updatedBlogPost = await this.blogPostService.updateBlogPost(
        new Types.ObjectId(blogPostId),
        blogPostData
      );
      return handleResponse(updatedBlogPost);
    } catch (error) {
      return req instanceof ExtendedNextRequest
        ? handleError(undefined, req)
        : handleError();
    }
  }

  /**
   * @summary Delete a blog post by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating whether the blog post was deleted successfully
   */
  async deleteBlogPost(req: NextRequest): Promise<NextResponse> {
    try {
      const blogPostId = req.nextUrl.pathname.split("/").pop();
      if (!blogPostId || !Types.ObjectId.isValid(blogPostId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Blog Post ID is either missing or invalid")
        );
      }

      const deletedBlogPost = await this.blogPostService.deleteBlogPost(
        new Types.ObjectId(blogPostId)
      );
      return handleResponse(deletedBlogPost);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Delete multiple blog posts by their IDs
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating the result of the bulk delete
   */
  async deleteBlogPosts(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const blogPostIds = url.searchParams.get("blogPostIds");
      if (!blogPostIds) {
        return handleError(
          httpMessages.BAD_REQUEST("Blog Post IDs are required")
        );
      }

      const blogPostIdArray = blogPostIds.split(",").map((id) => id.trim());

      for (const id of blogPostIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Blog Post ID: ${id}`)
          );
        }
      }

      const objectIds = blogPostIdArray.map((id) => new Types.ObjectId(id));

      const isDeleted = await this.blogPostService.deleteBlogPosts(objectIds);
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteBlogPostsController error:", error);
      return handleError();
    }
  }
}
