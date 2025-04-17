import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  HeartHandshake,
  Users,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

const ProgramsPage = () => {
  const upcomingEvents = [
    {
      title: "Weekend Meditation Retreat",
      date: "March 15-17, 2025",
      location: "Mountain Dharma Center",
      description:
        "A peaceful weekend retreat focusing on mindfulness and compassion practices",
      image: "/api/placeholder/400/200",
    },
    {
      title: "Public Talk: The Path to Inner Peace",
      date: "March 25, 2025",
      location: "City Community Hall",
      description: "An evening talk on finding peace in our busy modern lives",
      image: "/api/placeholder/400/200",
    },
    {
      title: "Nyungne Fasting Practice",
      date: "April 5-6, 2025",
      location: "Temple Meditation Hall",
      description:
        "Traditional purification and compassion practice with fasting and prayers",
      image: "/api/placeholder/400/200",
    },
  ];

  const retreatTypes = [
    {
      title: "Weekend Retreats",
      description:
        "Short, intensive practice periods perfect for those with busy schedules",
      duration: "2-3 days",
      frequency: "Monthly",
    },
    {
      title: "Silent Retreats",
      description:
        "Deep immersion in meditation practice in a supportive, silent environment",
      duration: "5-7 days",
      frequency: "Quarterly",
    },
    {
      title: "Summer Intensive",
      description:
        "Annual extended retreat combining study and practice in a residential setting",
      duration: "2-4 weeks",
      frequency: "Annually (June-August)",
    },
  ];

  const causes = [
    {
      title: "Education Fund",
      description:
        "Supporting Buddhist education for monastics and lay practitioners",
      goal: "$25,000",
      current: "$18,750",
      image: "/api/placeholder/400/200",
    },
    {
      title: "Temple Renovation",
      description:
        "Preserving and maintaining sacred spaces for practice and community",
      goal: "$50,000",
      current: "$32,500",
      image: "/api/placeholder/400/200",
    },
    {
      title: "Humanitarian Relief",
      description: "Providing aid to communities affected by natural disasters",
      goal: "$15,000",
      current: "$9,800",
      image: "/api/placeholder/400/200",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Programs & Events</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Join our community for transformative events, retreats, and charitable
          initiatives that put Buddhist teachings into practice and foster
          connections with fellow practitioners.
        </p>
      </div>

      {/* Featured Programs */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 mx-auto text-amber-600" />
              <CardTitle className="mt-4">Events</CardTitle>
              <CardDescription>
                Public talks, ceremonies, and community gatherings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Join us for regular events including dharma talks, special
                ceremonies, and community celebrations throughout the year.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <a href="/programs/events">
                  View Calendar <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-amber-600" />
              <CardTitle className="mt-4">Retreats</CardTitle>
              <CardDescription>
                Immersive meditation experiences in supportive settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Deepen your practice through guided retreats ranging from
                weekend intensives to extended residential programs.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <a href="/programs/retreats">
                  Explore Retreats <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <HeartHandshake className="h-12 w-12 mx-auto text-amber-600" />
              <CardTitle className="mt-4">Causes</CardTitle>
              <CardDescription>
                Charitable initiatives and community service projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Support our ongoing causes that embody Buddhist principles of
                compassion, generosity, and service to others.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <a href="/programs/causes">
                  Support Causes <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <Card key={index} className="overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-1 text-amber-600" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-amber-600" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="text-gray-600">{event.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            View All Events
          </Button>
        </div>
      </section>

      {/* Retreats Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Retreat Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {retreatTypes.map((retreat, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{retreat.title}</CardTitle>
                <CardDescription>{retreat.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-amber-600" />
                    <span>Duration: {retreat.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-amber-600" />
                    <span>Frequency: {retreat.frequency}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Schedule
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Causes Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Current Causes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {causes.map((cause, index) => (
            <Card key={index} className="overflow-hidden">
              <img
                src={cause.image}
                alt={cause.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{cause.title}</CardTitle>
                <CardDescription>{cause.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        Progress: {cause.current} of {cause.goal}
                      </span>
                      <span>
                        {Math.floor(
                          (parseInt(cause.current.replace(/\D/g, "")) /
                            parseInt(cause.goal.replace(/\D/g, ""))) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-600 h-2 rounded-full"
                        style={{
                          width: `${Math.floor(
                            (parseInt(cause.current.replace(/\D/g, "")) /
                              parseInt(cause.goal.replace(/\D/g, ""))) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Support This Cause</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProgramsPage;
