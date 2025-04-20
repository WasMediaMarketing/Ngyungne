// app/[slug]/[child]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageApi } from "@/utils/pageApi";

// Generate metadata for the child page
export async function generateMetadata({
  params,
}: {
  params: { slug: string; child: string };
}): Promise<Metadata> {
  // Extract params values before using them
  const slug = params?.slug;
  const child = params?.child;

  console.log(`Generating metadata for child page: ${child} (parent: ${slug})`);

  // Find the child page by slug
  const childPage = await pageApi.getPageBySlug(child);

  if (!childPage) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  return {
    title: childPage.metaTitle || childPage.title,
    description:
      childPage.metaDescription || `${childPage.title} - Ngyungne Practice`,
    keywords: childPage.metaKeywords || "",
  };
}

export default async function NestedDynamicPage({
  params,
}: {
  params: { slug: string; child: string };
}) {
  // Extract params values before using them
  const slug = params?.slug;
  const child = params?.child;

  console.log(`Rendering nested page with child: ${child}, parent: ${slug}`);

  // Find the child page by slug
  const childPage = await pageApi.getPageBySlug(child);
  if (!childPage) {
    console.log(`Child page not found: ${child}`);
    notFound();
  }

  // Also verify that the parent page exists with the given slug
  const parentPage = await pageApi.getPageBySlug(slug);
  if (!parentPage) {
    console.log(`Parent page not found: ${slug}`);
    notFound();
  }

  // Verify that the parent-child relationship is correct
  if (
    !childPage.parentPage ||
    childPage.parentPage === "none" ||
    parentPage.id !== childPage.parentPage
  ) {
    console.log(
      `Invalid parent-child relationship between ${slug} and ${child}`
    );
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <article className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-6">{childPage.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: childPage.content }} />
      </article>
    </main>
  );
}
