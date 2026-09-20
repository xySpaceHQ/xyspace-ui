import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ColumnDef } from "@tanstack/react-table"
import { expect, waitFor, within } from "storybook/test"

import { DataTable } from "./data-table"

interface Person {
  id: string
  name: string
  email: string
  role: string
}

const people: Person[] = Array.from({ length: 24 }).map((_, index) => ({
  id: `${index + 1}`,
  name: `Person ${index + 1}`,
  email: `person${index + 1}@example.com`,
  role: ["Admin", "Editor", "Viewer"][index % 3],
}))

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
]

const meta: Meta<typeof DataTable<Person, unknown>> = {
  title: "Custom/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    columns,
    data: people,
  },
}

export const WithColumnVisibility: Story = {
  args: {
    columns,
    data: people,
    showColumnVisibility: true,
  },
}

export const Loading: Story = {
  args: {
    columns,
    data: [],
    isLoading: true,
  },
}

export const Empty: Story = {
  args: {
    columns,
    data: [],
  },
}

export const GridView: Story = {
  args: {
    columns,
    data: people,
    enableGridView: true,
  },
}

const manyPeople: Person[] = Array.from({ length: 100 }).map((_, index) => ({
  id: `${index + 1}`,
  name: `Person ${index + 1}`,
  email: `person${index + 1}@example.com`,
  role: ["Admin", "Editor", "Viewer"][index % 3],
}))

// The table scrolls inside whatever height its parent gives it, with the
// header staying in view.
export const Scrollable: Story = {
  args: {
    columns,
    data: manyPeople,
    className: "h-96",
  },
}

const INFINITE_PAGE_SIZE = 20

// Rows are handed over in batches: the next batch is requested when the end of
// the loaded rows scrolls into view.
export const InfiniteScroll: Story = {
  args: {
    columns,
    data: [],
    paginationMode: "infinite",
    className: "h-96",
  },
  render: (args) => {
    const [count, setCount] = React.useState(INFINITE_PAGE_SIZE)
    const [isFetchingMore, setIsFetchingMore] = React.useState(false)

    const loadMore = () => {
      setIsFetchingMore(true)
      setTimeout(() => {
        setCount((current) => current + INFINITE_PAGE_SIZE)
        setIsFetchingMore(false)
      }, 300)
    }

    return (
      <DataTable
        {...args}
        data={manyPeople.slice(0, count)}
        hasMore={count < manyPeople.length}
        isFetchingMore={isFetchingMore}
        onLoadMore={loadMore}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole("row")).toHaveLength(
      INFINITE_PAGE_SIZE + 1
    )

    const scroller = canvasElement.querySelector<HTMLElement>(
      '[data-slot="table-container"]'
    )!.parentElement!
    scroller.scrollTop = scroller.scrollHeight

    await waitFor(() =>
      expect(canvas.getAllByRole("row").length).toBeGreaterThan(
        INFINITE_PAGE_SIZE + 1
      )
    )
    await expect(canvas.queryByText("Page 1 of 1")).not.toBeInTheDocument()
  },
}
