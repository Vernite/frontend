import { MainModule } from '@main/_main.module';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { componentContentDecorator } from 'src/stories/helpers/component-content-decorator.helper';
import { ButtonComponent } from './button.component';

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
    variant: {
      control: { type: 'select' },
    },
    type: {
      control: { type: 'select' },
    },
  },
} as Meta;

const Template: Story<ButtonComponent> = (args: ButtonComponent) => ({
  props: args,
});

export const Default = Template.bind({});

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
};

export const Important = Template.bind({});
Important.args = {
  variant: 'important',
};
