import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BlogNewsletter() {
  return (
    <div className="bg-gradient-to-r from-crimson-50 to-saffron-50 rounded-2xl p-8 border border-saffron-200 shadow-sm">
      <div className="md:flex items-center">
        <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
          <Badge
            variant="outline"
            className="mb-2 bg-white text-crimson-700 border-saffron-200"
          >
            Stay Updated
          </Badge>
          <h3 className="text-2xl font-bold text-crimson-800 mb-2">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-maroon-700">
            Receive the latest articles, meditation guidance, and event updates
            directly in your inbox.
          </p>
        </div>
        <div className="md:w-1/3 flex items-center">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow px-4 py-2 rounded-l-lg border-y border-l border-saffron-200 focus:outline-none focus:ring-2 focus:ring-crimson-500"
          />
          <Button className="rounded-l-none bg-crimson-600 hover:bg-crimson-700">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}
