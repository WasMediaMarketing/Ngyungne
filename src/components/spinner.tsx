"use client";

import { Loader2 } from "lucide-react";

const Spinner = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin text-yellow-200" />
      {text}
    </div>
  );
};

export default Spinner;
