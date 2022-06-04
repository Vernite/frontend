import '@angular/compiler';
import { AbstractControl, FormControl, NgControl } from '@angular/forms';
import '@angular/localize/init';
import { emailValidator } from '../validators/email.validator';
import { ControlAccessor } from './control-accessor.class';

class TestNgControl extends NgControl {
  private _control = new FormControl('');
  viewToModelUpdate(newValue: any): void {
    this._control = newValue;
  }
  get control(): AbstractControl | null {
    return this._control;
  }
}

function values(obj: any): string[] {
  if (!obj) return [];
  return Object.values(obj);
}

describe('Control Accessor', () => {
  it('should create an instance', () => {
    const ngControl = new TestNgControl();
    expect(new ControlAccessor(ngControl)).to.exist;
  });

  it('should return empty value when not set', () => {
    const ngControl = new TestNgControl();
    const controlAccessor = new ControlAccessor(ngControl);
    expect(controlAccessor.value).equals('');
  });

  it('should return empty value when set', () => {
    const ngControl = new TestNgControl();
    const controlAccessor = new ControlAccessor(ngControl);
    controlAccessor.control.setValue('test');
    expect(controlAccessor.value).to.equal('test');
  });

  it('should return null when has no errors', () => {
    const ngControl = new TestNgControl();
    const controlAccessor = new ControlAccessor(ngControl);
    controlAccessor.control.setValue('test');
    expect(controlAccessor.errors).to.be.null;
  });

  it('should successfully validate with emailValidator', () => {
    const ngControl = new TestNgControl();
    const controlAccessor = new ControlAccessor(ngControl);
    controlAccessor.control.setValidators(emailValidator());
    controlAccessor.control.setValue('TEST');
    expect(values(controlAccessor.errors)).to.contain('email');
  });

  it('Should be possible to set disable state of accessor to false', () => {
    const ngControl = new TestNgControl();
    const controlAccessor = new ControlAccessor(ngControl);
    controlAccessor.setDisabledState(false);
    expect(controlAccessor.control.disabled).to.be.false;
  });

  it('Should be possible to set disable state of accessor to true', () => {
    const ngControl = new TestNgControl();
    const controlAccessor = new ControlAccessor(ngControl);
    controlAccessor.setDisabledState(true);
    expect(controlAccessor.control.disabled).to.be.true;
  });
});
