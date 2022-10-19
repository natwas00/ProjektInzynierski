import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPreviewComponent } from './set-preview.component';

describe('SetPreviewComponent', () => {
  let component: SetPreviewComponent;
  let fixture: ComponentFixture<SetPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
