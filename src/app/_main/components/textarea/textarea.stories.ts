import {
  DOCS_SELECT,
  DOCS_PRESET_CONTROL_ACCESSOR,
} from '../../../../stories/helpers/arg-type.helper';
import { MainModule } from '@main/_main.module';
import { FormControl, NgControl } from '@angular/forms';
import { story } from './../../../../stories/helpers/story.helper';
import { Story, moduleMetadata, Meta } from '@storybook/angular';
import { TextareaComponent } from './textarea.component';

export default {
  title: 'Components/Textarea',
  component: TextareaComponent,
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

const Template: Story<TextareaComponent> = (args: TextareaComponent) => ({
  props: args,
});

export const $Default = story(Template.bind({}), {
  selector: 'app-textarea',
  template: `<app-textarea></app-textarea>`,
  props: {
    formControl: new FormControl(),
  },
});
