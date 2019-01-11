import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flash-ventas',
  templateUrl: './flash-ventas.component.html',
  styleUrls: ['./flash-ventas.component.scss']
})
export class FlashVentasComponent implements OnInit {

  options = [
    {value: 'jack', label: 'Jacks'},
    {value: 'lucy', label: 'Lucy'},
    {value: 'disabled', label: 'Disabled', disabled: true}
  ];
  selectedPeriodo;

  // Rango de fechas
  _startDate = null;
  _endDate = null;

  constructor() {
  }

  ngOnInit() {
  }


  _startValueChange = () => {
    if (this._startDate > this._endDate) {
      this._endDate = null;
    }
  }
  _endValueChange = () => {
    if (this._startDate > this._endDate) {
      this._startDate = null;
    }
  }

  _disabledStartDate = (startValue) => {
    if (!startValue || !this._endDate) {
      return false;
    }
    return startValue.getTime() >= this._endDate.getTime();
  }
  _disabledEndDate = (endValue) => {
    if (!endValue || !this._startDate) {
      return false;
    }
    return endValue.getTime() <= this._startDate.getTime();
  }
}
