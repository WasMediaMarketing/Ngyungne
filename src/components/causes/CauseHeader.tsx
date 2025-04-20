import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Eye } from "lucide-react";

interface CauseHeaderProps {
  cause: {
    image: string;
    title: string;
    subtitle: string;
    categories?: string[];
    tags?: string[];
    taxDeductible?: boolean;
    verified?: boolean;
    gallery?: string[];
  };
  onOpenGallery: () => void;
}

export function CauseHeader({ cause, onOpenGallery }: CauseHeaderProps) {
  // Use categories if available, otherwise use tags, or default to empty array
  const displayCategories = cause.categories?.length
    ? cause.categories
    : cause.tags?.length
    ? cause.tags
    : [];

  return (
    <Card className="bg-white border-saffron-200 overflow-hidden shadow-sm mb-8">
      <div className="bg-crimson-700 text-white px-4 py-3 flex justify-between items-center"></div>

      <div className="relative aspect-video overflow-hidden">
        <Image
          src={cause.image || "/placeholder.svg?height=400&width=800"}
          alt={cause.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {cause.gallery && cause.gallery.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="flex space-x-2">
              {cause.gallery.slice(0, 4).map((img, index) => (
                <button
                  key={index}
                  onClick={onOpenGallery}
                  className="w-16 h-16 rounded-md overflow-hidden border-2 border-white/80 transition-all hover:border-white hover:scale-105"
                >
                  <Image
                    src={img || "/placeholder.svg?height=64&width=64"}
                    alt={`Gallery image ${index + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
              {cause.gallery.length > 4 && (
                <button
                  onClick={onOpenGallery}
                  className="w-16 h-16 rounded-md overflow-hidden border-2 border-white/80 bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all"
                >
                  +{cause.gallery.length - 4}
                </button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenGallery}
              className="bg-white/90 hover:bg-white text-maroon-800"
            >
              <Eye className="h-4 w-4 mr-2" /> View Gallery
            </Button>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        {displayCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {displayCategories.map((category, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="bg-saffron-100 text-maroon-700 border-saffron-200"
              >
                {category}
              </Badge>
            ))}
          </div>
        )}
        <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-crimson-800 font-bold">
          {cause.title}
        </CardTitle>
        <p className="text-lg text-maroon-600">{cause.subtitle}</p>
      </CardHeader>
    </Card>
  );
}
