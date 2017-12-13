import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ListaatendimentoPage } from '../../pages/listaatendimento/listaatendimento';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../../providers/auth/auth';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the ServicosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-servicos',
  templateUrl: 'servicos.html',
})
export class ServicosPage {

  constructor(public alertCtrl: AlertController, auth: AuthProvider,private atAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
    //this.listaAtendimento();
  }

  ionViewDidLoad() {
  }

 // addServico(){
   // console.log("Lista de Serviços");
   // this.navCtrl.push(ListaservicosPage);
   listaAtendimento(servico){
    this.showRadio(servico);
  }

  showRadio(servico) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Região');

    alert.addInput({
      type: 'radio',
      label: 'Norte',
      value: 'norte',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Sul',
      value: 'sul',
      checked: false
    },);

    alert.addInput({
      type: 'radio',
      label: 'Taquaralto',
      value: 'taquaralto',
      checked: false
    },);

    alert.addInput({
      type: 'radio',
      label: 'Taquarusul',
      value: 'taquarusul',
      checked: false
    },);
    
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        var dataA = {sevico:servico,regiao:data}
        this.navCtrl.push(ListaatendimentoPage,dataA);
      }
    });
    alert.present();
  }

}
