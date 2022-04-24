/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateProjectPage } from './create-project.page';
import { MainModule } from 'src/app/_main/_main.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NgControl } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateProjectPage', () => {
  let component: CreateProjectPage;
  let fixture: ComponentFixture<CreateProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MainModule, RouterTestingModule, BrowserAnimationsModule],
      declarations: [CreateProjectPage],
      providers: [NgControl],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
