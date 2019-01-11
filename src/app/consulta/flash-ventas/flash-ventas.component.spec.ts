import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashVentasComponent } from './flash-ventas.component';

describe('FlashVentasComponent', () => {
  let component: FlashVentasComponent;
  let fixture: ComponentFixture<FlashVentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
