/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MainModule } from '@main/_main.module';
import { CreateWorkspacePage } from './create-workspace.page';

describe('CreateWorkspaceComponent', () => {
  let component: CreateWorkspacePage;
  let fixture: ComponentFixture<CreateWorkspacePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MainModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
      ],
      declarations: [CreateWorkspacePage],
      providers: [NgControl],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkspacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.true;
  });
});
