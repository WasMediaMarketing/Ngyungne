"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { pageApi, type PageUI } from "@/utils/pageApi";
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
  FileText,
  FileEdit,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { PageForm } from "@/components/admin/pages/page-form";

export default function AdminPageList() {
  const [pages, setPages] = useState<PageUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewPage, setViewPage] = useState<PageUI | null>(null);
  const [editPage, setEditPage] = useState<PageUI | null>(null);
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const data = await pageApi.getAdminPages();
      setPages(data);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast.error("Error", {
        description: "Failed to fetch pages",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map((index) => pages[Number.parseInt(index)].id);
    setSelectedIds(ids);
  };

  const handleViewPage = (page: PageUI) => {
    setViewPage(page);
  };

  const handleEditPage = (page: PageUI) => {
    setEditPage(page);
  };

  const handleAddPage = () => {
    setIsAddPageOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setPageToDelete(id);
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
      const success = await pageApi.deletePages(selectedIds);
      if (success) {
        setPages((prevPages) =>
          prevPages.filter((p) => !selectedIds.includes(p.id))
        );
        setSelectedIds([]);
        toast.success("Success", {
          description: `${selectedIds.length} pages deleted successfully`,
        });
      }
    } catch (error) {
      console.error("Error deleting pages:", error);
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!pageToDelete) return;

    setIsDeleting(true);
    try {
      const success = await pageApi.deletePage(pageToDelete);
      if (success) {
        setPages((prevPages) => prevPages.filter((p) => p.id !== pageToDelete));
        setDeleteConfirmOpen(false);
        setPageToDelete(null);
        toast.success("Success", {
          description: "Page deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting page:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: "draft" | "published"
  ) => {
    setIsUpdatingStatus(id);
    try {
      const success = await pageApi.togglePageStatus(id, currentStatus);

      if (success) {
        setPages((prevPages) => {
          return prevPages.map((page) => {
            if (page.id === id) {
              const newStatus =
                currentStatus === "draft" ? "published" : "draft";
              return {
                ...page,
                status: newStatus,
              };
            }
            return page;
          });
        });
        toast.success("Success", {
          description: `Page ${
            currentStatus === "draft" ? "published" : "moved to draft"
          } successfully`,
        });
      } else {
        toast.error("Error", {
          description:
            "Failed to update page status. Please check your authentication.",
        });
      }
    } catch (error) {
      console.error("Error toggling page status:", error);
      toast.error("Error", {
        description:
          "Failed to update page status. Please check your authentication.",
      });
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handlePageSaved = () => {
    fetchPages();
    setIsAddPageOpen(false);
    setEditPage(null);
  };

  const getLocationBadge = (location: string) => {
    return location === "header" ? (
      <Badge variant="outline" className="bg-blue-100 text-blue-800">
        Header
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-purple-100 text-purple-800">
        Footer
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === "published" ? (
      <Badge variant="outline" className="bg-green-100 text-green-800">
        Published
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-amber-100 text-amber-800">
        Draft
      </Badge>
    );
  };

  const getParentPageName = (parentId: string | undefined) => {
    if (!parentId) return "None";

    // Check if it's a site section
    if (parentId === "teachings") return "Teachings";
    if (parentId === "programs") return "Programs";
    if (parentId === "resources") return "Resources";
    if (parentId === "bookings") return "Bookings";
    if (parentId === "quick-links") return "Quick Links";

    // Otherwise, check if it's a page ID
    const parent = pages.find((p) => p.id === parentId);
    return parent ? parent.title : "Unknown";
  };

  const columns: ColumnDef<PageUI>[] = [
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
        <div className="font-medium">{row.original.title}</div>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.slug}</div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => getLocationBadge(row.original.location),
    },
    {
      accessorKey: "parentPage",
      header: "Parent",
      cell: ({ row }) => (
        <div>{getParentPageName(row.original.parentPage)}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const page = row.original;
        const isUpdating = isUpdatingStatus === page.id;

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={page.status === "published"}
              onCheckedChange={() => handleToggleStatus(page.id, page.status)}
              disabled={isUpdating}
              aria-label="Toggle status"
            />
            {isUpdating ? (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              getStatusBadge(page.status)
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.original.updatedAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const page = row.original;

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
              <DropdownMenuItem onClick={() => handleViewPage(page)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditPage(page)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleStatus(page.id, page.status)}
                disabled={isUpdatingStatus === page.id}
              >
                {page.status === "draft" ? (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Publish
                  </>
                ) : (
                  <>
                    <FileEdit className="mr-2 h-4 w-4" />
                    Move to Draft
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteConfirm(page.id)}
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
    <div className="space-y-8">
      <>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Page Management</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPages}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="default" size="sm" onClick={handleAddPage}>
              <Plus className="h-4 w-4 mr-2" />
              Add Page
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
            data={pages}
            filterColumn="title"
            filterPlaceholder="Filter by title..."
            onRowSelectionChange={handleRowSelectionChange}
          />
        )}

        {/* View Page Dialog */}
        {viewPage && (
          <Dialog
            open={!!viewPage}
            onOpenChange={(open) => !open && setViewPage(null)}
          >
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Page Details</DialogTitle>
                <DialogDescription>
                  Complete information about the page.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {getLocationBadge(viewPage.location)}
                  {getStatusBadge(viewPage.status)}
                  {viewPage.metaTitle && (
                    <Badge variant="outline" className="bg-gray-100">
                      SEO Optimized
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{viewPage.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="font-mono">/{viewPage.slug}</span>
                  </div>
                </div>

                {viewPage.parentPage && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Parent Page
                    </h4>
                    <p>{getParentPageName(viewPage.parentPage)}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Content Preview
                  </h4>
                  <div className="p-4 border rounded-md bg-gray-50 max-h-[300px] overflow-y-auto">
                    <div
                      dangerouslySetInnerHTML={{ __html: viewPage.content }}
                    />
                  </div>
                </div>

                {(viewPage.metaTitle ||
                  viewPage.metaDescription ||
                  viewPage.metaKeywords) && (
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="text-sm font-medium">SEO Information</h4>
                    {viewPage.metaTitle && (
                      <div className="space-y-1">
                        <h5 className="text-xs font-medium text-muted-foreground">
                          Meta Title
                        </h5>
                        <p className="text-sm">{viewPage.metaTitle}</p>
                      </div>
                    )}
                    {viewPage.metaDescription && (
                      <div className="space-y-1">
                        <h5 className="text-xs font-medium text-muted-foreground">
                          Meta Description
                        </h5>
                        <p className="text-sm">{viewPage.metaDescription}</p>
                      </div>
                    )}
                    {viewPage.metaKeywords && (
                      <div className="space-y-1">
                        <h5 className="text-xs font-medium text-muted-foreground">
                          Meta Keywords
                        </h5>
                        <p className="text-sm">{viewPage.metaKeywords}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  <p>
                    Created: {new Date(viewPage.createdAt).toLocaleString()}
                  </p>
                  <p>
                    Last Updated:{" "}
                    {new Date(viewPage.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setViewPage(null)}>
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setViewPage(null);
                    handleEditPage(viewPage);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Add Page Dialog */}
        <Dialog open={isAddPageOpen} onOpenChange={setIsAddPageOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Page</DialogTitle>
              <DialogDescription>
                Create a new page for your website.
              </DialogDescription>
            </DialogHeader>
            <PageForm
              onSuccess={handlePageSaved}
              onCancel={() => setIsAddPageOpen(false)}
              parentPages={pages}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Page Dialog */}
        <Dialog
          open={!!editPage}
          onOpenChange={(open) => !open && setEditPage(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Page</DialogTitle>
              <DialogDescription>
                Update the page information.
              </DialogDescription>
            </DialogHeader>
            {editPage && (
              <PageForm
                page={editPage}
                onSuccess={handlePageSaved}
                onCancel={() => setEditPage(null)}
                parentPages={pages}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this page? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setPageToDelete(null);
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
                Delete Multiple Pages
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedIds.length} selected
                pages? This action cannot be undone.
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
                  <>Delete {selectedIds.length} Pages</>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    </div>
  );
}
