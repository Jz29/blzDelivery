import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , AlertController } from 'ionic-angular';
import { User , UserInterface} from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../../pages/login/login';
import { Events } from 'ionic-angular';
import firebase from 'firebase/app';
/**
 * Generated class for the UsuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-usuario',
  templateUrl: 'usuario.html',
})
export class UsuarioPage {
  public arrayData = [];
  public user = {} as UserInterface;
  public auxTelefone:string;
  public passwordAux:string;
  regiao; cep; quadra; numero; referencia; 
  
  constructor( public alertCtrl: AlertController ,public events: Events, public authProv:AuthProvider, public navCtrl: NavController, public navParams: NavParams) {
   
  }

  ionViewDidLoad(){
    this.carregarDados();
  }

  teste(){
    this.arrayData = [];
    var database = this.authProv.getDataBase("users","pedidos");
    return new Promise( (resolve, reject) => {
      database.once('value',(snapshots)=> {
        var i=0;
        snapshots.val().map((userSnap, index,size)=> {
          i++;
          this.arrayData.push({id:userSnap});
        });
        if(i>=snapshots.numChildren()){
          resolve("end");
        }
        
      });
    }).then((fromresolve)=>{
      console.log(fromresolve);
    });
  }
  
  initDados(){
    this.auxTelefone = "Novo numero";
    this.regiao = "";
    this.cep = "";
    this.quadra = "";
    this.numero = "";
    this.referencia = "";
  }

  mostrarConfirmacao(title, message){
    let confirm = this.alertCtrl.create({
      title: title ,
      message: message,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceitar',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  carregarDados(){
    var database = this.authProv.getDataBase("users","data");
    database.on("value", (snapshot)=> {
      this.user.nome = snapshot.val().nome;
      this.user.telefone = snapshot.val().telefone;
      this.user.email = snapshot.val().email;
      this.user.tipo = snapshot.val().usertype;
      
      var end = snapshot.val().endereco;
      if(end != null){
        this.regiao = end.regiao;
        this.cep = end.cep;
        this.quadra = end.quadra;
        this.numero = end.numero;
        this.referencia = end.referencia;
      }else{
        this.initDados();
      }

    }, (error)=> {
      console.log("Error: " + error.code);
    });
  }

  deslogarUser(){
    let confirm = this.alertCtrl.create({
      title: 'Deslogar',
      message: 'Gostaria de sair do BLz Delivery ?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Concluir',
          handler: () => {
            this.authProv.deslogarUsuario().then((func)=>{
              //this.navCtrl.popToRoot();
              this.events.publish('event:logout');
            }); 
          }
        }
      ]
    });
    confirm.present();
    
  }

  atualizarDados(user){

  }

  redefinirSenha(user){
    let confirm = this.alertCtrl.create({
      title: "Redefinir senha." ,
      message: "Ao aceitar, um email será enviado para você , assim voce poderá redefinir sua senha.",
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceitar',
          handler: () => {
            this.authProv.redefinirSenha(this.user.email);            
          }
        }
      ]
    });
    confirm.present();
  }

  salvarEndereco(){
    var ref = this.authProv.getDataBase("users","data/endereco");
    var key = this.authProv.usuarioId();

    var endereco = {
      regiao:this.regiao,
      cep:this.cep,
      quadra:this.quadra,
      numero: this.numero,
      referencia:this.referencia
    };

    ref.set(endereco).then(res=>{
      console.log("Endereco adicionado");
    }).catch((error)=>{
      console.log(error);
    });
    //this.initDados();
    this.carregarDados();
    
  }



} 
