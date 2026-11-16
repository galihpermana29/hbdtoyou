# 8. Plan limits belong to the account, not the template

Date: 2026-11-17

## Status

Accepted (owner, 2026-11-17).

## Context

Every gift form decided "free" for itself (`profile?.quota < 1`) and wrote its own caps inline: 2, 4 or 5 gallery photos on the free plan and 15 or 20 on premium, 2 or 3 list items, a 1MB file limit. Tarot, Arcade Claw and Board of Us had no plan cap at all, and the copy ("free plan can only add 1 images") drifted from the numbers enforced.

The owner rotates which templates are free and which are premium on the backend. A cap tied to a template is wrong as soon as the label moves.

What the backend enforces, checked live on 2026-11-17 with a free account:

- one free gift per 24 hours, counted from `last_gift_created_at`, and one free scrapbook per 24 hours from `last_scrapbook_created_at`;
- a second create is refused with `FREE_PLAN_GIFT_LIMIT_REACHED`;
- a draft spends the free slot;
- a premium template made by a free account is accepted even during the cooldown, comes back `status: locked`, and resets the cooldown;
- deleting a gift does not return the slot;
- unlocking needs a credit (`INSUFFICIENT_BASIC_QUOTA`).

Photo and item caps are not enforced by the backend at all.

## Decision

- Caps depend on the account's plan only, and are read from one file, `src/lib/plan-limits.ts`, kept as constants in the frontend for now (owner).
- Gifts spend credits (`quota`) and scrapbooks spend tokens (`token_scrapbook`), so the plan is asked per kind.
- The template's label decides one thing only: whether making it needs a credit or token.
- Plan refusals from the backend are shown in plain words, with the time of the next free one and a way to Premium.
- The daily allowance is shown before the work starts, not first met as a refusal.

## Consequences

- Changing a cap is a one-line change in one file. New templates inherit the caps by using the helpers (CLAUDE.md, "Free vs premium").
- The caps remain a frontend fence until the backend enforces the same numbers.
- Raised for the backend:
  - a locked premium gift should not reset the free cooldown;
  - a locked gift's content should not be sent to the viewer;
  - deleting a gift's effect on the allowance;
  - whether an unlocked gift stays unlocked after the plan lapses.
