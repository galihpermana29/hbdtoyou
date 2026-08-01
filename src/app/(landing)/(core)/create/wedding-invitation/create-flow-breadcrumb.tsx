import { ChevronRight, House } from 'lucide-react';
import Link from 'next/link';

/**
 * Where the Create Flow sits in the site, drawn as the design draws it.
 *
 * The trail is Home, Feature, Wedding Invitation, and then the page you are on.
 * The design opens it with a house and no words, so that link carries its name
 * in `aria-label` rather than in text a sighted reader would see.
 *
 * The last item is the page itself, so it is a `span` with `aria-current`
 * rather than a link to where you already are. That is the standard ARIA
 * breadcrumb pattern, and it is also how the style and structure check finds
 * these items: see `visual/expectations/details-and-story.mjs`.
 */

/** The links before the current page, in the order the design reads them. */
const TRAIL = [
  // Memoify has no features index of its own; the templates page is the list of
  // what the product offers, which is what this step of the trail means.
  { label: 'Feature', href: '/templates' },
  { label: 'Wedding Invitation', href: '/wedding-invitation' },
];

export default function CreateFlowBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-[12px]">
        <li className="flex items-center">
          <Link href="/" aria-label="Home" className="text-[#7B7B7B]">
            <House size={18} />
          </Link>
        </li>
        {TRAIL.map(({ label, href }) => (
          <li key={href} className="flex items-center gap-[12px]">
            <ChevronRight
              size={20}
              aria-hidden="true"
              className="text-[#667085]"
            />
            <Link
              href={href}
              className="text-[14px] font-[500] leading-[20px] text-[#7B7B7B]">
              {label}
            </Link>
          </li>
        ))}
        <li className="flex items-center gap-[12px]">
          <ChevronRight
            size={20}
            aria-hidden="true"
            className="text-[#667085]"
          />
          <span
            aria-current="page"
            className="text-[14px] font-[600] leading-[20px] text-[#E34013]">
            Create Wedding Invitation
          </span>
        </li>
      </ol>
    </nav>
  );
}
