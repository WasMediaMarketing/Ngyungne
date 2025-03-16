"use client";

import { AlertDialogFooter } from "@/components/ui/alert-dialog";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { retreatRegisterApi } from "@/utils/retreatRegisterApi";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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
  Utensils,
  MessageSquare,
  Bed,
  HeartPulse,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import RegistrationViewDialog from "@/components/admin/retreat-registration/registration-view-dialog";
import RegistrationFormDialog from "@/components/admin/retreat-registration/registration-form-dialog";
import type { IRegisterRetreatData, IRetreat, IUser } from "@/types";

export default function AdminRetreatsRegistrationsPage() {
  const [registrations, setRegistrations] = useState<IRegisterRetreatData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewRegistration, setViewRegistration] =
    useState<IRegisterRetreatData | null>(null);
  const [editRegistration, setEditRegistration] =
    useState<IRegisterRetreatData | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<
    string | null
  >(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const data = await retreatRegisterApi.getRegistrations();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Error", {
        description: "Failed to fetch registrations",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map((index) =>
      registrations[Number.parseInt(index)]._id.toString()
    );
    setSelectedIds(ids);
  };

  const handleViewRegistration = (registration: IRegisterRetreatData) => {
    setViewRegistration(registration);
  };

  const handleEditRegistration = (registration: IRegisterRetreatData) => {
    setEditRegistration(registration);
  };

  const handleDeleteConfirm = (id: string) => {
    setRegistrationToDelete(id);
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
      const success = await retreatRegisterApi.deleteRegistrations(selectedIds);
      if (success) {
        setRegistrations(
          registrations.filter((v) => !selectedIds.includes(v._id.toString()))
        );
        setSelectedIds([]);
        toast.success("Success", {
          description: `${selectedIds.length} registrations deleted successfully`,
        });
      }
    } catch (error) {
      console.error("Error deleting registrations:", error);
      toast.error("Error", {
        description: "Failed to delete registrations",
      });
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!registrationToDelete) return;

    try {
      const success = await retreatRegisterApi.deleteRegistration(
        registrationToDelete
      );
      if (success) {
        setRegistrations(
          registrations.filter((v) => v._id.toString() !== registrationToDelete)
        );
        setDeleteConfirmOpen(false);
        setRegistrationToDelete(null);
        toast.success("Success", {
          description: "Registration deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting registration:", error);
      toast.error("Error", {
        description: "Failed to delete registration",
      });
    }
  };

  const handleRegistrationSaved = () => {
    fetchRegistrations();
    setEditRegistration(null);
  };

  // Helper function to get retreat title
  const getRetreatTitle = (registration: IRegisterRetreatData): string => {
    if (
      typeof registration.retreatId === "object" &&
      registration.retreatId !== null &&
      "title" in registration.retreatId
    ) {
      return (registration.retreatId as IRetreat).title || "Unknown Retreat";
    }
    return "Unknown Retreat";
  };

  // Helper function to get user name
  const getUserName = (registration: IRegisterRetreatData): string => {
    if (
      typeof registration.userId === "object" &&
      registration.userId !== null &&
      "name" in registration.userId
    ) {
      return (registration.userId as IUser).name || "Unknown User";
    }
    return "Unknown User";
  };

  // Helper function to get user email
  const getUserEmail = (registration: IRegisterRetreatData): string => {
    if (
      typeof registration.userId === "object" &&
      registration.userId !== null &&
      "email" in registration.userId
    ) {
      return (registration.userId as IUser).email || "Unknown Email";
    }
    return "Unknown Email";
  };

  // Helper function to get user phone
  const getUserPhone = (registration: IRegisterRetreatData): string => {
    if (
      typeof registration.userId === "object" &&
      registration.userId !== null &&
      "phoneNumber" in registration.userId
    ) {
      return (registration.userId as IUser).phoneNumber || "Unknown Phone";
    }
    return "Unknown Phone";
  };

  // Add these new helper functions to display additional registration details
  const getDietaryRestrictions = (
    registration: IRegisterRetreatData
  ): string => {
    return registration.dietaryRestriction || "None";
  };

  const getSpecialRequests = (registration: IRegisterRetreatData): string => {
    return registration.specialRequest || "None";
  };

  const getEmergencyContact = (registration: IRegisterRetreatData): string => {
    if (
      registration.emergencyContactName &&
      registration.emergencyContactNumber
    ) {
      return `${registration.emergencyContactName} (${registration.emergencyContactNumber})`;
    }
    return "Not provided";
  };

  const columns: ColumnDef<IRegisterRetreatData>[] = [
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
      accessorFn: (row) => getRetreatTitle(row),
      id: "retreatTitle",
      header: "Retreat",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{getRetreatTitle(row.original)}</span>
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
      accessorKey: "MeditationExperience",
      header: "Experience",
      cell: ({ row }) => {
        const experience = row.original.MeditationExperience?.toLowerCase();
        let badgeVariant: "default" | "outline" | "secondary" | "destructive" =
          "outline";

        if (experience === "beginner") {
          badgeVariant = "secondary";
        } else if (experience === "intermediate") {
          badgeVariant = "default";
        } else if (experience === "advanced") {
          badgeVariant = "destructive";
        }

        return (
          <Badge variant={badgeVariant} className="capitalize">
            {row.original.MeditationExperience || "Unknown"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "accommodationType",
      header: "Accommodation",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Bed className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span className="capitalize">{row.original.accommodationType}</span>
        </div>
      ),
    },

    {
      accessorKey: "createdAt",
      header: "Registration Date",
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
        const registration = row.original;

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
                onClick={() => handleViewRegistration(registration)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEditRegistration(registration)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteConfirm(registration._id.toString())}
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
        <h2 className="text-2xl font-bold">Retreat Registrations</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRegistrations}
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
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={registrations}
          filterColumn="name"
          filterPlaceholder="Filter by participant name..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* View Registration Dialog */}
      {viewRegistration && (
        <RegistrationViewDialog
          registration={viewRegistration}
          open={!!viewRegistration}
          onClose={() => setViewRegistration(null)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Utensils className="h-4 w-4 mr-2" />
                Dietary Restrictions
              </h3>
              <p className="text-sm text-muted-foreground">
                {viewRegistration.dietaryRestriction || "None specified"}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Special Requests
              </h3>
              <p className="text-sm text-muted-foreground">
                {viewRegistration.specialRequest || "None specified"}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <HeartPulse className="h-4 w-4 mr-2" />
                Emergency Contact
              </h3>
              <p className="text-sm text-muted-foreground">
                {viewRegistration.emergencyContactName} (
                {viewRegistration.emergencyContactNumber})
              </p>
            </div>
          </div>
        </RegistrationViewDialog>
      )}

      {/* Edit Registration Dialog */}
      {editRegistration && (
        <RegistrationFormDialog
          open={!!editRegistration}
          registration={editRegistration}
          onClose={() => setEditRegistration(null)}
          onSaved={handleRegistrationSaved}
        />
      )}

      {/* Single Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this registration? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setRegistrationToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSingle}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Delete Multiple Registrations
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected
              registrations? This action cannot be undone and will permanently
              remove the selected registrations.
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
                <>Delete {selectedIds.length} Registrations</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
