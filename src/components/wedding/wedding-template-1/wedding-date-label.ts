/**
 * Wedding Template 1 - the wedding day, written as a line of the invitation.
 *
 * The invitation prints this one date in two places and punctuates it
 * differently in each: the Hero sets a comma before the year, "May 3rd, 2026",
 * and the Event Details section sets a space, "May 3rd 2026". That punctuation
 * is the whole of the difference between them, so it is the one thing a caller
 * says and everything else is said here once.
 */

/**
 * The wedding day, as the section calling for it prints it.
 *
 * `beforeYear` is what the design puts between the day and the year. The two
 * forms it takes are the two the design draws and there is no third, so a
 * caller picks the one its own section prints rather than inventing
 * punctuation.
 *
 * A date this cannot read is answered with nothing, and a caller draws no line
 * rather than an empty one. It used to fall back to the Showcase's day, which
 * printed somebody else's wedding on a draft whose couple had not picked one
 * yet - and spelt that day out a second time beside
 * `DEFAULT_WEDDING_TEMPLATE_1_CONTENT`, which was `hbd-bk0`. A missing answer
 * stays missing: nothing invented reaches a guest.
 */
export function formatWeddingDateLabel(
  iso: string,
  { beforeYear }: { beforeYear: ', ' | ' ' }
): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th';
  const month = d.toLocaleString('en-US', { month: 'long' });
  return `${month} ${day}${suffix}${beforeYear}${d.getFullYear()}`;
}
