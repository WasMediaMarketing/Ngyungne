import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "../ui/button";
import { Ambassador } from "@/types/ambassador.types";

const MemberCard: React.FC<{
  member: Ambassador;
  onClick: () => void;
  roleColor: string;
}> = ({ member, onClick, roleColor }) => {
  return (
    <>
      <Card
        className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] group cursor-pointer"
        onClick={onClick}
      >
        <div className="relative h-56 overflow-hidden">
          <Image
            src={member.image || "/placeholder.svg"}
            alt={member.name}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-white text-sm line-clamp-3">
              {member.bio.substring(0, 120)}...
            </p>
          </div>
        </div>
        <CardContent className="p-6">
          <Badge className={cn("mb-2", roleColor)}>{member.role}</Badge>
          <h3 className="text-xl font-bold text-foreground mb-1">
            {member.name}
          </h3>
          {member.location && (
            <p className="text-sm text-muted-foreground mb-4">
              {member.location}
            </p>
          )}
          <div className="flex space-x-3">
            {member.socialLinks?.linkedin && (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
            )}
            {member.socialLinks?.twitter && (
              <a
                href={member.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
            )}
            {member.socialLinks?.instagram && (
              <a
                href={member.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
            )}
            {member.socialLinks?.facebook && (
              <a
                href={member.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0 pb-4 px-6">
          <Button variant="outline" size="sm" className="w-full gap-2">
            View Profile <ExternalLink className="h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default MemberCard;
