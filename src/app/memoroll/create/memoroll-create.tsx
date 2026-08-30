'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import {
  INSUFFICIENT_QUOTA,
  WEDDING_ALREADY_LINKED,
} from '@/action/interfaces';
// Browser-to-backend since 2026-08-30 (`memoroll-client-api.ts`): the first
// deployed publish died silently when Vercel's ten-second server-action
// ceiling met a backend that took ninety - while the backend obeyed anyway.
import {
  createMemorollEventClient as createMemorollEvent,
  getOwnedMemorollEventClient as getOwnedMemorollEvent,
  listOwnedMemorollEventsClient as listOwnedMemorollEvents,
  publishMemorollEventClient as publishMemorollEvent,
} from '@/action/memoroll-client-api';
import Cover from '@/components/memoroll/guest/cover';
import CoverStep from '@/components/memoroll/creator/cover-step';
import NameStep from '@/components/memoroll/creator/name-step';
import PublishStep from '@/components/memoroll/creator/publish-step';
import QrSheet from '@/components/memoroll/creator/qr-sheet';
import RevealStep from '@/components/memoroll/creator/reveal-step';
import ShotsStep from '@/components/memoroll/creator/shots-step';
import TimeStep from '@/components/memoroll/creator/time-step';
import VenueStep from '@/components/memoroll/creator/venue-step';
import VibeStep from '@/components/memoroll/creator/vibe-step';
import WelcomeScreen from '@/components/memoroll/creator/welcome-screen';
import { ChevronLeftIcon } from '@/components/memoroll/ui/icons';
import { colour } from '@/components/memoroll/ui/tokens';
import {
  COVER_STYLES,
  LAST_STEP,
  type MemorollDraft,
} from '@/components/memoroll/creator/draft';
import { newUploadImageWithAPI } from '@/lib/upload';
// The motion constants are the demo's, on purpose: one source, so the product
// and the walkthrough cannot drift apart in how a step arrives (ADR 0007).
import { REDUCED_FADE, screenVariants } from '@/app/memoroll/demo/variants';
import { buildMemorollPayload } from './payload';

/**
 * The four photographs behind the welcome's sentence. The design's own, the
 * same ones the demo shows: the welcome belongs to the product rather than to
 * any one event, so these are artwork rather than anybody's content.
 */
import { SAMPLE_SOURCES } from '@/app/memoroll/demo/mock';

const WELCOME_PHOTOS = SAMPLE_SOURCES.slice(2, 6);

/**
 * What a creator out of credit reads. Named and worded the way the wedding's
 * own refusal is, and for the same reason: they have not failed at anything,
 * and every answer they gave is still on the screen waiting.
 */
const NO_MEMOROLL_CREDIT_PROBLEM =
  'Your account has no MemoRoll credits left, so this roll could not be ' +
  'published. Everything you have entered is still here - add credits to ' +
  'your plan and press Publish again.';

/**
 * What a raced wedding link reads. The dashboard card already points at an
 * existing memoroll when one exists, so meeting this refusal means the same
 * wedding was linked from another tab between opening this flow and
 * publishing it.
 */
const WEDDING_TAKEN_PROBLEM =
  'This wedding already has a MemoRoll. Open your wedding dashboard to find ' +
  'it - a wedding can only have one.';

/**
 * The backend's id for the one memoroll template.
 *
 * A constant rather than a lookup, unlike the wedding's `weddingTemplateId`:
 * the backend confirmed on 2026-08-30 that this seeded id IS the memoroll
 * template on every environment, the templates listing carries no memoroll
 * row to resolve it from, and a create against staging with this exact id
 * answered 200 on 2026-08-29. If a real template row ever appears, resolving
 * by type can replace this the way the wedding does it.
 */
const MEMOROLL_TEMPLATE_ID = '66666666-6666-6666-6666-666666666666';

type View =
  { kind: 'welcome' } | { kind: 'step'; step: number } | { kind: 'preview' };

/** The created event, and how far towards its guests it has come. */
interface Published {
  id: string;
  /** Whether the publish call has landed. A create is a draft until it does -
   *  verified on staging 2026-08-29, against the guide's own note - and a
   *  draft's gallery answers nobody. */
  live: boolean;
  /** The 8-character code every guest link carries, or null until the
   *  read-back after create answers - see `learnTheCode`. */
  code: string | null;
}

/**
 * The MemoRoll creator: the same welcome, eight steps and QR sheet the demo
 * walks through, with the one difference ADR 0007 promised - a record behind
 * them.
 *
 * Every step holds local state and nothing more. The backend is asked exactly
 * once, when Publish is pressed: one POST that creates the event published
 * and spends the credit, or one refusal the problem line prints with every
 * answer kept (CONTEXT.md - a Draft lives only in this browser, and a
 * MemoRoll is created published or not at all).
 */
export default function MemorollCreate({
  initialDraft,
  weddingId,
  existingRollId = null,
}: {
  initialDraft: MemorollDraft;
  weddingId: string | null;
  /** The wedding's already-made roll, when it has one: the welcome's button
   *  leads to its console instead of into the wizard. */
  existingRollId?: string | null;
}) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [view, setView] = useState<View>({ kind: 'welcome' });
  const [draft, setDraft] = useState<MemorollDraft>(initialDraft);
  const [qrOpen, setQrOpen] = useState(false);
  const [origin, setOrigin] = useState('');
  const [problem, setProblem] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState<Published | null>(null);
  /** The moment of success, said briefly: the toast shows for a beat and
   *  goes, because the flipped footer is the durable statement. */
  const [justPublished, setJustPublished] = useState(false);
  useEffect(() => {
    if (!justPublished) return;
    const timer = setTimeout(() => setJustPublished(false), 2000);
    return () => clearTimeout(timer);
  }, [justPublished]);

  // Problems are toasts too (owner, 2026-08-30): they say their piece and
  // go, rather than squatting over the buttons. Long enough to read two
  // lines; a tap dismisses sooner.
  useEffect(() => {
    if (!problem) return;
    const timer = setTimeout(() => setProblem(null), 2500);
    return () => clearTimeout(timer);
  }, [problem]);
  /** How many cover photographs are still travelling to storage. */
  const [uploading, setUploading] = useState(0);
  /** Object URLs previewing photographs whose uploads have not landed. */
  const previewUrls = useRef<Set<string>>(new Set());

  // Read after mount rather than during render, so the first client render is
  // the server's and the QR is not a hydration mismatch.
  useEffect(() => setOrigin(window.location.origin), []);

  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const patch = (partial: Partial<MemorollDraft>) =>
    setDraft((previous) => ({ ...previous, ...partial }));

  const goToStep = (step: number) =>
    setView({ kind: 'step', step: Math.min(Math.max(step, 1), LAST_STEP) });

  const step = view.kind === 'step' ? view.step : 0;
  const back = () => {
    setProblem(null);
    goToStep(step - 1);
  };

  /**
   * What still stops this step, or null when it may be left. Every field is
   * mandatory (owner's call, 2026-08-30): a roll published with blanks is a
   * cover with empty frames and a venue nobody can find, so each Continue
   * refuses with the reason rather than carrying blanks forward. The demo
   * keeps its unguarded walkthrough - its draft is the design's.
   */
  const stillMissingOn = (at: number): string | null => {
    switch (at) {
      case 2:
        return draft.eventName.trim() ? null : 'The roll needs a name.';
      case 3: {
        const slots =
          COVER_STYLES.find((option) => option.key === draft.coverStyle)
            ?.slots ?? 1;
        const filled = draft.photos
          .slice(0, slots)
          .every((photo) => typeof photo === 'string' && photo !== '');
        return filled
          ? null
          : slots === 1
            ? 'The cover needs its photograph.'
            : 'The collage needs all six photographs.';
      }
      case 4:
        return draft.opensOn && draft.opensAt
          ? null
          : 'Pick the date and the hour the roll opens.';
      case 5:
        return draft.venue.trim() && draft.address.trim()
          ? null
          : 'The venue and its address are both needed.';
      case 7: {
        if (!draft.revealOn || !draft.revealAt) {
          return 'Pick the date and the hour of the reveal.';
        }
        // Same day is fine - the same minute is not: the roll needs at
        // least five minutes open, or it reveals before anyone has shot.
        const opens = Date.parse(`${draft.opensOn}T${draft.opensAt}`);
        const reveal = Date.parse(`${draft.revealOn}T${draft.revealAt}`);
        if (!isNaN(opens) && !isNaN(reveal) && reveal < opens + 5 * 60_000) {
          return 'The reveal has to be at least five minutes after the roll opens.';
        }
        return null;
      }
      default:
        return null;
    }
  };

  const next = () => {
    const missing = stillMissingOn(step);
    if (missing) {
      setProblem(missing);
      return;
    }
    setProblem(null);
    goToStep(step + 1);
  };

  const placePhoto = (slot: number, url: string | null) =>
    setDraft((previous) => {
      const photos = [...previous.photos];
      const replaced = photos[slot];
      if (replaced?.startsWith('blob:')) {
        URL.revokeObjectURL(replaced);
        previewUrls.current.delete(replaced);
      }
      photos[slot] = url;
      return { ...previous, photos };
    });

  /**
   * A picked photograph starts uploading the moment it is picked, and the
   * slot previews it from the file itself in the meantime, so the creator is
   * never looking at an empty slot they just filled. The upload landing swaps
   * the preview for the stored address; the upload failing empties the slot
   * and says so, because a cover published with a blob: URL in it would be a
   * cover no guest can see.
   */
  const setPhoto = (slot: number, photo: File) => {
    const preview = URL.createObjectURL(photo);
    previewUrls.current.add(preview);
    placePhoto(slot, preview);
    setUploading((count) => count + 1);

    const body = new FormData();
    body.append('file', photo);
    newUploadImageWithAPI(body)
      .then((result) => {
        const url = result.success ? result.data?.data : null;
        if (typeof url === 'string' && url) {
          placePhoto(slot, url);
          return;
        }
        placePhoto(slot, null);
        setProblem(
          'That photograph could not be uploaded. Pick it again to retry.'
        );
      })
      .catch(() => {
        placePhoto(slot, null);
        setProblem(
          'That photograph could not be uploaded. Pick it again to retry.'
        );
      })
      .finally(() => setUploading((count) => count - 1));
  };

  const guestUrl = published?.code
    ? `${origin}/memoroll/${published.code}`
    : '';

  /** Read the created event back for the one thing create does not answer. */
  const learnTheCode = async (eventId: string): Promise<string | null> => {
    const event = await getOwnedMemorollEvent(eventId);
    return event.success && event.data?.code ? event.data.code : null;
  };

  /**
   * The event a failed create may nevertheless have made.
   *
   * A create is not atomic with its answer: the first live run of this flow
   * (2026-08-30) had Railway's proxy answer 502 "Application failed to
   * respond" after 92 seconds while the backend had already made the event,
   * published it and spent the credit. A flow that believed the 502 would
   * offer the creator a second create - and a second credit - so an
   * ambiguous failure looks through the owner's own listing first: an event
   * carrying exactly this draft's name and opening moment, made in the last
   * few minutes, is this press's, and is adopted rather than mourned.
   */
  const adoptOrphanedEvent = async (payload: {
    host_name: string;
    starts_at: string;
  }): Promise<Published | null> => {
    const listing = await listOwnedMemorollEvents('20', '1');
    if (!listing.success || !listing.data) return null;
    const startsAt = Date.parse(payload.starts_at);
    const match = listing.data.find(
      (candidate) =>
        candidate.host_name === payload.host_name &&
        Date.parse(candidate.starts_at) === startsAt &&
        Date.now() - Date.parse(candidate.create_time) < 10 * 60_000
    );
    if (!match) return null;
    return {
      id: match.id,
      live: match.status === 'published',
      code: match.code || null,
    };
  };

  /**
   * The roll a WEDDING_ALREADY_LINKED refusal is talking about. The refusal
   * is proof the roll exists, so the flow adopts it - by the wedding's own
   * id, with no time window, because however old it is, it is this
   * wedding's one roll - and the footer flips to the published state
   * instead of stranding a Publish that can never succeed (owner,
   * 2026-08-30).
   */
  const adoptWeddingsRoll = async (): Promise<Published | null> => {
    if (!weddingId) return null;
    const listing = await listOwnedMemorollEvents('100', '1');
    if (!listing.success || !listing.data) return null;
    const match = listing.data.find(
      (candidate) =>
        candidate.wedding_id === weddingId && candidate.status !== 'archived'
    );
    if (!match) return null;
    return {
      id: match.id,
      live: match.status === 'published',
      code: match.code || null,
    };
  };

  /**
   * The one act, as the creator feels it: press Publish, get the QR. On the
   * wire it is up to three calls - create, publish, and a read-back for the
   * code. The backend has published at create since 2026-08-30 and answers
   * the code in the create response, so publish and read-back are usually
   * confirmations that cost one call; both stay because the 2026-08-29
   * backend did neither, and a flow that assumes the newest backend strands
   * creators on the older one. Each stage that fails leaves its progress
   * behind, so the next press resumes where the last one stopped instead of
   * creating twice: the credit is spent by the create, and only the create.
   */
  const publishThenQr = async () => {
    if (publishing) return;
    setProblem(null);
    setPublishing(true);
    // Whether this press is the one doing the publishing - the toast belongs
    // to that press alone, never to a later QR re-open.
    const wasNew = !published?.live;
    // Hoisted so the catch below can still look for the event a dead
    // transport may nevertheless have made.
    let payloadForRescue: { host_name: string; starts_at: string } | null =
      null;
    // Set when the press resolved to the wedding's pre-existing roll: the
    // footer flips, but the toast and the QR sheet stay quiet so the banner
    // explaining what happened is what gets read.
    let adoptedExisting = false;
    try {
      let event = published;

      if (!event) {
        if (uploading > 0) {
          setProblem(
            'Your cover photographs are still uploading - give them a ' +
              'moment, then press Publish again.'
          );
          return;
        }

        const built = buildMemorollPayload(draft, weddingId);
        if ('problem' in built) {
          setProblem(built.problem);
          return;
        }
        payloadForRescue = built.payload;

        // Look before creating, every press: a prior press's create may
        // still be cooking on the backend past our 20-second patience, and
        // a press that created blind would make the event twice. The
        // listing answers in a second and makes every press safe to repeat.
        const cooked = await adoptOrphanedEvent(built.payload);
        if (cooked) {
          event = cooked;
          setPublished(cooked);
        } else {
          const created = await createMemorollEvent({
            template_id: MEMOROLL_TEMPLATE_ID,
            ...built.payload,
          });

          if (!created.success || !created.data?.id) {
            // The two clean refusals mean the backend heard and said no; a
            // credit was not spent and nothing was made.
            if (created.message === INSUFFICIENT_QUOTA) {
              setProblem(NO_MEMOROLL_CREDIT_PROBLEM);
              return;
            }
            if (created.message === WEDDING_ALREADY_LINKED) {
              // The refusal proves the roll exists: adopt it, flip the
              // footer, and let the banner explain - a Publish left standing
              // here could never succeed.
              const theirs = await adoptWeddingsRoll();
              if (theirs) {
                event = theirs;
                adoptedExisting = true;
                setPublished(theirs);
                setProblem(WEDDING_TAKEN_PROBLEM);
                // Fall through: the shared tail below confirms publish state
                // and learns the code, then the footer stands published.
              } else {
                setProblem(WEDDING_TAKEN_PROBLEM);
                return;
              }
            } else {
              // Anything else is ambiguous - a proxy 502, a timeout, a
              // dropped connection - and the event may exist anyway. Look
              // before offering to create it twice; see adoptOrphanedEvent.
              const orphan = await adoptOrphanedEvent(built.payload);
              if (!orphan) {
                setProblem(
                  `Your roll could not be published: ${
                    created.message || 'the backend sent no answer'
                  }.`
                );
                return;
              }
              event = orphan;
              setPublished(orphan);
            }
          } else {
            // The create answers the code itself since 2026-08-30; the
            // read-back below stays only for a backend that has not caught up.
            event = {
              id: created.data.id,
              live: false,
              code: created.data.code || null,
            };
            setPublished(event);
          }
        }
      }

      if (!event.live) {
        const opened = await publishMemorollEvent(event.id);
        if (!opened.success) {
          setProblem(
            'Your roll was created but is not open to guests yet: ' +
              `${opened.message || 'the backend sent no answer'}. ` +
              'Press Publish again - nothing is lost and nothing is charged twice.'
          );
          return;
        }
        event = { ...event, live: true };
        setPublished(event);
      }

      if (!event.code) {
        const code = await learnTheCode(event.id);
        if (!code) {
          setProblem(
            'Your roll is published, but its link could not be read back. ' +
              'Press Publish again to fetch it.'
          );
          return;
        }
        event = { ...event, code };
        setPublished(event);
      }

      if (!adoptedExisting) {
        if (wasNew) setJustPublished(true);
        setQrOpen(true);
      }
    } catch (error) {
      // Nothing in the pipeline should throw - the client calls answer with
      // envelopes - but the first deployed publish proved what silence costs:
      // the transport died mid-flight, the backend obeyed anyway, and the
      // screen said nothing (2026-08-30). So a throw is caught, the orphan
      // hunt runs the same as for an ambiguous refusal, and whatever the
      // truth is, the creator reads it.
      if (!published && payloadForRescue) {
        const orphan = await adoptOrphanedEvent(payloadForRescue).catch(
          () => null
        );
        if (orphan) {
          setPublished(orphan);
          if (orphan.live && orphan.code) {
            if (wasNew) setJustPublished(true);
            setQrOpen(true);
          }
          return;
        }
      }
      setProblem(
        `Your roll could not be published: ${
          error instanceof Error ? error.message : String(error)
        }. Press Publish again - nothing is charged twice.`
      );
    } finally {
      setPublishing(false);
    }
  };

  /**
   * Hand the link over the way the phone offers to - the share sheet, or the
   * clipboard where a desktop browser has no sheet to open.
   */
  const shareLink = () => {
    if (typeof navigator === 'undefined' || !guestUrl) return;
    if (navigator.share) {
      navigator.share({ title: draft.eventName, url: guestUrl }).catch(() => {
        // Somebody dismissed the sheet. That is an answer, not a failure.
      });
      return;
    }
    navigator.clipboard?.writeText(guestUrl).catch(() => {
      // A context that refuses the clipboard still has the link on screen.
    });
  };

  return (
    <div className="min-h-[100dvh] bg-[#e8e4dd] transition-colors duration-300">
      <div
        className="relative mx-auto flex min-h-[100dvh] max-w-[430px] flex-col overflow-x-clip shadow-2xl"
        style={{
          background: view.kind === 'welcome' ? colour.ink : colour.paper,
        }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view.kind === 'step' ? `step-${view.step}` : view.kind}
            variants={reduce ? undefined : screenVariants}
            initial={reduce ? { opacity: 0 } : 'enter'}
            animate={
              reduce ? { opacity: 1, transition: REDUCED_FADE } : 'center'
            }
            exit={reduce ? { opacity: 0, transition: REDUCED_FADE } : 'exit'}
            className="flex min-h-[100dvh] flex-col">
            {view.kind === 'welcome' && (
              <WelcomeScreen
                photos={WELCOME_PHOTOS}
                onStart={() =>
                  existingRollId
                    ? router.push(`/dashboard/memoroll/${existingRollId}`)
                    : goToStep(1)
                }
              />
            )}

            {view.kind === 'preview' && (
              <div className="relative flex min-h-full flex-1 flex-col">
                <button
                  type="button"
                  aria-label="Back"
                  onClick={() => goToStep(LAST_STEP)}
                  className="absolute left-[16px] top-[16px] z-20 flex h-[44px] w-[48px] items-center justify-center rounded-full"
                  style={{ background: colour.flame, color: '#fafafa' }}>
                  <ChevronLeftIcon className="h-[24px] w-[24px]" />
                </button>
                <Cover
                  eventName={draft.eventName}
                  photos={draft.photos}
                  style={draft.coverStyle}
                  onEnter={() => goToStep(LAST_STEP)}
                />
              </div>
            )}

            {step === 1 && (
              <VibeStep
                vibe={draft.vibe}
                onChange={(vibe) => patch({ vibe })}
                onContinue={next}
              />
            )}
            {step === 2 && (
              <NameStep
                eventName={draft.eventName}
                onChange={(eventName) => patch({ eventName })}
                onBack={back}
                onContinue={next}
              />
            )}
            {step === 3 && (
              <CoverStep
                eventName={draft.eventName}
                coverStyle={draft.coverStyle}
                photos={draft.photos}
                onStyleChange={(coverStyle) => patch({ coverStyle })}
                onPhotoChange={setPhoto}
                onBack={back}
                onContinue={next}
              />
            )}
            {step === 4 && (
              <TimeStep
                opensOn={draft.opensOn}
                opensAt={draft.opensAt}
                onChange={patch}
                onBack={back}
                onContinue={next}
              />
            )}
            {step === 5 && (
              <VenueStep
                venue={draft.venue}
                address={draft.address}
                onlyAtTheVenue={draft.onlyAtTheVenue}
                onChange={patch}
                onBack={back}
                onContinue={next}
              />
            )}
            {step === 6 && (
              <ShotsStep
                shotsPerGuest={draft.shotsPerGuest}
                onChange={(shotsPerGuest) => patch({ shotsPerGuest })}
                onBack={back}
                onContinue={next}
              />
            )}
            {step === 7 && (
              <RevealStep
                revealOn={draft.revealOn}
                revealAt={draft.revealAt}
                onChange={patch}
                onBack={back}
                onCreate={next}
              />
            )}
            {step === 8 && (
              <PublishStep
                eventName={draft.eventName}
                coverStyle={draft.coverStyle}
                photos={draft.photos}
                onEdit={() => goToStep(1)}
                onPreview={() => setView({ kind: 'preview' })}
                onShowQr={publishThenQr}
                onPublish={publishThenQr}
                busy={publishing}
                published={Boolean(published?.live)}
                onOpenDashboard={() =>
                  published &&
                  router.push(`/dashboard/memoroll/${published.id}`)
                }
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Success, said briefly: two seconds of toast, then the flipped
            footer carries the statement. It lingered once and sat over the
            pills it was announcing (owner, 2026-08-30). */}
        {justPublished && !problem ? (
          <div
            role="status"
            className="pointer-events-none absolute inset-x-[16px] bottom-[96px] z-30">
            <p
              className="rounded-[12px] px-[16px] py-[12px] text-[13px] font-semibold leading-[150%] shadow-lg"
              style={{
                background: colour.flame,
                color: '#ffffff',
                fontFamily: 'var(--font-mr-body)',
              }}>
              Your roll is published. The QR is ready whenever you need it.
            </p>
          </div>
        ) : null}

        {/* What stopped the last press, in a sentence, where the thumb that
            pressed is. Product-owned: the designed steps carry no problem
            slot, and inventing one inside them would be redrawing screens. */}
        {problem ? (
          <div
            role="alert"
            className="pointer-events-none absolute inset-x-[16px] bottom-[96px] z-30">
            <p
              className="pointer-events-auto rounded-[12px] px-[16px] py-[12px] text-[13px] font-semibold leading-[150%] shadow-lg"
              style={{
                background: colour.ink,
                color: colour.paper,
                fontFamily: 'var(--font-mr-body)',
              }}
              onClick={() => setProblem(null)}>
              {problem}
            </p>
          </div>
        ) : null}

        <AnimatePresence>
          {qrOpen && published?.code && (
            <QrSheet
              eventName={draft.eventName}
              url={guestUrl}
              onClose={() => setQrOpen(false)}
              onShareLink={shareLink}
              onOpenDashboard={() =>
                router.push(`/dashboard/memoroll/${published.id}`)
              }
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
