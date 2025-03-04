"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import { Metadata } from "next";
import { DynamicBreadcrumbs } from "@/components/admin-breadcrumbs";
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from "@/components/auth-guard";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const metadata: Metadata = {
  title: "Ngyungne Practice - Buddhist Teachings & Practices",
  description:
    "Discover Tibetan Buddhist teachings, events, and practices with Ngyungne Practice.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Client component wrapper to get the current path
  const ClientLayout = () => {
    const pathname = usePathname();

    return (
      <AuthGuard>
        <SidebarProvider>
          <AppSidebar activePath={pathname} />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-saffron-50">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <DynamicBreadcrumbs />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-saffron-50">
              {children}
              <Toaster />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    );
  };

  return (
    <html lang="en" className={poppins.className}>
      <body>
        {/* 
          We need to use a client component wrapper since usePathname() 
          is a client hook and can't be used directly in a Server Component
        */}
        <ClientLayout />
      </body>
    </html>
  );
}
