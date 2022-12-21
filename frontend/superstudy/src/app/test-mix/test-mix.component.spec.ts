import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMixComponent } from './test-mix.component';

describe('TestMixComponent', () => {
  let component: TestMixComponent;
  let fixture: ComponentFixture<TestMixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestMixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
