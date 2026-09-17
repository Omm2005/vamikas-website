import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "@/lib/api";

// Every drawn placeholder on the site is a named slot, and a slot is filled by
// an uploaded photo tagged with its name in the admin.
//
// The tag rides along in the item's `medium` field. That is not where it
// belongs, but an item cannot be edited after upload, so the metadata sent at
// upload time is the only writable place. The marker is stripped everywhere
// `medium` is shown.
const MARKER = /\s*\[\[slot:([a-z0-9-]+)\]\]\s*/i;

export const parseMedium = (raw) => {
  const text = raw || "";
  const found = text.match(MARKER);
  return { medium: text.replace(MARKER, " ").trim(), slot: found ? found[1].toLowerCase() : null };
};

export const withSlot = (medium, slot) =>
  slot ? `${medium || ""} [[slot:${slot}]]`.trim() : medium || "";

// Photos are served straight from Blob storage, not through the API.
export const photoUrl = (item) => item?.url || "";

const range = (count, make) => Array.from({ length: count }, (_, i) => make(i + 1));

// Keys duplicated from the page data. `useSlotPhoto` works for any id, so a
// missed update here only means a slot is absent from the admin list — and the
// dev-only warning below points at it.
const FEELINGS = ["messy", "romantic", "angry", "nostalgic", "playful", "dreamy", "chaotic"];
// The Project page swaps a stack of three photos per chapter.
const PROJECT_CHAPTERS = ["memory", "chaos", "obsession", "identity", "emotion", "creation"];
const BOARDS = [
  ["romantic-decay", "romantic decay"],
  ["mythology", "mythology, retold"],
  ["city-noise", "city noise"],
  ["surreal-tailoring", "surreal tailoring"],
  ["texture", "texture"],
  ["burgundy", "burgundy"],
];

/// Grouped for the admin: page, then the spots on it.
export const SLOT_GROUPS = [
  {
    id: "home",
    page: "Home",
    title: "Hero fragments",
    hint: "The photos that drift behind the title.",
    slots: range(3, (n) => ({ id: `home-hero-${n}`, label: `Floating fragment ${n}` })),
  },
  {
    id: "about",
    page: "About",
    title: "Fragment cards",
    hint: "The four cards under “who is vamika?”.",
    slots: range(4, (n) => ({ id: `about-${n}`, label: `Card ${n}` })),
  },
  {
    id: "process",
    page: "Process",
    title: "Steps",
    hint: "Thought → sketch → form, one photo per step.",
    slots: range(6, (n) => ({ id: `process-${n}`, label: `Step ${n}` })),
  },
  {
    id: "project-chapters",
    page: "Project",
    title: "Chapters",
    hint: "Three photos per chapter — shown when the reader opens that one.",
    slots: PROJECT_CHAPTERS.flatMap((chapter) =>
      range(3, (n) => ({ id: `project-${chapter}-${n}`, label: `${chapter} · photo ${n}` })),
    ),
  },
  {
    id: "project-making",
    page: "Project",
    title: "The making",
    hint: "Three dark frames near the end of the chronicle.",
    slots: range(3, (n) => ({ id: `project-making-${n}`, label: `Making ${n}` })),
  },
  {
    id: "mind-memories",
    page: "Mind",
    title: "Memories",
    slots: range(3, (n) => ({ id: `mind-memory-${n}`, label: `Memory ${n}` })),
  },
  {
    id: "mind-pieces",
    page: "Mind",
    title: "Pieces, by feeling",
    hint: "Shown when a reader picks that feeling.",
    slots: FEELINGS.flatMap((feeling) =>
      range(2, (n) => ({ id: `mind-${feeling}-${n}`, label: `${feeling} · piece ${n}` })),
    ),
  },
  {
    id: "moodboards",
    page: "Moodboards",
    title: "Board tiles",
    hint: "Three per board — the same photos fill the grid and the opened board.",
    slots: BOARDS.flatMap(([id, name]) =>
      range(3, (n) => ({ id: `moodboard-${id}-${n}`, label: `${name} · tile ${n}` })),
    ),
  },
];

export const ALL_SLOTS = SLOT_GROUPS.flatMap((group) =>
  group.slots.map((slot) => ({ ...slot, group })),
);

const KNOWN = new Set(ALL_SLOTS.map((s) => s.id));

/// Newest upload wins. An item cannot be edited after upload, so replacing a
/// photo means uploading another one against the same slot; deleting the last
/// one tagged for a slot drops it back to the drawn placeholder.
export const mapPhotos = (items) => {
  const map = {};
  [...(items || [])]
    .filter((item) => item && !item.is_deleted)
    .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0))
    .forEach((item) => {
      const { slot } = parseMedium(item.medium);
      if (slot) map[slot] = item;
    });
  return map;
};

/// One shared fetch for the whole site: react-query dedupes across every
/// placeholder on the page.
export const useSitePhotos = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => axios.get(`${API}/gallery`).then((res) => res.data.items || []),
    staleTime: 5 * 60 * 1000,
  });
  const photos = useMemo(() => mapPhotos(data), [data]);
  return { photos, isLoading };
};

export const useSlotPhoto = (slot) => {
  const { photos } = useSitePhotos();
  if (!slot) return null;
  if (import.meta.env?.DEV && !KNOWN.has(slot)) {
    // Not fatal — the photo still resolves — but the slot will be missing from
    // the admin's list, so nobody can fill it.
    console.warn(`[slots] "${slot}" is not in SLOT_GROUPS; add it so it appears in the admin.`);
  }
  return photos[slot] || null;
};
