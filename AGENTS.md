# AGENTS.md

What a fresh agent needs before it touches this repository. Written from things
that actually went wrong, so most of it is a trap rather than a description.

## Commands

```bash
npm install
npm run dev -- -p 3000        # port 3000, and it matters - see Traps
npx tsc --noEmit              # typecheck
npm run visual                # the check: 27 screens against two Figma designs
npm run visual:self-check     # the check on the checker, browser-free

# verify - the loop gates on this
npx tsc --noEmit && npm run visual && npm run visual:self-check
```

`npm run lint` is deliberately absent from verify. It is `next lint` across the
whole repository, which carries a few hundred pre-existing errors that predate
this work and fail regardless of what you changed. Lint what you touched
instead - `npx eslint <files>` - which is what the pre-commit hook does.

There is no unit test runner. `npm run visual` is the only automated check,
and it needs Chromium once: `npx playwright install chromium`.

## Stack

Next.js 14 App Router, TypeScript with `strict: false`, Tailwind. Three UI
libraries coexist - Ant Design 5, MUI 6, shadcn/ui - so match the file you are
in rather than introducing a fourth. Backend is an external REST API; there is
no database in this repo. `@/*` maps to `src/*`.

## The check

`visual/` drives a real browser and asserts computed style, copy, placeholder
text and document order against values read from Figma. It **never** asserts a
width, a height or a typeface family, and it refuses to - the vocabulary
rejects those properties by name and tells you why.

Screenshots are evidence for a person. They decide nothing.

Any new element must be declared in the expectations before it can be asserted;
undeclared ones are refused rather than ignored. When you add a control, you add
its declaration in the same change.

## Traps

**The dev server must run on port 3000.** Both staging backends whitelist
`http://localhost:3000` and nothing else, and only echo `Access-Control-Allow-Origin`
for it. Any other port breaks browser uploads with a CORS error that reads like a
broken uploader. Server actions are unaffected, which is why saving works on the
wrong port and only photographs fail.

**`noStyle` on a `Form.Item` renders no error text.** Every field in the wedding
form is inside one, so antd rules validate and then say nothing at all. If you
need a message on the screen, the `Form.Item` cannot be `noStyle`.

**antd's `whitespace: true` is for strings only.** Applied to a Dayjs it fails
validation, and a couple who picked a date is told it is still required while
looking at it. Non-text answers use a rule without it.

**Chrome's scroll anchoring will undo a scroll issued during a reflow.** If you
scroll right after expanding several sections, the browser applies it and then
corrects it back, which looks exactly like scrolling to the wrong place. Wait for
the layout to settle.

**Nothing is invented for an unanswered field.** A blank answer stays blank all
the way to the saved record and the invitation. See CONTEXT.md for Prefill
against Fallback - the distinction is load-bearing, and blurring it once put the
designer's own wedding into other people's saved records.

**A number a person writes beside another number will drift from it.** Uploader
guidance is generated from the limit it enforces, and the prop that let a caller
write its own is gone. Do not add it back.

## Conventions

Comments explain why, not what. The codebase is written to be read by somebody
who was not there, and the reasoning behind a decision is the part that cannot be
recovered from the diff.

Failures are surfaced, never swallowed. A save that fails blocks the step and
says so; a couple who believes their work is kept and finds otherwise has lost
more than a step.

Copy is taken from the design exactly as written, including its mistakes. Every
place that could not be followed is recorded in
`docs/adr/0002-figma-is-literal-truth.md` with why - add to it rather than
deviating silently.

Backend calls live in `src/action/` as server actions and follow the existing
`APP_ENV` flip between production and staging. Because they are server actions,
nothing about them appears in the browser's network panel.

## Domain

The glossary is `CONTEXT.md` at the workspace root. Use its vocabulary in names,
tests, tickets and commit messages - it exists because the same word was meaning
two things and the confusion reached production.

Decisions are in `docs/adr/`. Read 0002 before changing anything the design
draws, and 0003 before adding a route that renders somebody's gift.
