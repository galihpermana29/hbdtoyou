/**
 * What every screen of the Create Flow says above its own content, and the type
 * the design sets that content in.
 *
 * The chrome - the site navigation, the breadcrumb, the heading, the four-step
 * indicator and the footer - is the same on all four steps, and the only thing
 * that changes between them is which step is the current one. It is written
 * here once so that a change to the design's wording is one edit rather than
 * one per screen, and so two screens cannot quietly disagree about it.
 *
 * Every value was read from the Figma frames the screens name. The design is
 * literal truth, including its copy errors: see
 * `docs/adr/0002-figma-is-literal-truth.md`.
 */

/** The typographic treatments the design uses across the flow, each named once. */
export const TYPE = {
  breadcrumb: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    color: '#7b7b7b',
  },
  breadcrumbCurrent: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '20px',
    color: '#e34013',
  },
  pageTitle: {
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '28px',
    color: '#1b1b1b',
  },
  pageDescription: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '24px',
    color: '#7b7b7b',
  },
  stepTitle: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '20px',
  },
  stepDescription: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
  },
  sectionName: {
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '28px',
    color: '#1b1b1b',
  },
  sectionDescription: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    color: '#475467',
  },
  fieldLabel: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    color: '#344054',
  },
  fieldHint: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    color: '#475467',
  },
  actionLabel: {
    fontSize: '16px',
    fontWeight: 700,
    lineHeight: '24px',
  },
  panelHeading: {
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '28px',
    color: '#1b1b1b',
  },
};

/** The one drop shadow the design uses on fields and buttons. */
export const FIELD_SHADOW = 'rgba(16, 24, 40, 0.05) 0px 1px 2px 0px';

/** The colour the design gives the step a couple is on, whichever step it is. */
const CURRENT = '#e34013';

/**
 * The four steps, with the colour each keeps while it is not the current one.
 *
 * The design colours each step's words per step rather than per state: step 2
 * is #344054 both before it is reached and after it is done, and step 4 stays
 * #7b7b7b until it is current. That is the only rule that holds across all
 * three designed frames, and it is the same rule `create-flow-steps.tsx`
 * implements. Step 3's description really does read "Config guest details on
 * your the invites", and step 4 is titled "Share with guests" by the one agreed
 * deviation: both are recorded in `docs/adr/0002-figma-is-literal-truth.md`.
 */
const STEPS = [
  {
    title: 'Choose your template',
    description: 'Pick a template design that calls to your dream wedding',
    restingTitleColor: '#1b1b1b',
    restingDescriptionColor: '#7b7b7b',
  },
  {
    title: 'Fill in the details & story',
    description: 'Add photos, music, and story details.',
    restingTitleColor: '#344054',
    restingDescriptionColor: '#475467',
  },
  {
    title: 'Guest invites details',
    description: 'Config guest details on your the invites',
    restingTitleColor: '#344054',
    restingDescriptionColor: '#475467',
  },
  {
    title: 'Share with guests',
    description: 'Easily share your invitation to invited guests.',
    restingTitleColor: '#7b7b7b',
    restingDescriptionColor: '#7b7b7b',
  },
];

/**
 * Everything above a screen's own content, in the order the design stacks it.
 *
 * `current` is the title of the step the screen is, which decides nothing but
 * which two lines of the indicator turn orange.
 *
 * The site navigation is checked for presence only: its design is out of scope
 * for this epic and the existing component wins, so asserting its type would
 * contradict the spec. The design opens the breadcrumb with a home icon and no
 * words, so there is nothing to assert about that item beyond it being first.
 */
export function pageChrome(current) {
  return [
    {
      name: 'Site navigation',
      select: 'header',
    },
    {
      name: 'Breadcrumb, home',
      select: 'nav[aria-label="Breadcrumb"] a',
      nth: 0,
    },
    {
      name: 'Breadcrumb, Feature',
      select: 'nav[aria-label="Breadcrumb"] a',
      nth: 1,
      text: 'Feature',
      style: TYPE.breadcrumb,
    },
    {
      name: 'Breadcrumb, Wedding Invitation',
      select: 'nav[aria-label="Breadcrumb"] a',
      nth: 2,
      text: 'Wedding Invitation',
      style: TYPE.breadcrumb,
    },
    {
      name: 'Breadcrumb, current page',
      select: 'nav[aria-label="Breadcrumb"] [aria-current="page"]',
      text: 'Create Wedding Invitation',
      style: TYPE.breadcrumbCurrent,
    },
    {
      name: 'Page title',
      select: 'h1',
      text: 'Create Wedding Invitation',
      style: TYPE.pageTitle,
    },
    {
      name: 'Page description',
      select: 'h1 + p',
      text: 'Create memorable wedding invitation for you & your special person’s big day',
      style: TYPE.pageDescription,
    },
    ...STEPS.flatMap((step, index) => {
      const isCurrent = step.title === current;
      return [
        {
          name: `Step ${index + 1} title`,
          withText: step.title,
          style: {
            ...TYPE.stepTitle,
            color: isCurrent ? CURRENT : step.restingTitleColor,
          },
        },
        {
          name: `Step ${index + 1} description`,
          withText: step.description,
          style: {
            ...TYPE.stepDescription,
            color: isCurrent ? CURRENT : step.restingDescriptionColor,
          },
        },
      ];
    }),
  ];
}

/** The last thing on every screen. Presence only, for the same reason as the navigation. */
export const siteFooter = {
  name: 'Site footer',
  select: 'footer',
};
