'use client';

import { Avatar, Dropdown, MenuProps } from 'antd';
import {
  BadgeDollarSign,
  Camera,
  ChevronDown,
  Gift,
  House,
  Lightbulb,
  LogOut,
  Menu,
  Settings2,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  useMemoifyProfile,
  useMemoifySession,
} from '@/app/session-provider';
import { formatNumberWithComma } from '@/lib/utils';
import { removeSession } from '@/store/get-set-session';

type NavItem = {
  key: string;
  href: string;
  desktopLabel: string;
  mobileLabel: string;
};

const PRIMARY_LINKS: NavItem[] = [
  {
    key: 'website-gift',
    href: '/templates',
    desktopLabel: 'Website gift',
    mobileLabel: 'Website gift',
  },
  {
    key: 'scrapbook',
    href: '/scrapbook',
    desktopLabel: 'Scrapbook',
    mobileLabel: 'Digital scrapbook',
  },
  {
    key: 'journal',
    href: '/journal',
    desktopLabel: 'Journal',
    mobileLabel: 'Personal journal',
  },
];

const FEATURE_LINKS: NavItem[] = [
  {
    key: 'photobox',
    href: '/photobox-newspaper',
    desktopLabel: 'Photobox',
    mobileLabel: 'Newspaper photobox',
  },
  {
    key: 'inspiration',
    href: '/inspiration',
    desktopLabel: 'Inspiration',
    mobileLabel: 'Gift inspiration',
  },
];

const NavigationBar = () => {
  const [sidebar, setSidebar] = useState(false);
  const session = useMemoifySession();
  const userProfile = useMemoifyProfile();
  const router = useRouter();
  const isLoggedIn = Boolean(session.accessToken);
  const displayName = userProfile?.fullname || session.fullName || 'Account';
  const email = userProfile?.email || session.email || '';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'M';
  const shortName = displayName.trim().split(/\s+/)[0];

  const openPricing = () => {
    setSidebar(false);
    if (isLoggedIn) {
      router.push('/payment');
      return;
    }

    signIn('google', { callbackUrl: '/payment' });
  };

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

  const accountItems: MenuProps['items'] = [
    {
      key: 'account-summary',
      disabled: true,
      label: (
        <div className="min-w-0 py-1">
          <p className="truncate text-[14px] font-semibold capitalize text-[#344054]">
            {displayName.toLowerCase()}
          </p>
          <p className="max-w-[240px] truncate text-[13px] text-[#667085]">
            {email}
          </p>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <House size={17} className="text-[#667085]" />,
      onClick: () => router.push('/dashboard'),
    },
    {
      key: 'upgrade',
      label: 'Upgrade plan',
      icon: <Zap size={17} className="text-[#667085]" />,
      onClick: () => router.push('/payment'),
    },
    {
      key: 'credit',
      label: `${formatNumberWithComma(userProfile?.quota || 0)} Credit`,
      icon: <BadgeDollarSign size={17} className="text-[#667085]" />,
      disabled: true,
    },
    {
      key: 'token',
      label: `${formatNumberWithComma(
        userProfile?.token_scrapbook || 0
      )} Token`,
      icon: <Settings2 size={17} className="text-[#667085]" />,
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'logout',
      danger: true,
      label: 'Log out',
      icon: <LogOut size={17} />,
      onClick: async () => {
        await removeSession();
        window.location.href = '/';
      },
    },
  ];

  const featureItems: MenuProps['items'] = FEATURE_LINKS.map((link) => ({
    key: link.key,
    label: (
      <Link
        href={link.href}
        className="flex min-w-[170px] items-center gap-3 py-1">
        {link.key === 'photobox' ? (
          <Camera size={17} className="text-[#E34013]" />
        ) : (
          <Lightbulb size={17} className="text-[#E34013]" />
        )}
        <span>{link.desktopLabel}</span>
      </Link>
    ),
  }));

  return (
    <header className="relative isolate z-[100] h-20 border-b border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div
        suppressHydrationWarning
        className="flex h-full w-full items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-5 xl:gap-7">
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
            className="hidden items-center gap-4 text-[14px] xl:flex 2xl:gap-6"
            aria-label="Primary navigation">
            <Link
              href="/wedding-invitation"
              className="whitespace-nowrap font-medium text-[#667085] transition-colors hover:text-[#1B1B1B]">
              Wedding
            </Link>

            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="whitespace-nowrap font-medium text-[#667085] transition-colors hover:text-[#1B1B1B]">
                {link.desktopLabel}
              </Link>
            ))}

            <Dropdown
              menu={{ items: featureItems }}
              trigger={['hover']}
              placement="bottomLeft">
              <button
                type="button"
                className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-[#667085] transition-colors hover:text-[#1B1B1B]">
                Features
                <ChevronDown size={14} aria-hidden="true" />
              </button>
            </Dropdown>

            <button
              type="button"
              onClick={openPricing}
              className="whitespace-nowrap font-medium text-[#667085] transition-colors hover:text-[#1B1B1B]">
              Pricing
            </button>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <Dropdown
              menu={{ items: accountItems }}
              trigger={['click']}
              placement="bottomRight">
              <button
                type="button"
                aria-label={`Open account menu for ${displayName}`}
                className="hidden h-10 items-center gap-2 rounded-full border border-[#EAECF0] bg-white pl-1 pr-2 transition-colors hover:bg-[#F9FAFB] sm:inline-flex">
                <Avatar size={32}>{initial}</Avatar>
                <span className="hidden max-w-20 truncate text-[13px] font-semibold text-[#344054] 2xl:inline">
                  {shortName}
                </span>
                <ChevronDown
                  size={14}
                  className="text-[#667085]"
                  aria-hidden="true"
                />
              </button>
            </Dropdown>
          ) : (
            <button
              type="button"
              className="hidden h-10 items-center rounded-lg border border-[#D0D5DD] px-4 text-[14px] font-semibold text-[#344054] transition-colors hover:bg-[#F9FAFB] lg:inline-flex"
              onClick={() => signIn('google')}>
              Sign in
            </button>
          )}

          <Link
            href="/create"
            prefetch
            className="hidden h-10 items-center gap-2 rounded-lg bg-[#E34013] px-4 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#C9340E] md:inline-flex">
            <Gift size={16} aria-hidden="true" />
            Create a gift
          </Link>

          <button
            type="button"
            aria-label={sidebar ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebar}
            aria-controls="mobile-navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#EAECF0] text-[#344054] transition-colors hover:bg-[#F9FAFB] xl:hidden"
            onClick={() => setSidebar((isOpen) => !isOpen)}>
            {sidebar ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {sidebar ? (
        <div className="fixed inset-x-0 bottom-0 top-20 z-[110] xl:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-[#101828]/35 backdrop-blur-[2px]"
            onClick={() => setSidebar(false)}
          />
          <aside
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="absolute bottom-0 right-0 top-0 flex w-full max-w-[380px] flex-col border-l border-[#EAECF0] bg-white shadow-2xl">
            <div className="flex-1 overflow-y-auto px-5 py-6">
              {isLoggedIn ? (
                <Dropdown
                  menu={{ items: accountItems }}
                  trigger={['click']}
                  placement="bottomLeft">
                  <button
                    type="button"
                    className="mb-6 flex w-full items-center gap-3 rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-3 text-left">
                    <Avatar size={38}>{initial}</Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-[#344054]">
                        {displayName}
                      </p>
                      <p className="text-[12px] text-[#667085]">
                        View account
                      </p>
                    </div>
                    <ChevronDown size={16} className="text-[#667085]" />
                  </button>
                </Dropdown>
              ) : null}

              <div className="mb-6">
                <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#98A2B3]">
                  Create
                </p>
                <div className="space-y-1">
                  <Link
                    href="/wedding-invitation"
                    onClick={() => setSidebar(false)}
                    className="block rounded-lg px-3 py-2.5 text-[15px] font-semibold text-[#344054] transition-colors hover:bg-[#F9FAFB]">
                    Wedding invitations
                  </Link>
                  {PRIMARY_LINKS.map((link) => (
                    <Link
                      key={link.key}
                      href={link.href}
                      onClick={() => setSidebar(false)}
                      className="block rounded-lg px-3 py-2.5 text-[15px] font-semibold text-[#344054] transition-colors hover:bg-[#F9FAFB]">
                      {link.mobileLabel}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#98A2B3]">
                  Explore
                </p>
                <div className="space-y-1">
                  {FEATURE_LINKS.map((link) => (
                    <Link
                      key={link.key}
                      href={link.href}
                      onClick={() => setSidebar(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-semibold text-[#344054] transition-colors hover:bg-[#F9FAFB]">
                      {link.key === 'photobox' ? (
                        <Camera size={17} className="text-[#E34013]" />
                      ) : (
                        <Sparkles size={17} className="text-[#E34013]" />
                      )}
                      {link.mobileLabel}
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={openPricing}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] font-semibold text-[#344054] transition-colors hover:bg-[#F9FAFB]">
                    <BadgeDollarSign size={17} className="text-[#E34013]" />
                    Pricing
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-[#EAECF0] bg-white p-5">
              <Link
                href="/create"
                onClick={() => setSidebar(false)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#E34013] px-4 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[#C9340E]">
                <Gift size={17} />
                Create a gift
              </Link>
              {!isLoggedIn ? (
                <button
                  type="button"
                  className="mt-2 h-11 w-full rounded-lg text-[14px] font-semibold text-[#475467] transition-colors hover:bg-[#F9FAFB]"
                  onClick={() => signIn('google')}>
                  Sign in
                </button>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  );
};

export default NavigationBar;
