import { FormControl } from '@angular/forms';
import { exposeAllPossibilities } from './component-content-decorator.helper';
import { merge } from 'lodash-es';
import { Story, componentWrapperDecorator } from '@storybook/angular';

export interface StoryConfig<C> {
  selector: string;
  description?: string;
  multiple?: {
    prop: string;
    options: any[];
  };
  props?: Partial<C> & { formControl?: FormControl };
  code?: string;
  template?: string;
}

export const story = <C = any>(story: Story<C>, config: StoryConfig<C>) => {
  if (config.multiple) {
    exposeAllPossibilities(story, config.selector, config.multiple.prop, config.multiple.options);
  }

  const descriptionObject = config.description
    ? {
        parameters: {
          docs: {
            description: {
              story: config.description,
            },
          },
        },
      }
    : {};

  const propsObject = config.props
    ? {
        args: config.props,
      }
    : {};

  const codeObject = config.code
    ? {
        parameters: {
          docs: {
            source: {
              code: config.code,
              language: 'html',
              type: 'auto',
            },
          },
        },
      }
    : {};

  const templateObject = config.template
    ? {
        decorators: [componentWrapperDecorator(() => config.template!)],
        parameters: {
          docs: {
            source: {
              code: config.template,
              language: 'html',
              type: 'auto',
            },
          },
        },
      }
    : {};

  return merge(story, descriptionObject, propsObject, codeObject, templateObject);
};
