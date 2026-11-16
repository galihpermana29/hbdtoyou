'use client';

import type { FormInstance } from 'antd';
import { Button, Modal, message } from 'antd';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { getPromotedCoupon } from '@/action/user-api';
import { useMemoifyProfile } from '@/app/session-provider';
import { setAfterPayment } from '@/lib/after-payment';
import { balanceOf, needsBalance, type Kind } from '@/lib/plan-limits';

/**
 * The paywall, at the creator's Create - not at the recipient's link (owner,
 * 2026-11-17).
 *
 * Before: a free account could fill and publish a premium template; the
 * backend kept it as `status: locked`, the recipient opened a blurred page,
 * and - measured live on 2026-11-17 - that locked gift also reset the free
 * account's 24-hour allowance. Now a premium template on an account with no
 * credit (gift) or token (scrapbook) never reaches the backend: what was
 * written is kept on this device, and the person is offered Premium or a
 * free template. Coming back to the same template with a credit, the form
 * fills itself again.
 *
 * An account with a balance is told what the create spends before it
 * spends it: the backend takes one credit for EVERY gift such an account
 * makes, free template or not (measured live, 2026-11-17).
 *
 * Editing an existing gift is never gated: it is already made.
 */

const KEPT_FOR_MS = 7 * 24 * 60 * 60 * 1000;
const keptKey = (templateId: string) => `memoify:kept-draft:${templateId}`;

function keep(templateId: string, values: unknown) {
  try {
    window.localStorage.setItem(
      keptKey(templateId),
      JSON.stringify({ at: Date.now(), values })
    );
  } catch {
    // No room or no storage: the paywall still stands, the words are lost.
  }
}

function takeKept(templateId: string): Record<string, unknown> | null {
  try {
    const raw = window.localStorage.getItem(keptKey(templateId));
    if (!raw) return null;
    window.localStorage.removeItem(keptKey(templateId));
    const kept = JSON.parse(raw) as {
      at: number;
      values: Record<string, unknown>;
    };
    return Date.now() - kept.at < KEPT_FOR_MS ? kept.values : null;
  } catch {
    return null;
  }
}

type Ask = 'paywall' | 'spend' | null;

export function usePremiumGate({
  form,
  template,
  kind = 'gift',
  editing = false,
}: {
  form: FormInstance;
  template: { id: string; label?: string } | null | undefined;
  kind?: Kind;
  editing?: boolean;
}): { allow: (values: unknown) => Promise<boolean>; ui: ReactNode } {
  const profile = useMemoifyProfile();
  const [ask, setAsk] = useState<Ask>(null);
  const [coupon, setCoupon] = useState<string | null>(null);
  const answer = useRef<((go: boolean) => void) | null>(null);
  const unit = kind === 'gift' ? 'credit' : 'token';
  const balance = balanceOf(profile, kind);

  // What was written before the paywall comes back once there is something
  // to spend on it.
  useEffect(() => {
    if (editing || !template?.id || needsBalance(profile, template.label, kind))
      return;
    const kept = takeKept(template.id);
    if (!kept) return;
    form.setFieldsValue(kept);
    message.success('Welcome back - we kept what you wrote.');
    // Once per template and account state; `profile` changes when a
    // purchase lands.
  }, [
    template?.id,
    template?.label,
    editing,
    profile?.quota,
    profile?.token_scrapbook,
  ]);

  useEffect(() => {
    if (ask !== 'paywall') return;
    let cancelled = false;
    getPromotedCoupon().then((res) => {
      if (!cancelled && res.success && res.data) setCoupon(res.data.code);
    });
    return () => {
      cancelled = true;
    };
  }, [ask]);

  const settle = (go: boolean) => {
    setAsk(null);
    answer.current?.(go);
    answer.current = null;
  };

  const allow = async (values: unknown) => {
    if (editing || !template?.id) return true;
    if (needsBalance(profile, template.label, kind)) {
      keep(template.id, values);
      setAsk('paywall');
      return false;
    }
    if (balance < 1) return true;
    setAsk('spend');
    return new Promise<boolean>((resolve) => {
      answer.current = resolve;
    });
  };

  const returnTo =
    kind === 'gift'
      ? `/create?template=${template?.id ?? ''}`
      : `/scrapbook/create?templateId=${template?.id ?? ''}`;

  const ui = (
    <>
      <Modal
        open={ask === 'paywall'}
        onCancel={() => settle(false)}
        footer={null}
        centered
        title="This template is Premium">
        <p className="text-[14px] text-gray-700">
          Your {kind} is ready to go - we kept everything you wrote on this
          device. Publishing a Premium template takes 1 {unit}, and you have
          none yet.
        </p>
        {coupon ? (
          <p className="mt-3 rounded-full border border-dashed border-[#E34013] bg-[#FEF3F0] px-4 py-2 text-center text-[13px] text-[#7B4034]">
            Use code{' '}
            <span className="font-mono font-bold text-[#E34013]">{coupon}</span>{' '}
            at checkout
          </p>
        ) : null}
        <div className="mt-5 flex flex-col gap-2">
          <Link
            href="/payment?type=premium"
            onClick={() => setAfterPayment(returnTo)}
            className="flex h-[44px] items-center justify-center rounded-full !bg-[#E34013] font-semibold !text-white">
            Get Premium and publish
          </Link>
          <Link
            href={kind === 'gift' ? '/templates' : '/scrapbook/create'}
            className="flex h-[44px] items-center justify-center rounded-full border border-black font-semibold !text-black">
            Pick a free template instead
          </Link>
        </div>
      </Modal>
      <Modal
        open={ask === 'spend'}
        onCancel={() => settle(false)}
        centered
        title={`This uses 1 ${unit}`}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => settle(false)} className="mr-outline">
              Not yet
            </Button>
            <Button
              type="primary"
              onClick={() => settle(true)}
              className="mr-cta">
              Use 1 {unit}
            </Button>
          </div>
        }>
        <p className="text-[14px] text-gray-700">
          You have {balance} {balance === 1 ? unit : `${unit}s`}. Making this{' '}
          {kind} spends one of them.
        </p>
      </Modal>
    </>
  );

  return { allow, ui };
}
