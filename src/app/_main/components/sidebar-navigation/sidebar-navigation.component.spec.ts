/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconComponent } from '../icon/icon.component';
import { NavElementWorkspaceComponent } from '../nav-element-workspace/nav-element-workspace.component';
import { NavElementComponent } from '../nav-element/nav-element.component';
import { SidebarNavigationComponent } from './sidebar-navigation.component';

describe('SidebarNavigationComponent', () => {
  let component: SidebarNavigationComponent;
  let fixture: ComponentFixture<SidebarNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        FontAwesomeModule,
        MatIconModule,
        MatMenuModule,
      ],
      declarations: [
        SidebarNavigationComponent,
        NavElementComponent,
        NavElementWorkspaceComponent,
        IconComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.true;
  });
});
