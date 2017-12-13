import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CriarPedidosPage } from './criar-pedidos';

@NgModule({
  declarations: [
    CriarPedidosPage,
  ],
  imports: [
    IonicPageModule.forChild(CriarPedidosPage),
  ],
})
export class CriarPedidosPageModule {}
