import { Component } from '@angular/core';
import {Events, ActionSheetController , IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the PedidosClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pedidos-cliente',
  templateUrl: 'pedidos-cliente.html',
})
export class PedidosClientePage {
  msg;
  pedidos = [];
  pedido;
  statuspedido;
  msgtext;
  status;
  cor = ["cinza","cinza","cinza","cinza","cinza"]; // cinza
  constructor( public events: Events, public actionSheetCtrl: ActionSheetController, public auth:AuthProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.status = false;
    this.init();
  }

  ionViewDidLoad() {
    //this.auth.getUserToken();
    this.events.subscribe('event:Reload-Pedidos-Cliente', ()=>{
      this.init();
    });
  }

  avaliar(estrelas: number, pedido) {
    pedido.avaliacao = estrelas;
    for(var i = 0; i < 5; i++) {
      this.cor[i] = "cinza";
    }
    for(var i = 0; i < estrelas; i++) {
      this.cor[i] = "gold";
    }

    // console.log(this.cor);
  }

  init(){
    this.pedidos = [];
    this.msg = false;
    this.statuspedido = 'Marcado';
    this.loadData();
  }

  loadData(){
    this.pedidos = [];
    var ref = this.auth.getDataBaseList("users","pedidos");
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

  getPedidosFromDatabase(id){
    var end = "/Pedidos/"+ id;
    this.auth.getDataBaseEnd(end).on("value",(snap)=>{

      var i=0;
      if(this.statuspedido == snap.val().status){

        var data= {
          status:snap.val().status,
          key: snap.key,
          preco: snap.val().preco,
          horario: snap.val().horario,
          data:snap.val().data,
          atendente:snap.val().atendente,
          clienteid:snap.val().clienteId,
          antendenteid: snap.val().atendenteId,
          tipo:snap.val().tipo
        }
        console.log(data);
        this.pedidos.push(data);
        i++;
      }
      if(i<=0){

        this.msgtext = "";
      }else{
        this.msgtext = '';
      }


      /*
      this.servicos.push({
        id:id,
        preco : snap.val().preco,
        descricao : snap.val().descricao,
        duracao : snap.val().duracao,
        tipo : snap.val().tipo,
        userId:snap.val().userid,
        });

    */
      });

    }

    statusPedido(){
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Status do Pedido',
        buttons: [
          {
            text: 'Marcados',
            handler: () => {
              this.status = false;
              this.statuspedido = 'Marcado';
              this.loadData()
            }
          },
          {
            text: 'Cancelados',
            handler: () => {
              this.status = true;
              this.statuspedido = 'Cancelado';
              this.loadData()
            }
          },
          {
            text: 'Feitos',
            handler: () => {
              this.status = true;
              this.statuspedido = 'Feito';
              this.loadData()
            }
          }
        ]
      });
      actionSheet.present();
    }

    cancelarPedido(pedido){
      var end = "/Pedidos/" + pedido.key +"/status";
      console.log(end);
      this.auth.getDataBaseEndereco(end).set("Cancelado");
      this.init();
    }

}
