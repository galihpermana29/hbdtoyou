'use client';

import { Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { deleteMemorollEventClient } from '@/action/memoroll-client-api';
import { trackMemoRoll } from '@/lib/memoroll-analytics';

/**
 * Deleting a whole roll (owner, 2026-11-26: "kerjain yg hapus").
 *
 * The backend's delete is final: the event, its guests and the record of
 * every photo they took are gone, with no undo and no bin. So it is the one
 * thing on this page that takes more than a press. It sits last, apart from
 * everything else, and its dialog names the roll, says whose it is and what
 * goes with it, and only arms its button once the roll's own code has been
 * typed - the code is on the sign at the venue, so typing it is also a last
 * look at which event this is.
 */
export default function DeleteRoll({
  eventId,
  name,
  code,
  ownerEmail,
  guests,
  shots,
}: {
  eventId: string;
  name: string;
  code: string;
  /** Set when an administrator is deleting somebody else's roll. */
  ownerEmail?: string | null;
  /** How much is in it, where the numbers were read. */
  guests?: number | null;
  shots?: number | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const armed = typed.trim().toUpperCase() === code.toUpperCase();

  const close = () => {
    if (deleting) return;
    setOpen(false);
    setTyped('');
    setProblem(null);
  };

  const remove = async () => {
    if (!armed || deleting) return;
    setDeleting(true);
    setProblem(null);
    try {
      const gone = await deleteMemorollEventClient(eventId);
      if (!gone.success) {
        setProblem(`The roll was not deleted: ${gone.message}.`);
        setDeleting(false);
        return;
      }
      trackMemoRoll('memoroll_roll_deleted', {
        of_another_account: Boolean(ownerEmail),
      });
      // There is no page to stay on: back to the list, read afresh.
      router.replace('/dashboard/memoroll');
      router.refresh();
    } catch {
      setProblem('The roll was not deleted: the request did not go through.');
      setDeleting(false);
    }
  };

  const inside =
    typeof guests === 'number' && typeof shots === 'number'
      ? `${guests} ${guests === 1 ? 'guest' : 'guests'} and ${shots} ${
          shots === 1 ? 'shot' : 'shots'
        }`
      : 'every guest and every shot';

  return (
    <div className="flex flex-col gap-[12px] rounded-[20px] border border-[#FDA29B] bg-white p-[20px]">
      <h2 className="text-[18px] font-[600] leading-[28px] text-[#182230]">
        Delete this roll
      </h2>
      <p className="text-[14px] font-[400] leading-[20px] text-[#667085]">
        Removes the roll, its guest list and every shot from Memoify, for
        everyone, for good. Its link and QR stop working. There is no undo.
      </p>
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-[#B42318] px-[14px] py-[8px] text-[14px] font-[600] leading-[20px] text-[#B42318] hover:bg-[#FEF3F2]">
          Delete roll…
        </button>
      </div>

      <Modal
        open={open}
        onCancel={close}
        title={`Delete "${name}"?`}
        footer={null}
        maskClosable={!deleting}
        closable={!deleting}
        destroyOnClose>
        <div className="flex flex-col gap-[12px] pt-[4px]">
          <p className="text-[14px] leading-[20px] text-[#344054]">
            This deletes the roll <strong>{name}</strong> (code{' '}
            <strong>{code}</strong>)
            {ownerEmail ? (
              <>
                , which belongs to <strong>{ownerEmail}</strong>
              </>
            ) : null}
            , with {inside} in it.
          </p>
          <p className="text-[14px] leading-[20px] text-[#B42318]">
            It cannot be undone, and nobody can get the photos back from Memoify
            afterwards. Download them first if they matter.
          </p>
          <label className="flex flex-col gap-[6px] text-[14px] font-[600] leading-[20px] text-[#344054]">
            Type the roll&rsquo;s code, {code}, to confirm
            <input
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              disabled={deleting}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              className="rounded-full border border-[#dadada] px-[12px] py-[8px] text-[14px] font-[400] leading-[20px] text-[#182230] outline-none focus:border-[#B42318]"
            />
          </label>
          {problem ? (
            <p
              role="alert"
              className="text-[14px] leading-[20px] text-[#B42318]">
              {problem}
            </p>
          ) : null}
          <div className="flex flex-wrap justify-end gap-[8px] pt-[4px]">
            <button
              type="button"
              onClick={close}
              disabled={deleting}
              className="rounded-full border border-[rgba(33,33,33,0.2)] px-[14px] py-[8px] text-[14px] font-[600] leading-[20px] text-[#344054] hover:bg-[#F9FAFB] disabled:opacity-60">
              Keep the roll
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={!armed || deleting}
              aria-busy={deleting}
              className="rounded-full bg-[#B42318] px-[14px] py-[8px] text-[14px] font-[600] leading-[20px] text-white hover:bg-[#912018] disabled:opacity-40">
              {deleting ? 'Deleting…' : 'Delete for good'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
