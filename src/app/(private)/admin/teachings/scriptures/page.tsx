"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createScriptureApi } from "@/utils/scriptureApi";
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
  Book,
  Clock,
  Tag,
  Bookmark,
  MessageSquare,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { IScripture } from "@/types/scripture.types";
import { AddScriptureDialog } from "@/components/admin/scripture/add-scripture-dialog";
import { EditScriptureDialog } from "@/components/admin/scripture/edit-scripture-dialog";

const scriptureApi = createScriptureApi();

export default function AdminScripturePage() {
  const [scriptures, setScriptures] = useState<IScripture[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewScripture, setViewScripture] = useState<IScripture | null>(null);
  const [editScripture, setEditScripture] = useState<IScripture | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [scriptureToDelete, setScriptureToDelete] = useState<string | null>(
    null
  );
  const [isAddScriptureOpen, setIsAddScriptureOpen] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState<
    string | null
  >(null);

  const fetchScriptures = async () => {
    setLoading(true);
    try {
      const scriptures = await scriptureApi.getScriptures();
      setScriptures(scriptures);
    } catch (error) {
      console.error("Error fetching scriptures:", error);
      toast.error("Failed to load scriptures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScriptures();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map((index) =>
      scriptures[Number.parseInt(index)]._id.toString()
    );
    setSelectedIds(ids);
  };

  const handleViewScripture = (scripture: IScripture) => {
    setViewScripture(scripture);
  };

  const handleEditScripture = (scripture: IScripture) => {
    setEditScripture(scripture);
  };

  const handleDeleteConfirm = (id: string) => {
    setScriptureToDelete(id);
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
      await scriptureApi.deleteScriptures(selectedIds);
      setScriptures((prevScriptures) =>
        prevScriptures.filter((s) => !selectedIds.includes(s._id.toString()))
      );
      setSelectedIds([]);
      toast.success(`${selectedIds.length} scriptures deleted successfully`);
    } catch (error) {
      console.error("Error deleting scriptures:", error);
      toast.error("Failed to delete scriptures");
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!scriptureToDelete) return;

    setIsDeleting(true);
    try {
      await scriptureApi.deleteScripture(scriptureToDelete);
      setScriptures((prevScriptures) =>
        prevScriptures.filter((s) => s._id.toString() !== scriptureToDelete)
      );
      toast.success("Scripture deleted successfully");
    } catch (error) {
      console.error("Error deleting scripture:", error);
      toast.error("Failed to delete scripture");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setScriptureToDelete(null);
    }
  };

  const handleToggleVisibility = async (
    id: string,
    currentVisibility: boolean
  ) => {
    setIsTogglingVisibility(id);
    try {
      await scriptureApi.toggleVisibility(id, !currentVisibility);
      setScriptures((prevScriptures) => {
        return prevScriptures.map((scripture) => {
          if (scripture._id.toString() === id) {
            return {
              ...scripture,
              isVisible: !currentVisibility,
            } as IScripture; // Ensure the object conforms to IScripture
          }
          return scripture;
        });
      });
      toast.success(
        `Scripture ${!currentVisibility ? "published" : "unpublished"}`
      );
    } catch (error) {
      console.error("Error toggling scripture visibility:", error);
      toast.error("Failed to update visibility");
    } finally {
      setIsTogglingVisibility(null);
    }
  };

  const handleScriptureSaved = () => {
    fetchScriptures();
    setIsAddScriptureOpen(false);
    setEditScripture(null);
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

  const columns: ColumnDef<IScripture>[] = [
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
      accessorKey: "tradition",
      header: "Tradition",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {row.original.tradition}
        </Badge>
      ),
    },
    {
      accessorKey: "period",
      header: "Period",
      cell: ({ row }) => <span>{row.original.period}</span>,
    },
    {
      accessorKey: "language",
      header: "Language",
      cell: ({ row }) => <span>{row.original.language}</span>,
    },
    {
      accessorKey: "verses",
      header: "Verses",
      cell: ({ row }) => (
        <Badge variant="outline">
          <Book className="h-3 w-3 mr-1" />
          {row.original.verses?.length || 0}
        </Badge>
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
        const scripture = row.original;
        const id = scripture._id.toString();
        const isVisible = scripture.isVisible;
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
          <span>{formatDate(row.original.createdAt as any)}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const scripture = row.original;

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
              <DropdownMenuItem onClick={() => handleViewScripture(scripture)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditScripture(scripture)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleToggleVisibility(
                    scripture._id.toString(),
                    scripture.isVisible
                  )
                }
                disabled={isTogglingVisibility === scripture._id.toString()}
              >
                {scripture.isVisible ? (
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
                onClick={() => handleDeleteConfirm(scripture._id.toString())}
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
        <h2 className="text-2xl font-bold">Scripture Management</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchScriptures}
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
            onClick={() => setIsAddScriptureOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Scripture
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
          data={scriptures}
          filterColumn="title"
          filterPlaceholder="Filter by title..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* View Scripture Dialog */}
      {viewScripture && (
        <Dialog
          open={!!viewScripture}
          onOpenChange={(open) => !open && setViewScripture(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Scripture Details</DialogTitle>
              <DialogDescription>
                Complete information about the scripture.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="relative h-64 w-full rounded-md overflow-hidden bg-muted">
                  {viewScripture.image ? (
                    <Image
                      src={viewScripture.image || "/placeholder.svg"}
                      alt={viewScripture.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Book className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold mt-2">
                    {viewScripture.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      {viewScripture.tradition}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      {viewScripture.period}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700"
                    >
                      {viewScripture.language}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">
                    {viewScripture.description}
                  </p>
                </div>

                {viewScripture.significance && (
                  <div>
                    <h4 className="font-medium mb-2">Significance</h4>
                    <p className="text-muted-foreground">
                      {viewScripture.significance}
                    </p>
                  </div>
                )}

                {viewScripture.historicalContext && (
                  <div>
                    <h4 className="font-medium mb-2">Historical Context</h4>
                    <p className="text-muted-foreground">
                      {viewScripture.historicalContext}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Overview</h4>
                  <p className="text-muted-foreground">
                    {viewScripture.overview}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Book className="h-4 w-4 mr-1" /> Verses (
                    {viewScripture.verses?.length || 0})
                  </h4>
                  <div className="max-h-[300px] overflow-y-auto border rounded-md p-4 bg-muted/30">
                    {viewScripture.verses && viewScripture.verses.length > 0 ? (
                      <div className="space-y-4">
                        {viewScripture.verses.map((verse, index) => (
                          <div
                            key={index}
                            className="border-b pb-3 last:border-0 last:pb-0"
                          >
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">
                                Chapter {verse.chapter}, Verse {verse.number}
                              </span>
                            </div>
                            <p className="text-muted-foreground">
                              {verse.text}
                            </p>
                            {verse.commentary && (
                              <div className="mt-2 text-sm italic text-muted-foreground">
                                <span className="font-medium">Commentary:</span>{" "}
                                {verse.commentary}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No verses available
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Visibility Status</h4>
                    <div className="flex items-center">
                      <Switch
                        checked={viewScripture.isVisible}
                        onCheckedChange={() => {
                          handleToggleVisibility(
                            viewScripture._id.toString(),
                            viewScripture.isVisible
                          );
                          setViewScripture({
                            ...viewScripture?.toObject(),
                            isVisible: !viewScripture?.isVisible,
                          });
                        }}
                        aria-label="Toggle visibility"
                      />
                      <span className="ml-2">
                        {viewScripture.isVisible ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" /> Views
                    </h4>
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700"
                    >
                      {viewScripture.views || 0} views
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> Created
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(viewScripture.createdAt as any)}
                    </span>
                  </div>

                  {viewScripture.updatedAt && (
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> Updated
                      </h4>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(viewScripture.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewScripture(null)}>
                Close
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setViewScripture(null);
                  handleEditScripture(viewScripture);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Scripture Dialog */}
      <AddScriptureDialog
        open={isAddScriptureOpen}
        onOpenChange={setIsAddScriptureOpen}
        onSuccess={handleScriptureSaved}
      />

      {/* Edit Scripture Dialog */}
      <EditScriptureDialog
        open={!!editScripture}
        onOpenChange={(open) => !open && setEditScripture(null)}
        scripture={editScripture}
        onSuccess={handleScriptureSaved}
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
              Are you sure you want to delete this scripture? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmOpen(false);
                setScriptureToDelete(null);
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
              Delete Multiple Scriptures
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected
              scriptures? This action cannot be undone.
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
                <>Delete {selectedIds.length} Scriptures</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
