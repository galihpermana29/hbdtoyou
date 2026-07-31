/**
 * The Guest List a couple uploads, and how a CSV becomes one.
 *
 * Everything here happens in the browser. The file is never sent anywhere: it is
 * read, parsed, and held in the step's own state, because the product has no
 * place to put a Guest List yet. Storing one is `hbd-byb.17`.
 *
 * Parsing is written out rather than taken from a library, because the shape the
 * design asks for is one column of names, and the whole of RFC 4180 that matters
 * for that is quoting, escaped quotes and line endings.
 */

/** One person the couple intends to invite. */
export interface Guest {
  /**
   * Stable for as long as the guest is in the list.
   *
   * A row is renamed in place, so it cannot be identified by its name, and it
   * cannot be identified by its position either, because deleting the row above
   * it would move it.
   */
  id: string;
  name: string;
}

/**
 * A Guest List: the guests, and when the file they came from was read.
 *
 * One value rather than two, so that a list without a date and a date without a
 * list cannot be written down. The design draws the two together and there is no
 * state in which one of them makes sense alone: an empty list is not a Guest
 * List with nobody in it, it is the couple not having uploaded one.
 */
export interface GuestList {
  guests: Guest[];
  uploadedAt: Date;
}

/** The size limit the design states, and the words it states it in. */
export const GUEST_LIST_MAX_MB = 5;
export const GUEST_LIST_MAX_BYTES = GUEST_LIST_MAX_MB * 1024 * 1024;
export const GUEST_LIST_SIZE_LIMIT = `Max file size ${GUEST_LIST_MAX_MB}MB`;

/**
 * What the file picker offers, and the only thing this module will read.
 *
 * By extension rather than by media type: a CSV reaches a browser as `text/csv`,
 * as `application/vnd.ms-excel`, and as nothing at all, depending on which
 * program last saved it, so the type a browser reports cannot be relied on.
 */
export const GUEST_LIST_ACCEPT = '.csv';

/**
 * The column headings a first row is recognised as, rather than as a guest.
 *
 * Two words rather than every word a spreadsheet might have been given, because
 * a heading this does not know costs the couple one row saying "Attendees" and
 * one press of the Delete beside it, and guessing at more of them would be
 * guessing. These two are what this product itself calls the column.
 */
const HEADINGS = new Set(['guest', 'name']);

const asGuest = (name: string): Guest => ({ id: crypto.randomUUID(), name });

/**
 * Every row of a CSV, as its fields.
 *
 * A quote opens a quoted field only at the start of one, so a name containing an
 * apostrophe-free inch mark in the middle survives. Inside quotes a doubled
 * quote is one quote and a newline is part of the field.
 *
 * Rows end at a newline. Which characters make one is settled before this runs,
 * so nothing here has to know that three conventions exist: a spreadsheet saved
 * on Windows ends its rows with a carriage return and a line feed, one saved by
 * Excel for Mac ends them with a carriage return alone, and a file whose rows
 * all ran together would otherwise read as a single guest with everybody's name.
 */
function rowsOf(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  let atFieldStart = true;

  const endField = () => {
    row.push(field);
    field = '';
    atFieldStart = true;
  };
  const endRow = () => {
    endField();
    rows.push(row);
    row = [];
  };

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (quoted) {
      if (character !== '"') {
        field += character;
      } else if (text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = false;
      }
      continue;
    }

    if (character === '"' && atFieldStart) {
      quoted = true;
      atFieldStart = false;
    } else if (character === ',') {
      endField();
    } else if (character === '\n') {
      endRow();
    } else {
      field += character;
      atFieldStart = false;
    }
  }

  // A file ending in a newline has nothing after it, and that is not a guest.
  if (field !== '' || row.length > 0) {
    endRow();
  }

  return rows;
}

/**
 * The guests a CSV names, in the order it names them.
 *
 * The design's table has one column, so the first field of each row is the
 * guest and any others are ignored rather than refused - a couple exporting from
 * a spreadsheet that also holds an address should not have to strip it first.
 * A row with no name in its first field is dropped, so trailing blank lines and
 * a stray separator row cost nothing.
 */
export function guestsFromCsv(text: string): Guest[] {
  const names = rowsOf(
    text
      // A spreadsheet that saved as UTF-8 puts a byte order mark first, and a
      // guest whose name begins with an invisible character is a guest nobody
      // has.
      .replace(/^\uFEFF/, '')
      // Every convention for ending a row, including inside a quoted name that
      // spans two lines, said one way so that the parsing only knows one.
      .replace(/\r\n?/g, '\n')
  )
    .map((row) => (row[0] ?? '').trim())
    .filter((name) => name !== '');

  const withoutHeading =
    names.length > 0 && HEADINGS.has(names[0].toLowerCase())
      ? names.slice(1)
      : names;

  return withoutHeading.map(asGuest);
}

/**
 * What a Guest List file yielded: the guests it named, or what is wrong with it.
 *
 * One or the other and never both, so that a caller cannot be handed a problem
 * to show alongside a list to show it against.
 */
export type GuestListReading =
  | { guests: Guest[]; problem: null }
  /** `problem` is in words a couple can act on. */
  | { guests: null; problem: string };

/** What is wrong with the file itself, before it is worth reading. */
function fileProblem(file: File): string | null {
  const format = GUEST_LIST_ACCEPT.toUpperCase();

  if (!file.name.toLowerCase().endsWith(GUEST_LIST_ACCEPT)) {
    return `“${file.name}” is not a CSV file. Upload your Guest List in format ${format}`;
  }
  // Said as "larger than" rather than as the file's own size, because a file one
  // byte over the limit rounds to "5.0MB", and being told that 5.0MB is more
  // than 5MB reads as the page being broken rather than the file being too big.
  if (file.size > GUEST_LIST_MAX_BYTES) {
    return `“${file.name}” is larger than ${GUEST_LIST_MAX_MB}MB, which is as large as a Guest List can be`;
  }
  return null;
}

/**
 * Read a chosen file as a Guest List.
 *
 * Every way this can go wrong comes back as a sentence rather than as an
 * exception or an empty list, because a file that silently produces no guests
 * looks exactly like a couple who has not uploaded one yet.
 */
export async function readGuestList(file: File): Promise<GuestListReading> {
  const problem = fileProblem(file);
  if (problem) {
    return { guests: null, problem };
  }

  let text: string;
  try {
    text = await file.text();
  } catch {
    return {
      guests: null,
      problem: 'That file could not be read. Try uploading it again',
    };
  }

  const guests = guestsFromCsv(text);
  if (guests.length === 0) {
    return {
      guests: null,
      problem:
        'No guests were found in that file. Put one guest name on each line',
    };
  }

  return { guests, problem: null };
}

/**
 * The upload date, written the way the design writes it.
 *
 * The locale is named rather than left to the browser, so that the date reads
 * "Jan 4, 2025" for every couple rather than reordering itself by where they
 * happen to be.
 */
export function uploadedOn(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
