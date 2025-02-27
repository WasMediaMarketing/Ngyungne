import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AuthorProps = {
  author: {
    name: string;
    image: string;
    bio: string;
  };
};

export function BlogAuthorInfo({ author }: AuthorProps) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 bg-saffron-50 rounded-lg p-6">
      <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md">
        <AvatarImage src={author?.image} alt={author?.name} />
        <AvatarFallback className="bg-saffron-200 text-crimson-700 text-xl">
          {author?.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="text-center md:text-left">
        <h3 className="text-xl font-semibold text-crimson-800">
          {author?.name}
        </h3>
        <p className="mt-2 text-maroon-700">{author?.bio}</p>
        <div className="mt-4 flex justify-center md:justify-start space-x-3">
          <Button variant="outline" size="sm" className="rounded-full">
            Follow
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            View All Posts
          </Button>
        </div>
      </div>
    </div>
  );
}
