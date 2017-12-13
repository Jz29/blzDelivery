import { Component } from '@angular/core';
import {AlertController, Platform, ActionSheetController,  IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the AtendentePedidosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-atendente-pedidos',
  templateUrl: 'atendente-pedidos.html',
})
export class AtendentePedidosPage {
  
  statuspedido;
  msg;
  pedidos = [];
  nomecliente;
  buttonstatus;
  data: Date;

  constructor(private alertCtrl: AlertController, public plt: Platform, private localNotifications: LocalNotifications, public actionSheetCtrl: ActionSheetController,public auth:AuthProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.pedidos = [];
    this.nomecliente = "";
    this.buttonstatus = false;
    this.msg = false;
    this.statuspedido = 'Marcado';
    this.loadData();
    this.init();
  }

  ionViewDidLoad() {
    this.pedidos = [];
    this.init();    
  } 


  init(){
    this.pedidos = [];
    this.loadData();
  }

  recaregar(){
    this.init();
  }


  loadData(){
    //this.pedidos = [];
    if(this.pedidos.length >= 0){
      this.pedidos = [];
    }
    this.localNotifications.cancelAll();    
    var ref = this.auth.getDataBaseList("users","pedidosAtender");
    ref.once("value",(snapshots)=>{
      for (var item in snapshots.val()) {
        //console.log(snapshots.val()[item]);
        this.getPedidosFromDatabase(snapshots.val()[item]);
      }
      if(snapshots.val() == null){
        this.msg = true;
      }
    });
  }


  validaHora(data){
    var date = new Date();
    var aux = new Date();
    var atual ,prox;
    date.setFullYear(data.data.slice(0,4))
    date.setMonth(data.data.slice(5,7))
    date.setDate(data.data.slice(8,10))
    date.setHours(data.horario.slice(0,2));
    date.setMinutes(data.horario.slice(3,5));
    
    var ha = parseInt(aux.getHours().toString())
    var ph = parseInt(date.getHours().toString())
    
    //console.log(aux.toLocaleString())
    
    atual = parseInt(aux.getFullYear().toString());
    prox=  parseInt( date.getFullYear().toString())

    if(atual > prox){
      return false;
    }

    atual = parseInt(aux.getMonth().toString());
    prox=  parseInt( date.getMonth().toString())

    if(atual > prox){
      return false;
    }
    
    atual = parseInt(aux.getDate().toString());
    prox=  parseInt( date.getDate().toString())

    
    //console.log("-------------------------------------------------------")
    //console.log("Prox:" + prox ,"-", "atual",atual);
  
    this.data = new Date(date) ;

    if( atual <= prox ){
      
      //console.log("Prox:" + ph ,"-", "atual",ha);
      
      if(atual == prox){
        if(ha >= ph ){
          return false;
        }
      }  
      return true; 
      
    }else{
      //console.log("bye")
      return false;
    }

   // console.log(date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours()+":"+date.getMinutes());
  }
  
  gerarNotificacao(data){
    

    this.data.setHours(this.data.getHours()-1);
    var text = "Falta uma hora para antender o cliente " +data.clienteNome + " !";
    if (this.plt.is('cordova')) {
      alert("Corodova");
      console.log("CORDOVA");
      this.localNotifications.schedule({
        id: 1,
        at: new Date(this.data.getTime()-1800000),
        led: 'FF0000',
        title: 'BLz Delivery' ,
        text: text,
        sound: 'file://assets/alert.mp3',
        data: { secret: "key" }
      });
    }
  }

  statusCancelado(id){
    var end = "/Pedidos/" + id +"/status/"
    this.auth.getDataBaseEndereco(end).set("Cancelado");
  }

  getPedidosFromDatabase(id){
    var end = "/Pedidos/"+ id;
    this.auth.getDataBaseEnd(end).on("value",(snap)=>{
        
      var i=0;
      if(this.statuspedido == snap.val().status){
        this.getClienteNameFromDataBase(snap.val().clienteId)
          
        var data= {
            clienteNome: this.nomecliente,
            status:snap.val().status,
            key: snap.key,
            preco: snap.val().preco,
            horario: snap.val().horario,
            data:snap.val().data,
            atendente:snap.val().atendente,
            tipo:snap.val().tipo,
            endereco:snap.val().endereco
          }
          if(this.validaHora(data)){
            this.gerarNotificacao(data);
            console.log(this.data.getTime())
            //console.log(data.data ,"  Data Valida");
          }else{
            this.statusCancelado(data.key);
            //console.log(data.data ,"  Data INvalida")
          }
          //console.log(snap.val().endereco);
          this.pedidos.push(data);
          i++;
       
      }
      if(i<=0){
        this.msg = true;
      }else{
        this.msg = false;
      }

      });
  }

  getClienteNameFromDataBase(id){
    var end = "/users/"+id+"/data/nome/"
    var ref = this.auth.getDataBaseEndereco(end);
    ref.on('value',(snap)=>{
      this.nomecliente = snap.val();
    });

  }

  statusPedido(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Status do pedido',
      buttons: [
        {
          text: 'Marcados',
          handler: () => {
            this.buttonstatus = false;
            this.statuspedido = 'Marcado';
            this.loadData()
          }
        },
        {
          text: 'Cancelados',
          handler: () => {

            this.buttonstatus = true;
            this.statuspedido = 'Cancelado';
            this.loadData()
          }
        },
        {
          text: 'Feitos',
          handler: () => {
            this.buttonstatus = true;
            this.statuspedido = 'Feito';
            this.loadData()
          }
        }
      ]
    });
    actionSheet.present();
  }

  atenderServico(servico){
    this.alertNovoPedido(servico);
  }


  alertNovoPedido(servico){
    var msg = "O atendimento do cliente "+ servico.clienteNome + " esta iniciando agora !"; 
    let alert = this.alertCtrl.create({
      title: 'Iniciando Atendimento' ,
      subTitle: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.mudarStatusFeito(servico);
          }
        }]
    });
    alert.present();
    
  }
  
  mudarStatusFeito(servico){
    var end = "/Pedidos/"+servico.key+"/status";
    var ref = this.auth.getDataBaseEndereco(end).set("Feito").then(()=>{
      this.loadData();      
    });
  }

}
