import { JoinCourseService } from "@/lib/services";
import { JoinCourseController } from "@/lib/controllers";

export function createJoinCourseController() {
  const joinCourseService = new JoinCourseService();
  return new JoinCourseController(joinCourseService);
}
