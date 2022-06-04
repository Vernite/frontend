import { Enum } from './enum.class';

describe('Enum class', () => {
  it('isNumeric() - should return true if enum has numeric values', () => {
    enum TestEnum1 {
      One = 1,
      Two = 2,
      Three = 3,
    }

    expect(Enum.isNumeric(TestEnum1)).to.be.true;
  });

  it('isNumeric() - should return false if enum has non-numeric values', () => {
    enum TestEnum2 {
      One = 'one',
      Two = 'two',
      Three = 'three',
    }

    expect(Enum.isNumeric(TestEnum2)).to.be.false;
  });

  it('keys() - should return keys of numeric enum', () => {
    enum TestEnum3 {
      One = 1,
      Two = 2,
      Three = 3,
    }

    expect(Enum.keys(TestEnum3)).eql(['One', 'Two', 'Three']);
  });

  it('keys() - should return keys of non-numeric enum', () => {
    enum TestEnum4 {
      One = 'one',
      Two = 'two',
      Three = 'three',
    }

    expect(Enum.keys(TestEnum4)).eql(['One', 'Two', 'Three']);
  });

  it('values() - should return values of numeric enum', () => {
    enum TestEnum5 {
      One = 1,
      Two = 2,
      Three = 3,
    }

    expect(Enum.values(TestEnum5)).eql([1, 2, 3]);
  });

  it('values() - should return values of non-numeric enum', () => {
    enum TestEnum6 {
      One = 'one',
      Two = 'two',
      Three = 'three',
    }

    expect(Enum.values(TestEnum6)).eql(['one', 'two', 'three']);
  });

  it('entries() - should return entries of numeric enum', () => {
    enum TestEnum7 {
      One = 1,
      Two = 2,
      Three = 3,
    }

    expect(Enum.entries(TestEnum7)).eql([
      ['One', 1],
      ['Two', 2],
      ['Three', 3],
    ]);
  });

  it('entries() - should return entries of non-numeric enum', () => {
    enum TestEnum8 {
      One = 'one',
      Two = 'two',
      Three = 'three',
    }

    expect(Enum.entries(TestEnum8)).eql([
      ['One', 'one'],
      ['Two', 'two'],
      ['Three', 'three'],
    ]);
  });
});
