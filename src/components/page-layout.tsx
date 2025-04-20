import type React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  keywords?: string;
}

export function PageLayout({
  children,
  title,
  description,
  keywords,
}: PageLayoutProps) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold mb-6">{title}</h1>
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
