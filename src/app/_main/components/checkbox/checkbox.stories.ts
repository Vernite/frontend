import {
  DOCS_SELECT,
  DOCS_PRESET_CONTROL_ACCESSOR,
} from '../../../../stories/helpers/arg-type.helper';
import { MainModule } from '@main/_main.module';
import { FormControl, NgControl } from '@angular/forms';
import { story } from './../../../../stories/helpers/story.helper';
import { Story, moduleMetadata, Meta } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';

export default {
  title: 'Components/Checkbox',
  component: CheckboxComponent,
  decorators: [
    moduleMetadata({
      imports: [MainModule],
      providers: [NgControl],
    }),
  ],
  argTypes: {
    ...DOCS_PRESET_CONTROL_ACCESSOR,
    autocomplete: DOCS_SELECT,
  },
} as Meta;

const Template: Story<CheckboxComponent> = (args: CheckboxComponent) => ({
  props: args,
});

export const $Default = story(Template.bind({}), {
  selector: 'app-checkbox',
  template: `<app-checkbox>Sample checkbox</app-checkbox>`,
  props: {
    formControl: new FormControl(),
  },
});
