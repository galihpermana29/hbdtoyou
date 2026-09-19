'use client';

/**
 * The control that chooses which language the Create Flow is read in.
 *
 * Above the Sections rather than inside one, because it governs all of them and
 * a setting that lived in Cover Header would look like it belonged to the Cover
 * Header. The design draws no such control - it was drawn for an English form -
 * and the deviation is recorded in `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * It sits on both of the steps a couple works in - above step 2's Sections and
 * above step 3's fields - and outside each step's form, in the same place
 * either way, so the choice reads as the flow's rather than one step's.
 *
 * It wears the same treatment as every other choice in the flow, so it reads as
 * part of the form rather than as a piece of site chrome that wandered in.
 */

import { useId } from 'react';

import { Select } from 'antd';

import { fieldTreatment } from './field-treatment';
import { useFlowCopy, useFlowLanguage } from './flow-language';
import { type FlowLanguage } from './copy';
import './field-treatment.css';

export default function FlowLanguageField() {
  const { language, setLanguage } = useFlowLanguage();
  const copy = useFlowCopy();
  // Its own rather than a fixed one: the control sits on two steps of the same
  // page, both mounted at once, and a shared id would point every label at
  // whichever select came first.
  const id = useId();

  return (
    <div className="mb-[24px] flex flex-col gap-[6px]">
      <label
        htmlFor={id}
        className="text-[14px] font-[500] leading-[20px] text-[#344054]">
        {copy.languageLabel}
      </label>
      <Select<FlowLanguage>
        id={id}
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
