"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page after 5 seconds
    const timer = setTimeout(() => {
      router.push("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        >
          <AlertCircle className="mx-auto h-24 w-24 text-destructive" />
        </motion.div>
        <h1 className="mt-8 text-4xl font-bold">Unauthorized Access</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          You do not have permission to access this page.
        </p>
        <p className="mt-2 text-muted-foreground">
          Redirecting to login page in 5 seconds...
        </p>
        <Button className="mt-8" onClick={() => router.push("/login")}>
          Go to Login
        </Button>
      </motion.div>
    </div>
  );
}
