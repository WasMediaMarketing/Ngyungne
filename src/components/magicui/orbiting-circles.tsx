import { cn } from "@/lib/utils";
import React, { useState } from "react";

export interface OrbitingCirclesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  reverse?: boolean;
  duration?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
  items: Array<{
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

export function OrbitingCircles({
  className,
  reverse,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
  items,
  ...props
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed;
  const [hoveredItem, setHoveredItem] = useState<null | (typeof items)[0]>(
    null
  );

  return (
    <div className="relative flex items-center justify-center">
      {/* Orbiting Path (Circle) */}
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
          style={{
            width: `${2 * radius}px`,
            height: `${2 * radius}px`,
            left: `calc(50% - ${radius}px)`, // Position it centered
            top: `calc(50% - ${radius}px)`, // Position it centered
          }}
        >
          {/* Circle as the orbit path */}
          <circle
            className="stroke-black/10 stroke-2 dark:stroke-white/10"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}

      {/* Orbiting Items */}
      {items.map((item, index) => {
        const angle = (360 / items.length) * index;

        return (
          <div
            key={item.id}
            style={
              {
                "--duration": calculatedDuration,
                "--radius": radius,
                "--angle": angle,
                "--icon-size": `${iconSize}px`,
              } as React.CSSProperties
            }
            className={cn(
              `absolute flex size-[var(--icon-size)] transform-gpu animate-orbit items-center justify-center rounded-full transition-transform hover:scale-110 cursor-pointer`,
              { "[animation-direction:reverse]": reverse },
              className
            )}
            onMouseEnter={() => setHoveredItem(item)}
            onMouseLeave={() => setHoveredItem(null)}
            {...props}
          >
            {item.icon}
          </div>
        );
      })}

      {/* Card Displaying Hovered Item Details */}
      {hoveredItem && (
        <div className="absolute bottom-[-120px] z-10 w-64 p-4 bg-white shadow-lg rounded-lg dark:bg-gray-800 transition-opacity duration-300 opacity-100">
          <h3 className="text-lg font-semibold">{hoveredItem.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {hoveredItem.description}
          </p>
        </div>
      )}
    </div>
  );
}
