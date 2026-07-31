import './field-treatment.css';

/**
 * The treatment every form control in the wedding invitation Create Flow wears.
 *
 * Pass it as a control's `className` at the call site. It is one name rather
 * than a border colour and a shadow repeated per field, so the design's field
 * can be revised in one place, and it is opted into rather than inherited, so no
 * form elsewhere in the product changes and no shared form primitive is touched.
 *
 * It sets the border colour and the drop shadow, and nothing else. Corner
 * radius, font size and padding are left as antd renders them, which is not the
 * same as saying they match the design: they match on Input, and DatePicker,
 * TimePicker and TextArea come out at a smaller radius and font size than the
 * design asks for. That is a separate correction, tracked separately, and
 * folding it in here would make one class quietly responsible for two things.
 *
 * The typeface family is the one the application sets globally, deliberately:
 * see `docs/adr/0002-figma-is-literal-truth.md`.
 *
 * Two things in this flow are not fields and do not take it: the toggle in the
 * MemoRoll Section, and the photo drop zones, which the design draws as dashed
 * areas rather than as bordered boxes.
 */
export const fieldTreatment = 'wedding-field-treatment';
