import { motion } from "framer-motion";

// Benefits data
const benefits = [
  {
    title: "Make a Difference",
    description:
      "Contribute to meaningful change in your community through direct action.",
    icon: "✨",
  },
  {
    title: "Build Skills",
    description:
      "Develop new abilities and gain valuable experience for your career.",
    icon: "🚀",
  },
  {
    title: "Connect with Others",
    description:
      "Meet like-minded individuals and build your professional network.",
    icon: "🤝",
  },
];

export default function BenefitsSection() {
  return (
    <div className="flex flex-col justify-center">
      <h2 className="text-3xl font-bold text-maroon-700 mb-8">
        Why Volunteer With Us?
      </h2>

      <div className="space-y-8">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-start"
          >
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-saffron-400 to-crimson-400 text-white text-2xl">
              {benefit.icon}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-crimson-700">
                {benefit.title}
              </h3>
              <p className="mt-1 text-gray-600">{benefit.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 p-6 border border-saffron-200 rounded-lg bg-saffron-50 shadow-sm">
        <h3 className="text-lg font-semibold text-crimson-700 mb-2">
          Our Commitment
        </h3>
        <p className="text-gray-700">
          The Ngyungne Project is dedicated to creating positive change. Our
          volunteers are the heart of our organization, bringing passion and
          expertise to every initiative. Join us in making a lasting impact in
          our community.
        </p>
      </div>
    </div>
  );
}
