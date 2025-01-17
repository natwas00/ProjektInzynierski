import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassInfoComponent } from './class-info.component';

describe('DisplayAllSetsComponent', () => {
  let component: ClassInfoComponent;
  let fixture: ComponentFixture<ClassInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
