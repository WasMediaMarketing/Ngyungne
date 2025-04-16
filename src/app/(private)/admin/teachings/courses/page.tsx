"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Trash2,
  RefreshCw,
  MoreHorizontal,
  Eye,
  EyeOff,
  Globe,
  Edit,
  AlertCircle,
  Plus,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { courseApi } from "@/utils/courseApi";
import CourseFormDialog from "@/components/admin/courses/course-form-dialog";
import CourseViewDialog from "@/components/admin/courses/course-view-dialog";
import type { ICourse } from "@/types";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewCourse, setViewCourse] = useState<ICourse | null>(null);
  const [editCourse, setEditCourse] = useState<ICourse | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState<
    string | null
  >(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // The getCourses function now returns properly typed ICourse[]
      const data = await courseApi.getCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Error", {
        description: "Failed to fetch courses",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map((index) => courses[Number.parseInt(index)].id);
    setSelectedIds(ids);
  };

  const handleViewCourse = (course: ICourse) => {
    setViewCourse(course);
  };

  const handleEditCourse = (course: ICourse) => {
    setEditCourse(course);
  };

  const handleDeleteConfirm = (id: string) => {
    setCourseToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (!selectedIds.length) return;
    setBulkDeleteConfirmOpen(true);
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;

    setIsDeleting(true);
    try {
      const success = await courseApi.deleteCourses(selectedIds);
      if (success) {
        // Filter out deleted courses
        setCourses(
          (prevCourses) =>
            prevCourses.filter((c) => !selectedIds.includes(c.id)) as ICourse[]
        );
        setSelectedIds([]);
        toast.success("Success", {
          description: `${selectedIds.length} courses deleted successfully`,
        });
      }
    } catch (error) {
      console.error("Error deleting courses:", error);
      toast.error("Error", {
        description: "Failed to delete courses",
      });
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!courseToDelete) return;

    setIsDeleting(true);
    try {
      const success = await courseApi.deleteCourse(courseToDelete);
      if (success) {
        // Filter out deleted course
        setCourses(
          (prevCourses) =>
            prevCourses.filter((c) => c.id !== courseToDelete) as ICourse[]
        );
        toast.success("Success", {
          description: "Course deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Error", {
        description: "Failed to delete course",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setCourseToDelete(null);
    }
  };

  const handleToggleVisibility = async (
    id: string,
    currentVisibility: boolean
  ) => {
    setIsUpdatingVisibility(id);
    try {
      const success = await courseApi.toggleVisibility(id, !currentVisibility);
      if (success) {
        // Explicitly cast the result to ICourse[] to satisfy TypeScript
        setCourses((prevCourses) => {
          return prevCourses.map((course) => {
            if (course.id === id) {
              // Create a new course object with the updated isVisible property
              return {
                ...course,
                isVisible: !currentVisibility,
              } as ICourse; // Explicitly cast to ICourse
            }
            return course;
          });
        });
      }
    } catch (error) {
      console.error("Error toggling course visibility:", error);
    } finally {
      setIsUpdatingVisibility(null);
    }
  };

  const handleCourseSaved = () => {
    fetchCourses();
    setEditCourse(null);
    setIsAddDialogOpen(false);
  };

  const columns: ColumnDef<ICourse>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center">
          <BookOpen className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <span className="font-medium">{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => {
        const level = row.original.level?.toLowerCase();
        let badgeVariant: "default" | "outline" | "secondary" | "destructive" =
          "outline";

        if (level === "beginner") {
          badgeVariant = "secondary";
        } else if (level === "intermediate") {
          badgeVariant = "default";
        } else if (level === "advanced") {
          badgeVariant = "destructive";
        }

        return (
          <Badge variant={badgeVariant} className="capitalize">
            {row.original.level || "Unknown"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <span>{row.original.duration}</span>
        </div>
      ),
    },
    {
      accessorKey: "students",
      header: "Students",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Users className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <span>{row.original.students || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: "featured",
      header: "Featured",
      cell: ({ row }) => (
        <Badge variant={row.original.featured ? "default" : "outline"}>
          {row.original.featured ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      accessorKey: "isVisible",
      header: "Visible",
      cell: ({ row }) => {
        const course = row.original;
        const isUpdating = isUpdatingVisibility === course.id;

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={course.isVisible}
              onCheckedChange={() =>
                handleToggleVisibility(course.id, course.isVisible)
              }
              disabled={isUpdating}
              aria-label="Toggle visibility"
            />
            {isUpdating ? (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Badge variant={course.isVisible ? "outline" : "secondary"}>
                {course.isVisible ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" /> Visible
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" /> Hidden
                  </>
                )}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const course = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewCourse(course)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleToggleVisibility(course.id, course.isVisible)
                }
                disabled={isUpdatingVisibility === course.id}
              >
                {course.isVisible ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Publish
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteConfirm(course.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Courses</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCourses}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDeleteClick}
            disabled={!selectedIds.length || isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={courses}
          filterColumn="title"
          filterPlaceholder="Filter by course title..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* Add Course Dialog */}
      <CourseFormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSaved={handleCourseSaved}
      />

      {/* View Course Dialog */}
      {viewCourse && (
        <CourseViewDialog
          course={viewCourse}
          open={!!viewCourse}
          onClose={() => setViewCourse(null)}
        />
      )}

      {/* Edit Course Dialog */}
      {editCourse && (
        <CourseFormDialog
          open={!!editCourse}
          course={editCourse}
          onClose={() => setEditCourse(null)}
          onSaved={handleCourseSaved}
        />
      )}

      {/* Single Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this course? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmOpen(false);
                setCourseToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSingle}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Delete Multiple Courses
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected
              courses? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setBulkDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete {selectedIds.length} Courses</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
