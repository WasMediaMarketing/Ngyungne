import { BlogPost } from "@/lib/models";
import {
  IBlogPostInput,
  IBlogPostUpdate,
  IBlogPost,
  IBlogPostService,
} from "@/types";
import { connectToDatabase } from "@/lib/utils/mongodb";
import { Types } from "mongoose";
import { deleteFile } from "@/lib/utils/deleteFile"; // Import the deleteFile utility

export class BlogPostService implements IBlogPostService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  /**
   * @description Creates a new blog post in the system
   * @param {IBlogPostInput} blogPostData - Data to create the blog post
   * @returns {Promise<IBlogPost>} The created blog post
   */
  async createBlogPost(blogPostData: IBlogPostInput): Promise<IBlogPost> {
    await this.initializeDbConnection();
    const blogPost = new BlogPost({
      ...blogPostData,
      views: blogPostData.views || 0,
    });
    await blogPost.save();
    return blogPost;
  }

  /**
   * @description Retrieves all blog posts in the system
   * @returns {Promise<IBlogPost[]>} List of all blog posts
   */
  async getBlogPosts(isVisible?: boolean): Promise<IBlogPost[]> {
    await this.initializeDbConnection();
    if (isVisible) {
      return await BlogPost.find({ isVisible: true });
    }
    return await BlogPost.find();
  }

  /**
   * @description Retrieves a single blog post by its ID
   * @param {string} blogPostId - The ID of the blog post to retrieve
   * @returns {Promise<IBlogPost | null>} The blog post found or null if not found
   */
  async getBlogPostById(blogPostId: Types.ObjectId): Promise<IBlogPost | null> {
    await this.initializeDbConnection();
    const blogPost = await BlogPost.findById(blogPostId);
    if (!blogPost) throw new Error("BlogPost not found");
    return blogPost;
  }

  /**
   * @description Updates a blog post by its ID
   * @param {string} blogPostId - The ID of the blog post to update
   * @param {IBlogPostUpdate} blogPostData - The data to update the blog post
   * @returns {Promise<IBlogPost | null>} The updated blog post
   */
  async updateBlogPost(
    blogPostId: Types.ObjectId,
    blogPostData: IBlogPostUpdate
  ): Promise<IBlogPost | null> {
    await this.initializeDbConnection();
    const existingBlogPost = await BlogPost.findById(blogPostId);
    if (!existingBlogPost) {
      throw new Error("BlogPost Not Found");
    }

    // Handle image deletion if new image is provided
    if (
      blogPostData.image &&
      blogPostData.image !== existingBlogPost.image &&
      existingBlogPost.image
    ) {
      deleteFile(existingBlogPost.image); // Delete old image if new one is provided
    }

    const blogPost = await BlogPost.findByIdAndUpdate(
      blogPostId,
      blogPostData,
      {
        new: true,
      }
    );
    if (!blogPost) throw new Error("BlogPost not found");
    return blogPost;
  }

  /**
   * @description Deletes a blog post by its ID
   * @param {string} blogPostId - The ID of the blog post to delete
   * @returns {Promise<IBlogPost | null>} The deleted blog post
   */
  async deleteBlogPost(blogPostId: Types.ObjectId): Promise<IBlogPost | null> {
    await this.initializeDbConnection();

    // Find the blog post to get its image path (if exists)
    const blogPost = await BlogPost.findById(blogPostId);
    if (!blogPost) throw new Error("BlogPost not found");

    // If there's an image, delete it
    if (blogPost.image) {
      deleteFile(blogPost.image); // Delete the image file from the file system
    }

    // Now delete the blog post from the database
    const deletedBlogPost = await BlogPost.findByIdAndDelete(blogPostId);
    return deletedBlogPost;
  }

  /**
   * @description Deletes multiple blog posts by their IDs
   * @param {Types.ObjectId[]} blogPostIds - Array of blog post IDs to delete
   * @returns {Promise<unknown>} A promise indicating the deletion status
   */
  async deleteBlogPosts(blogPostIds: Types.ObjectId[]): Promise<unknown> {
    await this.initializeDbConnection();

    // Find all blog posts to get their image paths (if exists)
    const blogPosts = await BlogPost.find({ _id: { $in: blogPostIds } });
    if (blogPosts.length === 0) throw new Error("No blog posts found");

    // Delete images for all blog posts
    blogPosts.forEach((blogPost) => {
      if (blogPost.image) {
        deleteFile(blogPost.image); // Delete each blog post's image from the file system
      }
    });

    // Delete the blog posts from the database
    const deletedBlogPosts = await BlogPost.deleteMany({
      _id: { $in: blogPostIds },
    });
    return deletedBlogPosts;
  }
}
