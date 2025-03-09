"use client";
import { motion } from "framer-motion";
import Link from "next/link";
const VolunteerCTA = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mt-20 text-center bg-gradient-to-r from-crimson-500 to-saffron-500 text-white py-12 px-6 rounded-xl shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
      <p className="max-w-2xl mx-auto mb-8 text-white/90">
        Join our growing team of passionate volunteers and help us create
        positive change in our community.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white text-crimson-600 font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <Link href="/resources/volunteers">Become a Volunteer Today</Link>
      </motion.button>
    </motion.div>
  );
};

export default VolunteerCTA;
