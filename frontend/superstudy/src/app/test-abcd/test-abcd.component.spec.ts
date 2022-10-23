import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAbcdComponent } from './test-abcd.component';

describe('TestAbcdComponent', () => {
  let component: TestAbcdComponent;
  let fixture: ComponentFixture<TestAbcdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAbcdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAbcdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
