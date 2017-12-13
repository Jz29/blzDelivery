import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PedidosClientePage } from './pedidos-cliente';

@NgModule({
  declarations: [
    PedidosClientePage,
  ],
  imports: [
    IonicPageModule.forChild(PedidosClientePage),
  ],
})
export class PedidosClientePageModule {}
