'use client';

import { ConfigProvider, type ThemeConfig } from 'antd';
import type { ReactNode } from 'react';

import { colour } from '@/components/memoroll/ui/tokens';

/**
 * The gift and scrapbook creators, dressed in the MemoRoll design system
 * (owner, 2026-11-17: "kita ikutin memoroll design system").
 *
 * The forms stay Ant Design - twelve of them, and the dashboard's editor
 * reuses them - so the design arrives as a theme rather than a rewrite: the
 * tokens below carry MemoRoll's values (src/components/memoroll/ui/tokens.ts)
 * into every Input, Select, Upload, Button, Switch, Steps and Modal under
 * this provider, and `.mr-form` in globals.css covers what a token cannot -
 * the pill fields, the CTA's raised highlight, the label type, the toasts.
 *
 * Scoped, not global: the dashboard and the rest of the site keep their own
 * look until they are given this one on purpose.
 */
export const memorollFormTheme: ThemeConfig = {
  token: {
    colorPrimary: colour.flame,
    colorLink: colour.flame,
    colorText: colour.ink,
    colorTextSecondary: colour.muted,
    colorTextPlaceholder: '#a3a3a3',
    colorBorder: 'rgba(0, 0, 0, 0.2)',
    colorBgContainer: colour.field,
    colorBgLayout: colour.paper,
    colorError: '#d92d20',
    fontFamily: "'Plus Jakarta Sans', var(--font-mr-body), sans-serif",
    fontSize: 14,
    borderRadius: 16,
    controlHeight: 44,
    controlHeightLG: 48,
  },
  components: {
    Button: {
      borderRadius: 999,
      borderRadiusLG: 999,
      primaryShadow: 'none',
      defaultBg: colour.paper,
      defaultBorderColor: 'rgba(33, 33, 33, 0.2)',
      defaultColor: colour.ink,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 999,
      borderRadiusLG: 999,
      paddingInline: 16,
      paddingInlineLG: 16,
      activeBorderColor: colour.flame,
      hoverBorderColor: 'rgba(0, 0, 0, 0.35)',
      activeShadow: '0 0 0 3px rgba(255, 62, 9, 0.12)',
    },
    InputNumber: { borderRadius: 999, activeBorderColor: colour.flame },
    Select: {
      borderRadius: 999,
      borderRadiusLG: 999,
      optionSelectedBg: colour.unchosen,
      activeBorderColor: colour.flame,
    },
    DatePicker: { borderRadius: 999, activeBorderColor: colour.flame },
    Form: {
      labelColor: '#000000',
      labelFontSize: 14,
      verticalLabelPadding: '0 0 8px',
      itemMarginBottom: 24,
    },
    Switch: { colorPrimary: colour.flame, colorPrimaryHover: '#e63605' },
    Steps: {
      colorPrimary: colour.flame,
      colorText: colour.ink,
      colorTextDescription: colour.muted,
      colorSplit: colour.track,
    },
    Modal: {
      borderRadiusLG: 24,
      contentBg: colour.paper,
      headerBg: colour.paper,
      footerBg: colour.paper,
      titleFontSize: 18,
    },
    Tooltip: { colorBgSpotlight: colour.ink },
    Upload: { colorFillAlter: colour.field },
  },
};

export default function MemorollFormTheme({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ConfigProvider theme={memorollFormTheme}>
      <div className={`mr-form ${className}`}>{children}</div>
    </ConfigProvider>
  );
}
