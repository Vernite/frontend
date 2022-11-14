import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Event } from '@calendar/interfaces/event.interface';
import { Task } from '@tasks/interfaces/task.interface';
import * as dayjs from 'dayjs';

@Component({
  selector: 'calendar-grid',
  templateUrl: './calendar-grid.component.html',
  styleUrls: ['./calendar-grid.component.scss'],
})
export class CalendarGridComponent implements OnChanges {
  @Input() date!: dayjs.Dayjs;
  @Input() events: Event[] = [];

  public days: {
    date: dayjs.Dayjs;
    events: {
      date: dayjs.Dayjs;
      type: 'start' | 'end';
      data: Event;
    }[];
  }[] = [];
  public firstDay: dayjs.Dayjs = dayjs();
  public lastDay: dayjs.Dayjs = dayjs();

  public tasksByDate = new Map<number, Task[]>();

  public weekdaysShort = dayjs.weekdaysShort();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['date'] && !changes['date'].currentValue.isSame(changes['date'].previousValue)) {
      this.calculateGrid();

      if (this.events.length) {
        this.calculateEvents();
      }
    }

    if (changes['events']) {
      this.calculateEvents();
    }
  }

  private calculateGrid() {
    this.firstDay = this.date.startOf('month');
    this.lastDay = this.date.endOf('month');

    const firstDay = this.date.startOf('month').startOf('week');
    const lastDay = this.date.endOf('month').endOf('week');

    const days: {
      date: dayjs.Dayjs;
      events: {
        date: dayjs.Dayjs;
        type: 'start' | 'end';
        data: Event;
      }[];
    }[] = [];
    let day = firstDay;

    while (day <= lastDay) {
      days.push({ date: day, events: [] });
      day = day.add(1, 'day');
    }

    this.days = days;
  }

  private clearEvents() {
    this.days.forEach((day) => {
      day.events = [];
    });
  }

  private calculateEvents() {
    this.clearEvents();

    const addToDate = (event: Event, day: dayjs.Dayjs) => {
      const index = this.days.findIndex((d) => d.date.isSame(day, 'day'));

      if (index !== -1) {
        this.days[index].events.push({
          date: day,
          type: 'start',
          data: event,
        });
      }
    };

    for (const event of this.events) {
      if (event.startDate) {
        addToDate(event, dayjs(event.startDate));
      }
      if (event.endDate) {
        addToDate(event, dayjs(event.endDate));
      }
    }

    this.days.sort((a, b) => {
      if (a.date.isBefore(b.date)) {
        return -1;
      }
      if (a.date.isAfter(b.date)) {
        return 1;
      }
      return 0;
    });
  }
}