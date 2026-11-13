'use client';

import Field from '../ui/field';
import Switch from '../ui/switch';
import { colour, type } from '../ui/tokens';
import StepShell from './step-shell';

/**
 * Step five: where the party is, and whether being there is the ticket
 * (creator-08).
 *
 * Both hints read "We get this from your digital invitation", and that is the
 * design's copy shipped as written (ADR 0002). MemoRoll is standalone and the
 * link to a wedding invitation is deliberately later, so today the hint
 * describes a connection nothing makes; the fields are the creator's to type
 * either way, which is what makes shipping it harmless rather than a lie a
 * creator gets stuck behind (ADR 0007).
 *
 * The padlock the design draws over each field is the one thing not built. It
 * is the mark of an answer that came from somewhere else and cannot be changed,
 * and there is nowhere for one to come from yet - a padlock over a field the
 * creator has to fill in themselves would be the screen contradicting itself.
 * Recorded in ADR 0002 with the rest.
 */
const INVITATION_HINT = 'We get this from your digital invitation';

export default function VenueStep({
  venue,
  address,
  onlyAtTheVenue,
  venueLock = true,
  fromInvitation = true,
  onChange,
  onBack,
  onContinue,
}: {
  venue: string;
  address: string;
  onlyAtTheVenue: boolean;
  /**
   * Whether the "Only at the venue" switch is offered. The demo draws the
   * design whole; the product passes false while nothing enforces the lock
   * (owner, 2026-11-12) - a switch that promises 500m and keeps nobody out
   * is worse than no switch. The blurb loses its geofence claim with it.
   */
  venueLock?: boolean;
  /**
   * Whether the fields came from a wedding invitation. The "We get this from
   * your digital invitation" hints are only true then; a standalone roll is
   * typed by hand and shows no hint.
   */
  fromInvitation?: boolean;
  onChange: (patch: {
    venue?: string;
    address?: string;
    onlyAtTheVenue?: boolean;
  }) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <StepShell
      step={5}
      heading="Where’s the party?"
      blurb={
        venueLock
          ? 'Being there is the ticket, nobody shoots the roll outside the function'
          : 'Tell your guests where the party is'
      }
      onBack={onBack}
      primary={{ label: 'Continue', onClick: onContinue }}>
      <div className="flex w-full flex-col gap-[20px]">
        <Field
          id="memoroll-venue"
          label="Venue"
          note={fromInvitation ? INVITATION_HINT : undefined}
          value={venue}
          onChange={(value) => onChange({ venue: value })}
        />
        <Field
          id="memoroll-address"
          label="Address"
          note={fromInvitation ? INVITATION_HINT : undefined}
          value={address}
          onChange={(value) => onChange({ address: value })}
        />

        {venueLock ? (
          <div className="flex items-center justify-between gap-[16px]">
            <div className="flex flex-col">
              <p
                className={type.label}
                style={{ color: '#000000', fontFamily: 'var(--font-mr-body)' }}>
                Only at the venue
              </p>
              {/* One line, two colours: the design writes the distance in the
                flame and in bold, because 500m is the whole rule. */}
              <p
                className={type.body}
                style={{
                  color: colour.muted,
                  fontFamily: 'var(--font-mr-body)',
                }}>
                Phones{' '}
                <span className="font-bold" style={{ color: colour.flame }}>
                  500m
                </span>{' '}
                outside the venue aren’t allowed to shoot
              </p>
            </div>

            <Switch
              on={onlyAtTheVenue}
              onChange={(on) => onChange({ onlyAtTheVenue: on })}
              label="Only at the venue"
            />
          </div>
        ) : null}
      </div>
    </StepShell>
  );
}
