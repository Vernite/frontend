import { ESet } from './e-set.class';

describe('ESet', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('toggle - remove item if exists', () => {
    const set = new ESet([1, 2, 3]);
    set.toggle(1);
    expect(set.has(1)).to.be.false;
  });

  it('toggle - add item if not exists', () => {
    const set = new ESet([2, 3]);
    set.toggle(1);
    expect(set.has(1)).to.be.true;
  });
});
