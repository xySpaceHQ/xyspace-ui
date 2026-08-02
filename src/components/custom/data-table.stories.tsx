import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ColumnDef } from "@tanstack/react-table"

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
