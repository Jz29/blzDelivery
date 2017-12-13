import { Component } from '@angular/core';
import { UsuarioPage } from '../usuario/usuario';
import {AtendentePedidosPage} from '../atendente-pedidos/atendente-pedidos';
import {AtendenteServicosPage} from '../atendente-servicos/atendente-servicos';

@Component({
  templateUrl: 'tabsatendente.html'
})
export class TabsAtendentePage {

  tab1Root = AtendenteServicosPage;
  tab2Root = AtendentePedidosPage;
  tab3Root = UsuarioPage;
  
  constructor() {
    
  }


}
