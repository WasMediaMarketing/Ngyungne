import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ContentItem = {
  type: string;
  content?: string;
  level?: number;
};

type TableOfContentsProps = {
  content: ContentItem[];
};

export function BlogTableOfContents({ content }: TableOfContentsProps) {
  return (
    <Card className="bg-white border-saffron-200 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-crimson-800">
          In This Article
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {content
            ?.filter((item) => item.type === "heading")
            .map((heading, index) => (
              <li
                key={index}
                className="pl-2 border-l-2 border-saffron-200 hover:border-crimson-500 transition-colors"
              >
                <Button
                  variant="link"
                  className="text-maroon-700 hover:text-crimson-600 p-0 h-auto"
                >
                  {heading.content}
                </Button>
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
}
