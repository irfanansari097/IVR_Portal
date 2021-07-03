import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageivrcontentsComponent } from './manageivrcontents.component';

describe('ManageivrcontentsComponent', () => {
  let component: ManageivrcontentsComponent;
  let fixture: ComponentFixture<ManageivrcontentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageivrcontentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageivrcontentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
