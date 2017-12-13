import { Component } from '@angular/core';
import {AlertController  , IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UserInterface , User} from '../../models/user';
import { RegisterPage } from "../../pages/register/register";
import { TabsPage } from '../../pages/tabs/tabs';
import { TabsAtendentePage } from '../../pages/tabsatendente/tabsatendente';
import { AuthProvider } from '../../providers/auth/auth';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as UserInterface;
  aux = [];
  constructor( public events: Events, private alertCtrl: AlertController, private auth: AuthProvider  ,public navCtrl: NavController, public navParams: NavParams) {
    this.limparCampos();
    this.auth.deslogarUsuario();
  
  }

  ionViewDidLoad() {
    this.events.subscribe('event:clearLoginPage', ()=>{
      this.limparCampos();
    });
  }

  cadastrar(){
    this.navCtrl.push(RegisterPage);
  }

  mensagem(msg: string){
    let alert = this.alertCtrl.create({
      title: 'Atenção',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  };

  logar(){
    this.auth.deslogarUsuario();
    var aux = this.auth.logarComEmail(this.user.email, this.user.password);
    aux.then((result)=>{
      this.userType();
    }).catch((error)=>{
      if (error.code == 'auth/wrong-password') {
        this.mensagem("Senha incorreta.");
      } else if(error.code == "auth/invalid-email"){
        this.mensagem("o email digitado é invalido.");
      } else {
        this.mensagem("Houve um erro ! Verifique sua conexão com a web.");
      }
      console.log(error);
    });
    
  }

  userType(){
    var database =  this.auth.userType();
    database.on("value", (snapshot)=> {
      this.carregarTela(snapshot.val().usertype);
    }, (error)=> {
      console.log("Error: " + error.code);
    });
  }


  carregarTela(usertype){
    if(usertype=="client"){
      this.navCtrl.setRoot(TabsPage);
      //this.navCtrl.push(TabsPage);
    }else{
      this.navCtrl.setRoot(TabsAtendentePage);
      //this.navCtrl.push(TabsAtendentePage);
    }
    this.navCtrl.popToRoot();
  }

  limparCampos(){
    this.user.email = "";
    this.user.password = "";
  }

  

}
