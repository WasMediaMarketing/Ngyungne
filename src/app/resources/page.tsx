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
  BookOpen,
  Calendar,
  Scroll,
  HeartHandshake,
  Users,
  Newspaper,
  Image,
  HelpCircle,
  Download,
  ArrowRight,
  FileText,
  PlayCircle,
  Clock,
  Headphones,
} from "lucide-react";

const ResourcesPage = () => {
  const featuredResources = [
    {
      title: "Daily Meditation Guide",
      type: "Practice",
      description:
        "Step-by-step instructions for establishing a daily meditation routine",
      icon: <BookOpen className="h-6 w-6 text-amber-600" />,
      href: "/resources/practices/daily-meditation",
    },
    {
      title: "Buddhist Calendar 2025",
      type: "Calendar",
      description:
        "Complete annual calendar with important Buddhist holy days and practice dates",
      icon: <Calendar className="h-6 w-6 text-amber-600" />,
      href: "/resources/buddhist-calendar",
    },
    {
      title: "Digital Practice Journal",
      type: "Tool",
      description:
        "Downloadable template to track your meditation sessions and insights",
      icon: <Scroll className="h-6 w-6 text-amber-600" />,
      href: "/resources/practice-journal",
    },
    {
      title: "Beginning Buddhism: FAQ",
      type: "Guide",
      description:
        "Answers to common questions for those new to Buddhist practice",
      icon: <HelpCircle className="h-6 w-6 text-amber-600" />,
      href: "/resources/faq",
    },
  ];

  const blogPosts = [
    {
      title: "The Art of Mindful Living",
      date: "February 25, 2025",
      excerpt: "Exploring how to bring awareness into everyday activities...",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Understanding Buddhist Ethics in Modern Life",
      date: "February 10, 2025",
      excerpt:
        "How ancient ethical principles can guide us in today's complex world...",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Meditation and Neuroscience",
      date: "January 30, 2025",
      excerpt:
        "Recent findings on how meditation affects brain structure and function...",
      image: "/placeholder.svg?height=200&width=400",
    },
  ];

  const downloadableResources = [
    {
      title: "Beginner's Meditation Guide",
      format: "PDF",
      size: "1.2 MB",
      type: "Guide",
    },
    {
      title: "Morning Chants",
      format: "Audio MP3",
      size: "15.8 MB",
      type: "Practice",
    },
    {
      title: "Practice Journal Template",
      format: "PDF",
      size: "0.8 MB",
      type: "Tool",
    },
  ];

  const practiceTools = [
    {
      title: "Practice Journal",
      description: "Track your meditation progress and insights",
      icon: <Scroll className="h-6 w-6 text-amber-600" />,
      href: "/resources/practice-journal",
    },
    {
      title: "Meditation Timer",
      description: "Customizable timer with interval bells",
      icon: <Clock className="h-6 w-6 text-amber-600" />,
      href: "/resources/meditation-timer",
    },
    {
      title: "Guided Meditations",
      description: "Audio recordings for various meditation practices",
      icon: <Headphones className="h-6 w-6 text-amber-600" />,
      href: "/resources/guided-meditations",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Resources</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Access tools, guides, and materials to support your Buddhist practice
          journey. From practical meditation aids to in-depth references, our
          resources are designed to help practitioners at all levels.
        </p>
      </div>

      {/* Resource Categories */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Resource Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              title: "Practice Journal",
              icon: <Scroll className="h-8 w-8 text-amber-600" />,
              href: "/resources/practice-journal",
            },
            {
              title: "Buddhist Calendar",
              icon: <Calendar className="h-8 w-8 text-amber-600" />,
              href: "/resources/buddhist-calendar",
            },
            {
              title: "Practices",
              icon: <BookOpen className="h-8 w-8 text-amber-600" />,
              href: "/resources/practices",
            },
            {
              title: "Sponsors",
              icon: <HeartHandshake className="h-8 w-8 text-amber-600" />,
              href: "/resources/sponsors",
            },
            {
              title: "Ambassadors",
              icon: <Users className="h-8 w-8 text-amber-600" />,
              href: "/resources/ambassadors",
            },
            {
              title: "Blog",
              icon: <Newspaper className="h-8 w-8 text-amber-600" />,
              href: "/resources/blog",
            },
            {
              title: "Gallery",
              icon: <Image className="h-8 w-8 text-amber-600" />,
              href: "/resources/gallery",
            },
            {
              title: "FAQ",
              icon: <HelpCircle className="h-8 w-8 text-amber-600" />,
              href: "/resources/faq",
            },
          ].map((category, index) => (
            <Card
              key={index}
              className="text-center hover:bg-amber-50 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">{category.icon}</div>
                <h3 className="font-medium">{category.title}</h3>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Button variant="link" asChild>
                  <a href={category.href}>
                    View <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Resources */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredResources.map((resource, index) => (
            <Card key={index} className="flex flex-row">
              <div className="p-6 flex items-center justify-center bg-amber-50">
                <div className="h-16 w-16 flex items-center justify-center">
                  {resource.icon}
                </div>
              </div>
              <div className="flex-1 p-6">
                <div className="mb-1">
                  <span className="text-xs font-semibold text-amber-600 uppercase">
                    {resource.type}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <Button size="sm" variant="outline" asChild>
                  <a href={resource.href}>Access Resource</a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Blog Posts</h2>
          <Button variant="link" asChild>
            <a href="/resources/blog">View All Posts</a>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Button variant="link" className="p-0" asChild>
                  <a
                    href={`/resources/blog/${post.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    Read More
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;
