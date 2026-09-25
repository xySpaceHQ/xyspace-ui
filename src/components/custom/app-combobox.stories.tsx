import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { MailIcon } from "lucide-react";
import { Button } from "../ui/button";
import { AppCombobox, type AppComboboxItem } from "./app-combobox";

const meta: Meta<typeof AppCombobox> = {
  title: "Custom/AppCombobox",
  component: AppCombobox,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const USERS: AppComboboxItem[] = [
  {
    value: "ada@xyspace.io",
    label: "Ada Lovelace",
    description: "ada@xyspace.io",
    image: "https://i.pravatar.cc/80?img=47",
  },
  {
    value: "grace@xyspace.io",
    label: "Grace Hopper",
    description: "grace@xyspace.io",
    image: "https://i.pravatar.cc/80?img=45",
  },
  {
    value: "alan@xyspace.io",
    label: "Alan Turing",
    description: "alan@xyspace.io",
  },
  {
    value: "katherine@xyspace.io",
    label: "Katherine Johnson",
    description: "katherine@xyspace.io",
    image: "https://i.pravatar.cc/80?img=32",
  },
];

const isValidEmail = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);

// Unknown emails become "invite" chips with a mail icon.
const createEmailItem = (text: string): AppComboboxItem | null =>
  isValidEmail(text)
    ? { value: text.toLowerCase(), icon: <MailIcon /> }
    : null;

// Stands in for the users search endpoint.
function useUserSearch(search: string) {
  const [results, setResults] = useState<AppComboboxItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      setResults(
        USERS.filter((user) =>
          [user.label, user.value].some((field) =>
            field?.toLowerCase().includes(query),
          ),
        ),
      );
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  return { results, loading };
}

export const InviteCollaborators: Story = {
  name: "Sample: Invite collaborators",
  render: function Render() {
    const [recipients, setRecipients] = useState<AppComboboxItem[]>([]);
    const [search, setSearch] = useState("");
    const [sending, setSending] = useState(false);
    const { results, loading } = useUserSearch(search);

    const send = () => {
      setSending(true);
      setTimeout(() => {
        setSending(false);
        setRecipients([]);
      }, 1000);
    };

    return (
      <div className="flex max-w-full flex-col gap-3">
        <p className="text-sm text-subtext-01">
          Search users by name or email, or paste a list of emails.
        </p>
        <div className="flex items-start gap-2">
          <AppCombobox
            value={recipients}
            onValueChange={setRecipients}
            chipColor="orange"
            options={results}
            searchValue={search}
            onSearchChange={setSearch}
            filterOptions={false}
            loading={loading}
            createItem={createEmailItem}
            createLabel={(item) => (
              <>
                Invite <span className="font-medium">{item.value}</span>
              </>
            )}
            delimiters={[",", ";", " "]}
            emptyMessage="No users found. Enter a full email to invite someone new."
            placeholder="name1@example.com, name2@example.com.."
            aria-label="Search users or enter emails"
            disabled={sending}
          />
          <Button onClick={send} disabled={!recipients.length || sending}>
            {sending ? "Sending.." : "Invite"}
          </Button>
        </div>
        <pre className="text-xs text-subtext-03">
          {JSON.stringify(
            recipients.map(({ value, label }) => ({ value, label })),
            null,
            2,
          )}
        </pre>
      </div>
    );
  },
};

export const LocalOptions: Story = {
  render: function Render() {
    const [value, setValue] = useState<AppComboboxItem[]>([USERS[0]]);
    return (
      <div className="max-w-md">
        <AppCombobox
          value={value}
          onValueChange={setValue}
          options={USERS}
          placeholder="Search teammates.."
        />
      </div>
    );
  },
};

export const Overflow: Story = {
  render: function Render() {
    const [value, setValue] = useState<AppComboboxItem[]>(USERS);
    return (
      <div className="max-w-md">
        <AppCombobox
          value={value}
          onValueChange={setValue}
          options={USERS}
          placeholder="Search teammates.."
        />
      </div>
    );
  },
};

export const MaxItems: Story = {
  render: function Render() {
    const [value, setValue] = useState<AppComboboxItem[]>([]);
    return (
      <div className="max-w-md">
        <AppCombobox
          value={value}
          onValueChange={setValue}
          options={USERS}
          maxItems={2}
          placeholder="Pick up to 2 reviewers.."
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-md">
      <AppCombobox
        value={USERS.slice(0, 2)}
        onValueChange={() => {}}
        options={USERS}
        disabled
      />
    </div>
  ),
};
