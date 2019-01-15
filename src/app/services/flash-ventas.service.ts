import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObtenVentasFlashVentasRequestBody } from '../../models/requestBody/ObtenVentasFlashVentasRequestBody ';

@Injectable()
export class FlashVentasService {

  constructor(private http: HttpClient) {
  }


  makeSoapCall(body: string) {


    const headers = new HttpHeaders().
      set('Content-Type', 'text/xml').
      append('SOAPAction', 'http://tempuri.org/IWsCGI/ObtenVentaFlashVentasJson');

    return this.http.post('http://pruebas-mm.milano-melody.net/WSCGI/WsCGI.WsCGI.svc', body, {
      headers,
      responseType: 'text'
    }).map(resp => {


      const parser = new DOMParser();
      const xmlResponse: Document = parser.parseFromString(resp, 'text/xml');

      const response = JSON.parse(
        xmlResponse.getElementsByTagName('ObtenVentaFlashVentasJsonResult').item(0).textContent
      );

      return response;

    });

  }

  generaBodyFlashVentas(params: ObtenVentasFlashVentasRequestBody): string {

    const {
      Director: director,
      Estado: estado,
      FechaFinal: fechaFinal,
      FechaInicial: fechaInicial,
      Marca: marca,
      MT: mt,
      Nivel: nivel,
      TCerrada: tCerrada,
      Tienda: tienda,
      Tipo: tipo,
      vsCuota: vsCuota,
      vsUBruta: vsUBruta,
      vsVenta: vsVenta
    } = params;

    return `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
    <Body>
        <ObtenVentaFlashVentasJson xmlns="http://tempuri.org/">
            <Tipo>${tipo}</Tipo>
                <Nivel>${nivel}</Nivel>
                <Estado>${estado}</Estado>
                <Director>${director}</Director>
                <Marca>${marca}</Marca>
                <FechaInicial>${fechaInicial}</FechaInicial>
                <FechaFinal>${fechaFinal}</FechaFinal>
                <TCerrada>${tCerrada}</TCerrada>
                <Tienda>${tienda}</Tienda>
                <MT>${mt}</MT>
                <vsVenta>${vsVenta}</vsVenta>
                <vsCuota>${vsCuota}</vsCuota>
                <vsUBruta>${vsUBruta}</vsUBruta>
        </ObtenVentaFlashVentasJson>
    </Body>
</Envelope>`;

  }
}
