"use client";

import { Layer, Marker, Source } from "@vis.gl/react-maplibre";
import type * as MapLibreGL from "maplibre-gl";
import type * as GeoJSON from "geojson";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { useMap } from "./map";

/*
 * Drawing and editing tools for <Map>, modelled on geojson.io: a single
 * "mode" plus a set of mouse handlers per mode. State lives in `useMapDraw()`
 * so any component (toolbars, sidebars, keyboard shortcuts) can drive it,
 * while `<MapDraw>` sits inside <Map> and translates map events into
 * controller calls.
 *
 *   const draw = useMapDraw({
 *     onCreate: (f) => setLayers((l) => [...l, f]),
 *     onUpdate: (f) => setLayers((l) => l.map((x) => (x.id === f.id ? f : x))),
 *   });
 *   <button onClick={() => draw.start("polygon")}>Polygon</button>
 *   <button onClick={() => draw.edit(layers[0])}>Edit</button>
 *   <Map>
 *     <MapDraw draw={draw} />
 *   </Map>
 *
 * Drawing:
 *   polygon   — click to add vertices; click the first vertex, double-click or
 *               press Enter to close.
 *   line      — click to add vertices; double-click or press Enter to finish.
 *   rectangle — press, drag and release.
 *   measure   — like line, but shows the length and never creates a shape.
 *               Once finished, the next click starts a new measurement.
 *   Escape cancels, Backspace removes the last vertex.
 *
 * Editing (after `draw.edit(feature)`):
 *   drag a vertex to move it, drag a midpoint to insert a vertex, click a
 *   vertex then press Delete/Backspace to remove it. Rectangles keep their
 *   shape: dragging a corner resizes. Escape or Enter stops editing.
 *
 * Both drawing and editing keep a history: `draw.undo()` / `draw.redo()`, or
 * Cmd/Ctrl+Z and Cmd/Ctrl+Shift+Z (Ctrl+Y). `<MapDrawToolbar>` puts the
 * tools and undo/redo in a ready-made toolbar.
 */

type MapDrawMode = "polygon" | "line" | "rectangle";

/** A drawing mode, or `measure`: a throwaway line that shows its length. */
type MapDrawTool = MapDrawMode | "measure";

type LngLat = [number, number];

type MapDrawGeometry = GeoJSON.Polygon | GeoJSON.LineString;

/** A drawn shape, as handed to `onCreate` / `onUpdate` and accepted by `edit`. */
type MapDrawFeature = GeoJSON.Feature<
  MapDrawGeometry,
  { drawMode: MapDrawMode }
> & { id: string };

type UseMapDrawOptions = {
  /** Called with each finished shape. Store it and render it however you like (e.g. `MapGeoJSON`). */
  onCreate?: (feature: MapDrawFeature) => void;
  /** Called after each edit (vertex moved, inserted or removed) with the updated shape. Same `id` as before. */
  onUpdate?: (feature: MapDrawFeature) => void;
  /** Called when undo takes back a shape `onCreate` reported. Redo reports it through `onCreate` again. */
  onRemove?: (feature: MapDrawFeature) => void;
  /** Stay in the current mode after finishing a shape, ready to draw the next one (default: false). Each shape then starts a fresh history. */
  continuous?: boolean;
  /** Go straight into editing a finished shape, so it can be reshaped right away (default: false). */
  editOnCreate?: boolean;
};

/** Controller returned by `useMapDraw`. Pass it to `<MapDraw draw={...} />`. */
type MapDrawController = {
  /** Active drawing tool, or `null` when not drawing. */
  mode: MapDrawTool | null;
  /** Vertices placed so far in the shape being drawn. */
  vertices: LngLat[];
  /** True once a measurement is finished; it stays on the map until the next click. */
  measureComplete: boolean;
  /** Shape currently being edited, or `null`. Reflects every committed edit. */
  editing: MapDrawFeature | null;
  /** Enter a drawing tool, discarding any shape in progress and stopping any edit. */
  start: (mode: MapDrawTool) => void;
  /** Start editing an existing shape's vertices. Leaves drawing mode. Re-editing the shape this session already holds keeps its history. */
  edit: (feature: MapDrawFeature) => void;
  /** Complete the current shape (or stop editing). Returns the shape, or `null` if it doesn't have enough vertices yet (and always for `measure`). */
  finish: () => MapDrawFeature | null;
  /**
   * Step back through the session: placed vertices, the shape being finished
   * (reopening it for drawing and firing `onRemove`) and each edit (firing
   * `onUpdate`). Works after finishing too, until another tool is started.
   */
  undo: () => void;
  /** Re-apply the last undone step. */
  redo: () => void;
  /** Whether `undo` / `redo` would do anything. */
  canUndo: boolean;
  canRedo: boolean;
  /** Discard the shape in progress and leave drawing/editing mode. */
  cancel: () => void;
  /** Place a vertex at a coordinate. Used by `<MapDraw>`; also handy for programmatic drawing. */
  addVertex: (lngLat: LngLat) => void;
  /** Replace the edited shape's vertices and fire `onUpdate`. Used by `<MapDraw>`. */
  updateEditing: (vertices: LngLat[]) => void;
};

/** Minimum vertices each mode needs before it can be finished. */
const MIN_VERTICES: Record<MapDrawTool, number> = {
  polygon: 3,
  line: 2,
  rectangle: 2,
  measure: 2,
};

/** Undo steps kept per drawing or editing session. */
const MAX_HISTORY = 100;

/**
 * What undo/redo restores. `shape` is the session's shape as it stands,
 * whether or not it is being edited; `created` says whether this session drew
 * it (so undo can take it back) or was handed it through `edit()`.
 */
type Snapshot = {
  mode: MapDrawTool | null;
  vertices: LngLat[];
  shape: MapDrawFeature | null;
  created: boolean;
  editing: boolean;
};

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `draw-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function rectangleRing([a, b]: LngLat[]): LngLat[] {
  return [a, [b[0], a[1]], b, [a[0], b[1]], a];
}

function buildGeometry(
  mode: MapDrawMode,
  vertices: LngLat[],
): MapDrawGeometry | null {
  if (vertices.length < MIN_VERTICES[mode]) return null;
  switch (mode) {
    case "line":
      return { type: "LineString", coordinates: vertices };
    case "polygon":
      return { type: "Polygon", coordinates: [[...vertices, vertices[0]]] };
    case "rectangle": {
      const [a, b] = vertices;
      // A click without a drag gives a zero-area rectangle.
      if (a[0] === b[0] || a[1] === b[1]) return null;
      return { type: "Polygon", coordinates: [rectangleRing(vertices)] };
    }
  }
}

/** Editable vertices of a shape: the line's points, or the ring without its closing point. */
function getVertices(feature: MapDrawFeature): LngLat[] {
  const { geometry } = feature;
  if (geometry.type === "LineString") {
    return geometry.coordinates as LngLat[];
  }
  return geometry.coordinates[0].slice(0, -1) as LngLat[];
}

function withVertices(
  feature: MapDrawFeature,
  vertices: LngLat[],
): MapDrawFeature {
  const geometry: MapDrawGeometry =
    feature.geometry.type === "LineString"
      ? { type: "LineString", coordinates: vertices }
      : { type: "Polygon", coordinates: [[...vertices, vertices[0]]] };
  return { ...feature, geometry };
}

/**
 * Moves vertex `index` to `to`. Rectangle corners drag their two neighbors
 * along so the shape stays axis-aligned (the ring alternates sharing latitude
 * and longitude between neighboring corners: 0–1 lat, 1–2 lng, 2–3 lat, 3–0 lng).
 */
function moveVertex(
  drawMode: MapDrawMode,
  vertices: LngLat[],
  index: number,
  to: LngLat,
): LngLat[] {
  const next = vertices.map((v) => [...v] as LngLat);
  next[index] = to;
  if (drawMode === "rectangle" && next.length === 4) {
    const even = index % 2 === 0;
    const sharesLat = (index + (even ? 1 : 3)) % 4;
    const sharesLng = (index + (even ? 3 : 1)) % 4;
    next[sharesLat][1] = to[1];
    next[sharesLng][0] = to[0];
  }
  return next;
}

/**
 * Holds the drawing state. Call it in whichever component owns the toolbar
 * (it does not need to be inside <Map>), then render `<MapDraw draw={draw} />`
 * inside the map.
 */
function useMapDraw({
  onCreate,
  onUpdate,
  onRemove,
  continuous = false,
  editOnCreate = false,
}: UseMapDrawOptions = {}): MapDrawController {
  const [mode, setModeState] = useState<MapDrawTool | null>(null);
  const [vertices, setVerticesState] = useState<LngLat[]>([]);
  const [editing, setEditingState] = useState<MapDrawFeature | null>(null);
  const [measureComplete, setMeasureCompleteState] = useState(false);
  const [historySize, setHistorySize] = useState({ past: 0, future: 0 });
  // Refs mirror state so `finish()` sees a vertex added in the same event
  // (the rectangle handler calls addVertex then finish back to back).
  const modeRef = useRef<MapDrawTool | null>(null);
  const verticesRef = useRef<LngLat[]>([]);
  const editingRef = useRef<MapDrawFeature | null>(null);
  const measureCompleteRef = useRef(false);
  // The session's shape, kept after editing stops so undo can still reach it.
  const shapeRef = useRef<MapDrawFeature | null>(null);
  const createdRef = useRef(false);
  const pastRef = useRef<Snapshot[]>([]);
  const futureRef = useRef<Snapshot[]>([]);
  const latestRef = useRef({
    onCreate,
    onUpdate,
    onRemove,
    continuous,
    editOnCreate,
  });
  latestRef.current = { onCreate, onUpdate, onRemove, continuous, editOnCreate };

  const setMode = useCallback((next: MapDrawTool | null) => {
    modeRef.current = next;
    setModeState(next);
  }, []);

  const setVertices = useCallback((next: LngLat[]) => {
    verticesRef.current = next;
    setVerticesState(next);
  }, []);

  const setEditing = useCallback((next: MapDrawFeature | null) => {
    editingRef.current = next;
    setEditingState(next);
  }, []);

  const setMeasureComplete = useCallback((next: boolean) => {
    measureCompleteRef.current = next;
    setMeasureCompleteState(next);
  }, []);

  const syncHistory = useCallback(() => {
    setHistorySize({
      past: pastRef.current.length,
      future: futureRef.current.length,
    });
  }, []);

  const resetHistory = useCallback(() => {
    pastRef.current = [];
    futureRef.current = [];
    syncHistory();
  }, [syncHistory]);

  const snapshot = useCallback(
    (): Snapshot => ({
      mode: modeRef.current,
      vertices: verticesRef.current,
      shape: shapeRef.current,
      created: createdRef.current,
      editing: editingRef.current !== null,
    }),
    [],
  );

  /** Saves the current state as an undo step; a new step drops the redo stack. */
  const record = useCallback(
    (overrides?: Partial<Snapshot>) => {
      pastRef.current = [
        ...pastRef.current,
        { ...snapshot(), ...overrides },
      ].slice(-MAX_HISTORY);
      futureRef.current = [];
      syncHistory();
    },
    [snapshot, syncHistory],
  );

  /** Puts a snapshot back and tells the owner what happened to the shape. */
  const restore = useCallback(
    (target: Snapshot) => {
      const current = snapshot();
      setMeasureComplete(false);
      setMode(target.mode);
      setVertices(target.vertices);
      shapeRef.current = target.shape;
      createdRef.current = target.created;
      setEditing(target.editing ? target.shape : null);

      const { onCreate, onUpdate, onRemove } = latestRef.current;
      if (current.shape && !target.shape) {
        if (current.created) onRemove?.(current.shape);
      } else if (target.shape && !current.shape) {
        if (target.created) onCreate?.(target.shape);
      } else if (target.shape && target.shape !== current.shape) {
        onUpdate?.(target.shape);
      }
    },
    [setEditing, setMeasureComplete, setMode, setVertices, snapshot],
  );

  const step = useCallback(
    (from: { current: Snapshot[] }, to: { current: Snapshot[] }) => {
      const target = from.current.at(-1);
      if (!target) return;
      from.current = from.current.slice(0, -1);
      to.current = [...to.current, snapshot()];
      restore(target);
      syncHistory();
    },
    [restore, snapshot, syncHistory],
  );

  const undo = useCallback(() => step(pastRef, futureRef), [step]);
  const redo = useCallback(() => step(futureRef, pastRef), [step]);

  const reset = useCallback(
    (nextMode: MapDrawTool | null, shape: MapDrawFeature | null) => {
      shapeRef.current = shape;
      createdRef.current = false;
      setEditing(shape);
      setVertices([]);
      setMeasureComplete(false);
      setMode(nextMode);
      resetHistory();
    },
    [resetHistory, setEditing, setMeasureComplete, setMode, setVertices],
  );

  const start = useCallback((next: MapDrawTool) => reset(next, null), [reset]);

  const edit = useCallback(
    (feature: MapDrawFeature) => {
      // Back to the shape this session holds: carry on with its history.
      if (shapeRef.current?.id === feature.id) {
        setMode(null);
        setVertices([]);
        setEditing(shapeRef.current);
        return;
      }
      reset(null, feature);
    },
    [reset, setEditing, setMode, setVertices],
  );

  const cancel = useCallback(() => reset(null, null), [reset]);

  const addVertex = useCallback(
    (lngLat: LngLat) => {
      if (!modeRef.current) return;
      // A click after a finished measurement starts a new one.
      if (measureCompleteRef.current) {
        setMeasureComplete(false);
        resetHistory();
        setVertices([lngLat]);
        return;
      }
      // A rectangle's corners are one drag, recorded as one step in finish().
      if (modeRef.current !== "rectangle") record();
      setVertices([...verticesRef.current, lngLat]);
    },
    [record, resetHistory, setMeasureComplete, setVertices],
  );

  const updateEditing = useCallback(
    (next: LngLat[]) => {
      const current = editingRef.current;
      if (!current) return;
      record();
      const updated = withVertices(current, next);
      shapeRef.current = updated;
      setEditing(updated);
      latestRef.current.onUpdate?.(updated);
    },
    [record, setEditing],
  );

  const finish = useCallback(() => {
    if (editingRef.current) {
      // Stops editing only; the history stays so the edits can still be undone.
      const edited = editingRef.current;
      setEditing(null);
      return edited;
    }
    const current = modeRef.current;
    if (!current) return null;
    if (current === "measure") {
      // Leave the measurement on the map; its history stays undoable.
      if (verticesRef.current.length >= MIN_VERTICES.measure) {
        setMeasureComplete(true);
      }
      return null;
    }
    const geometry = buildGeometry(current, verticesRef.current);
    if (!geometry) {
      // An unfinished rectangle can't be extended, so start it over.
      if (current === "rectangle") setVertices([]);
      return null;
    }
    const feature: MapDrawFeature = {
      type: "Feature",
      id: createId(),
      geometry,
      properties: { drawMode: current },
    };
    const { continuous, editOnCreate } = latestRef.current;
    // Continuous drawing starts each shape afresh; otherwise undo can reopen this one.
    const keepsHistory = !continuous || editOnCreate;
    if (keepsHistory) {
      record(current === "rectangle" ? { vertices: [] } : undefined);
    } else {
      resetHistory();
    }
    shapeRef.current = keepsHistory ? feature : null;
    createdRef.current = keepsHistory;
    setVertices([]);
    if (editOnCreate || !continuous) setMode(null);
    if (editOnCreate) setEditing(feature);
    latestRef.current.onCreate?.(feature);
    return feature;
  }, [record, resetHistory, setEditing, setMeasureComplete, setMode, setVertices]);

  const canUndo = historySize.past > 0;
  const canRedo = historySize.future > 0;

  return useMemo(
    () => ({
      mode,
      vertices,
      measureComplete,
      editing,
      start,
      edit,
      finish,
      undo,
      redo,
      canUndo,
      canRedo,
      cancel,
      addVertex,
      updateEditing,
    }),
    [
      mode,
      vertices,
      measureComplete,
      editing,
      start,
      edit,
      finish,
      undo,
      redo,
      canUndo,
      canRedo,
      cancel,
      addVertex,
      updateEditing,
    ],
  );
}

type MapDrawProps = {
  /** Controller from `useMapDraw()`. */
  draw: MapDrawController;
  /** Color of the shape being drawn or edited (default: "#2563eb"). */
  color?: string;
  /** Pixel distance within which a click snaps to a vertex (default: 8). */
  snapDistance?: number;
};

type Handle = { kind: "vertex" | "midpoint"; index: number };

/**
 * Renders the shape being drawn or edited and handles map interactions for
 * the active mode. Place inside <Map>. Renders nothing when idle.
 */
function MapDraw({ draw, color = "#2563eb", snapDistance = 8 }: MapDrawProps) {
  const { map } = useMap();
  const id = useId();
  const sourceId = `draw-source-${id}`;
  const vertexLayerId = `${sourceId}-vertex`;
  const midpointLayerId = `${sourceId}-midpoint`;
  const { mode, vertices, editing } = draw;
  const [cursor, setCursor] = useState<LngLat | null>(null);
  // Vertices of the edited shape while a drag is in progress. Kept local so
  // the drag only re-renders this component; committed on mouseup.
  const [dragVertices, setDragVertices] = useState<LngLat[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const editVertices = useMemo(
    () => dragVertices ?? (editing ? getVertices(editing) : []),
    [dragVertices, editing],
  );

  const latestRef = useRef({ draw, snapDistance, editVertices, selected });
  latestRef.current = { draw, snapDistance, editVertices, selected };

  useEffect(() => {
    if (!mode) setCursor(null);
  }, [mode]);

  useEffect(() => {
    setSelected(null);
    setDragVertices(null);
  }, [editing?.id]);

  // Time of the last click that finished a shape. The browser fires
  // `dblclick` after the second click, by which point the mode may already
  // be off, so this lets us still swallow that double-click.
  const finishedAtRef = useRef(0);

  // Double-clicking finishes a shape, so it must not also zoom the map.
  // preventDefault on a MapLibre `dblclick` skips DoubleClickZoomHandler.
  useEffect(() => {
    if (!map) return;
    const handleDblClick = (e: MapLibreGL.MapMouseEvent) => {
      const recentlyFinished = performance.now() - finishedAtRef.current < 500;
      if (latestRef.current.draw.mode || recentlyFinished) e.preventDefault();
    };
    map.on("dblclick", handleDblClick);
    return () => {
      map.off("dblclick", handleDblClick);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !mode) return;
    const canvas = map.getCanvas();
    canvas.style.cursor = "crosshair";
    return () => {
      canvas.style.cursor = "";
    };
  }, [map, mode]);

  // Undo/redo shortcuts once a shape is finished and no tool is active;
  // the drawing and editing handlers below cover them otherwise.
  const isIdle = !mode && !editing;
  const hasHistory = draw.canUndo || draw.canRedo;
  useEffect(() => {
    if (!isIdle || !hasHistory) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      handleHistoryKey(e, latestRef.current.draw);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isIdle, hasHistory]);

  // Drawing handlers.
  useEffect(() => {
    if (!map || !mode) return;

    const toLngLat = (e: MapLibreGL.MapMouseEvent): LngLat => [
      e.lngLat.lng,
      e.lngLat.lat,
    ];

    const isNear = (vertex: LngLat | undefined, point: MapLibreGL.Point) => {
      if (!vertex) return false;
      return (
        map.project(vertex).dist(point) <= latestRef.current.snapDistance
      );
    };

    const handleClick = (e: MapLibreGL.MapMouseEvent) => {
      if (mode === "rectangle") return;
      const { draw } = latestRef.current;
      const placed = draw.vertices;
      // Clicking the last vertex again (which is what a double-click does)
      // finishes the shape; for polygons, so does clicking the first one.
      if (
        !draw.measureComplete &&
        (isNear(placed.at(-1), e.point) ||
          (mode === "polygon" &&
            placed.length >= 3 &&
            isNear(placed[0], e.point)))
      ) {
        if (draw.finish()) finishedAtRef.current = performance.now();
        return;
      }
      draw.addVertex(toLngLat(e));
    };

    const handleMouseMove = (e: MapLibreGL.MapMouseEvent) => {
      setCursor(toLngLat(e));
    };

    const handleMouseDown = (e: MapLibreGL.MapMouseEvent) => {
      if (mode !== "rectangle") return;
      // Stops DragPanHandler so the drag draws instead of panning.
      e.preventDefault();
      latestRef.current.draw.addVertex(toLngLat(e));
    };

    const handleMouseUp = (e: MapLibreGL.MapMouseEvent) => {
      const { draw } = latestRef.current;
      if (mode !== "rectangle" || draw.vertices.length !== 1) return;
      draw.addVertex(toLngLat(e));
      draw.finish();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      const { draw } = latestRef.current;
      if (handleHistoryKey(e, draw)) return;
      if (e.key === "Escape") draw.cancel();
      else if (e.key === "Enter") draw.finish();
      else if (e.key === "Backspace") draw.undo();
    };

    map.on("click", handleClick);
    map.on("mousemove", handleMouseMove);
    map.on("mousedown", handleMouseDown);
    map.on("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      map.off("click", handleClick);
      map.off("mousemove", handleMouseMove);
      map.off("mousedown", handleMouseDown);
      map.off("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [map, mode]);

  // Editing handlers.
  const isEditing = !!editing;
  useEffect(() => {
    if (!map || !isEditing) return;
    const canvas = map.getCanvas();

    // Finds the vertex or midpoint handle under the cursor, if any. Vertices
    // win over midpoints; a small box makes handles easier to grab.
    const hitHandle = (point: MapLibreGL.Point): Handle | null => {
      const pad = latestRef.current.snapDistance;
      const box: [MapLibreGL.PointLike, MapLibreGL.PointLike] = [
        [point.x - pad, point.y - pad],
        [point.x + pad, point.y + pad],
      ];
      for (const layerId of [vertexLayerId, midpointLayerId]) {
        if (!map.getLayer(layerId)) continue;
        const [hit] = map.queryRenderedFeatures(box, { layers: [layerId] });
        if (hit) {
          return {
            kind: layerId === vertexLayerId ? "vertex" : "midpoint",
            index: hit.properties.index as number,
          };
        }
      }
      return null;
    };

    let drag: { index: number; vertices: LngLat[]; changed: boolean } | null =
      null;

    const handleMouseDown = (e: MapLibreGL.MapMouseEvent) => {
      const handle = hitHandle(e.point);
      if (!handle) return;
      // Stops DragPanHandler so the drag moves the vertex instead of the map.
      e.preventDefault();
      const current = latestRef.current.editVertices;
      if (handle.kind === "vertex") {
        drag = { index: handle.index, vertices: current, changed: false };
        setSelected(handle.index);
      } else {
        // Midpoint i sits between vertex i and i + 1: insert a vertex there.
        const inserted = current.slice();
        inserted.splice(handle.index + 1, 0, [e.lngLat.lng, e.lngLat.lat]);
        drag = { index: handle.index + 1, vertices: inserted, changed: true };
        setSelected(handle.index + 1);
        setDragVertices(inserted);
      }
    };

    const handleMouseMove = (e: MapLibreGL.MapMouseEvent) => {
      if (drag) {
        const drawMode = latestRef.current.draw.editing?.properties.drawMode;
        if (!drawMode) return;
        drag.vertices = moveVertex(drawMode, drag.vertices, drag.index, [
          e.lngLat.lng,
          e.lngLat.lat,
        ]);
        drag.changed = true;
        setDragVertices(drag.vertices);
        return;
      }
      canvas.style.cursor = hitHandle(e.point) ? "move" : "";
    };

    const handleMouseUp = () => {
      if (!drag) return;
      if (drag.changed) latestRef.current.draw.updateEditing(drag.vertices);
      drag = null;
      setDragVertices(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      const { draw, editVertices, selected } = latestRef.current;
      if (handleHistoryKey(e, draw)) {
        setSelected(null);
        return;
      }
      if (e.key === "Escape" || e.key === "Enter") {
        draw.finish();
        return;
      }
      if (e.key !== "Backspace" && e.key !== "Delete") return;
      const drawMode = draw.editing?.properties.drawMode;
      // Rectangles always keep 4 corners; others keep their minimum.
      if (selected == null || !drawMode || drawMode === "rectangle") return;
      if (editVertices.length <= MIN_VERTICES[drawMode]) return;
      e.preventDefault();
      draw.updateEditing(editVertices.filter((_, i) => i !== selected));
      setSelected(null);
    };

    map.on("mousedown", handleMouseDown);
    map.on("mousemove", handleMouseMove);
    map.on("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      map.off("mousedown", handleMouseDown);
      map.off("mousemove", handleMouseMove);
      map.off("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.style.cursor = "";
    };
  }, [map, isEditing, vertexLayerId, midpointLayerId]);

  // A finished measurement stays put instead of following the cursor.
  const liveCursor = draw.measureComplete ? null : cursor;

  const sketch = useMemo<GeoJSON.FeatureCollection>(() => {
    if (editing) return editSketch(editing, editVertices, selected);
    return drawSketch(mode, vertices, liveCursor);
  }, [editing, editVertices, selected, mode, vertices, liveCursor]);

  const measurePath =
    mode === "measure" && vertices.length > 0
      ? liveCursor
        ? [...vertices, liveCursor]
        : vertices
      : null;
  const measureEnd = measurePath?.at(-1);

  if (!mode && !editing) return null;

  return (
    <>
      {measurePath && measureEnd && measurePath.length >= 2 && (
        <Marker
          longitude={measureEnd[0]}
          latitude={measureEnd[1]}
          anchor="bottom"
          offset={[0, -10]}
          style={{ pointerEvents: "none" }}
        >
          <div className="bg-foreground text-background rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap shadow-md">
            {formatDistance(pathLength(measurePath))}
          </div>
        </Marker>
      )}
      <Source id={sourceId} type="geojson" data={sketch}>
        <Layer
          id={`${sourceId}-fill`}
          type="fill"
          filter={["==", ["geometry-type"], "Polygon"]}
          paint={{ "fill-color": color, "fill-opacity": 0.15 }}
        />
        <Layer
          id={`${sourceId}-line`}
          type="line"
          filter={["!=", ["geometry-type"], "Point"]}
          paint={{
            "line-color": color,
            "line-width": 2,
            // Dashed while drawing, solid while editing.
            ...(editing ? {} : { "line-dasharray": [2, 2] }),
          }}
        />
        <Layer
          id={midpointLayerId}
          type="circle"
          filter={["==", ["get", "kind"], "midpoint"]}
          paint={{
            "circle-radius": 3,
            "circle-color": color,
            "circle-opacity": 0.6,
          }}
        />
        <Layer
          id={vertexLayerId}
          type="circle"
          filter={["==", ["get", "kind"], "vertex"]}
          paint={{
            "circle-radius": ["case", ["get", "selected"], 6, 4],
            "circle-color": ["case", ["get", "selected"], color, "#ffffff"],
            "circle-stroke-color": color,
            "circle-stroke-width": 2,
          }}
        />
      </Source>
    </>
  );
}

function isTypingTarget(target: EventTarget | null) {
  return !!(target as HTMLElement | null)?.closest?.(
    "input, textarea, select, [contenteditable]",
  );
}

/** Cmd/Ctrl+Z undoes, Cmd/Ctrl+Shift+Z or Ctrl+Y redoes. Returns whether the key was handled. */
function handleHistoryKey(e: KeyboardEvent, draw: MapDrawController) {
  if (!(e.metaKey || e.ctrlKey)) return false;
  const key = e.key.toLowerCase();
  const isRedo = (key === "z" && e.shiftKey) || key === "y";
  if (key !== "z" && !isRedo) return false;
  e.preventDefault();
  if (isRedo) draw.redo();
  else draw.undo();
  return true;
}

const EARTH_RADIUS_METERS = 6_371_008.8;

/** Great-circle length of a path in meters. */
function pathLength(path: LngLat[]) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    const [lng1, lat1] = path[i - 1];
    const [lng2, lat2] = path[i];
    const h =
      Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(toRad(lng2 - lng1) / 2) ** 2;
    total += 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
  }
  return total;
}

function formatDistance(meters: number) {
  return meters < 1000
    ? `${Math.round(meters)} m`
    : `${(meters / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} km`;
}

function point(
  coordinates: LngLat,
  properties: Record<string, unknown>,
): GeoJSON.Feature {
  return {
    type: "Feature",
    properties,
    geometry: { type: "Point", coordinates },
  };
}

/** Shape in progress: placed vertices plus a rubber band to the cursor. */
function drawSketch(
  mode: MapDrawTool | null,
  vertices: LngLat[],
  cursor: LngLat | null,
): GeoJSON.FeatureCollection {
  const features = vertices.map((v, index) =>
    point(v, { kind: "vertex", index, selected: false }),
  );
  if (!mode || vertices.length === 0) {
    return { type: "FeatureCollection", features };
  }

  const path = cursor ? [...vertices, cursor] : vertices;

  if (mode === "rectangle") {
    if (path.length >= 2) {
      features.push({
        type: "Feature",
        properties: {},
        geometry: { type: "Polygon", coordinates: [rectangleRing(path)] },
      });
    }
  } else {
    if (mode === "polygon" && path.length >= 3) {
      features.push({
        type: "Feature",
        properties: {},
        geometry: { type: "Polygon", coordinates: [[...path, path[0]]] },
      });
    }
    if (path.length >= 2) {
      features.push({
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: path },
      });
    }
  }
  return { type: "FeatureCollection", features };
}

/** Shape being edited: its geometry, vertex handles and (except rectangles) midpoint handles. */
function editSketch(
  feature: MapDrawFeature,
  vertices: LngLat[],
  selected: number | null,
): GeoJSON.FeatureCollection {
  const shape = withVertices(feature, vertices);
  const features: GeoJSON.Feature[] = [
    { type: "Feature", properties: {}, geometry: shape.geometry },
  ];
  if (feature.properties.drawMode !== "rectangle") {
    const closed = feature.geometry.type === "Polygon";
    const edges = closed ? vertices.length : vertices.length - 1;
    for (let i = 0; i < edges; i++) {
      const a = vertices[i];
      const b = vertices[(i + 1) % vertices.length];
      features.push(
        point([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], {
          kind: "midpoint",
          index: i,
        }),
      );
    }
  }
  vertices.forEach((v, index) => {
    features.push(point(v, { kind: "vertex", index, selected: index === selected }));
  });
  return { type: "FeatureCollection", features };
}

export { useMapDraw, MapDraw };

export type {
  MapDrawMode,
  MapDrawTool,
  MapDrawFeature,
  MapDrawGeometry,
  MapDrawController,
  MapDrawProps,
  UseMapDrawOptions,
};
