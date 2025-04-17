"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { blogApi } from "@/utils/blogApi";
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
  Calendar,
  Clock,
  Tag,
  Bookmark,
  MessageSquare,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { IBlogPost } from "@/types";
import { AddBlogPostDialog } from "@/components/admin/blog/add-blog-post-dialog";
import { EditBlogPostDialog } from "@/components/admin/blog/edit-blog-post-dialog";

export default function AdminBlogPage() {
  const [blogPosts, setBlogPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewBlogPost, setViewBlogPost] = useState<IBlogPost | null>(null);
  const [editBlogPost, setEditBlogPost] = useState<IBlogPost | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [blogPostToDelete, setBlogPostToDelete] = useState<string | null>(null);
  const [isAddBlogPostOpen, setIsAddBlogPostOpen] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState<
    string | null
  >(null);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const blogPosts = await blogApi.getAdminBlogPosts();
      setBlogPosts(blogPosts.data); // ✅ no `.data` here
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);
  console.log("Blog posts:", blogPosts);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map((index) =>
      blogPosts[Number.parseInt(index)].id.toString()
    );
    setSelectedIds(ids);
  };

  const handleViewBlogPost = (blogPost: IBlogPost) => {
    setViewBlogPost(blogPost);
  };

  const handleEditBlogPost = (blogPost: IBlogPost) => {
    setEditBlogPost(blogPost);
  };

  const handleDeleteConfirm = (id: string) => {
    setBlogPostToDelete(id);
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
      const success = await blogApi.deleteBlogPosts(selectedIds);
      if (success) {
        setBlogPosts((prevBlogPosts) =>
          prevBlogPosts.filter((a) => !selectedIds.includes(a.id.toString()))
        );
        setSelectedIds([]);
        toast.success("Success", {
          description: `${selectedIds.length} blog posts deleted successfully`,
        });
      }
    } catch (error) {
      console.error("Error deleting blog posts:", error);
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!blogPostToDelete) return;

    setIsDeleting(true);
    try {
      const success = await blogApi.deleteBlogPost(blogPostToDelete);
      if (success) {
        setBlogPosts((prevBlogPosts) =>
          prevBlogPosts.filter((a) => a.id.toString() !== blogPostToDelete)
        );
        setDeleteConfirmOpen(false);
        setBlogPostToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
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
      const success = await blogApi.toggleBlogPostVisibility(
        id,
        !currentVisibility
      );
      if (success) {
        setBlogPosts((prevBlogPosts) => {
          return prevBlogPosts.map((blogPost) => {
            if (blogPost.id.toString() === id) {
              return {
                ...blogPost,
                isVisible: !currentVisibility,
              } as IBlogPost;
            }
            return blogPost;
          });
        });
      }
    } catch (error) {
      console.error("Error toggling blog post visibility:", error);
    } finally {
      setIsTogglingVisibility(null);
    }
  };

  const handleBlogPostSaved = () => {
    fetchBlogPosts();
    setIsAddBlogPostOpen(false);
    setEditBlogPost(null);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns: ColumnDef<IBlogPost>[] = [
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
                fill
                className="object-cover"
              />
            </div>
          )}
          <span className="font-medium line-clamp-2">{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{formatDate(row.original.date)}</span>
        </div>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.author?.image && (
            <div className="relative h-6 w-6 rounded-full overflow-hidden">
              <Image
                src={row.original.author.image || "/placeholder.svg"}
                alt={row.original.author.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <span>{row.original.author?.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "readTime",
      header: "Read Time",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.readTime ? (
            <>
              <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span>{row.original.readTime}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Not specified</span>
          )}
        </div>
      ),
    },
    {
      id: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.original.tags || [];
        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {tags.length > 0 ? (
              tags.slice(0, 2).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue-50 text-blue-700"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">No tags</span>
            )}
            {tags.length > 2 && (
              <Badge variant="outline">+{tags.length - 2}</Badge>
            )}
          </div>
        );
      },
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
        const blogPost = row.original;
        const id = blogPost.id.toString();
        const isVisible = blogPost.isVisible;
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const blogPost = row.original;

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
              <DropdownMenuItem onClick={() => handleViewBlogPost(blogPost)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditBlogPost(blogPost)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleToggleVisibility(
                    blogPost.id.toString(),
                    blogPost.isVisible
                  )
                }
                disabled={isTogglingVisibility === blogPost.id.toString()}
              >
                {blogPost.isVisible ? (
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
                onClick={() => handleDeleteConfirm(blogPost.id.toString())}
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
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBlogPosts}
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
            onClick={() => setIsAddBlogPostOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Blog Post
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
          data={blogPosts}
          filterColumn="title"
          filterPlaceholder="Filter by title..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* View Blog Post Dialog */}
      {viewBlogPost && (
        <Dialog
          open={!!viewBlogPost}
          onOpenChange={(open) => !open && setViewBlogPost(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Blog Post Details</DialogTitle>
              <DialogDescription>
                Complete information about the blog post.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="relative h-64 w-full rounded-md overflow-hidden">
                  <Image
                    src={viewBlogPost.image || "/placeholder.svg"}
                    alt={viewBlogPost.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold mt-2">
                    {viewBlogPost.title}
                  </h3>
                  <div className="flex items-center text-muted-foreground mt-1 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(viewBlogPost.date)}</span>
                    </div>
                    {viewBlogPost.readTime && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{viewBlogPost.readTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {viewBlogPost.author?.image && (
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={viewBlogPost.author.image || "/placeholder.svg"}
                        alt={viewBlogPost.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">
                      {viewBlogPost.author?.name}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {viewBlogPost.author?.bio}
                    </div>
                  </div>
                </div>

                {viewBlogPost.tags && viewBlogPost.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Tag className="h-4 w-4 mr-1" /> Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {viewBlogPost.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {viewBlogPost.categories &&
                  viewBlogPost.categories.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Bookmark className="h-4 w-4 mr-1" /> Categories
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {viewBlogPost.categories.map((category, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-green-50 text-green-700"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="space-y-6">
                {viewBlogPost.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">
                      {viewBlogPost.description}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Content</h4>
                  <div className="max-h-[300px] overflow-y-auto border rounded-md p-4 bg-muted/30">
                    <div
                      className="text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: viewBlogPost.content }}
                    />
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Visibility Status</h4>
                    <div className="flex items-center">
                      <Switch
                        checked={viewBlogPost.isVisible}
                        onCheckedChange={() => {
                          handleToggleVisibility(
                            viewBlogPost.id.toString(),
                            viewBlogPost.isVisible
                          );
                          setViewBlogPost({
                            ...viewBlogPost,
                            isVisible: !viewBlogPost.isVisible,
                          } as IBlogPost);
                        }}
                        aria-label="Toggle visibility"
                      />
                      <span className="ml-2">
                        {viewBlogPost.isVisible ? "Published" : "Draft"}
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
                      {viewBlogPost.views || 0} views
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewBlogPost(null)}>
                Close
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setViewBlogPost(null);
                  handleEditBlogPost(viewBlogPost);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Blog Post Dialog */}
      <AddBlogPostDialog
        open={isAddBlogPostOpen}
        onOpenChange={setIsAddBlogPostOpen}
        onSuccess={handleBlogPostSaved}
      />

      {/* Edit Blog Post Dialog */}
      <EditBlogPostDialog
        open={!!editBlogPost}
        onOpenChange={(open) => !open && setEditBlogPost(null)}
        blogPost={editBlogPost}
        onSuccess={handleBlogPostSaved}
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
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmOpen(false);
                setBlogPostToDelete(null);
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
              Delete Multiple Blog Posts
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected blog
              posts? This action cannot be undone.
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
                <>Delete {selectedIds.length} Blog Posts</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
