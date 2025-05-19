"use client";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
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
  ArrowUpRight,
  ArrowDownRight,
  Bookmark,
  GraduationCap,
  Activity,
} from "lucide-react";
import { isAuthenticated } from "@/utils/auth";
import { Loader } from "@/components/common/loader";
import { getUsers } from "@/utils/userApi";
import { courseApi } from "@/utils/courseApi";
import { eventApi } from "@/utils/eventApi";
import { retreatApi } from "@/utils/retreatApi";
import { causeApi } from "@/utils/causeApi";
import { blogApi } from "@/utils/blogApi";

// Define types for our stats
interface StatsCard {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: "up" | "down";
  color: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
}

const NgyungneDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [retreats, setRetreats] = useState<any[]>([]);
  const [causes, setCauses] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [statsCards, setStatsCards] = useState<StatsCard[]>([]);
  const [monthlyEnrollmentData, setMonthlyEnrollmentData] = useState<any[]>([]);
  const [enrollmentDistributionData, setEnrollmentDistributionData] = useState<
    any[]
  >([]);
  const [locationData, setLocationData] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const router = useRouter();

  // Fetch all data
  const fetchAllData = async () => {
    try {
      // Fetch users
      const usersData = await getUsers();
      setUsers(usersData);

      // Fetch courses
      const coursesData = await courseApi.getCourses();
      setCourses(coursesData);

      // Fetch events
      const eventsData = await eventApi.getAdminEvents();
      setEvents(eventsData);

      // Fetch retreats
      const retreatsData = await retreatApi.getAdminRetreats();
      setRetreats(retreatsData);

      // Fetch causes
      const causesData = await causeApi.getAdminCauses();
      setCauses(causesData);

      // Fetch blogs
      const blogsData = await blogApi.getAdminBlogPosts();
      setBlogs(blogsData);

      // Process data for stats cards
      processStatsCards(
        usersData,
        coursesData,
        eventsData,
        retreatsData,
        causesData,
        blogsData
      );

      // Process data for charts
      processChartData(coursesData, eventsData, causesData, retreatsData);

      // Process upcoming events
      processUpcomingEvents(eventsData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Process stats cards with dynamic data from API
  const processStatsCards = (
    users: any[],
    courses: any[],
    events: any[],
    retreats: any[],
    causes: any[],
    blogs: any[]
  ) => {
    // Get current and previous month for comparisons
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousMonthYear =
      currentMonth === 0 ? currentYear - 1 : currentYear;

    // Calculate user growth
    // For users, we'll compare creation dates if available
    const currentMonthUsers = users.filter((user) => {
      const createdAt = user.createdAt ? new Date(user.createdAt) : null;
      return (
        createdAt &&
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      );
    });

    const previousMonthUsers = users.filter((user) => {
      const createdAt = user.createdAt ? new Date(user.createdAt) : null;
      return (
        createdAt &&
        createdAt.getMonth() === previousMonth &&
        createdAt.getFullYear() === previousMonthYear
      );
    });

    const userGrowthPercent =
      previousMonthUsers.length > 0
        ? Math.round(
            ((currentMonthUsers.length - previousMonthUsers.length) /
              previousMonthUsers.length) *
              100
          )
        : currentMonthUsers.length > 0
        ? 100
        : 0;

    // Calculate monthly events (events in the current month)
    const currentMonthEvents = events.filter((event) => {
      const eventDate = event.date
        ? new Date(event.date)
        : event.startDate
        ? new Date(event.startDate)
        : null;
      return (
        eventDate &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });

    const previousMonthEvents = events.filter((event) => {
      const eventDate = event.date
        ? new Date(event.date)
        : event.startDate
        ? new Date(event.startDate)
        : null;
      return (
        eventDate &&
        eventDate.getMonth() === previousMonth &&
        eventDate.getFullYear() === previousMonthYear
      );
    });

    const monthlyEventsChange =
      previousMonthEvents.length > 0
        ? Math.round(
            ((currentMonthEvents.length - previousMonthEvents.length) /
              previousMonthEvents.length) *
              100
          )
        : currentMonthEvents.length > 0
        ? 100
        : 0;

    // Calculate course enrollments
    // For course enrollments, we'll look at when students enrolled if that data is available
    // Otherwise, we'll use course creation dates as a proxy
    let currentMonthEnrollments = 0;
    let previousMonthEnrollments = 0;

    // If we have enrollment data with dates
    const hasEnrollmentDates = courses.some(
      (course) =>
        course.enrollments &&
        course.enrollments.length > 0 &&
        course.enrollments[0].date
    );

    if (hasEnrollmentDates) {
      // Sum enrollments by date
      courses.forEach((course) => {
        if (course.enrollments && Array.isArray(course.enrollments)) {
          course.enrollments.forEach((enrollment: any) => {
            const enrollDate = enrollment.date
              ? new Date(enrollment.date)
              : null;
            if (
              enrollDate &&
              enrollDate.getMonth() === currentMonth &&
              enrollDate.getFullYear() === currentYear
            ) {
              currentMonthEnrollments++;
            } else if (
              enrollDate &&
              enrollDate.getMonth() === previousMonth &&
              enrollDate.getFullYear() === previousMonthYear
            ) {
              previousMonthEnrollments++;
            }
          });
        }
      });
    } else {
      // Use course creation as a proxy for enrollment
      const currentMonthCourses = courses.filter((course) => {
        const createdAt = course.createdAt ? new Date(course.createdAt) : null;
        return (
          createdAt &&
          createdAt.getMonth() === currentMonth &&
          createdAt.getFullYear() === currentYear
        );
      });

      const previousMonthCourses = courses.filter((course) => {
        const createdAt = course.createdAt ? new Date(course.createdAt) : null;
        return (
          createdAt &&
          createdAt.getMonth() === previousMonth &&
          createdAt.getFullYear() === previousMonthYear
        );
      });

      currentMonthEnrollments = currentMonthCourses.reduce(
        (total, course) => total + (course.students || 0),
        0
      );
      previousMonthEnrollments = previousMonthCourses.reduce(
        (total, course) => total + (course.students || 0),
        0
      );
    }

    // Calculate total enrollments across all courses
    const totalEnrollments = courses.reduce(
      (total, course) => total + (course.students || 0),
      0
    );

    // Calculate enrollment change percentage
    const enrollmentChange =
      previousMonthEnrollments > 0
        ? Math.round(
            ((currentMonthEnrollments - previousMonthEnrollments) /
              previousMonthEnrollments) *
              100
          )
        : currentMonthEnrollments > 0
        ? 100
        : 0;

    // Calculate retreat bookings
    const currentMonthRetreats = retreats.filter((retreat) => {
      const retreatDate = retreat.date ? new Date(retreat.date) : null;
      return (
        retreatDate &&
        retreatDate.getMonth() === currentMonth &&
        retreatDate.getFullYear() === currentYear
      );
    });

    const previousMonthRetreats = retreats.filter((retreat) => {
      const retreatDate = retreat.date ? new Date(retreat.date) : null;
      return (
        retreatDate &&
        retreatDate.getMonth() === previousMonth &&
        retreatDate.getFullYear() === previousMonthYear
      );
    });

    // Calculate retreat participants
    const currentMonthRetreatParticipants = currentMonthRetreats.reduce(
      (total, retreat) => total + (retreat.participants || 0),
      0
    );

    const previousMonthRetreatParticipants = previousMonthRetreats.reduce(
      (total, retreat) => total + (retreat.participants || 0),
      0
    );

    const retreatChange =
      previousMonthRetreatParticipants > 0
        ? Math.round(
            ((currentMonthRetreatParticipants -
              previousMonthRetreatParticipants) /
              previousMonthRetreatParticipants) *
              100
          )
        : currentMonthRetreatParticipants > 0
        ? 100
        : 0;

    // Create stats cards with real data and dynamically calculated percentages
    const newStatsCards: StatsCard[] = [
      {
        title: "Total Users",
        value: users.length.toString(),
        change: `${userGrowthPercent >= 0 ? "+" : ""}${userGrowthPercent}%`,
        icon: Users,
        trend: userGrowthPercent >= 0 ? "up" : "down",
        color: "crimson",
      },
      {
        title: "Monthly Events",
        value: currentMonthEvents.length.toString(),
        change: `${monthlyEventsChange >= 0 ? "+" : ""}${monthlyEventsChange}%`,
        icon: Calendar,
        trend: monthlyEventsChange >= 0 ? "up" : "down",
        color: "saffron",
      },
      {
        title: "Course Enrollment",
        value: totalEnrollments.toString(),
        change: `${enrollmentChange >= 0 ? "+" : ""}${enrollmentChange}%`,
        icon: BookOpen,
        trend: enrollmentChange >= 0 ? "up" : "down",
        color: "maroon",
      },
      {
        title: "Retreat Booking",
        value: retreats.length.toString(),
        change: `${retreatChange >= 0 ? "+" : ""}${retreatChange}%`,
        icon: MapPin,
        trend: retreatChange >= 0 ? "up" : "down",
        color: "crimson",
      },
    ];

    setStatsCards(newStatsCards);
  };

  // Process chart data from API data
  const processChartData = (
    courses: any[],
    events: any[],
    causes: any[],
    retreats: any[]
  ) => {
    // Process monthly enrollment data using actual historical data
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize data structure for all months
    const newMonthlyData = months.map((month, index) => ({
      name: month,
      courses: 0,
      events: 0,
      causes: 0,
      retreats: 0,
    }));

    // Fill in course data by month
    courses.forEach((course) => {
      if (course.createdAt) {
        const courseDate = new Date(course.createdAt);
        const monthIndex = courseDate.getMonth();
        newMonthlyData[monthIndex].courses += 1;
      }
    });

    // Fill in event data by month
    events.forEach((event) => {
      if (event.date || event.startDate) {
        const eventDate = new Date(event.date || event.startDate);
        const monthIndex = eventDate.getMonth();
        newMonthlyData[monthIndex].events += 1;
      }
    });

    // Fill in cause data by month
    causes.forEach((cause) => {
      if (cause.startDate) {
        const causeDate = new Date(cause.startDate);
        const monthIndex = causeDate.getMonth();
        newMonthlyData[monthIndex].causes += 1;
      }
    });

    // Fill in retreat data by month
    retreats.forEach((retreat) => {
      if (retreat.date) {
        const retreatDate = new Date(retreat.date);
        const monthIndex = retreatDate.getMonth();
        newMonthlyData[monthIndex].retreats += 1;
      }
    });

    setMonthlyEnrollmentData(newMonthlyData);

    // Process enrollment distribution data with real numbers
    const totalCourseStudents = courses.reduce(
      (total, course) => total + (course.students || 0),
      0
    );
    const totalEventAttendees = events.reduce(
      (total, event) => total + (event.attending || event.attendees || 0),
      0
    );
    const totalCauseParticipants = causes.reduce(
      (total, cause) => total + (cause.volunteers || 0),
      0
    );
    const totalRetreatParticipants = retreats.reduce(
      (total, retreat) => total + (retreat.participants || 0),
      0
    );

    // Calculate programs as a separate category if we have that data, otherwise use a small percentage of total
    const totalProgramParticipants = Math.max(
      // Try to find program data if it exists
      courses
        .filter((course) => course.type === "program")
        .reduce((total, course) => total + (course.students || 0), 0),
      // Otherwise use a small percentage of total
      Math.round(
        (totalCourseStudents +
          totalEventAttendees +
          totalCauseParticipants +
          totalRetreatParticipants) *
          0.05
      )
    );

    // Create distribution data
    const newDistributionData = [
      { name: "Courses", value: totalCourseStudents, color: "#f63d55" },
      { name: "Events", value: totalEventAttendees, color: "#ffb81a" },
      { name: "Causes", value: totalCauseParticipants, color: "#e64848" },
      { name: "Retreats", value: totalRetreatParticipants, color: "#dd7200" },
      { name: "Programs", value: totalProgramParticipants, color: "#b22626" },
    ];

    setEnrollmentDistributionData(newDistributionData);

    // Process location data based on available location information
    const locationCounts: { [key: string]: number } = {};

    // Count users by location from courses
    courses.forEach((course) => {
      if (course.location) {
        locationCounts[course.location] =
          (locationCounts[course.location] || 0) + (course.students || 0);
      }
    });

    // Count users by location from events
    events.forEach((event) => {
      if (event.location) {
        locationCounts[event.location] =
          (locationCounts[event.location] || 0) +
          (event.attending || event.attendees || 0);
      }
    });

    // Count users by location from retreats
    retreats.forEach((retreat) => {
      if (retreat.location) {
        locationCounts[retreat.location] =
          (locationCounts[retreat.location] || 0) + (retreat.participants || 0);
      }
    });

    // Count users by location from causes
    causes.forEach((cause) => {
      if (cause.location) {
        locationCounts[cause.location] =
          (locationCounts[cause.location] || 0) + (cause.volunteers || 0);
      }
    });

    // Convert location counts to array format for chart
    const newLocationData = Object.entries(locationCounts).map(
      ([name, students]) => ({
        name,
        students,
      })
    );

    // Sort by number of students (descending)
    newLocationData.sort((a, b) => b.students - a.students);

    // If we have no location data, create an empty chart
    if (newLocationData.length === 0) {
      newLocationData.push({ name: "No location data", students: 0 });
    }

    setLocationData(newLocationData);
  };

  // Process upcoming events from API data
  const processUpcomingEvents = (events: any[]) => {
    // Filter for upcoming events (events with dates in the future)
    const now = new Date();
    const upcoming = events
      .filter((event) => {
        const eventDate = event.date
          ? new Date(event.date)
          : event.startDate
          ? new Date(event.startDate)
          : null;
        return eventDate && eventDate > now;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || a.startDate);
        const dateB = new Date(b.date || b.startDate);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5) // Get the next 5 upcoming events
      .map((event) => ({
        id: event.id || event._id,
        title: event.title,
        date: event.date || event.startDate,
        location: event.location || "Unknown",
        attendees: event.attendees || event.attending || 0,
      }));

    // If no upcoming events, show empty state
    if (upcoming.length === 0) {
      setUpcomingEvents([
        {
          id: "no-events",
          title: "No upcoming events",
          date: new Date().toISOString(),
          location: "N/A",
          attendees: 0,
        },
      ]);
    } else {
      setUpcomingEvents(upcoming);
    }
  };

  useEffect(() => {
    // Check if the user is authenticated
    const user = isAuthenticated();
    if (!user) {
      // If not authenticated, redirect to login
      router.replace("/login");
    } else {
      // If authenticated, set authenticated to true and fetch data
      setAuthenticated(true);
      fetchAllData();
    }
  }, [router]);

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
              <h3 className="text-xl font-bold">{courses.length}</h3>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Completion Rate</p>
              <p className="text-sm font-medium">
                {(() => {
                  // Calculate completion rate based on course data
                  // A course is considered completed if its end date is in the past
                  const completedCourses = courses.filter((course) => {
                    if (course.endDate) {
                      return new Date(course.endDate) < new Date();
                    }
                    // If no end date, check if it's marked as completed
                    return course.completed === true;
                  }).length;

                  return courses.length > 0
                    ? `${Math.round(
                        (completedCourses / courses.length) * 100
                      )}%`
                    : "0%";
                })()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg. Enrollment</p>
              <p className="text-sm font-medium">
                {courses.length > 0
                  ? Math.round(
                      courses.reduce(
                        (total, course) => total + (course.students || 0),
                        0
                      ) / courses.length
                    )
                  : 0}{" "}
                users/course
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">New This Month</p>
              <p className="text-sm font-medium">
                {
                  courses.filter((course) => {
                    if (!course.createdAt) return false;
                    const createdAt = new Date(course.createdAt);
                    const now = new Date();
                    return (
                      createdAt.getMonth() === now.getMonth() &&
                      createdAt.getFullYear() === now.getFullYear()
                    );
                  }).length
                }{" "}
                courses
              </p>
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
              <h3 className="text-xl font-bold">{causes.length}</h3>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Total Participants</p>
              <p className="text-sm font-medium">
                {causes.reduce(
                  (total, cause) => total + (cause.volunteers || 0),
                  0
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg. Donation</p>
              <p className="text-sm font-medium">
                $
                {causes.length > 0 &&
                causes.reduce(
                  (total, cause) => total + (cause.totalDonors || 0),
                  0
                ) > 0
                  ? Math.round(
                      causes.reduce(
                        (total, cause) => total + (cause.raised || 0),
                        0
                      ) /
                        causes.reduce(
                          (total, cause) => total + (cause.totalDonors || 1),
                          0
                        )
                    )
                  : 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Funds Raised</p>
              <p className="text-sm font-medium">
                $
                {causes
                  .reduce((total, cause) => total + (cause.raised || 0), 0)
                  .toLocaleString()}
              </p>
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
              <h3 className="text-xl font-bold">{retreats.length}</h3>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Enrollment</p>
              <p className="text-sm font-medium">
                {retreats.reduce(
                  (total, retreat) => total + (retreat.participants || 0),
                  0
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Completion</p>
              <p className="text-sm font-medium">
                {(() => {
                  // Calculate completion rate based on retreat data
                  const completedRetreats = retreats.filter((retreat) => {
                    if (retreat.date) {
                      return new Date(retreat.date) < new Date();
                    }
                    return false;
                  }).length;

                  return retreats.length > 0
                    ? `${Math.round(
                        (completedRetreats / retreats.length) * 100
                      )}%`
                    : "0%";
                })()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Satisfaction</p>
              <p className="text-sm font-medium">
                {(() => {
                  // Calculate satisfaction rating if available in the data
                  const retreatsWithRatings = retreats.filter(
                    (retreat) => retreat.rating
                  );
                  if (retreatsWithRatings.length > 0) {
                    const avgRating =
                      retreatsWithRatings.reduce(
                        (sum, retreat) => sum + (retreat.rating || 0),
                        0
                      ) / retreatsWithRatings.length;
                    return `${avgRating.toFixed(1)}/5`;
                  }
                  return "N/A";
                })()}
              </p>
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
                      {event.date
                        ? new Date(event.date).toLocaleDateString()
                        : "N/A"}
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
