"use client";
import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { InstagramIcon } from "lucide-react";
import { volunteerApi } from "@/utils/volunteerApi";
import Spinner from "../spinner";

// Interface to match the simplified API
interface VolunteerFormData {
  fullname: string;
  phone: string;
  email: string;
  address: string;
  reason: string;
  image: File | null;
  socialLinks: Record<string, string>;
}

interface VolunteerFormProps {
  onSubmit?: (data: VolunteerFormData) => void;
}

export default function VolunteerForm({ onSubmit }: VolunteerFormProps) {
  // Form state
  const [formData, setFormData] = useState<VolunteerFormData>({
    fullname: "",
    phone: "",
    email: "",
    address: "",
    reason: "",
    image: null,
    socialLinks: {
      instagram: "",
      facebook: "",
      linkedin: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("social.")) {
      const socialNetwork = name.split(".")[1];
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialNetwork]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({
          ...formData,
          image: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({
          ...formData,
          image: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Prevent default behavior for drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Trigger file input click
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      fullname: "",
      phone: "",
      email: "",
      address: "",
      reason: "",
      image: null,
      socialLinks: {
        instagram: "",
        facebook: "",
        linkedin: "",
      },
    });
    setImagePreview(null);
    setSuccess(true);

    // Reset success message after 5 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.fullname.trim()) throw new Error("Name is required");
      if (!formData.email.trim()) throw new Error("Email is required");
      if (!formData.phone.trim()) throw new Error("Phone number is required");
      if (!formData.reason.trim()) throw new Error("Reason is required");
      if (!formData.address.trim()) throw new Error("Address is required");

      // Submit to API using the simplified API
      const success = await volunteerApi.createVolunteer({
        fullname: formData.fullname,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        reason: formData.reason,
        image: formData.image,
        socialLinks: formData.socialLinks,
      });

      if (success) {
        // Call the onSubmit prop if provided (for backward compatibility)
        if (onSubmit) {
          onSubmit(formData);
        }

        // Reset form
        resetForm();
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setError(
        error.message || "Failed to submit application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-maroon-700 mb-6">
        Become a Volunteer
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
          Your volunteer application has been submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="fullname"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            name="fullname"
            id="fullname"
            required
            value={formData.fullname}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <textarea
            name="address"
            id="address"
            required
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
            placeholder="Your address"
          />
        </div>

        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700"
          >
            Can you share why you're interested in volunteering?
          </label>
          <textarea
            name="reason"
            id="reason"
            required
            value={formData.reason}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
            placeholder="Your answer"
          />
        </div>

        {/* Social Links Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Social Media Links (Optional)
          </label>

          <div>
            <div className="flex items-center">
              <InstagramIcon className="h-5 w-5 mr-2" />
              <input
                type="url"
                name="social.instagram"
                id="social-instagram"
                value={formData.socialLinks.instagram}
                onChange={handleInputChange}
                className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                placeholder="Instagram URL"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-blue-600 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="url"
                name="social.facebook"
                id="social-facebook"
                value={formData.socialLinks.facebook}
                onChange={handleInputChange}
                className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                placeholder="Facebook URL"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-blue-700 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <input
                type="url"
                name="social.linkedin"
                id="social-linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleInputChange}
                className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                placeholder="LinkedIn URL"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <div
            onClick={handleImageClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-saffron-300 rounded-md cursor-pointer hover:border-saffron-500 transition-colors bg-saffron-50"
          >
            <div className="space-y-1 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              {imagePreview ? (
                <div className="mx-auto">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={imagePreview}
                    alt="Preview"
                    className="h-40 w-40 object-cover rounded-full mx-auto border-4 border-white shadow-md"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Click or drag to change
                  </p>
                </div>
              ) : (
                <div>
                  <svg
                    className="mx-auto h-12 w-12 text-saffron-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-sm text-saffron-600 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-base font-semibold text-white bg-gradient-to-r from-crimson-600 to-saffron-600 hover:from-crimson-700 hover:to-saffron-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crimson-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Spinner text="Submitting..." />
            ) : (
              "Submit Application"
            )}
          </motion.button>
        </div>
      </form>
    </>
  );
}
