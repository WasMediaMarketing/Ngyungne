"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Clock,
  Users,
  Target,
  CheckCircle,
  User,
  Briefcase,
  FileText,
  ListChecks,
  Award,
  Eye,
  EyeOff,
} from "lucide-react";
import type { ICourse } from "@/types";

interface CourseViewDialogProps {
  course: ICourse;
  open: boolean;
  onClose: () => void;
}

export default function CourseViewDialog({
  course,
  open,
  onClose,
}: CourseViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {course.title}
          </DialogTitle>
          <DialogDescription>Course details</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Description</h3>
                  <p className="text-muted-foreground mt-1">
                    {course.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Overview</h3>
                  <p className="text-muted-foreground mt-1">
                    {course.overView}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Prerequisites</h3>
                  <p className="text-muted-foreground mt-1">
                    {course.prerequisites}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Target Audience</h3>
                  <p className="text-muted-foreground mt-1">
                    {course.targetAudience}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        course.level?.toLowerCase() === "beginner"
                          ? "secondary"
                          : course.level?.toLowerCase() === "intermediate"
                          ? "default"
                          : "destructive"
                      }
                      className="capitalize"
                    >
                      {course.level}
                    </Badge>
                    <Badge
                      variant={course.featured ? "default" : "outline"}
                      className="ml-2"
                    >
                      {course.featured ? "Featured" : "Not Featured"}
                    </Badge>
                    <Badge
                      variant={course.isVisible ? "outline" : "secondary"}
                      className="ml-2"
                    >
                      {course.isVisible ? (
                        <Eye className="h-3 w-3 mr-1" />
                      ) : (
                        <EyeOff className="h-3 w-3 mr-1" />
                      )}
                      {course.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Card>
                    <CardContent className="p-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-sm text-muted-foreground">
                          {course.duration}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Lessons</p>
                        <p className="text-sm text-muted-foreground">
                          {course.lessons}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Students</p>
                        <p className="text-sm text-muted-foreground">
                          {course.students || 0}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Modules</p>
                        <p className="text-sm text-muted-foreground">
                          {course.modules?.length || 0}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {course.image && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Course Image</h3>
                    <div className="rounded-md overflow-hidden">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Learning Outcomes
              </h3>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                {course.outcomes?.map((outcome, index) => (
                  <li key={index} className="text-muted-foreground">
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <div className="space-y-4">
              {course.modules?.map((module, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Module {index + 1}: {module.title}
                    </CardTitle>
                    <CardDescription>
                      {module.lessons?.length || 0} lessons
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {module.lessons?.map((lesson, lessonIndex) => (
                        <li
                          key={lessonIndex}
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Lesson {lessonIndex + 1}: {lesson}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Instructor Tab */}
          <TabsContent value="instructor" className="space-y-4">
            {course.instructor && (
              <div className="flex flex-col md:flex-row gap-6">
                {course.instructor.image && (
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                      <img
                        src={course.instructor.image || "/placeholder.svg"}
                        alt={course.instructor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-xl font-medium flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {course.instructor.name}
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Briefcase className="h-4 w-4" />
                      {course.instructor.position}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">About</h4>
                    <p className="text-muted-foreground mt-1">
                      {course.instructor.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Visibility</CardTitle>
                <CardDescription>
                  Control whether this course is visible to students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Course Status</p>
                    <p className="text-sm text-muted-foreground">
                      {course.isVisible
                        ? "This course is currently visible to students"
                        : "This course is currently hidden from students"}
                    </p>
                  </div>
                  <Badge
                    variant={course.isVisible ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {course.isVisible ? "Visible" : "Hidden"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Status</CardTitle>
                <CardDescription>
                  Control whether this course appears in featured sections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Featured Status</p>
                    <p className="text-sm text-muted-foreground">
                      {course.featured
                        ? "This course is featured on the platform"
                        : "This course is not featured"}
                    </p>
                  </div>
                  <Badge
                    variant={course.featured ? "default" : "outline"}
                    className="ml-2"
                  >
                    {course.featured ? (
                      <>
                        <Award className="h-3 w-3 mr-1" />
                        Featured
                      </>
                    ) : (
                      "Not Featured"
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
