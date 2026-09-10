import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode } from "react";
import {
  Map,
  MapArc,
  MapClusterLayer,
  MapControls,
  MapGeoJSON,
  MapMarker,
  MapPopup,
  MapRasterLayer,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  MarkerTooltip,
} from "./map";

const meta = {
  title: "UI/Map",
  component: Map,
  subcomponents: {
    MapMarker,
    MarkerContent,
    MarkerLabel,
    MarkerTooltip,
    MarkerPopup,
    MapPopup,
    MapControls,
    MapGeoJSON,
    MapClusterLayer,
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Map>;

export default meta;

type Story = StoryObj<typeof Map>;

function MapCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background h-[560px] w-full p-4">
      <div className="border-border h-full w-full overflow-hidden rounded-lg border">
        {children}
      </div>
    </div>
  );
}

// --- Story 1: route + business location -----------------------------------

const WAREHOUSE: [number, number] = [-122.3872, 37.7803];
const COFFEE_ROASTERY: [number, number] = [-122.3937, 37.7955];

const DELIVERY_ROUTE: [number, number][] = [
  WAREHOUSE,
  [-122.3915, 37.7845],
  [-122.3902, 37.7891],
  [-122.3928, 37.7932],
  COFFEE_ROASTERY,
];

export const RouteToBusinessLocation: Story = {
  name: "Route & business location",
  parameters: {
    docs: {
      description: {
        story:
          "A delivery route (`MapRoute`) between a warehouse and a business, with the destination as a `MapMarker` — click it to open its `MarkerPopup`.",
      },
    },
  },
  render: () => (
    <MapCanvas>
      <Map viewport={{ center: [-122.3905, 37.7885], zoom: 13.5 }}>
        <MapRoute coordinates={DELIVERY_ROUTE} color="#2563eb" width={4} />
        <MapMarker longitude={WAREHOUSE[0]} latitude={WAREHOUSE[1]}>
          <MarkerContent>
            <div className="h-4 w-4 rounded-sm border-2 border-white bg-neutral-500 shadow-lg" />
          </MarkerContent>
          <MarkerLabel>Distribution warehouse</MarkerLabel>
        </MapMarker>
        <MapMarker longitude={COFFEE_ROASTERY[0]} latitude={COFFEE_ROASTERY[1]}>
          <MarkerContent />
          <MarkerPopup closeButton>
            <p className="text-sm font-medium">Bluebird Coffee Roasters</p>
            <p className="text-muted-foreground text-xs">
              Ferry Building, San Francisco
            </p>
            <p className="text-muted-foreground text-xs">
              4.2 mi from warehouse
            </p>
          </MarkerPopup>
          <MarkerLabel>Bluebird Coffee Roasters</MarkerLabel>
        </MapMarker>
        <MapControls showZoom showBaseMap showLocate showFullscreen />
      </Map>
    </MapCanvas>
  ),
};
