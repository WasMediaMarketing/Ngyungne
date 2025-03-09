"use client";

import { DonationsDataTable } from "@/components/admin/donations/donations-data-table";
import { Toaster } from "sonner";

export default function DonationsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Donation Management</h1>
      <DonationsDataTable />
      <Toaster />
    </div>
  );
}
