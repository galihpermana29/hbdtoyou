'use client';

import { IAllTemplateResponse } from '@/action/interfaces';
import NavigationBar from '@/components/ui/navbar';
import { templateThumbnail } from '@/lib/template-thumbnail';
import {
  getTemplateCategory,
  getTemplateCreateHref,
  getTemplateDescription,
  getTemplateDisplayName,
  getTemplatePreviewHref,
  getTemplateTileSize,
  isTemplateComingSoon,
  rankTemplates,
  TEMPLATE_CATEGORY_ORDER,
  TemplateCategory,
  TemplateTileSize,
  visibleTemplates,
} from '@/lib/template-catalog';
import clsx from 'clsx';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type CategoryFilter = 'All' | TemplateCategory;

const tileClasses: Record<TemplateTileSize, string> = {
  large: 'md:col-span-6 lg:col-span-6 md:min-h-[600px] lg:min-h-[620px]',
  medium: 'md:col-span-6 lg:col-span-6 md:min-h-[500px] lg:min-h-[500px]',
  small: 'md:col-span-6 lg:col-span-4 md:min-h-[450px] lg:min-h-[440px]',
};

const imageClasses: Record<TemplateTileSize, string> = {
  large: 'min-h-[280px] md:min-h-[390px]',
  medium: 'min-h-[260px] md:min-h-[300px]',
  small: 'min-h-[240px] md:min-h-[250px]',
};

function TemplateArtwork({
  template,
  size,
}: {
  template: IAllTemplateResponse;
  size: TemplateTileSize;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const thumbnail = templateThumbnail(template);

  return (
    <div
      className={clsx(
        'relative mt-7 flex flex-1 items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-[#f3ebe6] via-[#f8f6f2] to-[#e6e8ec]',
        imageClasses[size]
      )}
    >
      {thumbnail && !imageFailed ? (
        <img
          src={thumbnail}
          alt={`${getTemplateDisplayName(template)} preview`}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-8 text-center">
          <span className="max-w-[280px] text-3xl font-semibold tracking-[-0.04em] text-[#303238] md:text-4xl">
            {getTemplateDisplayName(template)}
          </span>
        </div>
      )}
    </div>
  );
}

function TemplateCard({
  template,
  size,
}: {
  template: IAllTemplateResponse;
  size: TemplateTileSize;
}) {
  const previewHref = getTemplatePreviewHref(template);
  const comingSoon = isTemplateComingSoon(template);

  return (
    <article
      className={clsx(
        'group flex min-h-[440px] flex-col overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(28,28,30,0.08)] md:p-6',
        tileClasses[size]
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {comingSoon ? (
              <span className="rounded-full bg-[#fff1e8] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#d54a1f]">
                Soon
              </span>
            ) : template.category === 'popular' ? (
              <span className="text-xs font-semibold text-[#e34013]">
                Popular
              </span>
            ) : null}
            {template.label === 'premium' ? (
              <span className="rounded-full bg-[#f3f3f5] px-2.5 py-1 text-[11px] font-semibold text-[#626269]">
                Premium
              </span>
            ) : null}
          </div>
          <p className="text-xs font-semibold text-[#5f6066]">
            {getTemplateCategory(template)}
          </p>
          <h2
            className={clsx(
              'mt-2 font-semibold leading-[1.08] tracking-[-0.035em] text-[#1d1d1f]',
              size === 'large' ? 'text-3xl md:text-[38px]' : 'text-2xl'
            )}
          >
            {getTemplateDisplayName(template)}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6e6e73]">
            {getTemplateDescription(template)}
          </p>
        </div>

        {previewHref ? (
          <Link
            href={previewHref}
            target="_blank"
            aria-label={`Preview ${getTemplateDisplayName(template)}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0f1f3] text-[#1d1d1f] transition hover:bg-[#e34013] hover:text-white"
          >
            <ArrowUpRight size={19} strokeWidth={2.2} />
          </Link>
        ) : null}
      </div>

      {previewHref ? (
        <Link
          href={previewHref}
          target="_blank"
          className="flex flex-1"
          aria-label={`Open ${getTemplateDisplayName(template)} preview`}
        >
          <TemplateArtwork template={template} size={size} />
        </Link>
      ) : (
        <TemplateArtwork template={template} size={size} />
      )}

      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-[#8a8a90]">
          {previewHref
            ? 'Interactive preview available'
            : 'Preview coming soon'}
        </span>
        {comingSoon ? (
          <span className="text-sm font-semibold text-[#8a8a90]">
            Coming soon
          </span>
        ) : (
          <Link
            href={getTemplateCreateHref(template)}
            className="shrink-0 rounded-full bg-[#1d1d1f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e34013]"
          >
            Use this
          </Link>
        )}
      </div>
    </article>
  );
}

const NewTemplates = ({ data }: { data: IAllTemplateResponse[] }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');

  const catalog = useMemo(() => rankTemplates(visibleTemplates(data)), [data]);
  const categories = useMemo(
    () =>
      TEMPLATE_CATEGORY_ORDER.filter((category) =>
        catalog.some((template) => getTemplateCategory(template) === category)
      ),
    [catalog]
  );
  const filteredTemplates = useMemo(
    () =>
      activeCategory === 'All'
        ? catalog
        : catalog.filter(
            (template) => getTemplateCategory(template) === activeCategory
          ),
    [activeCategory, catalog]
  );

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <NavigationBar />

      <main>
        <section className="px-5 pb-14 pt-16 text-center md:pb-20 md:pt-24">
          <div className="mx-auto max-w-4xl">
            <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#e34013] shadow-sm">
              <Sparkles size={15} />
              Made for every kind of memory
            </div>
            <h1 className="text-[42px] font-semibold leading-[1.02] tracking-[-0.055em] text-[#1d1d1f] md:text-6xl lg:text-7xl">
              Pick a feeling.
              <br />
              Make it unforgettable.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#6e6e73] md:text-xl md:leading-8">
              Explore website gifts, scrapbooks and keepsakes designed to turn
              your favorite moments into something worth sharing.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-20 md:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#e34013]">
                Template collection
              </p>
              <h2 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[#1d1d1f] md:text-4xl">
                Find your story.
              </h2>
            </div>

            <div
              className="flex max-w-full gap-2 overflow-x-auto pb-1"
              role="group"
              aria-label="Filter templates by category"
            >
              {(['All', ...categories] as CategoryFilter[]).map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                  className={clsx(
                    'shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition',
                    activeCategory === category
                      ? 'bg-[#1d1d1f] text-white'
                      : 'bg-white text-[#515156] hover:bg-[#e9e9ec]'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5 lg:gap-6">
              {filteredTemplates.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  size={getTemplateTileSize(index)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] bg-white px-6 py-20 text-center">
              <p className="text-lg font-semibold text-[#1d1d1f]">
                No templates in this category yet.
              </p>
              <p className="mt-2 text-sm text-[#6e6e73]">
                New designs will appear here as soon as they join the catalog.
              </p>
            </div>
          )}
        </section>

        <section className="px-4 pb-8 md:px-6">
          <div className="mx-auto flex max-w-[1376px] flex-col items-start justify-between gap-6 rounded-[28px] bg-[#1d1d1f] px-7 py-10 text-white md:flex-row md:items-center md:px-12 md:py-12">
            <div>
              <p className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                Your memory, your way.
              </p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#b8b8bd] md:text-base">
                Choose a template and make a thoughtful digital gift in minutes.
              </p>
            </div>
            <Link
              href="/create"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1d1d1f] transition hover:bg-[#e34013] hover:text-white"
            >
              Start creating
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NewTemplates;
