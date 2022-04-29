/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoardTaskComponent } from './board-task.component';
import { MatMenuModule } from '@angular/material/menu';

describe('BoardTaskComponent', () => {
  let component: BoardTaskComponent;
  let fixture: ComponentFixture<BoardTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatMenuModule],
      declarations: [BoardTaskComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
