import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { AlertController } from 'ionic-angular';
import * as moment from 'moment';

/**
 * Generated class for the CriarPedidosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-criar-pedidos',
  templateUrl: 'criar-pedidos.html',
})
export class CriarPedidosPage {
  servico;
  horario;
  data;
  status;
  regiao; cep; quadra; numero; referencia; 
  idservico;
  nome;
  minDate;
  minHorario;
  constructor(public events: Events, private alertCtrl: AlertController, public auth:AuthProvider, public navCtrl: NavController, public navParams: NavParams) {  
    //this.getDataMin();          
    this.servico = this.navParams.get("servicoId");
  }



  ionViewDidLoad() {
    this.getDataMin();      
    this.data = "";
    this.horario = "";
    this.getAtendenteNome();
    this.loadEnderecoData();
  }

  getDataMin(){
    var date = new Date();
    var minM = parseInt(date.getMonth().toString())+1;
    var minD = date.getDate().toString();
    var minH = parseInt(date.getHours().toString())+2;
    var minA = date.getFullYear().toString();

    // YYYY-MM-DDThh:mmTZD (eg 1997-07-16T19:20+01:00)
    this.minDate = minA+"-"+(minM)+"-"+minD//+"T"+minH+":20+01:00";
    console.log(this.minDate);
    var i, j;
    var aux =[];

    for(i=minH;i<24;i++){
      aux.push(i.toString());
    }
    this.minHorario = aux.toString();;
    console.log(this.minHorario);
  }

  verificarDataValida(){
  
    var date = new Date();
    var aux = new Date();
    var atual ,prox;
    date.setFullYear(this.data.slice(0,4))
    date.setMonth(this.data.slice(5,7))
    date.setDate(this.data.slice(8,10))
    date.setHours(this.horario.slice(0,2));
    date.setMinutes(this.horario.slice(3,5));
    
    var aatual = parseInt(aux.getFullYear().toString());
    var aprox=  parseInt( date.getFullYear().toString())
    if(aatual > aprox){
      return false;
    }
    var matual = parseInt(aux.getMonth().toString());
    var mprox=  parseInt( date.getMonth().toString())
    console.log("ANO")

    if(aatual == aprox){
      if(matual > mprox){
        return false;
      }
    }
    console.log("Mes")    
    var datual = parseInt(aux.getDate().toString());
    var dprox=  parseInt( date.getDate().toString())
    if(matual == mprox){
      if(datual > dprox){
        return false;
      }
    }
    console.log("Dia")
    
    var a = parseInt(aux.getHours().toString())
    var p = parseInt(date.getHours().toString())
    if( datual == dprox){
      if(a > p){
        return false;
      }
    }
    console.log("Hora")    
    return true;

    //console.log("Mes")
    
    //console.log("Dia Atual:",atual);
   // console.log("Dia prox", prox);
   
    //console.log("Prox:" + prox ,"-", "atual",atual);
    
    /*
    
    if( atual <= prox ){
      
      console.log("Data entrou")
      if(atual == prox){
        console.log("Data  igual entrou")
       
        if(a > p ){
          console.log("hora errada")
          return false;
        }

      }  
      return true; 

    }else{
      console.log("bye")
      return false;
    }
    */
  }

  loadEnderecoData(){
    var database = this.auth.getDataBase("users","data");
    database.on("value", (snapshot)=> {
  
      var end = snapshot.val().endereco;
      if(end != null){
        this.regiao = end.regiao;
        this.cep = end.cep;
        this.quadra = end.quadra;
        this.numero = end.numero;
        this.referencia = end.referencia;
      }

    }, (error)=> {
      console.log("Error: " + error.code);
    });
  }


  salvarNovoServico(){
    if(this.data=="" || this.horario==""){
      console.log("Variaveis Vazias");
      this.erroData();
      return;
    }
    
    /*
    if(!this.verificarDataValida()){
      console.log("Data Invalida");
      this.erroData();
      return;
    }
    */
    
    
    this.salvarPedido();
    let alert = this.alertCtrl.create({
      title: 'Novo pedido' ,
      subTitle: 'seu pedido foi realizado com sucesso e foi adicionado a sua pagina de pedidos',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.events.publish('event:Reload-Pedidos-Cliente');
            this.navCtrl.popToRoot();
          }
        }]
    });
    alert.present();
    
    
  }


  erroData(){
    
     let alert = this.alertCtrl.create({
       title: 'ERRO !' ,
       subTitle: 'Verifique se a data e horario são validos !',
       buttons: [
         {
           text: 'OK',
           handler: () => {
           }
         }]
     });
     alert.present();
     
     
   }

  salvarPedido(){
    
    //console.log(this.nome);
    
    //var newPostKey = this.auth.getDataBaseListChild("pedidosfeitos").push().key;    
    
    var key = this.auth.usuarioId();
    

    var endereco = {
      regiao:this.regiao,
      cep:this.cep,
      quadra:this.quadra,
      numero: this.numero,
      referencia:this.referencia
    };
    
    var servico = {
      status:"Marcado",
      tipo:this.servico.tipo,
      atendente:this.nome,
      endereco:endereco,
      data:this.data,
      horario:this.horario,
      servicoid : this.servico.id,
      atendenteId: this.servico.userId,
      preco:this.servico.preco,
      clienteId: key
    } 

    this.auth.getDataBaseListPedidos().push(servico).then(teste=>{
      var key = teste.key;
      this.salvarAtendente(key);
      this.salvarCliente(key);
    });
    
    
  }

  salvarAtendente(key){
    var end = "/users/" + this.servico.userId +"/pedidosAtender/";
    this.auth.getDataBaseEndereco(end).push(key);
    
  }

  salvarCliente(key){
    this.auth.getDataBaseListUser("pedidos").push(key);
  }


  getAtendenteNome(){
    
    var end = "/users/" + this.servico.userId +"/data/nome/";
    this.auth.getDataBaseEndereco(end).on("value",(snap)=>{
      this.nome = snap.val();
    });
    
  }
}
