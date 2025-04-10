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
  Quote,
  Lightbulb,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { philosophyApi } from "@/utils/philosophyApi";
import PhilosophyFormDialog from "@/components/admin/philosophy/philosophy-form-dialog";
import PhilosophyViewDialog from "@/components/admin/philosophy/philosophy-view-dialog";
import type { IPhilosophyTopic } from "@/types";

export default function AdminPhilosophyPage() {
  const [topics, setTopics] = useState<IPhilosophyTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewTopic, setViewTopic] = useState<IPhilosophyTopic | null>(null);
  const [editTopic, setEditTopic] = useState<IPhilosophyTopic | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState<
    string | null
  >(null);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const data = await philosophyApi.getAdminPhilosophyTopics();
      setTopics(data);
    } catch (error) {
      console.error("Error fetching philosophy topics:", error);
      toast.error("Error", {
        description: "Failed to fetch philosophy topics",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map((index) => topics[Number.parseInt(index)].id);
    setSelectedIds(ids);
  };

  const handleViewTopic = (topic: IPhilosophyTopic) => {
    setViewTopic(topic);
  };

  const handleEditTopic = (topic: IPhilosophyTopic) => {
    setEditTopic(topic);
  };

  const handleDeleteConfirm = (id: string) => {
    setTopicToDelete(id);
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
      const success = await philosophyApi.deletePhilosophyTopics(selectedIds);
      if (success) {
        // Filter out deleted topics
        setTopics(
          (prevTopics) =>
            prevTopics.filter(
              (t) => !selectedIds.includes(t.id)
            ) as IPhilosophyTopic[]
        );
        setSelectedIds([]);
        toast.success("Success", {
          description: `${selectedIds.length} topics deleted successfully`,
        });
      }
    } catch (error) {
      console.error("Error deleting topics:", error);
      toast.error("Error", {
        description: "Failed to delete topics",
      });
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!topicToDelete) return;

    setIsDeleting(true);
    try {
      const success = await philosophyApi.deletePhilosophyTopic(topicToDelete);
      if (success) {
        // Filter out deleted topic
        setTopics(
          (prevTopics) =>
            prevTopics.filter(
              (t) => t.id !== topicToDelete
            ) as IPhilosophyTopic[]
        );
        toast.success("Success", {
          description: "Philosophy topic deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting philosophy topic:", error);
      toast.error("Error", {
        description: "Failed to delete philosophy topic",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setTopicToDelete(null);
    }
  };

  const handleToggleVisibility = async (
    id: string,
    currentVisibility: boolean
  ) => {
    setIsUpdatingVisibility(id);
    try {
      const success = await philosophyApi.updatePhilosophyTopic(id, {
        isVisible: !currentVisibility,
      });
      if (success) {
        setTopics((prevTopics) => {
          return prevTopics.map((topic) => {
            if (topic.id === id) {
              return {
                ...topic,
                isVisible: !currentVisibility,
              } as IPhilosophyTopic;
            }
            return topic;
          });
        });
      }
    } catch (error) {
      console.error("Error toggling topic visibility:", error);
    } finally {
      setIsUpdatingVisibility(null);
    }
  };

  const handleTopicSaved = () => {
    fetchTopics();
    setEditTopic(null);
    setIsAddDialogOpen(false);
  };

  const columns: ColumnDef<IPhilosophyTopic>[] = [
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
          <div className="mr-2 text-muted-foreground">{row.original.icon}</div>
          <span className="font-medium">{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.original.description}</div>
      ),
    },
    {
      accessorKey: "quotes",
      header: "Quotes",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Quote className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <span>{row.original.quotes?.length || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: "practices",
      header: "Practices",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Lightbulb className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <span>{row.original.practices?.length || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: "isVisible",
      header: "Visible",
      cell: ({ row }) => {
        const topic = row.original;
        const isUpdating = isUpdatingVisibility === topic.id;

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={topic.isVisible}
              onCheckedChange={() =>
                handleToggleVisibility(topic.id, topic.isVisible)
              }
              disabled={isUpdating}
              aria-label="Toggle visibility"
            />
            {isUpdating ? (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Badge variant={topic.isVisible ? "outline" : "secondary"}>
                {topic.isVisible ? (
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
        const topic = row.original;

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
              <DropdownMenuItem onClick={() => handleViewTopic(topic)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditTopic(topic)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleToggleVisibility(topic.id, topic.isVisible)
                }
                disabled={isUpdatingVisibility === topic.id}
              >
                {topic.isVisible ? (
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
                onClick={() => handleDeleteConfirm(topic.id)}
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
        <h2 className="text-2xl font-bold">Buddhist Philosophy Topics</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTopics}
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
            Add Topic
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
          data={topics}
          filterColumn="title"
          filterPlaceholder="Filter by topic title..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* Add Topic Dialog */}
      <PhilosophyFormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSaved={handleTopicSaved}
      />

      {/* View Topic Dialog */}
      {viewTopic && (
        <PhilosophyViewDialog
          topic={viewTopic}
          open={!!viewTopic}
          onClose={() => setViewTopic(null)}
        />
      )}

      {/* Edit Topic Dialog */}
      {editTopic && (
        <PhilosophyFormDialog
          open={!!editTopic}
          topic={editTopic}
          onClose={() => setEditTopic(null)}
          onSaved={handleTopicSaved}
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
              Are you sure you want to delete this philosophy topic? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmOpen(false);
                setTopicToDelete(null);
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
              Delete Multiple Topics
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected
              philosophy topics? This action cannot be undone.
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
                <>Delete {selectedIds.length} Topics</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
