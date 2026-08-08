'use client';

/**
 * The control that chooses which language the Create Flow is read in.
 *
 * Above the Sections rather than inside one, because it governs all of them and
 * a setting that lived in Cover Header would look like it belonged to the Cover
 * Header. The design draws no such control - it was drawn for an English form -
 * and the deviation is recorded in `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * It wears the same treatment as every other choice in the flow, so it reads as
 * part of the form rather than as a piece of site chrome that wandered in.
 */

import { Select } from 'antd';

import { fieldTreatment } from './field-treatment';
import { useFlowCopy, useFlowLanguage } from './flow-language';
import { type FlowLanguage } from './copy';
import './field-treatment.css';

export default function FlowLanguageField() {
  const { language, setLanguage } = useFlowLanguage();
  const copy = useFlowCopy();

  return (
    <div className="mb-[24px] flex flex-col gap-[6px]">
      <label
        htmlFor="wedding-flow-language"
        className="text-[14px] font-[500] leading-[20px] text-[#344054]">
        {copy.languageLabel}
      </label>
      <Select<FlowLanguage>
        id="wedding-flow-language"
        value={language}
        onChange={setLanguage}
        className={`${fieldTreatment} w-full max-w-[240px]`}
        options={[
          { value: 'id', label: copy.languageIndonesian },
          { value: 'en', label: copy.languageEnglish },
        ]}
      />
    </div>
  );
}
