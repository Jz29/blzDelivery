import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaatendimentoPage } from './listaatendimento';

@NgModule({
  declarations: [
    ListaatendimentoPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaatendimentoPage),
  ],
})
export class ListaatendimentoPageModule {}
