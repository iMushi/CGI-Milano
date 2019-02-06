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

