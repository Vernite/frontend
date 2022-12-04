import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormArray, FormControl } from '@ngneat/reactive-forms';
import { ControlAccessor } from '@main/classes/control-accessor.class';
import { Filter } from '@main/interfaces/filters.interface';

@Component({
  selector: 'filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent extends ControlAccessor {
  @Input() set filters(filters: Filter[]) {
    this.form = new FormArray(
      filters.map((filter) => {
        return new FormControl(filter.value);
      }),
    );
    this._filters = filters;
  }

  public get filters() {
    return this._filters;
  }

  private _filters: Filter[] = [];
  public form?: FormArray<any>;

  constructor(public override ngControl: NgControl, cdRef: ChangeDetectorRef) {
    super(ngControl, cdRef);
  }

  public getControl(index: number) {
    const control = (this.form?.controls[index] || new FormControl()) as FormControl<any>;
    return control;
  }

  public save() {
    if (!this.form) return;

    let formValue: Filter[] = [];

    for (const [index, filter] of this.filters.entries()) {
      const filterValue = Number(this.form?.controls[index].value) as 0 | 1;
      filter.value = filterValue;
      formValue.push(filter);
    }

    this.control.setValue(formValue);
  }

  reset() {
    this.form?.reset();
  }
}
