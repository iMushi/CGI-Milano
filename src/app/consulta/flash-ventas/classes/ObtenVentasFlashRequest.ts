import { ObtenVentasFlashVentasRequestBody } from '../../../../models/requestBody/ObtenVentasFlashVentasRequestBody ';

export class ObtenVentasFlashRequest implements ObtenVentasFlashVentasRequestBody {
  Director: number;
  Estado: string;
  FechaFinal: string;
  FechaInicial: string;
  MT: number;
  Marca: number;
  Nivel: number;
  TCerrada: boolean;
  Tienda: number;
  Tipo: string;
  vsCuota: number;
  vsUBruta: number;
  vsVenta: number;

  constructor(params: ObtenVentasFlashVentasRequestBody = {} as ObtenVentasFlashVentasRequestBody) {
    const {
      vsVenta = 0,
      vsUBruta = 0,
      vsCuota = 0,
      Tipo = 'TIENDA',
      Tienda = 0,
      TCerrada = false,
      Nivel = 1,
      MT = 0,
      Marca = 0,
      FechaInicial = '01/01/2019',
      FechaFinal = '20/01/2019',
      Estado = '',
      Director = 0
    } = params;

    this.vsCuota = vsCuota;
    this.vsUBruta = vsUBruta;
    this.vsVenta = vsVenta;
    this.Tipo = Tipo;
    this.Tienda = Tienda;
    this.TCerrada = TCerrada;
    this.Nivel = Nivel;
    this.MT = MT;
    this.Marca = Marca;
    this.FechaInicial = FechaInicial;
    this.FechaFinal = FechaFinal;
    this.Estado = Estado;
    this.Director = Director;
  }

}
