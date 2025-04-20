"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { meditationApi } from "@/utils/meditationApi";
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
  Clock,
  Heart,
  Music,
  Star,
  Users,
  Tag,
  PlayCircle,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { IMeditation } from "@/types/meditation.types";
import { AddMeditationDialog } from "@/components/admin/meditation/add-meditation-dialog";
import { EditMeditationDialog } from "@/components/admin/meditation/edit-meditation-dialog";

export default function AdminMeditationPage() {
  const [meditations, setMeditations] = useState<IMeditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMeditation, setViewMeditation] = useState<IMeditation | null>(
    null
  );
  const [editMeditation, setEditMeditation] = useState<IMeditation | null>(
    null
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [meditationToDelete, setMeditationToDelete] = useState<string | null>(
    null
  );
  const [isAddMeditationOpen, setIsAddMeditationOpen] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState<
    string | null
  >(null);

  const fetchMeditations = async () => {
    setLoading(true);
    try {
      const meditations = await meditationApi.getAdminMeditations();
      setMeditations(meditations);
    } catch (error) {
      console.error("Error fetching meditations:", error);
      toast.error("Failed to load meditations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeditations();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map((index) =>
      meditations[Number.parseInt(index)]._id.toString()
    );
    setSelectedIds(ids);
  };

  const handleViewMeditation = (meditation: IMeditation) => {
    setViewMeditation(meditation);
  };

  const handleEditMeditation = (meditation: IMeditation) => {
    setEditMeditation(meditation);
  };

  const handleDeleteConfirm = (id: string) => {
    setMeditationToDelete(id);
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
      await meditationApi.deleteMeditations(selectedIds);
      setMeditations((prevMeditations) =>
        prevMeditations.filter((m) => !selectedIds.includes(m._id.toString()))
      );
      setSelectedIds([]);
      toast.success(`${selectedIds.length} meditations deleted successfully`);
    } catch (error) {
      console.error("Error deleting meditations:", error);
      toast.error("Failed to delete meditations");
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!meditationToDelete) return;

    setIsDeleting(true);
    try {
      await meditationApi.deleteMeditation(meditationToDelete);
      setMeditations((prevMeditations) =>
        prevMeditations.filter((m) => m._id.toString() !== meditationToDelete)
      );
      toast.success("Meditation deleted successfully");
    } catch (error) {
      console.error("Error deleting meditation:", error);
      toast.error("Failed to delete meditation");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setMeditationToDelete(null);
    }
  };

  const handleToggleVisibility = async (
    id: string,
    currentVisibility: boolean
  ) => {
    setIsTogglingVisibility(id);
    try {
      await meditationApi.toggleMeditationVisibility(id, !currentVisibility);
      setMeditations((prevMeditations) => {
        return prevMeditations.map((meditation) => {
          if (meditation._id.toString() === id) {
            return {
              ...meditation,
              isVisible: !currentVisibility,
            };
          }
          return meditation;
        });
      });
      toast.success(
        `Meditation ${!currentVisibility ? "published" : "unpublished"}`
      );
    } catch (error) {
      console.error("Error toggling meditation visibility:", error);
      toast.error("Failed to update visibility");
    } finally {
      setIsTogglingVisibility(null);
    }
  };

  const handleMeditationSaved = () => {
    fetchMeditations();
    setIsAddMeditationOpen(false);
    setEditMeditation(null);
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return <Badge className="bg-green-100 text-green-800">Beginner</Badge>;
      case "Intermediate":
        return (
          <Badge className="bg-amber-100 text-amber-800">Intermediate</Badge>
        );
      case "Advanced":
        return <Badge className="bg-rose-100 text-rose-800">Advanced</Badge>;
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">{difficulty}</Badge>
        );
    }
  };

  const columns: ColumnDef<IMeditation>[] = [
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
        <div className="flex items-center gap-2">
          {row.original.image && (
            <div className="relative h-10 w-16 rounded overflow-hidden">
              <Image
                src={row.original.image || "/placeholder.svg"}
                alt={row.original.title}
                width={64}
                height={40}
                className="object-cover"
              />
            </div>
          )}
          <span className="font-medium line-clamp-2">{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{row.original.duration} min</span>
        </div>
      ),
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ row }) =>
        getDifficultyBadge(row.original.difficulty || "Beginner"),
    },
    {
      accessorKey: "sessions",
      header: "Sessions",
      cell: ({ row }) => (
        <div className="flex items-center">
          <PlayCircle className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{row.original.sessions || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: "views",
      header: "Views",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Eye className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{row.original.views || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: "isVisible",
      header: "Status",
      cell: ({ row }) => {
        const meditation = row.original;
        const id = meditation._id.toString();
        const isVisible = meditation.isVisible;
        const isLoading = isTogglingVisibility === id;

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isVisible}
              onCheckedChange={() =>
                handleToggleVisibility(id, isVisible || false)
              }
              disabled={isLoading}
              aria-label="Toggle visibility"
            />
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Badge variant={isVisible ? "outline" : "secondary"}>
                {isVisible ? (
                  <>
                    <Globe className="h-3 w-3 mr-1" /> Published
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" /> Draft
                  </>
                )}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{formatDate(row.original.createdAt as Date)}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const meditation = row.original;

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
                onClick={() => handleViewMeditation(meditation)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEditMeditation(meditation)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleToggleVisibility(
                    meditation._id.toString(),
                    meditation.isVisible || false
                  )
                }
                disabled={isTogglingVisibility === meditation._id.toString()}
              >
                {meditation.isVisible ? (
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
                onClick={() => handleDeleteConfirm(meditation._id.toString())}
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
        <h2 className="text-2xl font-bold">Meditation Management</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMeditations}
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
            onClick={() => setIsAddMeditationOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Meditation
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
          data={meditations}
          filterColumn="title"
          filterPlaceholder="Filter by title..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* View Meditation Dialog */}
      {viewMeditation && (
        <Dialog
          open={!!viewMeditation}
          onOpenChange={(open) => !open && setViewMeditation(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Meditation Details</DialogTitle>
              <DialogDescription>
                Complete information about the meditation.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="relative h-64 w-full rounded-md overflow-hidden bg-muted">
                  {viewMeditation.image ? (
                    <Image
                      src={viewMeditation.image || "/placeholder.svg"}
                      alt={viewMeditation.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <PlayCircle className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold mt-2">
                    {viewMeditation.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      {viewMeditation.category}
                    </Badge>
                    {getDifficultyBadge(
                      viewMeditation.difficulty || "Beginner"
                    )}
                    {viewMeditation.tags?.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-purple-50 text-purple-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">
                    {viewMeditation.description}
                  </p>
                </div>

                {viewMeditation.longDescription && (
                  <div>
                    <h4 className="font-medium mb-2">Long Description</h4>
                    <p className="text-muted-foreground">
                      {viewMeditation.longDescription}
                    </p>
                  </div>
                )}

                {viewMeditation.instructor && (
                  <div>
                    <h4 className="font-medium mb-2">Instructor</h4>
                    <div className="flex items-center gap-3">
                      {viewMeditation.instructor.image && (
                        <div className="relative h-12 w-12 rounded-full overflow-hidden">
                          <Image
                            src={
                              viewMeditation.instructor.image ||
                              "/placeholder.svg"
                            }
                            alt={viewMeditation.instructor.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {viewMeditation.instructor.name}
                        </p>
                        {viewMeditation.instructor.bio && (
                          <p className="text-sm text-muted-foreground">
                            {viewMeditation.instructor.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {viewMeditation.audioFile && (
                  <div>
                    <h4 className="font-medium mb-2">Audio</h4>
                    <audio controls className="w-full">
                      <source
                        src={viewMeditation.audioFile}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                {viewMeditation.benefits &&
                  viewMeditation.benefits.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Heart className="h-4 w-4 mr-1" /> Benefits
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {viewMeditation.benefits.map((benefit, index) => (
                          <li key={index} className="text-muted-foreground">
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {viewMeditation.steps && viewMeditation.steps.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <PlayCircle className="h-4 w-4 mr-1" /> Steps
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2">
                      {viewMeditation.steps.map((step, index) => (
                        <li key={index} className="text-muted-foreground">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Visibility Status</h4>
                    <div className="flex items-center">
                      <Switch
                        checked={viewMeditation.isVisible || false}
                        onCheckedChange={() => {
                          handleToggleVisibility(
                            viewMeditation._id.toString(),
                            viewMeditation.isVisible || false
                          );
                          setViewMeditation({
                            ...viewMeditation,
                            isVisible: !(viewMeditation.isVisible || false),
                          });
                        }}
                        aria-label="Toggle visibility"
                      />
                      <span className="ml-2">
                        {viewMeditation.isVisible ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center">
                      <Eye className="h-4 w-4 mr-1" /> Views
                    </h4>
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700"
                    >
                      {viewMeditation.views || 0} views
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center">
                      <Users className="h-4 w-4 mr-1" /> Sessions
                    </h4>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      {viewMeditation.sessions || 0} sessions
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center">
                      <Heart className="h-4 w-4 mr-1" /> Favorites
                    </h4>
                    <Badge
                      variant="outline"
                      className="bg-rose-50 text-rose-700"
                    >
                      {viewMeditation.favorites || 0} favorites
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" /> Rating
                    </h4>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> Created
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(viewMeditation.createdAt as Date)}
                    </span>
                  </div>

                  {viewMeditation.updatedAt && (
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> Updated
                      </h4>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(viewMeditation.updatedAt as Date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewMeditation(null)}>
                Close
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setViewMeditation(null);
                  handleEditMeditation(viewMeditation);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Meditation Dialog */}
      <AddMeditationDialog
        open={isAddMeditationOpen}
        onOpenChange={setIsAddMeditationOpen}
        onSuccess={handleMeditationSaved}
      />

      {/* Edit Meditation Dialog */}
      <EditMeditationDialog
        open={!!editMeditation}
        onOpenChange={(open) => !open && setEditMeditation(null)}
        meditation={editMeditation}
        onSuccess={handleMeditationSaved}
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
              Are you sure you want to delete this meditation? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmOpen(false);
                setMeditationToDelete(null);
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
              Delete Multiple Meditations
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected
              meditations? This action cannot be undone.
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
                <>Delete {selectedIds.length} Meditations</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
