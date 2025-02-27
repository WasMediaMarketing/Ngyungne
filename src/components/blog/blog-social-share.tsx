import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin } from "lucide-react";

export function BlogSocialShare() {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" className="rounded-full w-8 h-8 p-0">
        <Facebook className="h-4 w-4 text-blue-600" />
        <span className="sr-only">Share on Facebook</span>
      </Button>
      <Button variant="outline" size="sm" className="rounded-full w-8 h-8 p-0">
        <Twitter className="h-4 w-4 text-sky-500" />
        <span className="sr-only">Share on Twitter</span>
      </Button>
      <Button variant="outline" size="sm" className="rounded-full w-8 h-8 p-0">
        <Linkedin className="h-4 w-4 text-blue-700" />
        <span className="sr-only">Share on LinkedIn</span>
      </Button>
    </div>
  );
}
