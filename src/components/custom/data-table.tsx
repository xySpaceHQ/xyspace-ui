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
} from "../ui/table";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LayoutGrid, LayoutList } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

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
  gridColumns?: number;
  renderGridCard?: (row: Row<TData>) => React.ReactNode;
  // Loading state
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  showColumnVisibility = false,
  pageCount,
  pagination,
  onPaginationChange,
  manualPagination = false,
  enableGridView = false,
  gridColumns = 3,
  renderGridCard,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table");

  // Internal pagination state (only used when not manual)
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: manualPagination ? pagination! : internalPagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: manualPagination
      ? onPaginationChange!
      : setInternalPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: manualPagination,
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showColumnVisibility && viewMode === "table" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Columns</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {enableGridView && (
          <div className="flex items-center gap-1 border rounded-md">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-r-none"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
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
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
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
                      <TableCell key={cellIndex}>
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
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div
          className={`grid gap-4`}
          style={{
            gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
          }}
        >
          {isLoading ? (
            // Skeleton loader for grid
            Array.from({ length: 6 }).map((_, index) => (
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
            ))
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
                              ? column.header
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
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No results found.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1}
          {pageCount ? ` of ${pageCount}` : ""}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}