import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { DaysGrid, CalendarDay } from './date-picker.model';
import {
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { ControlAccessor } from '@main/classes/control-accessor.class';
import { unixTimestamp } from '../../../interfaces/date.interface';

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent extends ControlAccessor<unixTimestamp | null> implements OnInit {
  // TODO: Read this from user settings
  firstDayOfWeek = 1;

  cursor = this.control.value ? dayjs.unix(this.control.value) : dayjs();

  monthNames = dayjs.months();
  weekdays = dayjs.weekdays();
  weekdaysShort = dayjs.weekdaysShort();

  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  daysGrid = this.calculateDaysGrid();

  private calculateDaysGrid() {
    const daysInMonth = this.cursor.daysInMonth();
    const daysInPreviousMonth = this.cursor.clone().subtract(1, 'month').daysInMonth();
    const firstDayOfMonth = this.cursor.startOf('month').day();

    const daysGrid: DaysGrid = [[]];

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysGrid[0].push({
        id: i,
        name: daysInPreviousMonth - firstDayOfMonth + i + 1,
        isWeekend: i % 6 === 0,
        isFromPreviousMonth: true,
        isFromNextMonth: false,
      });
    }

    for (let i = firstDayOfMonth; i < 7; i++) {
      daysGrid[0].push({
        id: i,
        name: i - firstDayOfMonth + 1,
        isWeekend: i % 6 === 0,
        isFromPreviousMonth: false,
        isFromNextMonth: false,
      });
    }

    for (let i = 1; i < 6; i++) {
      daysGrid[i] = [];
      for (let j = 0; j < 7; j++) {
        const theoreticalDay = i * 7 + j - firstDayOfMonth + 1;

        daysGrid[i].push({
          id: i * 7 + j,
          name: theoreticalDay <= daysInMonth ? theoreticalDay : theoreticalDay - daysInMonth,
          isWeekend: j % 6 === 0,
          isFromPreviousMonth: false,
          isFromNextMonth: theoreticalDay > daysInMonth,
        });
      }
    }

    return daysGrid;
  }

  previousMonth() {
    this.cursor = this.cursor.subtract(1, 'month');
    this.daysGrid = this.calculateDaysGrid();
  }

  nextMonth() {
    this.cursor = this.cursor.add(1, 'month');
    this.daysGrid = this.calculateDaysGrid();
  }

  today() {
    const hours = this.cursor.hour();
    const minutes = this.cursor.minute();

    this.cursor = dayjs();
    this.cursor = this.cursor.set('hour', hours);
    this.cursor = this.cursor.set('minute', minutes);
    this.cursor = this.cursor.set('second', 0);

    this.daysGrid = this.calculateDaysGrid();

    this.control.setValue(this.cursor.unix());
  }

  now() {
    const today = dayjs();

    this.cursor = this.cursor.set('hour', today.hour());
    this.cursor = this.cursor.set('minute', today.minute());

    this.control.setValue(this.cursor.unix());
  }

  increaseMinutes() {
    this.cursor = this.cursor.add(1, 'minute');
  }

  decreaseMinutes() {
    this.cursor = this.cursor.subtract(1, 'minute');
  }

  increaseHours() {
    this.cursor = this.cursor.add(1, 'hour');
  }

  decreaseHours() {
    this.cursor = this.cursor.subtract(1, 'hour');
  }

  onHourChange(event: Event) {
    const value = (event.target as HTMLInputElement)?.valueAsNumber;
    this.cursor = this.cursor.set('hour', value);
  }

  onMinuteChange(event: Event) {
    const value = (event.target as HTMLInputElement)?.valueAsNumber;
    this.cursor = this.cursor.set('minute', value);
  }

  selectDay(day: CalendarDay) {
    if (day.isFromPreviousMonth) {
      this.cursor = this.cursor.subtract(1, 'month');
    } else if (day.isFromNextMonth) {
      this.cursor = this.cursor.add(1, 'month');
    }

    this.cursor = this.cursor.date(day.name);
    this.control.setValue(this.cursor.unix());

    this.daysGrid = this.calculateDaysGrid();
  }

  override ngAfterControlInit(): void {
    if (this.control.value) {
      this.cursor = dayjs.unix(this.control.value);
      this.daysGrid = this.calculateDaysGrid();
    }
  }
}