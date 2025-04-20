"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { joinCourseApi } from "@/utils/joinCourseApi";
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
import {
  Trash2,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Edit,
  AlertCircle,
  User,
  Calendar,
  Phone,
  BookOpen,
  GraduationCap,
  Mail,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import CourseEnrollmentViewDialog from "@/components/admin/course-enrollment/course-enrollment-view-dialog";
import CourseEnrollmentFormDialog from "@/components/admin/course-enrollment/course-enrollment-form-dialog";
import type { IJoinCourseData, ICourse, IUser } from "@/types";
import Spinner from "@/components/spinner";
import { Loader } from "@/components/common/loader";

export default function AdminCourseEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<IJoinCourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewEnrollment, setViewEnrollment] = useState<IJoinCourseData | null>(
    null
  );
  const [editEnrollment, setEditEnrollment] = useState<IJoinCourseData | null>(
    null
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<string | null>(
    null
  );
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const data = await joinCourseApi.getJoinCourses();
      setEnrollments(data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast.error("Error", {
        description: "Failed to fetch course enrollments",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map((index) =>
      enrollments[Number.parseInt(index)]._id.toString()
    );
    setSelectedIds(ids);
  };

  const handleViewEnrollment = (enrollment: IJoinCourseData) => {
    setViewEnrollment(enrollment);
  };

  const handleEditEnrollment = (enrollment: IJoinCourseData) => {
    setEditEnrollment(enrollment);
  };

  const handleDeleteConfirm = (id: string) => {
    setEnrollmentToDelete(id);
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
      const success = await joinCourseApi.deleteJoinCourses(selectedIds);
      if (success) {
        setEnrollments((prevEnrollments) =>
          prevEnrollments.filter((e) => !selectedIds.includes(e._id.toString()))
        );
        setSelectedIds([]);
        toast.success("Success", {
          description: `${selectedIds.length} enrollments deleted successfully`,
        });
      }
    } catch (error) {
      console.error("Error deleting enrollments:", error);
      toast.error("Error", {
        description: "Failed to delete enrollments",
      });
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!enrollmentToDelete) return;

    setIsDeleting(true);
    try {
      const success = await joinCourseApi.deleteJoinCourse(enrollmentToDelete);
      if (success) {
        setEnrollments((prevEnrollments) =>
          prevEnrollments.filter((e) => e._id.toString() !== enrollmentToDelete)
        );
        toast.success("Success", {
          description: "Enrollment deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      toast.error("Error", {
        description: "Failed to delete enrollment",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setEnrollmentToDelete(null);
    }
  };

  const handleEnrollmentSaved = () => {
    fetchEnrollments();
    setEditEnrollment(null);
  };

  // Helper function to get course title
  const getCourseTitle = (enrollment: IJoinCourseData): string => {
    if (
      typeof enrollment.courseId === "object" &&
      enrollment.courseId !== null &&
      "title" in enrollment.courseId
    ) {
      return (enrollment.courseId as ICourse).title || "Unknown Course";
    }
    return "Unknown Course";
  };

  // Helper function to get user name
  const getUserName = (enrollment: IJoinCourseData): string => {
    if (
      typeof enrollment.userId === "object" &&
      enrollment.userId !== null &&
      "name" in enrollment.userId
    ) {
      return (enrollment.userId as IUser).name || "Unknown User";
    }
    return "Unknown User";
  };

  // Helper function to get user email
  const getUserEmail = (enrollment: IJoinCourseData): string => {
    if (
      typeof enrollment.userId === "object" &&
      enrollment.userId !== null &&
      "email" in enrollment.userId
    ) {
      return (enrollment.userId as IUser).email || "Unknown Email";
    }
    return "Unknown Email";
  };

  // Helper function to get user phone
  const getUserPhone = (enrollment: IJoinCourseData): string => {
    if (
      typeof enrollment.userId === "object" &&
      enrollment.userId !== null &&
      "phoneNumber" in enrollment.userId
    ) {
      return (enrollment.userId as IUser).phoneNumber || "Unknown Phone";
    }
    return "Unknown Phone";
  };

  const columns: ColumnDef<IJoinCourseData>[] = [
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
      accessorFn: (row) => getUserName(row),
      id: "name",
      header: "Participant",
      cell: ({ row }) => (
        <div className="flex items-center">
          <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span className="font-medium">{getUserName(row.original)}</span>
        </div>
      ),
    },
    {
      accessorFn: (row) => getCourseTitle(row),
      id: "courseTitle",
      header: "Course",
      cell: ({ row }) => (
        <div className="flex items-center">
          <BookOpen className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{getCourseTitle(row.original)}</span>
        </div>
      ),
    },
    {
      accessorFn: (row) => getUserEmail(row),
      id: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span className="text-sm">{getUserEmail(row.original)}</span>
        </div>
      ),
    },
    {
      accessorFn: (row) => getUserPhone(row),
      id: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{getUserPhone(row.original)}</span>
        </div>
      ),
    },
    {
      accessorKey: "educationalLevel",
      header: "Education",
      cell: ({ row }) => (
        <div className="flex items-center">
          <GraduationCap className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span className="capitalize">{row.original.educationalLevel}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Enrollment Date",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>
            {row.original.createdAt
              ? format(new Date(row.original.createdAt), "MMM d, yyyy")
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const enrollment = row.original;

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
              <DropdownMenuItem
                onClick={() => handleViewEnrollment(enrollment)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEditEnrollment(enrollment)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteConfirm(enrollment._id.toString())}
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
        <h2 className="text-2xl font-bold">Course Enrollments</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchEnrollments}
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
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          data={enrollments}
          filterColumn="name"
          filterPlaceholder="Filter by participant name..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* View Enrollment Dialog */}
      {viewEnrollment && (
        <CourseEnrollmentViewDialog
          enrollment={viewEnrollment}
          open={!!viewEnrollment}
          onClose={() => setViewEnrollment(null)}
        />
      )}

      {/* Edit Enrollment Dialog */}
      {editEnrollment && (
        <CourseEnrollmentFormDialog
          open={!!editEnrollment}
          enrollment={editEnrollment}
          onClose={() => setEditEnrollment(null)}
          onSaved={handleEnrollmentSaved}
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
              Are you sure you want to delete this enrollment? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmOpen(false);
                setEnrollmentToDelete(null);
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
              {isDeleting ? <Spinner text="Deleting..." /> : "Delete"}
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
              Delete Multiple Enrollments
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected
              enrollments? This action cannot be undone.
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
                <Spinner text="Deleting..." />
              ) : (
                <>Delete {selectedIds.length} Enrollments</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
