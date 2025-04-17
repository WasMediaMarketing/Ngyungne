import { Types } from "mongoose";
import { IBlogPostUpdate, IBlogPost, IBlogPostInput } from "@/types";

export interface IBlogPostService {
  createBlogPost(blogPostData: IBlogPostInput): Promise<IBlogPost>;
  getBlogPosts(isVisible?: boolean): Promise<IBlogPost[]>;
  getBlogPostById(blogPostId: Types.ObjectId): Promise<IBlogPost | null>;
  updateBlogPost(
    blogPostId: Types.ObjectId,
    blogPostData: IBlogPostUpdate
  ): Promise<IBlogPost | null>;
  deleteBlogPost(blogPostId: Types.ObjectId): Promise<IBlogPost | null>;
  deleteBlogPosts(blogPostIds: Types.ObjectId[]): Promise<unknown>;
}
