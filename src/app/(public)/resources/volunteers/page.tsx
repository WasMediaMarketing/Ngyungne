"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import VolunteerForm from "@/components/volunteer/volunteer-form";
import VolunteerCard from "@/components/volunteer/volunteer-card";
import BenefitsSection from "@/components/volunteer/benefits-section";
import PageBadge from "@/components/volunteer/page-badge";
import VolunteerCTA from "@/components/volunteer/volunteerCTA";

interface Volunteer {
  id: number;
  fullname: string;
  phone: string;
  email: string;
  address: string;
  image: string | null;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
}

interface VolunteerFormData {
  fullname: string;
  phone: string;
  email: string;
  address: string;
  image: string | null;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
}

const VolunteerPage = () => {
  // Volunteers state (in a real app, this would come from an API)
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    {
      id: 1,
      fullname: "John Doe",
      phone: "+1 (555) 123-4567",
      email: "john.doe@example.com",
      address: "123 Main St, Anytown, USA",
      image: "https://i.pravatar.cc/150?img=1",
      socialLinks: {
        twitter: "https://twitter.com/johndoe",
        facebook: "https://facebook.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
      },
    },
    {
      id: 2,
      fullname: "Jane Smith",
      phone: "+1 (555) 987-6543",
      email: "jane.smith@example.com",
      address: "456 Oak Ave, Somewhere, USA",
      image: "https://i.pravatar.cc/150?img=5",
      socialLinks: {
        twitter: "https://twitter.com/janesmith",
        linkedin: "https://linkedin.com/in/janesmith",
      },
    },
    {
      id: 3,
      fullname: "Alex Johnson",
      phone: "+1 (555) 456-7890",
      email: "alex.johnson@example.com",
      address: "789 Pine Rd, Elsewhere, USA",
      image: "https://i.pravatar.cc/150?img=8",
      socialLinks: {
        facebook: "https://facebook.com/alexjohnson",
        linkedin: "https://linkedin.com/in/alexjohnson",
      },
    },
    {
      id: 4,
      fullname: "Samantha Lee",
      phone: "+1 (555) 234-5678",
      email: "samantha.lee@example.com",
      address: "101 Cedar Ln, Nearby, USA",
      image: "https://i.pravatar.cc/150?img=10",
      socialLinks: {
        twitter: "https://twitter.com/samanthalee",
        facebook: "https://facebook.com/samanthalee",
      },
    },
    {
      id: 5,
      fullname: "Michael Chen",
      phone: "+1 (555) 876-5432",
      email: "michael.chen@example.com",
      address: "202 Maple Dr, Adjacent, USA",
      image: "https://i.pravatar.cc/150?img=12",
      socialLinks: {
        linkedin: "https://linkedin.com/in/michaelchen",
      },
    },
    {
      id: 6,
      fullname: "Taylor Wilson",
      phone: "+1 (555) 345-6789",
      email: "taylor.wilson@example.com",
      address: "303 Birch Blvd, Yonder, USA",
      image: "https://i.pravatar.cc/150?img=15",
      socialLinks: {
        twitter: "https://twitter.com/taylorwilson",
        facebook: "https://facebook.com/taylorwilson",
        linkedin: "https://linkedin.com/in/taylorwilson",
      },
    },
  ]);

  // Handle form submission
  const handleAddVolunteer = (newVolunteer: VolunteerFormData) => {
    const volunteerWithId = {
      ...newVolunteer,
      id: volunteers.length + 1,
      image: newVolunteer.image || "https://i.pravatar.cc/150?img=12", // Ensure image is never null
    };

    setVolunteers([...volunteers, volunteerWithId]);

    // Show success message (in a real app, handle this better)
    alert("Thank you for volunteering!");
  };

  return (
    <>
      <Head>
        <title>Volunteer - Ngyungne Project</title>
        <meta
          name="description"
          content="Join our volunteer team for the Ngyungne Project"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-saffron-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <PageBadge />
            <h1 className="text-5xl font-extrabold text-maroon-800 sm:text-6xl sm:tracking-tight lg:text-7xl">
              Volunteer with <span className="text-saffron-600">Ngyungne</span>
            </h1>
            <div className="h-1 w-40 bg-gradient-to-r from-crimson-500 to-saffron-500 mx-auto my-6 rounded-full"></div>
          </motion.div>

          {/* Benefits and Form Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BenefitsSection />
            </motion.div>

            {/* Volunteer Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white shadow-lg rounded-lg p-8 border border-gray-100"
            >
              <VolunteerForm onSubmit={handleAddVolunteer} />
            </motion.div>
          </div>

          {/* Volunteer List Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-maroon-800">
                Meet Our Volunteers
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-crimson-500 to-saffron-500 mx-auto my-4 rounded-full"></div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                These dedicated individuals are making the Ngyungne Project
                possible through their time and talents.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {volunteers.map((volunteer) => (
                <VolunteerCard key={volunteer.id} volunteer={volunteer} />
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <VolunteerCTA />
        </div>
      </div>
    </>
  );
};

export default VolunteerPage;
