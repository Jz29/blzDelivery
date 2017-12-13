import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User ,UserInterface } from '../../models/user';
import firebase from 'firebase/app';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()

export class AuthProvider {
  user: firebase.User;
  data: firebase.database.Database;
  aux:any=[];
  constructor(private afDB: AngularFireDatabase, private afAuth: AngularFireAuth) {
    //console.log('Hello AuthProvider Provider');
  }

  usuarioId(){
    this.user = firebase.auth().currentUser;
    return this.user.uid;
  }

  logarComEmail(email:string, senha:string):any{
    return this.afAuth.auth.signInWithEmailAndPassword(email,senha);
  }

  deslogarUsuario(){
    return this.afAuth.auth.signOut();
  }

  getUserState(){
    return this.afAuth.authState
  }

  getDataBase(ini,fim){
    var end = "/" + ini + "/" + this.usuarioId() +"/"+ fim;
    var ref = this.afDB.database.ref(end);
    return ref;
  }

  getDataBaseEnd(end){
    var ref = this.afDB.database.ref(end);
    return ref;
  }

  getDataBaseEndereco(end){
    var ref = this.afDB.database.ref(end);
    var personRef: firebase.database.Reference = firebase.database().ref(end);
    return personRef;
  }

  getDataBaseList(ini,fim){
    var end = "/" + ini + "/" + this.usuarioId() +"/"+ fim;

    var ref = this.afDB.database.ref(end);
    var personRef: firebase.database.Reference = firebase.database().ref(end);
    return personRef;
  }

  getDataBaseListUser(fim){
    var end = "/" + "users" + "/" + this.usuarioId() +"/"+ fim;

    var ref = this.afDB.database.ref(end);
    var personRef: firebase.database.Reference = firebase.database().ref(end);
    return personRef;
  }

  getDataBaseListServico(fim){
    var end = "/" + "servicos" + "/" + fim;

    var ref = this.afDB.database.ref(end);
    var personRef: firebase.database.Reference = firebase.database().ref(end);
    return personRef;
  }

  getDataBaseListPedidos(){
    var end = "/" + "Pedidos" + "/" ;

    var ref = this.afDB.database.ref(end);
    var personRef: firebase.database.Reference = firebase.database().ref(end);
    return personRef;
  }

  getDataBaseListChild(child){
    var ref = this.afDB.database.ref().child(child);
    return ref;
  }

  userType(){
    var end = '/users/' + this.usuarioId() + '/data/';
    var ref = this.afDB.database.ref(end);
    return ref;
  }

  redefinirSenha(email){
    this.afAuth.auth.sendPasswordResetEmail(email);
  }

  getUserToken(){
    firebase.auth().currentUser.getToken(/* forceRefresh */ true)
    /*
    .then(function(idToken) {
      console.log(idToken);
    }).catch(function(error) {
      // Handle error
    });
    */
  }

}
