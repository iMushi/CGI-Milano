import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flash-ventas',
  templateUrl: './flash-ventas.component.html',
  styleUrls: ['./flash-ventas.component.scss']
})
export class FlashVentasComponent implements OnInit {

  optionsFechas = [
    {value: 'jack', label: 'Jacks'},
    {value: 'lucy', label: 'Lucy'},
    {value: 'disabled', label: 'Disabled', disabled: true}
  ];

  optionsMarcas = [
    {value: '1', label: 'TODAS'},
    {value: '2', label: 'MELODY'},
    {value: '3', label: 'MILANO'},
    {value: '4', label: 'HOME & FASHION'}
  ];

  selectedPeriodo;
  selectedMarca;

  // Rango de fechas
  _startDate = null;
  _endDate = null;


  // datos tabla dummy

  advanceColumns = [
    {name: 'Rendering engine'},
    {name: 'Browser'},
    {name: 'Platform'},
    {name: 'Engine version'},
    {name: 'CSS grade'}
  ];
  advanceRows = [];

  scrollBarHorizontal = (window.innerWidth < 960);
  columnModeSetting = (window.innerWidth < 960) ? 'standard' : 'force';

// datos tabla dummy

  constructor() {

    this.fetchSampleAdvance((data) => {
      // push our inital complete list
      this.advanceRows = data;
    });

  }

  ngOnInit() {

  }


  _startValueChange = () => {
    if (this._startDate > this._endDate) {
      this._endDate = null;
    }
  };
  _endValueChange = () => {
    if (this._startDate > this._endDate) {
      this._startDate = null;
    }
  };

  _disabledStartDate = (startValue) => {
    if (!startValue || !this._endDate) {
      return false;
    }
    return startValue.getTime() >= this._endDate.getTime();
  };
  _disabledEndDate = (endValue) => {
    if (!endValue || !this._startDate) {
      return false;
    }
    return endValue.getTime() <= this._startDate.getTime();
  };


  fetchSampleAdvance(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/table_browser.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }
}
