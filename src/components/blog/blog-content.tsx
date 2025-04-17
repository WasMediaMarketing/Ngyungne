"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type ContentItem = {
  type: string;
  content?: string;
  level?: number;
  src?: string;
  alt?: string;
  caption?: string;
  poster?: string;
  author?: string;
  items?: string[];
};

type BlogContentProps = {
  content: ContentItem[];
  containerVariants: any;
  itemVariants: any;
};

export function BlogContent({
  content,
  containerVariants,
  itemVariants,
}: BlogContentProps) {
  return (
    <motion.div
      className="prose prose-lg md:prose-xl text-maroon-800 max-w-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {content?.map((item, index) => {
        switch (item.type) {
          case "text":
            return (
              <motion.p
                key={index}
                className="mb-6 leading-relaxed"
                variants={itemVariants}
              >
                {item.content}
              </motion.p>
            );
          case "heading":
            return item.level === 2 ? (
              <motion.h2
                key={index}
                className="text-xl md:text-2xl font-semibold text-crimson-800 mt-8 mb-4"
                variants={itemVariants}
              >
                {item.content}
              </motion.h2>
            ) : (
              <motion.h3
                key={index}
                className="text-lg md:text-xl font-medium text-crimson-700 mt-6 mb-3"
                variants={itemVariants}
              >
                {item.content}
              </motion.h3>
            );
          case "image":
            return (
              <motion.div key={index} className="my-8" variants={itemVariants}>
                <div className="relative">
                  <Image
                    src={item.src || "/placeholder.svg"}
                    alt={item.alt || "Image"}
                    width={800}
                    height={400}
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                </div>
                {item.caption && (
                  <p className="text-sm text-maroon-600 text-center mt-2 italic">
                    {item.caption}
                  </p>
                )}
              </motion.div>
            );
          case "video":
            return (
              <motion.div key={index} className="my-8" variants={itemVariants}>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <video
                    controls
                    poster={item.poster}
                    className="w-full rounded-lg"
                  >
                    <source src={item.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                {item.caption && (
                  <p className="text-sm text-maroon-600 text-center mt-2 italic">
                    {item.caption}
                  </p>
                )}
              </motion.div>
            );
          case "quote":
            return (
              <motion.blockquote
                key={index}
                className="pl-4 border-l-4 border-saffron-300 italic my-6 text-maroon-700"
                variants={itemVariants}
              >
                <p className="mb-2">{item.content}</p>
                {item.author && (
                  <footer className="text-sm text-maroon-600 not-italic">
                    — {item.author}
                  </footer>
                )}
              </motion.blockquote>
            );
          case "list":
            return (
              <motion.ul
                key={index}
                className="list-disc pl-5 space-y-2 my-4"
                variants={itemVariants}
              >
                {item?.items?.map((listItem, listItemIndex) => (
                  <li key={listItemIndex} className="text-maroon-800">
                    {listItem}
                  </li>
                ))}
              </motion.ul>
            );
          default:
            return null;
        }
      })}
    </motion.div>
  );
}
