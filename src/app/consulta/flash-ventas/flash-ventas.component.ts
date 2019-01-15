import { Component, OnInit } from '@angular/core';
import { pgDatePickerComponent } from '../../@pages/components/datepicker/datepicker.component';
import { FlashVentasService } from '../../services/flash-ventas.service';
import { ObtenVentasFlashRequest } from './classes/ObtenVentasFlashRequest';
import { ObtenerVentaFlashVentasJson } from '../../../models/response/ObtenerVentaFlashVentasJson';

import * as moment from 'moment';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-flash-ventas',
  templateUrl: './flash-ventas.component.html',
  styleUrls: ['./flash-ventas.component.scss']
})
export class FlashVentasComponent implements OnInit {

  isMobileTest = environment.mobileTest;

  optionsFechas = [];

  optionsMarcas = [
    {value: 0, label: 'TODAS'},
    {value: 10, label: 'MELODY'},
    {value: 30, label: 'MILANO'},
    {value: 60, label: 'HOME & FASHION'}
  ];


  optionsINCDEC = [
    {value: 'vsVenta1', label: 'Venta +'},
    {value: 'vsVenta2', label: 'Venta -'},
    {value: 'vsCuota1', label: 'Cuota +'},
    {value: 'vsCuota2', label: 'Cuota -'},
    {value: 'vsMix1', label: 'Venta/Cuota +'},
    {value: 'vsMix2', label: 'Venta/Cuota -'},
    {value: 'vsUBruta1', label: 'Utilidad Bruta +'},
    {value: 'vsUBruta2', label: 'Utilidad Bruta -'}
  ];

  selectedPeriodo: string;
  selectedMarca = 0;
  selectedINCDEC;

  porDia;
  porMes;
  porEstado;


  // Rango de fechas
  _startDate = null;
  _endDate = null;

  fechaDeInstance: pgDatePickerComponent;
  fechaAInstance: pgDatePickerComponent;

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


  constructor(private _flashService: FlashVentasService) {

    moment.locale('es');

  }

  ngOnInit() {


    const dateStart = moment(new Date()).subtract(1, 'year');
    const dateEnd = moment(new Date());

    const tmpArray = [];

    while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
      tmpArray.push({
        value: dateStart.format('MM/YYYY'),
        label: dateStart.format('MMMM').toUpperCase() + ' - ' + dateStart.format('YYYY')
      });
      dateStart.add(1, 'month');
    }
    this.optionsFechas = tmpArray.reverse();

    this.selectedPeriodo = dateEnd.format('MM/YYYY');

    this._startDate = moment().startOf('month').toDate();
    this._endDate = moment().subtract(1, 'day').toDate();


    if (this.isMobileTest) {

      this.fetchSampleAdvance((data) => {
        this.advanceRows = data;
      });

    } else {

      this.getData();
    }

  }


  _startValuePeriodoChange = () => {

    const currentDate = moment(new Date());
    const [mesSeleccionado, anioSeleccionado] = this.selectedPeriodo.split('/');
    const selectedPeriodo = moment(`${mesSeleccionado}-01-${anioSeleccionado}`, 'MM-DD-YYYY');

    this._startDate = selectedPeriodo.toDate();

    if (selectedPeriodo.get('month') === currentDate.get('month')) {
      this._endDate = moment().subtract(1, 'day').toDate();
    } else {
      this._endDate = selectedPeriodo.endOf('month').toDate();
    }

    this.getData();

  }

  _startMarcaChange = () => {
    this.getData();
  }


  _startValueChange = () => {
    if (this._startDate > this._endDate) {
      this._endDate = null;
    }

    this.getData();
  }

  _endValueChange = () => {
    if (this._startDate > this._endDate) {
      this._startDate = null;
    }
    this.getData();

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


  fetchSampleAdvance(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/MockResponse.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }


  changeAgrup() {
    this.getData();
  }

  getData() {

    const data = new ObtenVentasFlashRequest({
      Marca: this.selectedMarca,
      FechaInicial: moment(this._startDate).format('DD/MM/YYYY'),
      FechaFinal: moment(this._endDate).format('DD/MM/YYYY')
    });

    const bodyReq = this._flashService.generaBodyFlashVentas(data);
    this._flashService.makeSoapCall(bodyReq).subscribe(
      (resp: Array<ObtenerVentaFlashVentasJson>) => {
        this.advanceRows = resp;
      }
    );

  }
}
