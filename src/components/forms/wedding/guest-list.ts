/**
 * The Guest List a couple uploads, and how a CSV becomes one.
 *
 * Reading happens in the browser. The file itself is never sent anywhere: it is
 * read and parsed here, and what reaches the backend is the guests it named. The
 * sending is `use-guest-roster.ts`; this module says what a guest is, what the
 * backend calls each of their answers, and how a spreadsheet becomes a list of
 * them.
 *
 * Parsing is written out rather than taken from a library, because the shape the
 * backend accepts is six columns of plain text, and the whole of RFC 4180 that
 * matters for that is quoting, escaped quotes and line endings.
 *
 * ## One list of columns, four jobs
 *
 * `GUEST_COLUMNS` is the only place the six columns are written down. It decides
 * what the template a couple downloads has at the top of it, what a heading row
 * in their own file is recognised as, and what the table draws. Splitting those
 * apart is how a template comes to name a column the parser does not read, which
 * would be invisible until a couple filled that column in for nothing.
 *
 * The fourth job is what the backend calls each of them, which is `SENT_AS`. It
 * is a record of every answer rather than a list, so a seventh column cannot be
 * added without saying what to send it as, and a column a couple fills in cannot
 * silently go nowhere.
 */

import type {
  IWeddingGuestPayload,
  IWeddingGuestResponse,
} from '@/action/interfaces';

/**
 * The six things a couple says about one guest.
 *
 * Apart from who the guest is, because these are the answers and that is an
 * identity: `GuestField` is derived from this and indexes the columns, so a
 * field that is not one of the six would have to be given a column, a heading
 * and a place in the template file it has no business having.
 */
export interface GuestAnswers {
  name: string;
  /** Which side, table or family the couple files this guest under. */
  groupLabel: string;
  phone: string;
  email: string;
  /**
   * How many people this guest may bring, or null when the couple did not say.
   *
   * Null rather than zero, because they are different answers. Zero is the
   * couple saying nobody; null is the couple not having said, and the backend's
   * own default then stands. A file of nothing but names would otherwise cap
   * every guest at nobody without anyone having decided that.
   */
  maxPlusOnes: number | null;
  notes: string;
}

/** The fields of a guest that come from the file, which is all of the answers. */
export type GuestField = keyof GuestAnswers;

/** One person the couple intends to invite. */
export interface Guest extends GuestAnswers {
  /**
   * Stable for as long as the guest is in the list.
   *
   * A row is corrected in place, so it cannot be identified by its name, and it
   * cannot be identified by its position either, because deleting the row above
   * it would move it.
   *
   * Made here while the backend has never seen this guest, and the backend's own
   * identifier from the moment it has. Which of the two it is at any moment is
   * `token`: a guest the backend holds has one, and that is the only guest whose
   * id names anything the backend would answer to.
   */
  id: string;
  /**
   * The token the backend minted for this guest, or null while it holds none.
   *
   * The token is the personal link: the invitation resolves it into the name on
   * this row, and a reply is signed with it. Nothing here invents one, which is
   * why it is null rather than empty until a guest has actually been saved -
   * an empty token would read as a guest with a link that opens nothing.
   */
  token: string | null;
}

/**
 * What the backend calls each answer.
 *
 * A record of every field rather than a list of the ones that happen to be sent,
 * so a column added to `GUEST_COLUMNS` and not to this cannot compile: a couple
 * who fills in a column that reaches nobody has been asked for something for
 * nothing, and nothing on the screen would say so.
 */
const SENT_AS: Record<GuestField, keyof IWeddingGuestPayload> = {
  name: 'name',
  groupLabel: 'group_label',
  phone: 'phone',
  email: 'email',
  maxPlusOnes: 'max_plus_ones',
  notes: 'notes',
};

/** A guest's answer as the wire carries it, or nothing where they gave none. */
function answerSent(guest: Guest, field: GuestField): string | number | null {
  const answer = guest[field];
  const said = typeof answer === 'string' ? answer.trim() : answer;
  return said === null || said === '' ? null : said;
}

/**
 * Whether a column holds a number of people rather than a couple's words.
 *
 * Asked of `GUEST_COLUMNS` rather than written down again, so that the six
 * columns stay described in one place. A function rather than a derived table
 * because it is read when a guest is sent, long after this module has loaded,
 * and so it does not care that the columns are declared below it.
 */
const holdsACount = (field: GuestField) =>
  GUEST_COLUMNS.find((column) => column.field === field)?.holds === 'a count';

/**
 * One guest as the backend takes them when they are new: every column they
 * answered, and nothing for the ones they did not.
 *
 * A column left blank is left out rather than sent empty, so that whatever the
 * backend would put there itself stands for an answer nobody gave. That is the
 * difference the count already draws - null is the couple not having said, and
 * the cap the backend chooses is a better answer than a zero nobody chose - and
 * the words are the same case said the other way: an empty phone number is not
 * a phone number.
 *
 * Neither an identifier nor a token is here. The backend mints both when it
 * inserts the guest, and a personal link is built from the token it minted, so
 * inventing either would be inventing the address of somebody's invitation.
 */
export function guestToPayload(guest: Guest): IWeddingGuestPayload {
  const payload: IWeddingGuestPayload = { name: guest.name.trim() };
  // The same object seen as the shape a loop can write to. The name is written
  // ahead of the loop because it is the one column the backend requires, and a
  // record a loop filled in cannot promise it; the loop writes it again, with
  // the same value.
  const columns: Partial<Record<keyof IWeddingGuestPayload, string | number>> =
    payload;

  for (const field of Object.keys(SENT_AS) as GuestField[]) {
    const said = answerSent(guest, field);
    if (said === null) continue;
    columns[SENT_AS[field]] = said;
  }

  return payload;
}

/**
 * One guest as the backend takes them when it already holds them.
 *
 * Every worded answer goes, empty ones included, because this writes over a
 * guest rather than adding one: a field left out keeps whatever the backend
 * already has, so a couple who cleared a phone number would watch it come back.
 *
 * Driven by `SENT_AS` for the same reason the insert is. A seventh column added
 * to `GUEST_COLUMNS` reaches the backend on the way in and on the way out, or it
 * does not compile - which is better than a column a couple can fill in but
 * never correct.
 *
 * The count is the exception, and it is a real limitation rather than an
 * oversight. The wire carries a number or nothing, and nothing means "leave it
 * alone" rather than "unset it", so a count once given cannot be taken back.
 * `guestAsUpdated` is what keeps the screen honest about that.
 */
export function guestToUpdatePayload(guest: Guest): IWeddingGuestPayload {
  const payload: IWeddingGuestPayload = { name: guest.name.trim() };
  const columns: Partial<Record<keyof IWeddingGuestPayload, string | number>> =
    payload;

  for (const field of Object.keys(SENT_AS) as GuestField[]) {
    const said = answerSent(guest, field);
    // A count nobody has said is left out, because the wire has no way to say
    // "unset this"; every other emptied answer goes as the empty string it is.
    if (said === null && holdsACount(field)) continue;
    columns[SENT_AS[field]] = said ?? '';
  }

  return payload;
}

/**
 * The guest the backend holds after that update, which is what the table draws.
 *
 * Everything the correction said, plus the count it was unable to take back: a
 * couple who emptied the count still has whatever number was there, so showing
 * them a blank cell would be showing them something the backend does not hold.
 */
export function guestAsUpdated(corrected: Guest, before: Guest): Guest {
  return {
    ...corrected,
    maxPlusOnes: corrected.maxPlusOnes ?? before.maxPlusOnes,
  };
}

/**
 * A guest as the backend hands them back.
 *
 * This is the only way a saved guest is built, on the way back from an insert as
 * well as on a read. Keeping the couple's own answers and taking only the id and
 * the token from the row was tried and dropped: it needs the reply paired to the
 * request, the contract nowhere promises a batch answers in the order it was
 * sent, and a reordered reply would give every guest somebody else's token -
 * which is a personal link opening the invitation under the wrong name, and the
 * one thing this must not get wrong.
 *
 * Every answer the row has no value for reads as unanswered, which is the same
 * thing a row that stopped early in the file reads as. The count is taken at its
 * word, including a zero: the wire cannot tell a couple who said nobody from a
 * couple who said nothing and got whatever the backend puts there, and reading a
 * zero as "they never said" would quietly discard a real answer.
 */
export function guestFromRow(row: IWeddingGuestResponse): Guest {
  return {
    id: row.ID,
    token: row.Token,
    name: row.Name ?? '',
    groupLabel: row.GroupLabel ?? '',
    phone: row.Phone ?? '',
    email: row.Email ?? '',
    maxPlusOnes: typeof row.MaxPlusOnes === 'number' ? row.MaxPlusOnes : null,
    notes: row.Notes ?? '',
  };
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

/** One column of a Guest List file. */
export interface GuestColumn {
  /** The field of a guest this column holds. */
  field: GuestField;
  /** What the template writes above it, and what the table calls it. */
  heading: string;
  /**
   * The other words a heading row may name it with.
   *
   * Kept to what this product itself calls the column elsewhere, rather than to
   * every word a spreadsheet might have been given. A heading this does not know
   * is read by its position instead, which is the order the template lays the
   * columns out in, so guessing at more of them would buy nothing.
   */
  alsoKnownAs: string[];
  /**
   * Whether the column holds a couple's words or a number of people.
   *
   * Said here rather than by comparing a field's name where it matters, so that
   * the list stays the one place a column is described: the table asks a count
   * for as a number, and a count that cannot be one is the couple not having
   * said.
   */
  holds: 'words' | 'a count';
}

/**
 * The six columns, in the order the template writes them.
 *
 * These are exactly the six the backend accepts for a guest, so a couple can
 * state everything about a guest that can be stored. Maximum plus ones is the
 * one that earns its place beyond tidiness: it is what caps how many people a
 * guest may bring.
 */
export const GUEST_COLUMNS: GuestColumn[] = [
  {
    field: 'name',
    heading: 'Guest',
    alsoKnownAs: ['name', 'guest name'],
    holds: 'words',
  },
  {
    field: 'groupLabel',
    heading: 'Group',
    alsoKnownAs: ['group label'],
    holds: 'words',
  },
  {
    field: 'phone',
    heading: 'Phone',
    alsoKnownAs: ['phone number'],
    holds: 'words',
  },
  {
    field: 'email',
    heading: 'Email',
    alsoKnownAs: ['email address'],
    holds: 'words',
  },
  {
    field: 'maxPlusOnes',
    heading: 'Max Plus Ones',
    alsoKnownAs: ['maximum plus ones', 'plus ones'],
    holds: 'a count',
  },
  { field: 'notes', heading: 'Notes', alsoKnownAs: ['note'], holds: 'words' },
];

/** The column a guest's name is in, which is the one a row cannot do without. */
const NAME_COLUMN = GUEST_COLUMNS[0];

const headingsOf = (column: GuestColumn) =>
  [column.heading, ...column.alsoKnownAs].map((heading) =>
    heading.toLowerCase()
  );

/**
 * The two guests the downloaded file is filled in with.
 *
 * Written as one row per column-order so a couple opening the file in a
 * spreadsheet sees what belongs under each heading rather than six empty
 * columns and a guess. Two rather than one, because a single row reads as the
 * shape of the file while two read as a list - and the second one answers the
 * questions the first leaves open: that a group may repeat, that a plus one
 * may be none, and that the last three columns can simply be left empty.
 *
 * Obviously nobody's guests. The file used to carry the headings alone, on the
 * reasoning that a row left undeleted would be read as a real guest at
 * somebody's wedding; the owner asked for examples on 2026-08-23, and these
 * names are the answer to that risk rather than an exception to it. A couple
 * who forgets to delete "Example Guest" finds a guest called Example Guest,
 * which is a mistake that announces itself on their own screen before a single
 * invitation goes out - and the Guest List step shows every row it read.
 */
const GUEST_LIST_TEMPLATE_EXAMPLES = [
  [
    'Example Guest',
    'Family',
    '+62 812 3456 7890',
    'guest@example.com',
    '1',
    'Vegetarian',
  ],
  ['Second Example', 'Family', '', '', '0', ''],
];

/**
 * The file a couple downloads to fill in: the six headings, and two example
 * guests underneath them.
 */
export const GUEST_LIST_TEMPLATE = [
  GUEST_COLUMNS.map((column) => column.heading).join(','),
  ...GUEST_LIST_TEMPLATE_EXAMPLES.map((row) => row.join(',')),
  '',
].join('\n');

/** What the downloaded file is called, and the words offering it. */
export const GUEST_LIST_TEMPLATE_NAME = 'guest-list-template.csv';
export const GUEST_LIST_TEMPLATE_ACTION = 'Download CSV template';

/**
 * Where that file is downloaded from.
 *
 * The file is written out here rather than fetched, because it is six words the
 * product already knows and a round trip to ask for them could only ever fail.
 * A data URL rather than an object URL for the same reason: it needs no blob to
 * be built, no lifetime to be managed and nothing to be revoked, so the control
 * offering it is an ordinary link that works before any script has run.
 */
export const GUEST_LIST_TEMPLATE_HREF = `data:text/csv;charset=utf-8,${encodeURIComponent(
  GUEST_LIST_TEMPLATE
)}`;

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
 * Which cell of a row holds each column, or -1 where the file has no such cell.
 *
 * A file that names its columns is read by those names, so a couple who moved
 * Notes to the front of their spreadsheet still gets their notes. A file that
 * does not is read by position, in the template's own order, which is the order
 * a couple who downloaded it was handed.
 */
type CellOf = (column: GuestColumn) => number;

/** Whether a cell is any column's own word for itself. */
const namesAColumn = (cell: string) =>
  GUEST_COLUMNS.some((column) => headingsOf(column).includes(cell));

/**
 * Whether the first row of a file is its headings rather than its first guest.
 *
 * It has to name the guest column, whatever else it does. A row that names no
 * column a guest can be got out of is not a heading row this can use, and taking
 * it for one would leave every guest after it nameless and drop the whole list -
 * so a one-column file whose first guest happens to be called "Notes" keeps that
 * guest.
 *
 * Beyond that, two ways to be one, because either alone gets a real file wrong.
 *
 * Every word in it names a column: nobody's guest list has a row whose every
 * cell happens to be one of these words, so a file that reordered its columns is
 * still recognised.
 *
 * Or it starts with what this product calls the guest column: a couple who kept
 * the template's first column and renamed the others still has a heading row,
 * and reading it as a guest would put "Guest" on the list and shift every answer
 * after it into the wrong column.
 *
 * A one-column file whose first guest is called "Guest" does still lose that
 * guest. It is the same trade the design's own "Guest" heading always carried,
 * and it costs one row and one press of the Delete beside it.
 */
function isHeadingRow(row: string[]): boolean {
  const cells = row
    .map((cell) => cell.trim().toLowerCase())
    .filter((cell) => cell !== '');

  if (!cells.some((cell) => headingsOf(NAME_COLUMN).includes(cell))) {
    return false;
  }
  const first = (row[0] ?? '').trim().toLowerCase();
  return cells.every(namesAColumn) || headingsOf(NAME_COLUMN).includes(first);
}

const cellsByPosition: CellOf = (column) => GUEST_COLUMNS.indexOf(column);

/**
 * Which cell holds each column when the file named its columns.
 *
 * A heading this does not know does not cost the couple the column under it. The
 * named ones are matched first, and every column left over falls back to the
 * place the template puts it, unless a named one already claimed that cell. So a
 * couple who kept the template's order and headed their last column "Remarks"
 * still gets their notes, and a couple who reordered theirs is read by the names
 * rather than dragged back to the template's order.
 */
function cellsNamedBy(row: string[]): CellOf {
  const named = row.map((cell) => cell.trim().toLowerCase());
  const found = new Map<GuestColumn, number>();
  const claimed = new Set<number>();

  for (const column of GUEST_COLUMNS) {
    const headings = headingsOf(column);
    const cell = named.findIndex(
      (word, index) => headings.includes(word) && !claimed.has(index)
    );
    if (cell !== -1) {
      found.set(column, cell);
      claimed.add(cell);
    }
  }

  for (const column of GUEST_COLUMNS) {
    if (found.has(column)) continue;
    const cell = cellsByPosition(column);
    found.set(column, claimed.has(cell) ? -1 : cell);
  }

  return (column) => found.get(column) ?? -1;
}

/**
 * How many people a guest may bring, as the couple wrote it.
 *
 * A whole number of people or nothing at all. "two", "1-2" and "-1" are none of
 * them a count the backend could be given, so they read as the couple not having
 * said rather than as a number invented on their behalf.
 *
 * The same answer whether it was uploaded or typed, so that a couple correcting
 * a guest by hand cannot reach a value uploading the same thing could not.
 */
const A_WHOLE_NUMBER = /^\d+$/;

export function plusOnesFrom(cell: string): number | null {
  const value = cell.trim();
  return A_WHOLE_NUMBER.test(value) ? Number(value) : null;
}

/** One row as a guest, or null when the row names nobody. */
function guestFrom(row: string[], cellOf: CellOf): Guest | null {
  const answers = {} as Record<GuestField, string>;
  for (const column of GUEST_COLUMNS) {
    // A column the file has no cell for reads as blank rather than as missing:
    // a row that stops early and a file that never had the column are the same
    // thing said twice, which is the couple not having answered.
    answers[column.field] = (row[cellOf(column)] ?? '').trim();
  }

  if (answers.name === '') return null;

  return {
    id: crypto.randomUUID(),
    // Nobody the backend has heard of yet. Both of these are replaced by what it
    // answers with the moment the list is sent.
    token: null,
    name: answers.name,
    groupLabel: answers.groupLabel,
    phone: answers.phone,
    email: answers.email,
    maxPlusOnes: plusOnesFrom(answers.maxPlusOnes),
    notes: answers.notes,
  };
}

/**
 * The guests a CSV names, in the order it names them.
 *
 * A row with no name is dropped, so trailing blank lines and a stray separator
 * row cost nothing, and a row that stops early - a guest a couple wrote nothing
 * else about - leaves the rest of that guest's columns empty rather than being
 * refused.
 */
export function guestsFromCsv(text: string): Guest[] {
  const rows = rowsOf(
    text
      // A spreadsheet that saved as UTF-8 puts a byte order mark first, and a
      // guest whose name begins with an invisible character is a guest nobody
      // has.
      .replace(/^\uFEFF/, '')
      // Every convention for ending a row, including inside a quoted name that
      // spans two lines, said one way so that the parsing only knows one.
      .replace(/\r\n?/g, '\n')
  );

  const heading = rows.length > 0 && isHeadingRow(rows[0]);
  const cellOf = heading ? cellsNamedBy(rows[0]) : cellsByPosition;

  return (heading ? rows.slice(1) : rows)
    .map((row) => guestFrom(row, cellOf))
    .filter((guest): guest is Guest => guest !== null);
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
        'No guests were found in that file. Put one guest name on each line, ' +
        'or start from the template',
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

/** How a guest's answer for one column is written on the screen. */
export function guestCell(guest: Guest, column: GuestColumn): string {
  const value = guest[column.field];
  return value === null ? '' : String(value);
}
