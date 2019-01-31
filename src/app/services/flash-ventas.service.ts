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

  downloadFile() {


    const body = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
    <Body>
        <ObtenVentaFlashVentasExcel xmlns="http://tempuri.org/"/>
    </Body>
</Envelope>`;

    const headers = new HttpHeaders().
      set('Content-Type', 'text/xml').
      append('SOAPAction', 'http://tempuri.org/IWsCGI/ObtenVentaFlashVentasExcel');

    return this.http.post('http://pruebas-mm.milano-melody.net/WSCGI/WsCGI.WsCGI.svc', body, {
      headers,
      responseType: 'text'
    }).map(resp => {


      const parser = new DOMParser();
      const xmlResponse: Document = parser.parseFromString(resp, 'text/xml');

      const response = xmlResponse.getElementsByTagName('ObtenVentaFlashVentasExcelResult').item(0).textContent;


      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(response, 'excel.xlsx');
      } else {
        const link = document.createElement('a');
        const blob = new Blob([this.s2ab(atob(response))], {type: ''});

        link.setAttribute('type', 'hidden');
        link.download = 'excel.xlsx';
        link.href = window.URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();



      }


    });


  }

   s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i=0; i !=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

}
