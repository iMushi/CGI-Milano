import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';


  constructor(private http: HttpClient) {

    // this.soapCall();

  }


  soapCall() {
    const sr = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
    <Body>
        <ObtenVentaFlashVentasJson xmlns="http://tempuri.org/">
            <Tipo>TIENDA</Tipo>
                <Nivel>5</Nivel>
                <Estado></Estado>
                <Director>0</Director>
                <Marca>0</Marca>
                <FechaInicial>01/01/2019</FechaInicial>
                <FechaFinal>06/01/2019</FechaFinal>
                <TCerrada>false</TCerrada>
                <Tienda>3095</Tienda>
                <MT>0</MT>
                <vsVenta>0</vsVenta>
                <vsCuota>0</vsCuota>
                <vsUBruta>0</vsUBruta>
        </ObtenVentaFlashVentasJson>
    </Body>
</Envelope>`;

    const headers = new HttpHeaders().
      set('Content-Type', 'text/xml').
      append('SOAPAction', 'http://tempuri.org/IWsCGI/ObtenVentaFlashVentasJson');

    this.http.post('http://pruebas-mm.milano-melody.net/WSCGI/WsCGI.WsCGI.svc', sr, {
      headers,
      responseType: 'text'
    }).subscribe(
      resp => {

        const parser = new DOMParser();
        const xmlResponse: Document = parser.parseFromString(resp, 'text/xml');

        const response = JSON.parse(
          xmlResponse.getElementsByTagName('ObtenVentaFlashVentasJsonResult').item(0).textContent
        );


        console.log(response);
      }
    );

  }


}
