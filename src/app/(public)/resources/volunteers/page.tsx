"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import VolunteerForm from "@/components/volunteer/volunteer-form";
import VolunteerCard from "@/components/volunteer/volunteer-card";
import BenefitsSection from "@/components/volunteer/benefits-section";
import PageBadge from "@/components/volunteer/page-badge";
import VolunteerCTA from "@/components/volunteer/volunteerCTA";
import { volunteerApi } from "@/utils/volunteerApi";

interface Volunteer {
  id: number | string;
  fullname: string;
  phone: string;
  email: string;
  address: string;
  image: string | null;
  reason: string;
  socialLinks?: Record<string, string>;
}

const VolunteerPage = () => {
  // Volunteers state
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch volunteers on component mount
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const data = await volunteerApi.getVolunteers();
        setVolunteers(data);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  // Handle form submission
  const handleAddVolunteer = (newVolunteer: any) => {
    // The API call is now handled in the form component
    // This is just for immediate UI update after submission
    const volunteerWithId = {
      ...newVolunteer,
      id: volunteers.length + 1,
      image: newVolunteer.image || "/placeholder.svg?height=150&width=150",
    };

    setVolunteers([...volunteers, volunteerWithId]);
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

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saffron-500"></div>
              </div>
            ) : volunteers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {volunteers.map((volunteer) => (
                  <VolunteerCard key={volunteer.id} volunteer={volunteer} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">
                  No volunteers yet. Be the first to join our team!
                </p>
              </div>
            )}
          </motion.div>

          {/* Call to Action */}
          <VolunteerCTA />
        </div>
      </div>
    </>
  );
};

export default VolunteerPage;
