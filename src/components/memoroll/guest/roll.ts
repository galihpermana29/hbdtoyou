/**
 * The gallery's view of a Roll, shared by every screen that renders one - the
 * gallery grid, the Dark Room and the preview - so a photo means the same
 * thing on all three (ADR 0007).
 */

export interface GalleryPhoto {
  id: string;
  src: string;
  /** The Date Stamp, or null when it is already baked into the pixels (ADR 0006). */
  stamp: string | null;
  /** Who took this. Signed on My Roll prints; the preview's secret on ALL. */
  shooter: string;
  /** The guest's own Shot, which the Reveal never gates (CONTEXT.md). */
  own: boolean;
}

export interface GalleryGroup {
  /** The time heading a group of prints sits under, e.g. "May 3 at 07:30pm". */
  label: string;
  photos: GalleryPhoto[];
}
