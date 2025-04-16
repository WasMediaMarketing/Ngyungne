// app/(public)/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageApi } from "@/utils/pageApi";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Make sure params is fully resolved before using it
  const slug = params?.slug;

  try {
    const page = await pageApi.getPageBySlug(slug);

    if (!page) {
      return {
        title: "Page Not Found",
        description: "The requested page could not be found.",
      };
    }

    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || `${page.title} - Ngyungne Practice`,
      keywords: page.metaKeywords || "",
    };
  } catch (error) {
    console.error(`Error generating metadata for ${slug}:`, error);
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }
}

export default async function DynamicPage({
  params,
}: {
  params: { slug: string };
}) {
  // Extract the slug before using it
  const slug = params?.slug;
  console.log(`Rendering dynamic page for slug: ${slug}`);

  const page = await pageApi.getPageBySlug(slug);
  console.log(`Page fetched: ${JSON.stringify(page)}`);
  if (!page) {
    console.log(`Page not found for slug: ${slug}, showing 404`);
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <article className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </main>
  );
}
