import { Suspense } from "react";
import { CourseDetail } from "@/components/sections/course-detail";
import { Loader } from "@/components/sections/loader";

export default function CoursePage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-saffron-50 py-12">
      <Suspense fallback={<Loader />}>
        <CourseDetail slug={params.slug} />
      </Suspense>
    </main>
  );
}
