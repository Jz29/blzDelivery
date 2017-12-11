import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AtendentePedidosPage } from './atendente-pedidos';

@NgModule({
  declarations: [
    AtendentePedidosPage,
  ],
  imports: [
    IonicPageModule.forChild(AtendentePedidosPage),
  ],
})
export class AtendentePedidosPageModule {}
