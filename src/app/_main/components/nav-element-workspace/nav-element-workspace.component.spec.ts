/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogTestingProvider } from '@tests/helpers/mat-dialog-testing-provider.helper';
import { IconComponent } from '../icon/icon.component';
import { NavElementWorkspaceComponent } from './nav-element-workspace.component';

describe('NavElementWorkspaceComponent', () => {
  let component: NavElementWorkspaceComponent;
  let fixture: ComponentFixture<NavElementWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatMenuModule,
        HttpClientModule,
        MatDialogModule,
        MatIconModule,
        FontAwesomeModule,
      ],
      declarations: [NavElementWorkspaceComponent, IconComponent],
      providers: [...MatDialogTestingProvider],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavElementWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.true;
  });
});
