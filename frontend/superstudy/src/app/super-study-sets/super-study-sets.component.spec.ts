import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperStudySetsComponent } from './super-study-sets.component';

describe('SuperStudySetsComponent', () => {
  let component: SuperStudySetsComponent;
  let fixture: ComponentFixture<SuperStudySetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperStudySetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperStudySetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
