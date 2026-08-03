import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import { cn } from "@/lib/utils";

type AppTabProps = {
  tablist: Array<{
    value: string;
    label: string;
    disabled?: boolean;
    asChild?: boolean;
    content: React.ReactNode;
  }>;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
  tabClassName?: string;
  tabTriggerClassName?: string;
  value: string;
};

const AppTab = ({
  tablist,
  defaultValue,
  value,
  onValueChange,
  orientation = "horizontal",
  activationMode = "automatic",
  tabClassName,
  tabTriggerClassName,
}: AppTabProps) => {
  return (
    <Tabs
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      activationMode={activationMode}
      className={cn("", tabClassName)}
    >
      <TabsList>
        {tablist.map((tab) => (
          <TabsTrigger
            disabled={tab.disabled}
            asChild={tab.asChild}
            key={tab.value}
            value={tab.value}
            className={cn("", tabTriggerClassName)}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <>
        {tablist.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </>
    </Tabs>
  );
};

export default AppTab;
