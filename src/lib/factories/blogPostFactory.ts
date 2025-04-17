import { BlogPostService } from "@/lib/services";
import { BlogPostController } from "@/lib/controllers";

export function createBlogPostController() {
  const blogPostService = new BlogPostService();
  return new BlogPostController(blogPostService);
}
