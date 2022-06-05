import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAllSetsComponent } from './display-all-sets.component';

describe('DisplayAllSetsComponent', () => {
  let component: DisplayAllSetsComponent;
  let fixture: ComponentFixture<DisplayAllSetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayAllSetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayAllSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
