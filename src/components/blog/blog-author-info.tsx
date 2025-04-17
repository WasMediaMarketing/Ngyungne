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
      <span className="text-2xl">~</span>
      <div className="text-center md:text-left">
        <h3 className="text-xl font-semibold text-crimson-800">
          {author?.name}
        </h3>
        <p className="mt-2 text-maroon-700">{author?.bio}</p>
      </div>
    </div>
  );
}
