import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LoadingController ,IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User ,UserInterface } from '../../models/user';
import { LoginPage } from '../../pages/login/login';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as UserInterface;
  langs;
  langForm;

  constructor(public loadingCtrl: LoadingController ,public toastCtrl: ToastController ,private afAuth: AngularFireAuth,private afDB: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.langForm = new FormGroup({
      "langs": new FormControl({value:'client', disabled: false})
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    this.user.email = "";
    this.user.nome = "";
    this.user.password = "";
    this.user.telefone= "";
    this.user.tipo = this.langForm.value;
  }

  async registrar(user: UserInterface){
    console.log(this.langForm.value.langs);

    if(!this.verificaEntradas(user)){
      return;
    }

    this.afAuth.auth.createUserWithEmailAndPassword(user.email , user.password).then((result)=>{
      this.presentLoading()
      let _timer = setTimeout(this.mensagem("Parabens ! seu cadastro foi feito com sucesso.",4000), 5000);
      this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password);
      const userId = this.afAuth.auth.currentUser.uid;
      this.saveData(user, userId);
      this.navCtrl.pop();
    }).catch((error)=>{
      //console.log(error);
      // this.mensagemError(error.code);
    });


  }

  saveData(user: UserInterface, userId){

    var endereco: String;

    this.afDB.database.ref('users/'+ userId + '/data').set({
      usertype: this.langForm.value.langs,
      nome:user.nome,
      email:user.email,
      telefone:user.telefone,
      telefone01:""
    }).catch((error)=>{
      console.log(error.message);
    });
  }

  verificaEntradas(user: UserInterface){
    if(user.email == ""  ||  user.password == "" || user.telefone == "" || user.nome == "" ){
      this.mensagem("Verifique se todos os campos estão preenchidos.",5000  );
      return false;
    }else{
      return true;
    }
  }

  mensagemError(msg){
    var mensagem:string;
    mensagem = "";
    if(msg =="auth/weak-password"){
       mensagem = "Senha fraca. a senha deve ter no minimo 8 caracteres.";
    }else if(msg == "auth/email-already-in-use"){
      mensagem = "Esse email já está sendo usado em outra conta.";
    }else{
      mensagem = "Houve um erro no cadastro. Verifique sua conexão com a internet.";
    }
    this.mensagem(mensagem,5000);
  }

  mensagem(msg, tempo){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: tempo
    });
    toast.present();
  };

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde...",
      duration: 3000
    });
    loader.present();
  }

}
