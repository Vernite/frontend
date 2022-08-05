import { AfterViewInit, Component, ContentChildren, Input, OnInit, QueryList } from '@angular/core';
import { ControlAccessor } from '@main/classes/control-accessor.class';
import { Subject } from 'rxjs';
import { OptionComponent } from '../option/option.component';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent extends ControlAccessor implements AfterViewInit, OnInit {
  @ContentChildren(OptionComponent) queryOptions?: QueryList<OptionComponent>;
  options?: any[];
  optionsMap?: Map<any, any> = new Map();
  @Input() floatingLabel: string = '';
  yet: boolean = false;

  selected$: Subject<any> = new Subject<any>();

  get selected() {
    return this.optionsMap?.get(this.control.value);
  }

  ngOnInit(): void {
    this.control.valueChanges.subscribe((value) => {
      this.optionsMap?.forEach((option, key) => {
        const selected = key === value;
        option.selected = selected;
        if (selected) {
          this.selected$.next(option);
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.queryOptions?.changes.subscribe((options) => {
      this.updateOptions();
    });
    this.updateOptions();
  }

  updateOptions() {
    this.yet = false;
    this.options = this.queryOptions?.map((x) => {
      const option = { value: x.value, viewValue: x.viewValue, icon: x.icon };

      this.optionsMap!.set(x.value, option);
      return option;
    });
    setTimeout(() => {
      this.selected$.next(this.optionsMap?.get(this.control.value));
      this.yet = true;
    });
  }
}
