"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  PaginationState,
  Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutGrid,
  LayoutList,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Columns2,
  Columns2Icon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showColumnVisibility?: boolean;
  // Server-side pagination props
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: React.Dispatch<React.SetStateAction<PaginationState>>;
  manualPagination?: boolean;
  // Grid view props
  enableGridView?: boolean;
  viewMode?: "table" | "grid";
  onViewModeChange?: React.Dispatch<React.SetStateAction<"table" | "grid">>;
  gridColumns?: number;
  renderGridCard?: (row: Row<TData>) => React.ReactNode;
  renderGridSkeleton?: () => React.ReactNode;
  gridSkeletonCount?: number;
  // Infinite scroll props (only used when paginationMode is "infinite")
  // "pages" shows the pagination controls, "infinite" replaces them with
  // loading the next batch as the user scrolls to the end of the rows. `data`
  // should hold every row loaded so far.
  paginationMode?: "pages" | "infinite";
  hasMore?: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
  loadMoreRootMargin?: string;
  // Loading state
  isLoading?: boolean;
  // Pagination UI options
  pageSizeOptions?: number[];
  showSelectedCount?: boolean;
  className?: string; // Optional className for the root element
  gridViewClassName?: string; // Optional className for grid view container

  tableClassName?: string; // Optional className for table view container

  positionPaginationControls?: "right" | "left";
  renderEmptyState?: () => React.ReactNode; // Optional function to render a custom empty state
}

// Vertical dividers between body cells, matching the ones in the header.
const cellDividerClass = (index: number) =>
  index === 0 ? "border-l-0" : "border-l";

export function DataTable<TData, TValue>({
  columns,
  data,
  showColumnVisibility = false,
  pageCount,
  pagination,
  onPaginationChange,
  manualPagination = false,
  enableGridView = false,
  viewMode: controlledViewMode,
  onViewModeChange,
  gridColumns = 3,
  renderGridCard,
  renderGridSkeleton,
  gridSkeletonCount = 6,
  paginationMode = "pages",
  hasMore = false,
  isFetchingMore = false,
  onLoadMore,
  loadMoreRootMargin = "0px 0px 120px 0px",
  isLoading = false,
  pageSizeOptions = [10, 20, 30, 40, 50],
  positionPaginationControls = "right",
  showSelectedCount = false,
  className,
  gridViewClassName,
  tableClassName,
  renderEmptyState,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [internalViewMode, setInternalViewMode] = React.useState<
    "table" | "grid"
  >("table");

  const viewMode = controlledViewMode ?? internalViewMode;
  const setViewMode = onViewModeChange ?? setInternalViewMode;

  // Internal pagination state (only used when not manual)
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: pageSizeOptions[0] ?? 10,
    });

  const isInfinite = paginationMode === "infinite";
  // Infinite mode owns the row loading, so the pagination props are ignored.
  const isServerPaginated = manualPagination && !isInfinite;

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: isServerPaginated ? pagination! : internalPagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: isServerPaginated
      ? onPaginationChange!
      : setInternalPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: manualPagination || isInfinite,
  });

  const currentPageIndex = table.getState().pagination.pageIndex;
  const currentPageSize = table.getState().pagination.pageSize;
  const totalPageCount = table.getPageCount();
  const isEmpty = !isLoading && table.getRowModel().rows.length === 0;

  // The element that scrolls the rows, and a marker at the end of them that
  // triggers loading more once it comes into view.
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const onLoadMoreRef = React.useRef(onLoadMore);
  React.useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  const canLoadMore = isInfinite && hasMore && !isLoading && !isFetchingMore;
  const loadedRowCount = data.length;

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!canLoadMore || !sentinel) return;

    // The observer reports the sentinel's state as soon as it starts observing,
    // so a batch that doesn't fill the viewport keeps loading until it does.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMoreRef.current?.();
        }
      },
      { root: scrollRef.current, rootMargin: loadMoreRootMargin },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [canLoadMore, loadMoreRootMargin, loadedRowCount, viewMode]);

  const loadMoreSentinel = isInfinite ? (
    <div ref={sentinelRef} aria-hidden className="h-px w-full" />
  ) : null;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showColumnVisibility && viewMode === "table" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-xs">
                  <Columns2Icon className="mr-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border border-border-01"
              >
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      className="capitalize text-xs"
                    >
                      {column.id.replace(/_/g, " ")}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {enableGridView && (
          <div className="flex items-center border-gray-100 border shadow-xs rounded-md">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-r-none"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-l-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div
          ref={scrollRef}
          className={cn(
            "min-h-0 flex-1 overflow-auto rounded-md border-x border-b",
            tableClassName,
          )}
        >
          {/* The wrapper above is the scroll container, so the header can stick to it */}
          <Table containerClassName="overflow-visible">
            <TableHeader className="bg-surface-level-01">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "sticky top-0 z-10 bg-surface-level-01 cursor-pointer select-none px-2 capitalize border-y border-border-01 text-body font-medium text-xs",
                        index === 0 ? "border-l-0" : "border-l",
                        index === headerGroup.headers.length - 1
                          ? "border-r-0"
                          : "border-r",
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {typeof header.column.columnDef.header === "string"
                        ? header.column.columnDef.header.replace(/_/g, " ")
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {{
                        asc: " ↑",
                        desc: " ↓",
                      }[header.column.getIsSorted() as string] ?? null}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                // Skeleton loader for table
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((column, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className={cellDividerClass(cellIndex)}
                      >
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50 h-15 "
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "px-2 text-subtext-01 text-xs capitalize",
                          cellDividerClass(index),
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-48 text-center text-muted-foreground"
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      {renderEmptyState ? (
                        renderEmptyState()
                      ) : (
                        <span>No results found.</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {isInfinite &&
                isFetchingMore &&
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={`fetching-more-${index}`}>
                    {table.getVisibleLeafColumns().map((column, index) => (
                      <TableCell
                        key={column.id}
                        className={cellDividerClass(index)}
                      >
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {loadMoreSentinel}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div
          ref={scrollRef}
          className={cn("min-h-0 flex-1", isInfinite && "overflow-auto")}
        >
          <div
            className={cn("grid gap-4", gridViewClassName)}
            style={{
              gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
            }}
          >
            {isLoading ? (
              // Skeleton loader for grid
              Array.from({ length: gridSkeletonCount }).map((_, index) =>
                renderGridSkeleton ? (
                  <React.Fragment key={index}>
                    {renderGridSkeleton()}
                  </React.Fragment>
                ) : (
                  <div
                    key={index}
                    className="rounded-lg border bg-card p-6 shadow-sm"
                  >
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                ),
              )
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <div key={row.id}>
                  {renderGridCard ? (
                    renderGridCard(row)
                  ) : (
                    <div className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                      {columns.map((column) => {
                        const cell = row
                          .getVisibleCells()
                          .find((c) => c.column.id === column.id);
                        return cell ? (
                          <div key={cell.id} className="mb-2 last:mb-0">
                            <div className="text-sm font-medium text-muted-foreground">
                              {typeof column.header === "string"
                                ? column.header.replace(/_/g, " ")
                                : column.id}
                            </div>
                            <div className="text-sm">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center py-12 text-muted-foreground">
                {renderEmptyState ? renderEmptyState() : "No results found."}
              </div>
            )}
          </div>
          {loadMoreSentinel}
        </div>
      )}

      {/* Pagination */}
      {!isEmpty && !isInfinite && (
        <div className="flex shrink-0 items-center justify-between px-2 mt-6">
          <div
            className={cn(
              "flex-1 text-sm text-muted-foreground",
              positionPaginationControls === "left" && "order-2",
            )}
          >
            {showSelectedCount
              ? `${table.getFilteredSelectedRowModel().rows.length} of ${
                  table.getFilteredRowModel().rows.length
                } row(s) selected.`
              : null}
          </div>

          <div
            className={cn(
              "flex items-center space-x-6 lg:space-x-8",
              positionPaginationControls === "left" && "order-1",
            )}
          >
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${currentPageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={currentPageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {currentPageIndex + 1} of {Math.max(totalPageCount, 1)}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(totalPageCount - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
