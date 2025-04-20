import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <main className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold mb-6">Page Not Found</h1>
        <p className="text-xl mb-8">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-white hover:bg-primary/90"
        >
          Return to Home
        </Link>
      </main>
    </>
  );
}
