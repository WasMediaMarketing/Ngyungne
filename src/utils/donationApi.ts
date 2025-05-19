import type { IDonationInput, IDonationData } from "@/types";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Get the admin token from localStorage (if available)
const getAdminToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken");
  }
  return null;
};

// Helper function to handle API errors
const handleApiError = (error: any, customMessage: string) => {
  console.error(error);
  toast.error("Error", {
    description: customMessage,
  });
  return null;
};

/**
 * Create a new donation
 * @param donationData The donation data to submit
 * @param file The screenshot file to upload
 */
export const createDonation = async (
  donationData: Omit<IDonationInput, "screenshot">,
  file: File | null
): Promise<IDonationData | null> => {
  try {
    const formData = new FormData();

    // Add all donation data to the form
    Object.entries(donationData).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    // Add the screenshot file if provided
    if (file) {
      formData.append("screenshot", file);
    }

    const response = await fetch("/api/donation", {
      method: "POST",
      body: formData,
      // No Content-Type header as it's set automatically for FormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create donation");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to submit donation");
  }
};

/**
 * Get all donations (admin only)
 */
export const getAllDonations = async (): Promise<IDonationData[] | null> => {
  try {
    const token = getAdminToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch("/api/donation", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch donations");
    }

    const responseData = await response.json();
    // Check if the response has a data property
    const data = responseData.data || responseData;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    handleApiError(error, "Failed to fetch donations");
    return [];
  }
};

/**
 * Delete a donation by ID (admin only)
 * @param id The ID of the donation to delete
 */
export const deleteDonation = async (id: string): Promise<boolean> => {
  try {
    const token = getAdminToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`/api/donation/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete donation");
    }

    toast.success("Success", {
      description: "Donation deleted successfully",
    });
    return true;
  } catch (error) {
    handleApiError(error, "Failed to delete donation");
    return false;
  }
};

/**
 * Delete multiple donations by IDs (admin only)
 * @param ids Array of donation IDs to delete
 */
export const deleteDonations = async (ids: string[]): Promise<boolean> => {
  if (!ids || ids.length === 0) {
    toast.error("Error", {
      description: "No donation IDs provided for deletion",
    });
    return false;
  }

  try {
    const token = getAdminToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`/api/donation?donationIds=${ids.join(",")}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete donations";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    toast.success("Success", {
      description: `${ids.length} donation(s) deleted successfully`,
    });
    return true;
  } catch (error) {
    console.error("Error in deleteDonations:", error);
    toast.error("Error", {
      description:
        error instanceof Error ? error.message : "Failed to delete donations",
    });
    return false;
  }
};

/**
 * Generate and download a donation receipt as PDF
 * @param donation The donation data to include in the receipt
 */
export const downloadDonationReceipt = (donation: IDonationData) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const currentDate = new Date().toLocaleDateString();

    // Add organization logo (you'll need to add this image to your public folder)
    try {
      // Add logo - adjust the path as needed
      doc.addImage(
        "/logo.png",
        "PNG",
        pageWidth / 2 - 30,
        10,
        60,
        30,
        undefined,
        "FAST"
      );
    } catch (e) {
      console.error("Error adding logo:", e);
      // If logo fails to load, use text instead
      doc.setFontSize(20);
      doc.setTextColor(128, 0, 32); // Maroon color
      doc.text("Ngyungne", pageWidth / 2, 20, { align: "center" });
    }

    // Add organization info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Jorpati, Gokarneshwor 5", pageWidth / 2, 45, { align: "center" });
    doc.text("Phone: 981-8123174", pageWidth / 2, 53, { align: "center" });
    doc.text("Email: donation@ngyungne.org", pageWidth / 2, 61, {
      align: "center",
    });

    // Add a horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 68, pageWidth - 14, 68);

    // Add receipt title
    doc.setFontSize(16);
    doc.setTextColor(128, 0, 32);
    doc.text("DONATION RECEIPT", pageWidth / 2, 78, { align: "center" });

    // Add receipt date and ID
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Receipt Date: ${currentDate}`, 14, 88);
    doc.text(`Receipt ID: ${donation.id}`, pageWidth - 14, 88, {
      align: "right",
    });

    // Get donor name
    const donorName =
      typeof donation.userId === "object" &&
      donation.userId !== null &&
      "name" in donation.userId
        ? donation.userId.name
        : "Anonymous";

    // Get donor email
    const donorEmail =
      typeof donation.userId === "object" &&
      donation.userId !== null &&
      "email" in donation.userId
        ? donation.userId.email
        : "";

    // Get donor phone
    const donorPhone =
      typeof donation.userId === "object" &&
      donation.userId !== null &&
      "phoneNumber" in donation.userId
        ? donation.userId.phoneNumber
        : "";

    // Get page and pageTitle
    const page =
      typeof donation.userId === "object" &&
      donation.userId !== null &&
      "page" in donation.userId
        ? donation.userId.page
        : "";

    const pageTitle =
      typeof donation.userId === "object" &&
      donation.userId !== null &&
      "pageTitle" in donation.userId
        ? donation.userId.pageTitle
        : "";

    // Add donation details
    const donationDate = (donation as any).createdAt
      ? new Date((donation as any).createdAt).toLocaleDateString()
      : "N/A";

    // Create table with donation details
    autoTable(doc, {
      startY: 95,
      head: [["Description", "Details"]],
      body: [
        ["Donor Name", donorName],
        ["Donor Email", donorEmail],
        ["Donor Phone", donorPhone],
        ["Donation Amount", `$${donation.amount.toFixed(2)}`],
        ["Donation Type", donation.donationType],
        ["Payment Method", donation.donationMethod],
        ["Donation Date", donationDate],
        ["Source", page || "Website"],
        ["Campaign", pageTitle || ""],
      ],
      theme: "grid",
      headStyles: { fillColor: [128, 0, 32], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Add thank you message
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const thankYouY = (doc as any).lastAutoTable.finalY + 20;
    doc.text(
      "Thank you for your generous donation to Ngyungne.",
      pageWidth / 2,
      thankYouY,
      { align: "center" }
    );
    doc.text(
      "Your support helps us continue our important mission.",
      pageWidth / 2,
      thankYouY + 8,
      { align: "center" }
    );

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "This receipt is computer-generated and does not require a signature.",
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 20,
      { align: "center" }
    );

    // Save the PDF
    doc.save(`Donation_Receipt_${donation.id}.pdf`);

    toast.success("Success", {
      description: "Donation receipt downloaded successfully",
    });
  } catch (error) {
    console.error("Error generating receipt:", error);
    toast.error("Error", {
      description: "Failed to generate donation receipt",
    });
  }
};
