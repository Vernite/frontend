import { componentWrapperDecorator } from '@storybook/angular';

export const componentContentDecorator = (content: string) => {
  return componentWrapperDecorator((story) => {
    return story.replace('><', `>${content}<`);
  });
};
