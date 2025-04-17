"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Users,
  BookOpen,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Bookmark,
  GraduationCap,
  Activity,
} from "lucide-react";
import { getAuthUser, isAuthenticated } from "@/utils/auth";
import { Loader } from "@/components/common/loader";

// Sample data for charts
const monthlyEnrollmentData = [
  { name: "Jan", courses: 65, events: 40, causes: 30, retreats: 24 },
  { name: "Feb", courses: 59, events: 45, causes: 28, retreats: 20 },
  { name: "Mar", courses: 80, events: 52, causes: 35, retreats: 26 },
  { name: "Apr", courses: 81, events: 56, causes: 40, retreats: 35 },
  { name: "May", courses: 90, events: 64, causes: 45, retreats: 40 },
  { name: "Jun", courses: 95, events: 58, causes: 50, retreats: 45 },
  { name: "Jul", courses: 86, events: 55, causes: 48, retreats: 37 },
  { name: "Aug", courses: 94, events: 67, causes: 52, retreats: 30 },
  { name: "Sep", courses: 105, events: 70, causes: 58, retreats: 36 },
  { name: "Oct", courses: 110, events: 75, causes: 62, retreats: 42 },
  { name: "Nov", courses: 100, events: 68, causes: 55, retreats: 38 },
  { name: "Dec", courses: 121, events: 88, causes: 70, retreats: 50 },
];

const enrollmentDistributionData = [
  { name: "Courses", value: 35, color: "#f63d55" }, // crimson-500
  { name: "Events", value: 25, color: "#ffb81a" }, // saffron-400
  { name: "Causes", value: 20, color: "#e64848" }, // maroon-500
  { name: "Retreats", value: 15, color: "#dd7200" }, // saffron-600
  { name: "Programs", value: 5, color: "#b22626" }, // maroon-700
];

const locationData = [
  { name: "Dharma Center", students: 1200 },
  { name: "Online Portal", students: 2400 },
  { name: "Retreat Center", students: 900 },
  { name: "Monastery", students: 500 },
  { name: "Community Centers", students: 700 },
];

// Sample upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Introduction to Meditation",
    date: "2025-03-10",
    location: "Main Center",
    attendees: 45,
  },
  {
    id: 2,
    title: "Buddhist Philosophy Course",
    date: "2025-03-15",
    location: "Online",
    attendees: 120,
  },
  {
    id: 3,
    title: "Weekend Retreat",
    date: "2025-03-22",
    location: "Mountain Retreat Center",
    attendees: 35,
  },
  {
    id: 4,
    title: "Dharma Teaching with Lama Tenzin",
    date: "2025-04-01",
    location: "Main Center",
    attendees: 85,
  },
  {
    id: 5,
    title: "Tibetan Ritual Practice",
    date: "2025-04-12",
    location: "Monastery",
    attendees: 60,
  },
];

// Stats cards data
const statsCards = [
  {
    title: "Total Users",
    value: "5,720",
    change: "+12%",
    icon: Users,
    trend: "up",
    color: "crimson",
  },
  {
    title: "Monthly Events",
    value: "42",
    change: "+8%",
    icon: Calendar,
    trend: "up",
    color: "saffron",
  },
  {
    title: "Course Enrollment",
    value: "1,245",
    change: "+15%",
    icon: BookOpen,
    trend: "up",
    color: "maroon",
  },
  {
    title: "Retreat Booking",
    value: "124",
    change: "-3%",
    icon: MapPin,
    trend: "down",
    color: "crimson",
  },
];

const NgyungneDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const user = isAuthenticated();
    if (!user) {
      // If not authenticated, redirect to login
      router.replace("/login");
    } else {
      // If authenticated, set authenticated to true
      setAuthenticated(true);
    }

    setLoading(false);
  }, [router]);
  console.log("authenticated", authenticated);

  if (loading) {
    return <Loader />;
  }

  if (!authenticated) {
    return null; // Will redirect in useEffect
  }
  return (
    <div className="w-full p-4 ">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-maroon-800">
          Ngyungne Practice Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of practice activities, user engagement, and upcoming events
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold">{card.value}</h3>
                <div className="flex items-center mt-1">
                  {card.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={
                      card.trend === "up"
                        ? "text-green-500 text-sm"
                        : "text-red-500 text-sm"
                    }
                  >
                    {card.change} from last month
                  </span>
                </div>
              </div>
              <div className={`bg-${card.color}-50 p-3 rounded-full`}>
                <card.icon className={`h-6 w-6 text-${card.color}-500`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-crimson-50 p-3 rounded-full mr-4">
              <GraduationCap className="h-6 w-6 text-crimson-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Courses</p>
              <h3 className="text-xl font-bold">48</h3>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Completion Rate</p>
              <p className="text-sm font-medium">78%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg. Enrollment</p>
              <p className="text-sm font-medium">26 users/course</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">New This Month</p>
              <p className="text-sm font-medium">3 courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-saffron-50 p-3 rounded-full mr-4">
              <Activity className="h-6 w-6 text-saffron-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Causes</p>
              <h3 className="text-xl font-bold">12</h3>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Total Participants</p>
              <p className="text-sm font-medium">1,245</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg. Donation</p>
              <p className="text-sm font-medium">$42</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Funds Raised</p>
              <p className="text-sm font-medium">$52,290</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-maroon-50 p-3 rounded-full mr-4">
              <Bookmark className="h-6 w-6 text-maroon-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Programs</p>
              <h3 className="text-xl font-bold">8</h3>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Enrollment</p>
              <p className="text-sm font-medium">3,450</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Completion</p>
              <p className="text-sm font-medium">65%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Satisfaction</p>
              <p className="text-sm font-medium">4.8/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Enrollment Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">
            Monthly User Enrollment Trends
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyEnrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="courses"
                  stroke="#f63d55" // crimson-500
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="events"
                  stroke="#ffb81a" // saffron-400
                />
                <Line
                  type="monotone"
                  dataKey="causes"
                  stroke="#e64848" // maroon-500
                />
                <Line
                  type="monotone"
                  dataKey="retreats"
                  stroke="#dd7200" // saffron-600
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrollment Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">
            User Enrollment Distribution
          </h3>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enrollmentDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {enrollmentDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Location Chart and Events Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Student Distribution by Location */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Users by Location</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={locationData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#f63d55" /> {/* crimson-500 */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Upcoming Events</h3>
            <button className="text-crimson-600 text-sm font-medium hover:text-crimson-800">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendees
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {event.title}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {event.location}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {event.attendees}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgyungneDashboard;
