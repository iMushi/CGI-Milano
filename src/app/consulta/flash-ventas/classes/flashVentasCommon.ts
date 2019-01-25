import { DecimalPipe } from '@angular/common';
import { ObtenerVentaFlashVentasJson } from '../../../../models/response/ObtenerVentaFlashVentasJson';

export const enum tipoQuery {
  'DIA' = 'DIA',
  'MES' = 'MES',
  'ESTADO' = 'ESTADO',
  'TIENDA' = 'TIENDA'
}

export const enum maxLevelTipoQuery {
  'DIA' = 1,
  'MES' = 1,
  'ESTADO' = 1,
  'TIENDA' = 3
}

export const optionsMarcas = [
  {value: 0, label: 'TODAS'},
  {value: 10, label: 'MELODY'},
  {value: 30, label: 'MILANO'},
  {value: 60, label: 'HOME & FASHION'},
  {value: 70, label: 'TOKYO'}
];

export function getIdColumnClass(value: string) {
  return `idColor${value}`;
}
export function calculaSummary(rows: Array<ObtenerVentaFlashVentasJson>) {


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

export const getCalculoVarVtaPesos = () => this.calculoVarVtaPesos;
export const getCalculoVARMT = () => this.calculoVARMT;
export const getCalculoALCANCE = () => this.calculoALCANCE;
export const getCalculoCOBERTURA = () => this.calculoCOBERTURA;
export const getCalculoITTKPROMCN = () => this.calculoITTKPROMCN;
export const getCalculoITTKPROMC = () => this.calculoITTKPROMC;
export const getCalculoITTKPRTAEN = () => this.calculoITTKPRTAEN;
export const getCalculoITTKPRTAE = () => this.calculoITTKPRTAE;


export const sumaCantidades = (celdas: Array<number>) => {
  const suma = celdas.reduce((sum, cell) => sum += cell, 0);
  return new DecimalPipe('en-US').transform(suma, '1.0-0');
};

export const sumaPorcentaje = (celdas: Array<number>) => {
  const suma = celdas.reduce((sum, cell) => sum += cell, 0);
  return new DecimalPipe('en-US').transform(suma, '1.2-2');
};

export const transformDateToAmerican = (dateStr: string) => {
  const [dia, mes, anio] = dateStr.split('/');
  return `${mes}/${dia}/${anio}`;
};
