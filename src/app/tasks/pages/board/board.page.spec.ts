/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { MainModule } from 'src/app/_main/_main.module';
import { BoardPage } from './board.page';

describe('BoardComponent', () => {
  let component: BoardPage;
  let fixture: ComponentFixture<BoardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MainModule, RouterTestingModule],
      declarations: [BoardPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.true;
  });
});
