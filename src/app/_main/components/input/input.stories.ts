import { InputComponent } from './input.component';
import {
  DOCS_SELECT,
  DOCS_PRESET_CONTROL_ACCESSOR,
} from '../../../../stories/helpers/arg-type.helper';
import { MainModule } from '@main/_main.module';
import { FormControl, NgControl } from '@angular/forms';
import { story } from './../../../../stories/helpers/story.helper';
import { Story, moduleMetadata, Meta } from '@storybook/angular';

export default {
  title: 'Components/Input',
  component: InputComponent,
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

const Template: Story<InputComponent> = (args: InputComponent) => ({
  props: args,
});

export const $Default = story(Template.bind({}), {
  selector: 'app-input',
  template: `<app-input></app-input>`,
  props: {
    formControl: new FormControl(),
  },
});
