/* eslint-disable */
// eslint-disable-next-line
import 'zone.js';
import 'zone.js/testing';

import { mount } from '@jscutlery/cypress-angular/mount';
import '@jscutlery/cypress-mount/support';




import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from './button.component';

describe(ButtonComponent.name, () => {
  beforeEach(() => {
    cy.log('beforeEach');
    console.log(window.document);

    mount(ButtonComponent, {
      // imports: [MatProgressSpinnerModule, BrowserAnimationsModule],
      declarations: [IconComponent],
    });
  });

  it('should create', () => {
    expect(true).to.be.true;
  });
});
