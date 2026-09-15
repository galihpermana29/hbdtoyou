import { IAllTemplateResponse } from '@/action/interfaces';
import { templateRoute } from '@/lib/template-thumbnail';

export type TemplateCategory =
  'Website gift' | 'Scrapbook' | 'Photobox' | 'Journal' | 'Wedding';

export type TemplateTileSize = 'large' | 'medium' | 'small';

const HIDDEN_TEMPLATE_SLUGS = new Set(['photobox-newspaper']);

export const TEMPLATE_CATEGORY_ORDER: TemplateCategory[] = [
  'Website gift',
  'Scrapbook',
  'Photobox',
  'Journal',
  'Wedding',
];

export function visibleTemplates(templates: IAllTemplateResponse[] | null) {
  return (
    templates?.filter(
      (template) => !HIDDEN_TEMPLATE_SLUGS.has(template.slug)
    ) ?? []
  );
}

export function getTemplateRoute(template: IAllTemplateResponse) {
  return templateRoute(template.name) || template.slug || undefined;
}

export function getTemplateDisplayName(template: IAllTemplateResponse) {
  return template.name.split(' - ')[0]?.trim() || template.name;
}

export function getTemplateCategory(
  template: IAllTemplateResponse
): TemplateCategory {
  const type = template.type?.toLowerCase();
  const searchable = `${template.name} ${template.slug} ${template.tag?.join(
    ' '
  )}`.toLowerCase();

  if (type === 'scrapbook' || searchable.includes('scrapbook')) {
    return 'Scrapbook';
  }
  if (type === 'photobox' || searchable.includes('photobox')) {
    return 'Photobox';
  }
  if (type === 'journal' || searchable.includes('journal')) {
    return 'Journal';
  }
  if (type === 'wedding' || searchable.includes('wedding')) {
    return 'Wedding';
  }
  return 'Website gift';
}

export function getTemplatePreviewHref(template: IAllTemplateResponse) {
  const route = getTemplateRoute(template);

  // Gift and scrapbook preview routes follow the registry's
  // "<display name> - <route>" convention. A slug alone is not enough evidence
  // that a public preview page exists.
  return route && template.name.includes(' - ') ? `/${route}` : undefined;
}

export function getTemplateCreateHref(template: IAllTemplateResponse) {
  const category = getTemplateCategory(template);
  const route = getTemplateRoute(template);

  if (category === 'Scrapbook' && route) {
    return `/scrapbook/create?templateId=${template.id}&route=${route}`;
  }
  if (category === 'Photobox') return '/photobox';
  if (category === 'Journal') return '/journal';
  if (category === 'Wedding') return '/wedding-invitation';

  return `/create?template=${template.id}`;
}

export function isTemplateComingSoon(template: IAllTemplateResponse) {
  return ['pending', 'soon', 'coming soon'].includes(
    template.label?.toLowerCase()
  );
}

export function getTemplateDescription(template: IAllTemplateResponse) {
  const tags = template.tag?.filter(Boolean).slice(0, 2) ?? [];
  if (tags.length > 0) return tags.join(' · ');

  return `${getTemplateCategory(template)} for moments worth remembering.`;
}

export function rankTemplates(templates: IAllTemplateResponse[]) {
  return templates
    .map((template, index) => ({ template, index }))
    .sort((a, b) => {
      const previewDifference =
        Number(Boolean(getTemplatePreviewHref(b.template))) -
        Number(Boolean(getTemplatePreviewHref(a.template)));
      if (previewDifference !== 0) return previewDifference;

      const popularityDifference =
        Number(b.template.category === 'popular') -
        Number(a.template.category === 'popular');
      return popularityDifference || a.index - b.index;
    })
    .map(({ template }) => template);
}

export function getTemplateTileSize(index: number): TemplateTileSize {
  if (index < 2) return 'large';
  if (index < 6) return 'medium';
  return 'small';
}
