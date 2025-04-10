"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ambassadorApi } from "@/utils/ambassadorApi";
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
  Plus,
  Globe,
  EyeOff,
  MapPin,
  Quote,
  Award,
  LinkIcon,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Ambassador } from "@/types/ambassador.types";
import { AddAmbassadorDialog } from "@/components/admin/ambassador/add-ambassador-dialog";
import { EditAmbassadorDialog } from "@/components/admin/ambassador/edit-ambassador-dialog";

export default function AdminAmbassadorsPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewAmbassador, setViewAmbassador] = useState<Ambassador | null>(null);
  const [editAmbassador, setEditAmbassador] = useState<Ambassador | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [ambassadorToDelete, setAmbassadorToDelete] = useState<string | null>(
    null
  );
  const [isAddAmbassadorOpen, setIsAddAmbassadorOpen] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState<
    string | null
  >(null);

  const fetchAmbassadors = async () => {
    setLoading(true);
    try {
      const data = await ambassadorApi.getAdminAmbassadors();
      setAmbassadors(data);
    } catch (error) {
      console.error("Error fetching ambassadors:", error);
      toast.error("Error", {
        description: "Failed to fetch ambassadors",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbassadors();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map(
      (index) => ambassadors[Number.parseInt(index)].id as string
    );
    setSelectedIds(ids);
  };

  const handleViewAmbassador = (ambassador: Ambassador) => {
    setViewAmbassador(ambassador);
  };

  const handleEditAmbassador = (ambassador: Ambassador) => {
    setEditAmbassador(ambassador);
  };

  const handleDeleteConfirm = (id: string) => {
    setAmbassadorToDelete(id);
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
      const success = await ambassadorApi.deleteAmbassadors(selectedIds);
      if (success) {
        setAmbassadors((prevAmbassadors) =>
          prevAmbassadors.filter((a) => !selectedIds.includes(a.id as string))
        );
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Error deleting ambassadors:", error);
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!ambassadorToDelete) return;

    setIsDeleting(true);
    try {
      const success = await ambassadorApi.deleteAmbassador(ambassadorToDelete);
      if (success) {
        setAmbassadors((prevAmbassadors) =>
          prevAmbassadors.filter((a) => a.id !== ambassadorToDelete)
        );
        setDeleteConfirmOpen(false);
        setAmbassadorToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting ambassador:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleVisibility = async (
    id: string,
    currentVisibility: boolean
  ) => {
    setIsTogglingVisibility(id);
    try {
      const success = await ambassadorApi.toggleAmbassadorVisibility(
        id,
        !currentVisibility
      );
      if (success) {
        setAmbassadors((prevAmbassadors) => {
          return prevAmbassadors.map((ambassador) => {
            if (ambassador.id === id) {
              return {
                ...ambassador,
                isVisible: !currentVisibility,
              };
            }
            return ambassador;
          });
        });
      }
    } catch (error) {
      console.error("Error toggling ambassador visibility:", error);
    } finally {
      setIsTogglingVisibility(null);
    }
  };

  const handleAmbassadorSaved = () => {
    fetchAmbassadors();
    setIsAddAmbassadorOpen(false);
    setEditAmbassador(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Founder":
      case "Co-Founder":
        return "bg-amber-100 text-amber-800";
      case "Executive Director":
        return "bg-blue-100 text-blue-800";
      case "Ambassador":
        return "bg-purple-100 text-purple-800";
      case "Program Coordinator":
        return "bg-green-100 text-green-800";
      case "Community Liaison":
        return "bg-pink-100 text-pink-800";
      case "Volunteer":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns: ColumnDef<Ambassador>[] = [
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.image && (
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              <Image
                src={row.original.image || "/placeholder.svg"}
                alt={row.original.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={getRoleBadgeColor(row.original.role)}
        >
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.location ? (
            <>
              <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span>{row.original.location}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Not specified</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "bio",
      header: "Bio",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.original.bio}</div>
      ),
    },
    {
      id: "socialLinks",
      header: "Social Links",
      cell: ({ row }) => {
        const socialLinks = row.original.socialLinks;
        const count = socialLinks
          ? Object.keys(socialLinks).filter(
              (key) => !!socialLinks[key as keyof typeof socialLinks]
            ).length
          : 0;

        return (
          <div className="flex items-center">
            <LinkIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>{count} links</span>
          </div>
        );
      },
    },
    {
      accessorKey: "isVisible",
      header: "Visible",
      cell: ({ row }) => {
        const ambassador = row.original;
        const id = ambassador.id as string;
        const isVisible = ambassador.isVisible;
        const isLoading = isTogglingVisibility === id;

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isVisible}
              onCheckedChange={() => handleToggleVisibility(id, isVisible)}
              disabled={isLoading}
              aria-label="Toggle visibility"
            />
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Badge variant={isVisible ? "outline" : "secondary"}>
                {isVisible ? (
                  <>
                    <Globe className="h-3 w-3 mr-1" /> Public
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
        const ambassador = row.original;

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
                onClick={() => handleViewAmbassador(ambassador)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEditAmbassador(ambassador)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleToggleVisibility(
                    ambassador.id as string,
                    ambassador.isVisible
                  )
                }
                disabled={isTogglingVisibility === ambassador.id}
              >
                {ambassador.isVisible ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide from website
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Show on website
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteConfirm(ambassador.id as string)}
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
        <h2 className="text-2xl font-bold">Ambassador Management</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAmbassadors}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddAmbassadorOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Ambassador
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
          data={ambassadors}
          filterColumn="name"
          filterPlaceholder="Filter by name..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* View Ambassador Dialog */}
      {viewAmbassador && (
        <Dialog
          open={!!viewAmbassador}
          onOpenChange={(open) => !open && setViewAmbassador(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Ambassador Details</DialogTitle>
              <DialogDescription>
                Complete information about the ambassador.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="relative h-64 w-full rounded-md overflow-hidden">
                  <Image
                    src={viewAmbassador.image || "/placeholder.svg"}
                    alt={viewAmbassador.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <Badge className={getRoleBadgeColor(viewAmbassador.role)}>
                    {viewAmbassador.role}
                  </Badge>
                  <h3 className="text-xl font-bold mt-2">
                    {viewAmbassador.name}
                  </h3>
                  {viewAmbassador.location && (
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{viewAmbassador.location}</span>
                    </div>
                  )}
                </div>

                {viewAmbassador.quote && (
                  <div className="bg-muted p-4 rounded-md border-l-4 border-primary">
                    <Quote className="h-4 w-4 text-muted-foreground mb-2" />
                    <p className="italic">"{viewAmbassador.quote}"</p>
                  </div>
                )}

                {viewAmbassador.socialLinks &&
                  Object.keys(viewAmbassador.socialLinks).length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <LinkIcon className="h-4 w-4 mr-1" /> Social Links
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(viewAmbassador.socialLinks).map(
                          ([key, value]) =>
                            value ? (
                              <div key={key} className="flex items-center">
                                <span className="capitalize text-muted-foreground w-24">
                                  {key}:
                                </span>
                                <a
                                  href={
                                    key === "email" ? `mailto:${value}` : value
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline truncate"
                                >
                                  {key === "email"
                                    ? value
                                    : value.replace(/^https?:\/\//, "")}
                                </a>
                              </div>
                            ) : null
                        )}
                      </div>
                    </div>
                  )}
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Bio</h4>
                  <p className="text-muted-foreground">{viewAmbassador.bio}</p>
                </div>

                {viewAmbassador.achievements &&
                  viewAmbassador.achievements.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Award className="h-4 w-4 mr-1" /> Achievements
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {viewAmbassador.achievements.map(
                          (achievement, index) => (
                            <li key={index}>{achievement}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                <div className="pt-4">
                  <h4 className="font-medium mb-2">Visibility Status</h4>
                  <div className="flex items-center">
                    <Switch
                      checked={viewAmbassador.isVisible}
                      onCheckedChange={() => {
                        handleToggleVisibility(
                          viewAmbassador.id as string,
                          viewAmbassador.isVisible
                        );
                        setViewAmbassador({
                          ...viewAmbassador,
                          isVisible: !viewAmbassador.isVisible,
                        });
                      }}
                      aria-label="Toggle visibility"
                    />
                    <span className="ml-2">
                      {viewAmbassador.isVisible
                        ? "Visible on website"
                        : "Hidden from website"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewAmbassador(null)}>
                Close
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setViewAmbassador(null);
                  handleEditAmbassador(viewAmbassador);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Ambassador Dialog */}
      <AddAmbassadorDialog
        open={isAddAmbassadorOpen}
        onOpenChange={setIsAddAmbassadorOpen}
        onSuccess={handleAmbassadorSaved}
      />

      {/* Edit Ambassador Dialog */}
      <EditAmbassadorDialog
        open={!!editAmbassador}
        onOpenChange={(open: any) => !open && setEditAmbassador(null)}
        ambassador={editAmbassador}
        onSuccess={handleAmbassadorSaved}
      />

      {/* Single Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this ambassador? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmOpen(false);
                setAmbassadorToDelete(null);
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
              Delete Multiple Ambassadors
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected
              ambassadors? This action cannot be undone.
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
                <>Delete {selectedIds.length} Ambassadors</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
