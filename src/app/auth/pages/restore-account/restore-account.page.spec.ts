/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MainModule } from '@main/_main.module';

import { RestoreAccountPage } from './restore-account.page';

describe('RestoreAccountPage', () => {
  let component: RestoreAccountPage;
  let fixture: ComponentFixture<RestoreAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MainModule, ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [RestoreAccountPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.true;
  });
});
