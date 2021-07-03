import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadivrcontentsComponent } from './uploadivrcontents.component';

describe('UploadivrcontentsComponent', () => {
  let component: UploadivrcontentsComponent;
  let fixture: ComponentFixture<UploadivrcontentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadivrcontentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadivrcontentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
