import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { pgDatePickerComponent } from '../../@pages/components/datepicker/datepicker.component';
import { FlashVentasService } from '../../services/flash-ventas.service';
import { ObtenVentasFlashRequest } from './classes/ObtenVentasFlashRequest';
import { ObtenerVentaFlashVentasJson } from '../../../models/response/ObtenerVentaFlashVentasJson';

import * as moment from 'moment';
import { environment } from '../../../environments/environment';
import { ObtenVentasFlashVentasRequestBody } from '../../../models/requestBody/ObtenVentasFlashVentasRequestBody ';
import { LevelDrillDownModel } from '../../../models/levelDrillDown.model';
import { pagesToggleService } from '../../@pages/services/toggler.service';
import { getIdColumnClass, maxLevelTipoQuery, optionsMarcas, tipoQuery } from './classes/flashVentasCommon';
import { Subscription } from 'rxjs/Subscription';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AuthService } from '../../services/auth.service';
import { AuthModel } from '../../../models/auth.model';

@Component({
  selector: 'app-flash-ventas',
  templateUrl: './flash-ventas.component.html',
  styleUrls: ['./flash-ventas.component.scss']
})
export class FlashVentasComponent implements OnInit, OnDestroy {

  @ViewChild('tableAdvance') tableAdvance: DatatableComponent;
  @ViewChild('tableContainer') tableContainer: ElementRef;

  isMobileTest = environment.mobileTest;
  dataToSend: ObtenVentasFlashVentasRequestBody;

  authInfo:AuthModel;

  rowHeight = 30;
  summaryHeight = 50;
  summaryRow = true;
  lastScannedOffsetY: number;


  calculoVarVtaPesos: string;
  calculoVARMT: string;
  calculoALCANCE: string;
  calculoCOBERTURA: string;
  calculoITTKPROMCN: string;
  calculoITTKPROMC: string;
  calculoITTKPRTAEN: string;
  calculoITTKPRTAE: string;

  getIdColumnClass = getIdColumnClass;

  optionsMarcas = optionsMarcas;
  sentData;
  optionsFechas = [];

  optionsINCDEC = [
    {value: '', label: 'Seleccione'},
    {value: 'vsVenta-1', label: 'Venta +'},
    {value: 'vsVenta-2', label: 'Venta -'},
    {value: 'vsCuota-1', label: 'Cuota +'},
    {value: 'vsCuota-2', label: 'Cuota -'},
    {value: 'vsMix-1', label: 'Venta/Cuota +'},
    {value: 'vsMix-2', label: 'Venta/Cuota -'},
    {value: 'vsUBruta-1', label: 'Utilidad Bruta +'},
    {value: 'vsUBruta-2', label: 'Utilidad Bruta -'}
  ];

  selectedPeriodo: string;
  selectedMarca = 0;
  selectedINCDEC = '';

  showCiudad: boolean;
  showEstado: boolean;
  showDirector: boolean;
  showSupervisor: boolean;
  showVerTiendas: boolean;
  showMargen: boolean;

  showModalInfo: boolean;

  filterTienda;
  porMargen;
  porDia;
  porMes;
  porEstado;
  nivelBread = 1;
  currentTipoQuery;

  levelDrillDown: Array<LevelDrillDownModel> = [];

  _startDate = null;
  _endDate = null;

  fechaDeInstance: pgDatePickerComponent;
  fechaAInstance: pgDatePickerComponent;

  advanceRows: Array<ObtenerVentaFlashVentasJson> = [];
  advanceRowsBck: Array<ObtenerVentaFlashVentasJson> = [];

  scrollBarHorizontal = (window.innerWidth < 960);
  subResizeDatatable$: Subscription;


  constructor(private _flashService: FlashVentasService
    , public _pagesToggleService: pagesToggleService
    , private _renderer: Renderer2, private _authService: AuthService) {

    moment.locale('es');

    _pagesToggleService.togglePinnedColumn(window.innerWidth > 1025);
    Object.assign(this, {authInfo: this._authService.getLoggedInInfo()});

  }

  ngOnDestroy(): void {
    this.subResizeDatatable$.unsubscribe();
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


    this.updateDataModel();

    if (this.isMobileTest) {

      this.fetchSampleAdvance((data) => {
        this.advanceRows = data;
      });

    } else {

      this.getData();
    }

    this.showVerTiendas = true;


    this.subResizeDatatable$ = this._pagesToggleService.resizeDatatable$.subscribe(() => this.resizeDatatable());

  }


  _startValuePeriodoChange = () => {

    try {
      const currentDate = moment(new Date());
      const [mesSeleccionado, anioSeleccionado] = this.selectedPeriodo.split('/');
      const selectedPeriodo = moment(`${mesSeleccionado}-01-${anioSeleccionado}`, 'MM-DD-YYYY');

      this._startDate = selectedPeriodo.toDate();

      if (selectedPeriodo.get('month') === currentDate.get('month')) {
        this._endDate = moment().subtract(1, 'day').toDate();
      } else {
        this._endDate = selectedPeriodo.endOf('month').toDate();
      }

      this.getDataMismoNivel();
    } catch (e) {

    }
  }

  _startMarcaChange = () => {
    this.getDataMismoNivel();
  }

  _startINCDECChange = () => {
    this.getDataMismoNivel();
  }

  _startValueChange = () => {
    if (this._startDate > this._endDate) {
      this._endDate = null;
    }

    this.getDataMismoNivel();
  }

  _endValueChange = () => {
    if (this._startDate > this._endDate) {
      this._startDate = null;
    }

    this.getDataMismoNivel();
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
    this.getDataMismoNivel();
  }

  getData(row?: ObtenerVentaFlashVentasJson) {

    Object.assign(this.dataToSend, this.getInputData());

    let nombre;
    let showModalInfo: boolean;
    const tipo = this.getTipoQuery();
    const currentLevelInfo = this.getCurrentLevelInfo();

    let addBread = false;


    if (row) {
      nombre = row.NOMBRE;
      addBread = true;


      if (tipo === tipoQuery.TIENDA) {
        this.dataToSend.Nivel = this.nivelBread;
        this.dataToSend.Estado = '';
        this.dataToSend.Tienda = 0;


        if (currentLevelInfo.data.Nivel >= maxLevelTipoQuery.TIENDA) {
          showModalInfo = true;
          this.dataToSend.Nivel = 5; // nivel emergente;
          this.dataToSend.Tienda = row.ID;
        } else {
          this.dataToSend.Director = row.ID;
        }


      } else if (this.porEstado) {


        if (currentLevelInfo.data.Nivel === 1) { // primer nivel de agrupación por estado
          this.dataToSend.Nivel = 3;
          this.dataToSend.Estado = row.NOMBRE;
          this.dataToSend.Tienda = 0;
        } else if (currentLevelInfo.data.Nivel === 3) {
          this.dataToSend.Nivel = 5;
          this.dataToSend.Estado = '';
          this.dataToSend.Tienda = row.ID;
          showModalInfo = true;

        }


      } else if (this.porDia) {

        this.dataToSend.Tipo = tipo;
        this.dataToSend.Nivel = 4;


        if (currentLevelInfo.data.Nivel === 4) { // se abre modal
          nombre = new DatePipe('en-US').transform(row.NOMBRE, 'dd/MM/yyyy');
          this.dataToSend.Nivel = 3;
          this.dataToSend.Tipo = tipo;
          this.dataToSend.FechaInicial = nombre;
          this.dataToSend.FechaFinal = nombre;

          showModalInfo = true;

        }


      } else if (this.porMes) {

        this.dataToSend.Tipo = tipo;
        this.dataToSend.Nivel = 1;


        if (currentLevelInfo.data.Nivel === 1) { // se abre modal

          this.dataToSend.Nivel = 3;
          this.dataToSend.Tipo = tipo;
          nombre = new DatePipe('en-US').transform(row.NOMBRE, 'dd/MM/yyyy');
          showModalInfo = true;

        }


      }
    }

    this.dataToSend.Tipo = tipo;

    const bodyReq = this.sentData = this._flashService.generaBodyFlashVentas(this.dataToSend);
    this._flashService.makeSoapCall(bodyReq).subscribe(
      (resp: Array<ObtenerVentaFlashVentasJson>) => {

        this.showModalInfo = showModalInfo;
        this.advanceRowsBck = [...this.advanceRows];

        this.calculaSummary(resp);
        this.advanceRows = resp;

        if (addBread || this.levelDrillDown.length === 0) {
          this.addLevel({...this.dataToSend}, nombre);
        }


        this.setColumnsVisibility();
      }
    );
  }

  getDataMismoNivel() {

    let resetBreadToHome = false;
    const requestData = this.getCurrentLevelInfo().data;
    Object.assign(requestData, this.getInputData());


    if (this.porEstado) {

      /***  nivel 1 por estado ***/
      requestData.Nivel = 1;
      requestData.Tipo = this.getTipoQuery();
      /*** ***/

    } else if (this.porDia) {

      requestData.Nivel = 4;
      requestData.Tipo = this.getTipoQuery();

    } else if (this.porMes) {

      requestData.Nivel = 1;
      requestData.Tipo = this.getTipoQuery();

    } else {

      /*** Obtener último nivel sin agrupacion ***/

      const [lastLevelSinAgrup] = this.levelDrillDown.filter(levelInfo => levelInfo.data.Tipo === 'TIENDA').slice(-1);


      if (lastLevelSinAgrup) {
        this.getDataFromBread(lastLevelSinAgrup);
        return;
      } else {

        /** Reset Values to HOME **/
        this.updateDataModel();
        resetBreadToHome = true;
        Object.assign(requestData, this.dataToSend);
      }

    }

    if (this.porMargen) {
      requestData.MT = 1;
    }


    const bodyReq = this.sentData = this._flashService.generaBodyFlashVentas(requestData);
    this._flashService.makeSoapCall(bodyReq).subscribe(
      (resp: Array<ObtenerVentaFlashVentasJson>) => {
        this.advanceRows = resp;

        if (resetBreadToHome) {
          this.resetBread(requestData);
        }

        this.setColumnsVisibility();

      }
    );
  }


  getDataFromBread(drillInfo: LevelDrillDownModel) {

    Object.assign(drillInfo.data, this.getInputData());

    const tipoQueryDrill = drillInfo.data.Tipo;

    this.porEstado = tipoQueryDrill === tipoQuery.ESTADO;
    this.porMes = tipoQueryDrill === tipoQuery.MES;
    this.porDia = tipoQueryDrill === tipoQuery.DIA;


    const bodyReq = this.sentData = this._flashService.generaBodyFlashVentas(drillInfo.data);

    this._flashService.makeSoapCall(bodyReq).subscribe(
      (resp: Array<ObtenerVentaFlashVentasJson>) => {
        this.advanceRows = resp;
        this.nivelBread = drillInfo.level + 1;
        this.levelDrillDown.splice(drillInfo.level);

        this.setColumnsVisibility();
      }
    );
  }

  showTiendas(row: ObtenerVentaFlashVentasJson) {


    const requestData = {...this.getCurrentLevelInfo().data};
    const {ID, NOMBRE} = row;

    requestData.Nivel = 3;
    requestData.Director = !Number(ID) ? 0 : ID;

    const bodyReq = this.sentData = this._flashService.generaBodyFlashVentas(requestData);
    this._flashService.makeSoapCall(bodyReq).subscribe(
      (resp: Array<ObtenerVentaFlashVentasJson>) => {
        this.advanceRows = resp;

        this.addLevel({...requestData}, NOMBRE);
        this.setColumnsVisibility();
      }
    );

  }


  updateDataModel() {

    this.dataToSend = new ObtenVentasFlashRequest({
      Marca: this.selectedMarca,
      FechaInicial: this.getFechaUltimoAnio(),
      FechaFinal: moment(this._endDate).format('DD/MM/YYYY')
    });
  }


  getInputData() {


    const selectedINCDEC = this.selectedINCDEC;
    const incdec = {};

    if (selectedINCDEC !== '') {
      const [attr, value] = selectedINCDEC.split('-');

      if (attr.includes('vsMix')) {
        Object.assign(incdec, {vsCuota: value, vsVenta: value});
      } else {
        Object.assign(incdec, {[attr]: value});
      }
    }

    return {
      Tienda: this.filterTienda || 0,
      Marca: this.selectedMarca,
      FechaInicial: this.getFechaUltimoAnio(),
      FechaFinal: moment(this._endDate).format('DD/MM/YYYY'),
      ...incdec
    };
  }

  getTipoQuery() {
    return this.porMes ? tipoQuery.MES : this.porDia ? tipoQuery.DIA : this.porEstado ? tipoQuery.ESTADO : tipoQuery.TIENDA;
  }

  addLevel(data: ObtenVentasFlashVentasRequestBody, nombre: string) {

    this.levelDrillDown.push(Object.assign({}, {
      level: this.nivelBread,
      nombre,
      data
    }));

    this.nivelBread++;
  }

  destroyLevelBread(level: number) {
    const indexToSplice = this.levelDrillDown.findIndex(levelInfo => levelInfo.level === level);

    if (indexToSplice !== -1) {
      this.levelDrillDown.splice(indexToSplice);
      this.nivelBread = level;
    }


  }

  resetBread(data: ObtenVentasFlashVentasRequestBody) {
    this.levelDrillDown = [
      Object.assign({}, {
        level: 1,
        nombre: ''
      }, {data})
    ];

    this.nivelBread = 2;
    this.dataToSend.Tienda = 0;
  }

  goToLevel(nivel: number) {

    if (this.showModalInfo) {
      return;
    }

    const dataLevel = this.levelDrillDown.find(level => level.level === nivel);
    if (nivel === 1) {
      this.dataToSend.Director = 0;
    }
    this.getDataFromBread(dataLevel);
  }

  getCurrentLevelInfo() {
    return this.levelDrillDown.find(levelInfo => levelInfo.level === this.nivelBread - 1);
  }


  nullFn() {
    return '&nbsp;';
  }

  setColumnsVisibility() {

    const {data} = this.getCurrentLevelInfo();
    const tipoQueryActual = this.getTipoQuery();

    this.tableAdvance.sorts = [];

    this.showEstado = this.showDirector = this.showSupervisor =
      (this.porEstado && data.Nivel === 3) || (!this.porEstado && data.Tipo === tipoQuery.TIENDA && data.Nivel === 3);

    this.showVerTiendas = (tipoQueryActual !== tipoQuery.DIA && tipoQueryActual !== tipoQuery.MES) && data.Nivel !== 3 && !this.porEstado;

    this.currentTipoQuery = tipoQueryActual;
    this.showMargen = this.porMargen;


    if (this.showModalInfo) {
      this.summaryRow = false;
      this.showMargen = true;
      this.resizeDatatable();
    }


    setTimeout(() => this.tableScroll({offsetY: this.lastScannedOffsetY || 0}), 100);

  }

  resizeDatatable() {
    if (this.showModalInfo) {
      this.summaryRow = false;
      this._renderer.setStyle(this.tableContainer.nativeElement, 'height', `${window.innerHeight - 300}px`);
      this.tableAdvance.recalculate();
    }
  }

  exitModalInfo() {
    this.destroyLevelBread(this.getCurrentLevelInfo().level);
    this.showModalInfo = false;
    this.showMargen = false;
    this.summaryRow = true;
    this.advanceRows = [...this.advanceRowsBck];
    this._renderer.setStyle(this.tableContainer.nativeElement, 'height', '500px');
    this.setColumnsVisibility();
    this.tableAdvance.recalculate();
  }

  tableScroll(event) {

    if (!this.showModalInfo) {
      const {offsetY} = event;
      const totalH = (this.advanceRows.length * this.rowHeight); // altura Total;
      const totalAllowed = totalH; //+ this.summaryHeight;

      const element = document.querySelector('datatable-summary-row');
      let heightToSet = 330 + offsetY;

      if (heightToSet + this.summaryHeight >= totalH && heightToSet <= totalH) {
        heightToSet += 5;
      }

      heightToSet = heightToSet > totalAllowed ? totalAllowed : heightToSet;


      try {
        this._renderer.setStyle(element, 'transform', 'translate3d(0px,' + heightToSet + 'px, 0px)');
        this.lastScannedOffsetY = offsetY;
      } catch (e) {
        // aun no se renderea el summary
      }
    }

  }

  searchTienda() {

    if (this.filterTienda && this.filterTienda !== '') {

      this.destroyLevelBread(2);

      this.porEstado = false;
      this.porDia = false;
      this.porMes = false;
      this.selectedMarca = 0;
      this.updateDataModel();

      const requestData = {...this.dataToSend};

      requestData.Tienda = this.filterTienda;
      requestData.Nivel = 3;

      const bodyReq = this.sentData = this._flashService.generaBodyFlashVentas(requestData);
      this._flashService.makeSoapCall(bodyReq).subscribe(
        (resp: Array<ObtenerVentaFlashVentasJson>) => {
          this.advanceRows = resp;
          this.addLevel({...requestData}, 'Tienda');
          this.setColumnsVisibility();
        }
      );

    }
  }

  descargaExcel() {
    this._flashService.downloadFile().subscribe(() => {
    });
  }

  getFechaUltimoAnio() {
    if (this.porMes) {
      return moment(new Date()).subtract(11, 'months').startOf('month').format('DD/MM/YYYY');
    } else {
      return moment(this._startDate).format('DD/MM/YYYY');
    }
  }


  calculaSummary(rows: Array<ObtenerVentaFlashVentasJson>) {


    let VarVtaPesos: number;
    let VARMT: number;
    let ALCANCE: number;
    let COBERTURA: number;
    let ITTKPROMCN: number;
    let ITTKPROMC: number;
    let ITTKPRTAEN: number;
    let ITTKPRTAE: number;

    const sumITVTMCIASN = rows.reduce((sum, cell) => sum += cell.ITVTMCIASN, 0);
    const sumITVTMCIAS = rows.reduce((sum, cell) => sum += cell.ITVTMCIAS, 0);
    const sumVTAMT = rows.reduce((sum, cell) => sum += cell.VTAMT, 0);
    const sumVTAMTLY = rows.reduce((sum, cell) => sum += cell.VTAMTLY, 0);
    const sumITPRESUP = rows.reduce((sum, cell) => sum += cell.ITPRESUP, 0);
    const sumcuotaMensual = rows.reduce((sum, cell) => sum += cell.cuotaMensual, 0);
    const sumITNUTKMCIN = rows.reduce((sum, cell) => sum += cell.ITNUTKMCIN, 0);
    const sumITNUTKMCI = rows.reduce((sum, cell) => sum += cell.ITNUTKMCI, 0);
    const sumITVTUNIMCN = rows.reduce((sum, cell) => sum += cell.ITVTUNIMCN, 0);
    const sumITVTUNMCT = rows.reduce((sum, cell) => sum += cell.ITVTUNMCT, 0);

    if (sumITVTMCIASN === 0) {
      VarVtaPesos = 0;
      VARMT = 0;
    } else {
      VarVtaPesos = ((sumITVTMCIAS / (sumITVTMCIASN - 1)) * 100) - 100;
      VARMT = ((sumVTAMT / (sumVTAMTLY - 1)) * 100) - 100;
    }

    if (sumITPRESUP === 0) {
      ALCANCE = 0;
    } else {
      ALCANCE = ((sumITVTMCIAS / (sumITPRESUP)) * 100);
    }

    if (sumcuotaMensual === 0) {
      COBERTURA = 0;
    } else {
      COBERTURA = (sumITVTMCIAS / sumcuotaMensual) * 100;
    }

    if (sumITNUTKMCI === 0) {
      ITTKPROMC = 0;
      ITTKPRTAE = 0;
    } else {
      ITTKPROMC = sumITVTMCIAS / sumITNUTKMCI;
      ITTKPRTAE = sumITVTUNMCT / sumITNUTKMCI;
    }

    if (sumITNUTKMCIN === 0) {
      ITTKPROMCN = 0;
      ITTKPRTAEN = 0;
    } else {
      ITTKPROMCN = sumITVTMCIASN / sumITNUTKMCIN;
      ITTKPRTAEN = sumITVTUNIMCN / sumITNUTKMCIN;
    }

    this.calculoVarVtaPesos = new DecimalPipe('en-US').transform(VarVtaPesos, '1.2-2');
    this.calculoVARMT = new DecimalPipe('en-US').transform(VARMT, '1.2-2');
    this.calculoALCANCE = new DecimalPipe('en-US').transform(ALCANCE, '1.2-2');
    this.calculoCOBERTURA = new DecimalPipe('en-US').transform(COBERTURA, '1.2-2');
    this.calculoITTKPROMCN = new DecimalPipe('en-US').transform(ITTKPROMCN, '1.0-0');
    this.calculoITTKPROMC = new DecimalPipe('en-US').transform(ITTKPROMC, '1.0-0');
    this.calculoITTKPRTAEN = new DecimalPipe('en-US').transform(ITTKPRTAEN, '1.2-2');
    this.calculoITTKPRTAE = new DecimalPipe('en-US').transform(ITTKPRTAE, '1.2-2');
  }

  getCalculoVarVtaPesos = () => this.calculoVarVtaPesos;
  getCalculoVARMT = () => this.calculoVARMT;
  getCalculoALCANCE = () => this.calculoALCANCE;
  getCalculoCOBERTURA = () => this.calculoCOBERTURA;
  getCalculoITTKPROMCN = () => this.calculoITTKPROMCN;
  getCalculoITTKPROMC = () => this.calculoITTKPROMC;
  getCalculoITTKPRTAEN = () => this.calculoITTKPRTAEN;
  getCalculoITTKPRTAE = () => this.calculoITTKPRTAE;


  sumaCantidades = (celdas: Array<number>) => {
    const suma = celdas.reduce((sum, cell) => sum += cell, 0);
    return new DecimalPipe('en-US').transform(suma, '1.0-0');
  }

  sumaPorcentaje = (celdas: Array<number>) => {
    const suma = celdas.reduce((sum, cell) => sum += cell, 0);
    return new DecimalPipe('en-US').transform(suma, '1.2-2');
  }

  transformDateToAmerican = (dateStr: string) => {
    const [dia, mes, anio] = dateStr.split('/');
    return `${mes}/${dia}/${anio}`;
  }

}
