'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BookImage,
  Camera,
  ChevronDown,
  Gift,
  Heart,
  House,
  Lightbulb,
  LogOut,
  Menu,
  Newspaper,
  ScrollText,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { useMemoifyProfile, useMemoifySession } from '@/app/session-provider';
import { useCalmMotion } from '@/lib/use-calm-motion';
import { formatNumberWithComma } from '@/lib/utils';
import { WEDDING_RELEASED } from '@/lib/wedding-release';
import { removeSession } from '@/store/get-set-session';

/**
 * The site's navbar, in the MemoRoll design system (owner, 2026-11-17).
 *
 * What is where, as the owner agreed it:
 * - Products: everything Memoify makes, in one menu, each with a line
 *   saying what it is. A new product is a new row here, not a new tab.
 * - MemoRoll: also on the bar itself while it is new.
 * - Inspiration: on the bar. It is the easiest way in for somebody who
 *   does not know yet what to make.
 * - Upgrade: on the bar, to the checkout (see UPGRADE_DESTINATION).
 * - On a phone the same things are one flat list under Make / Explore /
 *   Account: a menu inside a menu costs a tap and hides what is there.
 *
 * The bar is 80px tall, its rule included, as before: pages are laid out
 * under it.
 *
 * Motion (emilkowalski/skills: animate):
 * - a menu grows from the button that opened it (scale 0.97 and a fade,
 *   160ms, strong ease-out) and leaves faster than it came. Under a real
 *   pointer Products opens on hover, with a moment's grace on the way to
 *   the panel; a tap or the keyboard opens it too;
 * - the phone's sheet slides in from the right while its backdrop fades;
 * - presses give under the finger (0.97); hover colour only for a pointer
 *   that can hover; reduced motion keeps the fades and drops the travel.
 */

/**
 * "Upgrade" goes to the checkout, with Premium already chosen (owner,
 * 2026-11-17). It names what the visitor gets, not the step they are on:
 * "Checkout" and "Payment" are names for a process. The plans side by side
 * are the pricing section of the home page, which the checkout links to.
 *
 * Nobody is made to sign in by this link: signed out, the checkout says so
 * and offers the sign-in button and the way to compare the plans.
 */
const UPGRADE_DESTINATION = '/payment?type=premium';

interface Product {
  key: string;
  href: string;
  name: string;
  says: string;
  icon: LucideIcon;
  badge?: string;
}

const PRODUCTS: Product[] = [
  {
    key: 'website-gift',
    href: '/templates',
    name: 'Website gifts',
    says: 'A page styled like a series, a playlist or a magazine',
    icon: Gift,
  },
  {
    key: 'scrapbook',
    href: '/scrapbook',
    name: 'Scrapbook',
    says: 'Your photos, laid out by Memo-AI',
    icon: BookImage,
  },
  {
    key: 'journal',
    href: '/journal',
    name: 'Journal',
    says: 'A letter written like a research paper',
    icon: ScrollText,
  },
  {
    key: 'memoroll',
    href: '/memoroll',
    name: 'MemoRoll',
    says: 'A camera for every guest at your event',
    icon: Camera,
    badge: 'NEW',
  },
  {
    key: 'photobox',
    href: '/photobox-newspaper',
    name: 'Photobox',
    says: 'A photobooth shot on a newspaper front page',
    icon: Newspaper,
  },
  // Not announced yet: see lib/wedding-release.ts.
  ...(WEDDING_RELEASED
    ? [
        {
          key: 'wedding',
          href: '/wedding-invitation',
          name: 'Wedding invitation',
          says: 'An invitation your guests open on their phone',
          icon: Heart,
        },
      ]
    : []),
];

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const press =
  'transition-transform duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]';
const barLink =
  'inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-full px-3 text-[15px] font-medium text-[#4a4642] transition-colors duration-200 [@media(hover:hover)_and_(pointer:fine)]:hover:text-[#1b1b1b]';

const NewBadge = ({ label }: { label: string }) => (
  <span className="ml-1.5 inline-flex items-center rounded-full bg-[#ff3e09] px-1.5 py-[3px] text-[10px] font-bold leading-none text-white">
    {label}
  </span>
);

/**
 * A menu under a button on the bar. Opens on a tap or the keyboard, and on
 * hover for a pointer that can hover; closes on a tap outside, Escape, or
 * a moment after the pointer has left both the button and the panel.
 */
function BarMenu({
  label,
  button,
  buttonClass,
  align = 'left',
  hover = false,
  width,
  children,
}: {
  label: string;
  button: ReactNode;
  buttonClass: string;
  align?: 'left' | 'right';
  hover?: boolean;
  width: string;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useCalmMotion();
  const root = useRef<HTMLDivElement>(null);
  const leaving = useRef<ReturnType<typeof setTimeout>>();
  const canHover = useRef(false);

  useEffect(() => {
    canHover.current = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches;
  }, []);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(leaving.current), []);

  const enter = () => {
    if (!hover || !canHover.current) return;
    clearTimeout(leaving.current);
    setOpen(true);
  };
  const leave = () => {
    if (!hover || !canHover.current) return;
    // Long enough to cross the gap between the button and the panel.
    leaving.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div
      ref={root}
      className="relative"
      onPointerEnter={enter}
      onPointerLeave={leave}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        onClick={(event) => {
          // A pointer that hovers has already opened it by arriving: its
          // click must not close it again. The keyboard (detail 0) and a
          // finger still toggle.
          if (hover && canHover.current && event.detail > 0) setOpen(true);
          else setOpen((value) => !value);
        }}
        className={buttonClass}>
        {button}
        <ChevronDown
          size={14}
          aria-hidden
          className={`transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            // Grows from the button it belongs to, not from its own middle.
            style={{
              transformOrigin: align === 'left' ? 'top left' : 'top right',
            }}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, transform: 'translateY(-4px) scale(0.97)' }
            }
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, transform: 'translateY(0px) scale(1)' }
            }
            exit={{ opacity: 0, transition: { duration: 0.11 } }}
            transition={{ duration: 0.16, ease: EASE_OUT }}
            className={`absolute top-[calc(100%+8px)] z-[120] rounded-[20px] border border-[#e8ded3] bg-[#fffdfa] p-2 shadow-[0_24px_48px_-20px_rgba(90,42,18,0.35)] ${width} ${
              align === 'left' ? 'left-0' : 'right-0'
            }`}>
            {children(() => setOpen(false))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ProductRow({
  product,
  onPick,
}: {
  product: Product;
  onPick: () => void;
}) {
  const Icon = product.icon;
  return (
    <Link
      href={product.href}
      onClick={onPick}
      className="flex items-center gap-3 rounded-[14px] p-2.5 transition-colors duration-150 active:bg-[#f5ece1] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#fbf4ec]">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-[#fff0e9]">
        <Icon size={19} aria-hidden className="text-[#e34013]" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center text-[15px] font-semibold text-[#1b1b1b]">
          {product.name}
          {product.badge ? <NewBadge label={product.badge} /> : null}
        </span>
        <span className="mt-0.5 block text-[13px] leading-[1.35] text-[#6b655f]">
          {product.says}
        </span>
      </span>
    </Link>
  );
}

const NavigationBar = () => {
  const [sidebar, setSidebar] = useState(false);
  const session = useMemoifySession();
  const userProfile = useMemoifyProfile();
  const pathname = usePathname();
  const reduce = useCalmMotion();

  const isLoggedIn = Boolean(session.accessToken);
  const displayName = userProfile?.fullname || session.fullName || 'Account';
  const email = userProfile?.email || session.email || '';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'M';
  const shortName = displayName.trim().split(/\s+/)[0];
  const credits = formatNumberWithComma(userProfile?.quota || 0);
  const tokens = formatNumberWithComma(userProfile?.token_scrapbook || 0);

  useEffect(() => {
    if (!sidebar) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebar(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [sidebar]);

  // Arriving somewhere closes the sheet, however the visitor got there.
  useEffect(() => setSidebar(false), [pathname]);

  const logOut = async () => {
    await removeSession();
    window.location.href = '/';
  };

  const here = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);
  const onBar = (href: string) =>
    `${barLink} ${here(href) ? '!text-[#1b1b1b] font-semibold' : ''}`;

  const avatar = (size: string) => (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#1b1b1b] font-semibold text-[#fbf4ec] ${size}`}>
      {initial}
    </span>
  );

  /** What the account holds, and the way to more of it. */
  const balance = (onPick: () => void) => (
    <div className="flex items-center justify-between gap-3 rounded-[14px] bg-[#fbf4ec] px-3 py-2.5">
      <p className="text-[13px] leading-[1.4] text-[#4a4642]">
        <span className="font-semibold text-[#1b1b1b]">{credits}</span> credit
        {credits === '1' ? '' : 's'} ·{' '}
        <span className="font-semibold text-[#1b1b1b]">{tokens}</span> token
        {tokens === '1' ? '' : 's'}
      </p>
      <Link
        href={UPGRADE_DESTINATION}
        onClick={onPick}
        className="shrink-0 text-[13px] font-semibold text-[#e34013] underline underline-offset-2">
        Get more
      </Link>
    </div>
  );

  const menuRow =
    'flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-[15px] font-medium text-[#1b1b1b] transition-colors duration-150 active:bg-[#f5ece1] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#fbf4ec]';

  return (
    <header className="relative isolate z-[100] h-20 border-b border-[#e8ded3] bg-[#fffdfa]">
      <div
        suppressHydrationWarning
        className="flex h-full w-full items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-4 xl:gap-6">
          <Link href="/" className="shrink-0" aria-label="Memoify home">
            <Image
              src="https://res.cloudinary.com/dfwrmapr4/image/upload/v1789303095/placeholder/69b085d3b98c04a8b06e3e58ecfa136e95641109_ynodbj.png"
              alt="Memoify"
              width={40}
              height={40}
              priority
            />
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Primary navigation">
            <BarMenu
              label="Products"
              hover
              width="w-[340px]"
              buttonClass={barLink}
              button="Products">
              {(close) => (
                <div className="flex flex-col">
                  {PRODUCTS.map((product) => (
                    <ProductRow
                      key={product.key}
                      product={product}
                      onPick={close}
                    />
                  ))}
                </div>
              )}
            </BarMenu>
            <Link href="/memoroll" className={onBar('/memoroll')}>
              MemoRoll
              <NewBadge label="NEW" />
            </Link>
            <Link href="/inspiration" className={onBar('/inspiration')}>
              Inspiration
            </Link>
            <Link href={UPGRADE_DESTINATION} className={onBar('/payment')}>
              Upgrade
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <div className="hidden sm:block">
              <BarMenu
                label={`Open account menu for ${displayName}`}
                align="right"
                width="w-[280px]"
                buttonClass={`inline-flex h-10 items-center gap-2 rounded-full border border-[rgba(33,33,33,0.16)] bg-[#fffdfa] pl-1 pr-2.5 text-[#4a4642] ${press}`}
                button={
                  <>
                    {avatar('size-8 text-[13px]')}
                    <span className="hidden max-w-24 truncate text-[14px] font-semibold text-[#1b1b1b] xl:inline">
                      {shortName}
                    </span>
                  </>
                }>
                {(close) => (
                  <div className="flex flex-col gap-1">
                    <div className="min-w-0 px-3 pb-1 pt-2">
                      <p className="truncate text-[15px] font-semibold capitalize text-[#1b1b1b]">
                        {displayName.toLowerCase()}
                      </p>
                      <p className="truncate text-[13px] text-[#6b655f]">
                        {email}
                      </p>
                    </div>
                    {balance(close)}
                    <Link href="/dashboard" onClick={close} className={menuRow}>
                      <House size={17} aria-hidden className="text-[#6b655f]" />
                      Dashboard
                    </Link>
                    <Link
                      href={UPGRADE_DESTINATION}
                      onClick={close}
                      className={menuRow}>
                      <Zap size={17} aria-hidden className="text-[#6b655f]" />
                      Upgrade plan
                    </Link>
                    <span className="mx-2 my-1 h-px bg-[#e8ded3]" />
                    <button
                      type="button"
                      onClick={logOut}
                      className={`${menuRow} !text-[#c2330b]`}>
                      <LogOut size={17} aria-hidden />
                      Log out
                    </button>
                  </div>
                )}
              </BarMenu>
            </div>
          ) : (
            <button
              type="button"
              className={`hidden h-10 items-center rounded-full border border-[rgba(33,33,33,0.2)] bg-[#fffdfa] px-4 text-[14px] font-semibold text-[#1b1b1b] lg:inline-flex ${press}`}
              onClick={() => signIn('google')}>
              Sign in
            </button>
          )}

          <Link
            href="/create"
            prefetch
            className={`hidden h-10 items-center gap-2 rounded-full bg-[#ff3e09] px-4 text-[14px] font-semibold text-white shadow-[inset_2px_3px_3.2px_rgba(255,255,255,0.25)] md:inline-flex ${press}`}>
            <Gift size={16} aria-hidden="true" />
            Create a gift
          </Link>

          <button
            type="button"
            aria-label={sidebar ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebar}
            aria-controls="mobile-navigation"
            className={`inline-flex size-10 items-center justify-center rounded-full border border-[rgba(33,33,33,0.16)] text-[#1b1b1b] lg:hidden ${press}`}
            onClick={() => setSidebar((isOpen) => !isOpen)}>
            {sidebar ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {sidebar ? (
          <div className="fixed inset-x-0 bottom-0 top-[calc(5rem+var(--site-strip,0px))] z-[110] lg:hidden">
            <motion.button
              type="button"
              aria-label="Close navigation"
              className="absolute inset-0 bg-[#1b1b1b]/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebar(false)}
            />
            <motion.aside
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className="absolute bottom-0 right-0 top-0 flex w-full max-w-[380px] flex-col border-l border-[#e8ded3] bg-[#fffdfa]"
              initial={
                reduce ? { opacity: 0 } : { transform: 'translateX(100%)' }
              }
              animate={
                reduce ? { opacity: 1 } : { transform: 'translateX(0%)' }
              }
              exit={
                reduce
                  ? { opacity: 0 }
                  : {
                      transform: 'translateX(100%)',
                      transition: { duration: 0.2, ease: EASE_OUT },
                    }
              }
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}>
              <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
                <Link
                  href="/create"
                  onClick={() => setSidebar(false)}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ff3e09] px-4 text-[16px] font-semibold text-white shadow-[inset_2px_3px_3.2px_rgba(255,255,255,0.25)] ${press}`}>
                  <Gift size={17} aria-hidden />
                  Create a gift
                </Link>

                <p className="mb-1 mt-6 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a847d]">
                  Make
                </p>
                <div className="flex flex-col">
                  {PRODUCTS.map((product) => (
                    <ProductRow
                      key={product.key}
                      product={product}
                      onPick={() => setSidebar(false)}
                    />
                  ))}
                </div>

                <p className="mb-1 mt-6 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a847d]">
                  Explore
                </p>
                <Link
                  href="/inspiration"
                  onClick={() => setSidebar(false)}
                  className={menuRow}>
                  <Lightbulb size={17} aria-hidden className="text-[#e34013]" />
                  Inspiration
                </Link>

                <p className="mb-1 mt-6 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a847d]">
                  Account
                </p>
                {isLoggedIn ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 px-3 py-2">
                      {avatar('size-10 text-[15px]')}
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold capitalize text-[#1b1b1b]">
                          {displayName.toLowerCase()}
                        </p>
                        <p className="truncate text-[13px] text-[#6b655f]">
                          {email}
                        </p>
                      </div>
                    </div>
                    {balance(() => setSidebar(false))}
                    <Link
                      href="/dashboard"
                      onClick={() => setSidebar(false)}
                      className={menuRow}>
                      <House size={17} aria-hidden className="text-[#6b655f]" />
                      Dashboard
                    </Link>
                    <Link
                      href={UPGRADE_DESTINATION}
                      onClick={() => setSidebar(false)}
                      className={menuRow}>
                      <Zap size={17} aria-hidden className="text-[#6b655f]" />
                      Upgrade
                    </Link>
                    <button
                      type="button"
                      onClick={logOut}
                      className={`${menuRow} !text-[#c2330b]`}>
                      <LogOut size={17} aria-hidden />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <Link
                      href={UPGRADE_DESTINATION}
                      onClick={() => setSidebar(false)}
                      className={menuRow}>
                      <Zap size={17} aria-hidden className="text-[#e34013]" />
                      Upgrade
                    </Link>
                    <button
                      type="button"
                      className={`mt-2 h-12 w-full rounded-full border border-[rgba(33,33,33,0.2)] bg-[#fffdfa] text-[16px] font-semibold text-[#1b1b1b] ${press}`}
                      onClick={() => signIn('google')}>
                      Sign in with Google
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default NavigationBar;
