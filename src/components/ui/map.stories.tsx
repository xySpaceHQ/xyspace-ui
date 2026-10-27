import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactNode } from "react";
import { Button } from "./button";
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
import { MapDraw, useMapDraw, type MapDrawFeature } from "./map-draw";
import { MapDrawToolbar } from "./map-draw-toolbar";

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

// --- Story: drawing tools ----------------------------------------------------

// `useMapDraw()` is plain React state, so the toolbar, a sidebar or a
// keyboard shortcut can all drive the same controller.
function DrawingToolsDemo() {
  const [layers, setLayers] = useState<MapDrawFeature[]>([]);
  const draw = useMapDraw({
    onCreate: (feature) => setLayers((prev) => [...prev, feature]),
    onUpdate: (feature) =>
      setLayers((prev) => prev.map((f) => (f.id === feature.id ? feature : f))),
    onRemove: (feature) =>
      setLayers((prev) => prev.filter((f) => f.id !== feature.id)),
  });

  return (
    <div className="bg-background flex h-[640px] w-full gap-3 p-4">
      <div className="border-border min-h-0 flex-1 overflow-hidden rounded-lg border">
        <Map viewport={{ center: [-122.4194, 37.7749], zoom: 12 }}>
          {/* MapDraw renders the shape being edited, so hide its own layer meanwhile. */}
          {layers
            .filter((feature) => feature.id !== draw.editing?.id)
            .map((feature) => (
              <MapGeoJSON
                key={feature.id}
                id={feature.id}
                data={feature}
                // MapLibre fill layers also fill LineStrings, so lines get outline only.
                fillPaint={
                  feature.geometry.type === "Polygon"
                    ? { "fill-color": "#2563eb", "fill-opacity": 0.25 }
                    : false
                }
                linePaint={{ "line-color": "#2563eb", "line-width": 2 }}
                interactive={!draw.mode}
                onClick={() => draw.edit(feature)}
              />
            ))}
          <MapDraw draw={draw} />
          <MapDrawToolbar
            draw={draw}
            tools={["polygon", "rectangle", "line", "measure"]}
          />
          <MapControls showZoom />
        </Map>
      </div>

      <aside className="border-border flex w-64 flex-col gap-2 overflow-auto rounded-lg border p-3 text-sm">
        <p className="font-medium">Layers ({layers.length})</p>
        {layers.length === 0 && (
          <p className="text-muted-foreground text-xs">
            Shapes you draw appear here. Click one on the map to edit it.
          </p>
        )}
        {layers.map((feature, index) => (
          <div key={feature.id} className="flex items-center justify-between gap-2">
            <span className="capitalize">
              {feature.properties.drawMode} {index + 1}
            </span>
            <div className="flex gap-1">
              <Button
                size="xs"
                variant={draw.editing?.id === feature.id ? "default" : "ghost"}
                onClick={() =>
                  draw.editing?.id === feature.id ? draw.finish() : draw.edit(feature)
                }
              >
                {draw.editing?.id === feature.id ? "Done" : "Edit"}
              </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => {
                  if (draw.editing?.id === feature.id) draw.cancel();
                  setLayers((prev) => prev.filter((f) => f.id !== feature.id));
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}

export const DrawingTools: Story = {
  name: "Drawing tools",
  parameters: {
    docs: {
      description: {
        story:
          "`useMapDraw()` + `<MapDraw />` + `<MapDrawToolbar />`. The toolbar sits at the bottom center of the map: the pencil draws a polygon, the selection draws a rectangle, the ruler measures a distance, and the arrows undo and redo (also Cmd/Ctrl+Z and Cmd/Ctrl+Shift+Z). Finished shapes come back through `onCreate` and are rendered as `MapGeoJSON` layers. Click a shape to call `draw.edit(feature)`: drag points to move them, drag midpoints to add points, select a point and press Delete to remove it. Edits come back through `onUpdate`, and undo/redo step through them.",
      },
    },
  },
  render: () => <DrawingToolsDemo />,
};

// --- Story: draw a boundary --------------------------------------------------

// The flow xyField uses for a project boundary: one shape at a time. Drawing
// replaces the boundary, and a fresh shape goes straight into editing so it
// can be tidied up before it is used. Undo walks back through the edits and
// then reopens the drawing, even after "Done editing".
function BoundaryDrawingDemo() {
  const [boundary, setBoundary] = useState<MapDrawFeature | null>(null);
  const draw = useMapDraw({
    editOnCreate: true,
    onCreate: setBoundary,
    onUpdate: setBoundary,
    onRemove: () => setBoundary(null),
  });
  const isEditing = draw.editing !== null;

  return (
    <div className="bg-background flex h-[640px] w-full gap-3 p-4">
      <aside className="border-border flex w-64 flex-col gap-3 rounded-lg border p-3 text-sm">
        <p className="font-medium">Project boundary</p>
        {boundary ? (
          <>
            <p className="text-muted-foreground text-xs">
              {boundary.geometry.type === "Polygon" &&
                `${boundary.geometry.coordinates[0].length - 1} points`}
              {isEditing && " · editing"}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => (isEditing ? draw.finish() : draw.edit(boundary))}
              >
                {isEditing ? "Done editing" : "Edit"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  draw.cancel();
                  setBoundary(null);
                }}
              >
                Remove
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-muted-foreground text-xs">
              Upload a boundary, or draw one with the tools at the bottom of the map.
            </p>
            <Button size="sm" onClick={() => draw.start("polygon")}>
              Draw boundary
            </Button>
          </>
        )}
      </aside>
      <div className="border-border min-h-0 flex-1 overflow-hidden rounded-lg border">
        <Map viewport={{ center: [-122.4194, 37.7749], zoom: 12 }}>
          {boundary && !isEditing && (
            <MapGeoJSON
              id="boundary"
              data={boundary}
              fillPaint={{ "fill-color": "#2563eb", "fill-opacity": 0.2 }}
              linePaint={{ "line-color": "#2563eb", "line-width": 2 }}
              interactive={!draw.mode}
              onClick={() => draw.edit(boundary)}
            />
          )}
          <MapDraw draw={draw} />
          <MapDrawToolbar draw={draw} />
          <MapControls showZoom />
        </Map>
      </div>
    </div>
  );
}

export const BoundaryDrawing: Story = {
  name: "Drawing a boundary",
  parameters: {
    docs: {
      description: {
        story:
          "A single-boundary flow with `editOnCreate`: the sidebar or the toolbar starts drawing, `onCreate` stores the shape and it goes straight into editing. Undo/redo cover the whole session, also after the shape is finished or editing is done: undoing past the first edit reopens the drawing and fires `onRemove`, redo brings the shape back through `onCreate`. Drawing again replaces the boundary.",
      },
    },
  },
  render: () => <BoundaryDrawingDemo />,
};
