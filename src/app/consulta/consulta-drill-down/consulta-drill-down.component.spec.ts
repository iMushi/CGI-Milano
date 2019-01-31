import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaDrillDownComponent } from './consulta-drill-down.component';

describe('ConsultaDrillDownComponent', () => {
  let component: ConsultaDrillDownComponent;
  let fixture: ComponentFixture<ConsultaDrillDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaDrillDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaDrillDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
