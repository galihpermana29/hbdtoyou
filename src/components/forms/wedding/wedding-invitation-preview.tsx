'use client';

import { Eye, PlayCircle } from 'lucide-react';
import type { FormInstance } from 'antd';
import { Form } from 'antd';
import { useRef, useState } from 'react';

import {
  flowActionPlayPreview,
  flowPreviewHeading,
  flowPreviewPanel,
  flowPreviewScreen,
  flowPreviewTray,
} from './create-flow-treatment';
import WeddingTemplate1 from '@/components/wedding/wedding-template-1/WeddingTemplate1';

import InvitationPlayer from './invitation-player';
import { formValuesToContent } from './wedding-invitation-types';
import type { WeddingInvitationFormValues } from './wedding-invitation-types';

/**
 * The Site Preview: the couple's invitation as it stands, beside the form.
 *
 * It is a picture of the invitation rather than the invitation being received,
 * so it is drawn open and still - nothing is sealed behind the envelope and
 * nothing reveals itself on scroll. Play Preview is the other half of that: it
 * opens the same content as the Invitation Viewer, sealed, the way a guest gets
 * it.
 *
 * The panel is the design's `<figure>` resting in its tray, and the invitation
 * inside is the couple's own, so the tray, its corner and its inset are the
 * design's to state while nothing on the glass is. The design's mockup also
 * prints phone furniture - a status bar reading 9:41 - which is deliberately not
 * drawn; see `flowPreviewScreen`.
 */

export interface WeddingInvitationPreviewProps {
  form: FormInstance<WeddingInvitationFormValues>;
}

export default function WeddingInvitationPreview({
  form,
}: WeddingInvitationPreviewProps) {
  const values = Form.useWatch([], form);
  const content = formValuesToContent(values);

  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef<HTMLButtonElement>(null);

  return (
    <aside aria-label="Site Preview" className={flowPreviewPanel}>
      {/* The design gives this row the height of the taller of the two things
          in it, and centres the heading against the action beside it. */}
      <div className="flex h-[40px] items-center justify-between">
        <div className="flex items-center gap-[4px]">
          <Eye size={20} aria-hidden="true" className="text-[#1B1B1B]" />
          <p className={flowPreviewHeading}>Site Preview</p>
        </div>

        {/* A button rather than a link: the invitation opens over this page, so
            the couple keeps the form they are in the middle of filling in. */}
        <button
          ref={playRef}
          type="button"
          onClick={() => setIsPlaying(true)}
          className={flowActionPlayPreview}>
          Play Preview
          <PlayCircle size={20} aria-hidden="true" />
        </button>
      </div>

      {/* The design's 812px is what the phone is when there is room for it. The
          panel sticks to the top of a form thousands of pixels long, so on a
          screen too short to hold all of it the glass gives way rather than
          hanging past the bottom of the window where nothing can reach it. */}
      <figure className={flowPreviewTray}>
        <div className={`${flowPreviewScreen} lg:max-h-[calc(100vh-200px)]`}>
          <WeddingTemplate1 content={content} />
        </div>
      </figure>

      {isPlaying ? (
        <InvitationPlayer
          content={content}
          onClose={() => {
            setIsPlaying(false);
            playRef.current?.focus();
          }}
        />
      ) : null}
    </aside>
  );
}
