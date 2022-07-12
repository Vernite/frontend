import { ControlType } from './control-type.helper';
import { faQuestion, faPenToSquare, faTrashArrowUp } from '@fortawesome/free-solid-svg-icons';

const fasQuestion = faQuestion;
const fasPenToSquare = faPenToSquare;
const fasTrashArrowUp = faTrashArrowUp;

const icons = { fasQuestion, fasPenToSquare, fasTrashArrowUp };

export const DOCS_ICON_SELECT = {
  control: {
    type: 'select',
  },
  options: Object.keys(icons),
  mapping: icons,
};

export const DOCS_CONTROL = (controlType: ControlType) => ({
  control: {
    type: controlType,
  },
});

export const DOCS_GETTER = (description: string) => ({
  control: {
    type: false,
  },
  table: {
    category: 'getters',
  },
  description,
});

// Simple controls
export const DOCS_SELECT = {
  control: {
    type: 'select',
  },
};

export const DOCS_PRESET_CONTROL_ACCESSOR = {
  required: {
    control: { type: false },
    table: { category: 'getters', type: { summary: 'boolean' } },
    description: `Property to describe if the control is required in a form (contains \`requiredValidator()\`)`,
    type: { name: 'boolean' },
  },
  control: {
    control: { type: false },
    table: { category: 'getters', type: { summary: 'FormControl' } },
    description: `Control attached to this control accessor`,
    type: { name: 'FormControl' },
  },
  formControl: {
    control: { type: false },
    table: { type: { summary: 'FormControl' } },
    description: `Control to attach to this control accessor (\`formControlName\` can also be used instead)`,
    type: { name: 'FormControl' },
  },
  formControlName: {
    control: { type: false },
    table: { type: { summary: 'string' } },
    description: `Control to attach to this control accessor - require to be nested in \`formGroup\` (\`formControl\` can also be used instead)`,
    type: { name: 'string' },
  },
};
