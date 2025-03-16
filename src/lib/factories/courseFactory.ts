import { CourseService } from "@/lib/services";
import { CourseController } from "@/lib/controllers";

export function createCourseController() {
  const courseService = new CourseService();
  return new CourseController(courseService);
}
