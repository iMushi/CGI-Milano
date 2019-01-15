export interface ObtenVentasFlashVentasRequestBody {
  Tipo?: string;
  Nivel?: number;
  Estado?: string;
  Director?: number;
  Marca?: number;
  FechaInicial?: string;
  FechaFinal?: string;
  TCerrada?: boolean;
  Tienda?: number;
  MT?: number;
  vsVenta?: number;
  vsCuota?: number;
  vsUBruta?: number;
}
