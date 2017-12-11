import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
// import { snapshotChanges } from 'angularfire2/database';
import { CriarPedidosPage } from '../criar-pedidos/criar-pedidos';


/**
 * Generated class for the ListaatendimentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listaatendimento',
  templateUrl: 'listaatendimento.html',
})
export class ListaatendimentoPage {

  tipo
  regiao
  msg
  servicos = []
  constructor( public auth:AuthProvider, public navCtrl: NavController, public navParams: NavParams) {

    this.tipo = this.navParams.get('sevico');
    this.regiao = this.navParams.get('regiao');
    this.msg = "";
  }

  ionViewDidLoad() {
    this.getData();
  }


  getData(){

    var end = "/index/" + this.tipo + "/" + this.regiao;
    //console.log(end);
    this.auth.getDataBaseEnd(end).once("value",(snapshots)=>{
      //
      console.log()
      for (var item in snapshots.val()) {
        //console.log(snapshots.val()[item]);
        this.getServicoFromDatabase(snapshots.val()[item]);
      }

      if(snapshots.numChildren() <= 0){
        this.msg = "Nenhum serviço foi encontrado !";
      }
    });

  }

  getServicoFromDatabase(id){
    var end = "/servicos/"+ id;
    this.auth.getDataBaseEnd(end).on("value",(snap)=>{

      this.servicos.push({
        id:id,
        preco : snap.val().preco,
        descricao : snap.val().descricao,
        duracao : snap.val().duracao,
        tipo : snap.val().tipo,
        userId:snap.val().userid,
        });
    });
  }

  FazerPedido(servico){
    //console.log(servico.tipo)
    this.navCtrl.push(CriarPedidosPage,{servicoId:servico});
  }



  salvarNovoServico(){

    var newPostKey = this.auth.getDataBaseListChild("dados/servicos").push().key;
    var key = this.auth.usuarioId();

    var dados = {


    };

    this.auth.getDataBaseListUser("servicos").push(newPostKey);

    this.salvarIndex(newPostKey);

    this.auth.getDataBaseListServico(newPostKey).set(dados).then((Response)=>{
      console.log("Servico adicionado");
      this.navCtrl.pop();
    }).catch((error)=>{
      console.log(error);
    });

  }

  salvarIndex(id){

  }

  salvarRegiao(regiao,id){
   // var end = "/index/"+ this.servicos.tipo +"/"+ regiao;
  //  this.auth.getDataBaseEnd(end).push(id);
  }



}
