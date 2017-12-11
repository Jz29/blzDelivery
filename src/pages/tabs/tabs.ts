import { Component } from '@angular/core';
import { ServicosPage } from '../servicos/servicos';
import { UsuarioPage } from '../usuario/usuario';
import { ContatoPage } from '../contato/contato';
import {PedidosClientePage} from '../../pages/pedidos-cliente/pedidos-cliente'
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ServicosPage;
  tab3Root = UsuarioPage;
  tab2Root = PedidosClientePage;
  tabParams;
  params;
  constructor(public navParams:NavParams) {
    this.params = navParams;
    //var userAux = navParams.get('user'); 
   // userAux.foi();
  }
}
