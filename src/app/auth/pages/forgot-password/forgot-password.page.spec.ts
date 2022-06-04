/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonComponent } from '@main/components/button/button.component';
import { IconComponent } from '@main/components/icon/icon.component';
import { MainModule } from '@main/_main.module';
import { ForgotPasswordPage } from './forgot-password.page';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordPage;
  let fixture: ComponentFixture<ForgotPasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MainModule, BrowserAnimationsModule, ReactiveFormsModule],
      declarations: [ForgotPasswordPage, ButtonComponent, IconComponent],
      providers: [NgControl],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.true;
  });
});
