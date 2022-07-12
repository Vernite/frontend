import { DOCS_SELECT } from '../../../../stories/helpers/arg-type.helper';
import { story } from './../../../../stories/helpers/story.helper';
import { MainModule } from '@main/_main.module';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { componentContentDecorator } from 'src/stories/helpers/component-content-decorator.helper';
import { ButtonComponent } from './button.component';
import { DOCS_ICON_SELECT } from 'src/stories/helpers/arg-type.helper';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

export default {
  title: 'Components/Button',
  component: ButtonComponent,
  decorators: [
    componentContentDecorator('Button'),
    moduleMetadata({
      imports: [MainModule],
    }),
  ],
  argTypes: {
    variant: DOCS_SELECT,
    type: DOCS_SELECT,
    icon: DOCS_ICON_SELECT,
  },
} as Meta;

const Template: Story<ButtonComponent> = (args: ButtonComponent) => ({
  props: args,
});

export const Default = story(Template.bind({}), {
  selector: 'app-button',
  code: `<app-button>Button</app-button>`,
});

export const Variant = story(Template.bind({}), {
  selector: 'app-button',
  multiple: {
    prop: 'variant',
    options: ['primary', 'secondary', 'important'],
  },
  description: `To customize the general appearance you need to use the \`variant\` property with one of the specified values.
    If you will not specify variant, the button will appear with \`secondary\` styling.`,
});

export const Pending = story(Template.bind({}), {
  selector: 'app-button',
  description: `To make the button show with loader you need to pass \`pending\` property with value: \`true\`.`,
  code: `<app-button [pending]="true">Button</app-button>`,
  props: {
    pending: true,
  },
});

export const Type = story(Template.bind({}), {
  selector: 'app-button',
  code: `<app-button type="button"></app-button>`,
  description: `If button is nested in a form, the default behavior is making this button a \`submit\` button. To
  omit this it is needed to set \`type\` to \`button\`.`,
  props: {
    type: 'button',
  },
});

export const Icon = story(Template.bind({}), {
  selector: 'app-button',
  code: `<app-button [icon]="faAdd"></app-button>`,
  description: `You can set \`icon\` property to add icon before text in buttons. This option supports prefixes like: \`mat\` |
  \`fas\` | \`fab\` | \`cu\`.`,
  props: {
    icon: faAdd,
  },
});
