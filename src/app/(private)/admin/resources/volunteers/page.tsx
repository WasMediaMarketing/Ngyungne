"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { volunteerApi, VolunteerUI } from "@/utils/volunteerApi";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  AlertCircle,
  EyeOff,
  EyeIcon,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function AdminVolunteerList() {
  const [volunteers, setVolunteers] = useState<VolunteerUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewVolunteer, setViewVolunteer] = useState<VolunteerUI | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [volunteerToDelete, setVolunteerToDelete] = useState<string | null>(
    null
  );
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState<
    string | null
  >(null);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      // Use the admin-specific function to get all volunteers including hidden ones
      const data = await volunteerApi.getAdminVolunteers();
      setVolunteers(data);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      toast.error("Error", {
        description: "Failed to fetch volunteers",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map((index) =>
      volunteers[Number.parseInt(index)].id.toString()
    );
    setSelectedIds(ids);
  };

  const handleViewVolunteer = (volunteer: VolunteerUI) => {
    setViewVolunteer(volunteer);
  };

  const handleDeleteConfirm = (id: string) => {
    setVolunteerToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedIds.length) return;

    setIsDeleting(true);
    try {
      const success = await volunteerApi.deleteVolunteers(selectedIds);
      if (success) {
        setVolunteers(
          volunteers.filter((v) => !selectedIds.includes(v.id.toString()))
        );
        setSelectedIds([]);
        toast.success("Success", {
          description: "Volunteers deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting volunteers:", error);
      toast.error("Error", {
        description: "Failed to delete volunteers",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!volunteerToDelete) return;

    try {
      const success = await volunteerApi.deleteVolunteer(volunteerToDelete);
      if (success) {
        setVolunteers(
          volunteers.filter((v) => v.id.toString() !== volunteerToDelete)
        );
        setDeleteConfirmOpen(false);
        setVolunteerToDelete(null);
        toast.success("Success", {
          description: "Volunteer deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting volunteer:", error);
      toast.error("Error", {
        description: "Failed to delete volunteer",
      });
    }
  };

  const handleToggleVisibility = async (
    id: string,
    currentVisibility: boolean
  ) => {
    setIsUpdatingVisibility(id);
    try {
      const success = await volunteerApi.toggleVisibility(
        id,
        !currentVisibility
      );
      if (success) {
        setVolunteers(
          volunteers.map((volunteer) =>
            volunteer.id.toString() === id
              ? { ...volunteer, isVisible: !currentVisibility }
              : volunteer
          )
        );
      }
    } catch (error) {
      console.error("Error toggling volunteer visibility:", error);
    } finally {
      setIsUpdatingVisibility(null);
    }
  };

  const columns: ColumnDef<VolunteerUI>[] = [
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
      accessorKey: "fullname",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.image && (
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              <Image
                src={row.original.image || "/placeholder.svg"}
                alt={row.original.fullname}
                fill
                className="object-cover"
              />
            </div>
          )}
          <span className="font-medium">{row.original.fullname}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.original.reason}</div>
      ),
    },
    {
      accessorKey: "isVisible",
      header: "Visibility",
      cell: ({ row }) => {
        const volunteer = row.original;
        const isUpdating = isUpdatingVisibility === volunteer.id.toString();

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={volunteer.isVisible}
              onCheckedChange={() =>
                handleToggleVisibility(
                  volunteer.id.toString(),
                  volunteer.isVisible
                )
              }
              disabled={isUpdating}
              aria-label="Toggle visibility"
            />
            {isUpdating ? (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Badge variant={volunteer.isVisible ? "outline" : "secondary"}>
                {volunteer.isVisible ? (
                  <>
                    <EyeIcon className="h-3 w-3 mr-1" /> Visible
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
        const volunteer = row.original;

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
              <DropdownMenuItem onClick={() => handleViewVolunteer(volunteer)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleToggleVisibility(
                    volunteer.id.toString(),
                    volunteer.isVisible
                  )
                }
                disabled={isUpdatingVisibility === volunteer.id.toString()}
              >
                {volunteer.isVisible ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide from website
                  </>
                ) : (
                  <>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Show on website
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteConfirm(volunteer.id.toString())}
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
        <h2 className="text-2xl font-bold">Volunteer Management</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchVolunteers}
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
            onClick={handleDelete}
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
          data={volunteers}
          filterColumn="fullname"
          filterPlaceholder="Filter by name..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* View Volunteer Dialog */}
      {viewVolunteer && (
        <Dialog
          open={!!viewVolunteer}
          onOpenChange={() => setViewVolunteer(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Volunteer Details</DialogTitle>
              <DialogDescription>
                Complete information about the volunteer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                {viewVolunteer.image ? (
                  <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary/10">
                    <Image
                      src={viewVolunteer.image || "/placeholder.svg"}
                      alt={viewVolunteer.fullname}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl text-gray-500">
                      {viewVolunteer.fullname.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center">
                <Badge
                  variant={viewVolunteer.isVisible ? "outline" : "secondary"}
                  className="text-xs"
                >
                  {viewVolunteer.isVisible ? (
                    <>
                      <EyeIcon className="h-3 w-3 mr-1" /> Visible on website
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" /> Hidden from website
                    </>
                  )}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Name
                  </h4>
                  <p className="text-base">{viewVolunteer.fullname}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Email
                  </h4>
                  <p className="text-base">{viewVolunteer.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Phone
                  </h4>
                  <p className="text-base">{viewVolunteer.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Address
                  </h4>
                  <p className="text-base">{viewVolunteer.address || "N/A"}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Reason for Volunteering
                </h4>
                <p className="text-base mt-1">{viewVolunteer.reason}</p>
              </div>

              {viewVolunteer.socialLinks &&
                Object.keys(viewVolunteer.socialLinks).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Social Links
                    </h4>
                    <div className="mt-1 space-y-1">
                      {Object.entries(viewVolunteer.socialLinks).map(
                        ([platform, url]) => (
                          <div key={platform} className="flex items-center">
                            <span className="capitalize mr-2">{platform}:</span>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate"
                            >
                              {url}
                            </a>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button
                variant={viewVolunteer.isVisible ? "outline" : "default"}
                onClick={() => {
                  handleToggleVisibility(
                    viewVolunteer.id.toString(),
                    viewVolunteer.isVisible
                  );
                  setViewVolunteer(null);
                }}
                className="flex-1 sm:flex-none"
              >
                {viewVolunteer.isVisible ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide from website
                  </>
                ) : (
                  <>
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Show on website
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewVolunteer(null)}
                className="flex-1 sm:flex-none"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this volunteer? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setVolunteerToDelete(null);
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
    </div>
  );
}
