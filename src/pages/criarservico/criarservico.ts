import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Regiao, Servicos } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
/**
 * Generated class for the CriarservicoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-criarservico',
  templateUrl: 'criarservico.html',
})
export class CriarservicoPage {
  n = false;
  s = false;
  tq = false;
  ts = false;
  r_n="";r_s="";r_tr="";r_ts="";
  regiao = {} as Regiao;
  servico = {} as Servicos;

  constructor( public events: Events, public auth:AuthProvider , public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }
  


  salvarNovoServico(){
    
    var newPostKey = this.auth.getDataBaseListChild("dados/servicos").push().key;
    
    var key = this.auth.usuarioId();
    
    this.salvarIndex(newPostKey);

    var dados = {
      status:"ativado",
      userid:key,
      tipo: this.servico.tipo,
      descricao: this.servico.descricao,
      regiao: {
        norte: this.n,
        rnorte:this.r_n,
        sul:this.s,
        rsul:this.r_s,
        taquaralto: this.tq,
        rtr:this.r_tr,
        taquarusul:this.ts,
        rts:this.r_ts
      },
      preco:this.servico.preco,
      duracao: this.servico.duracao

    };

    this.auth.getDataBaseListUser("servicos").push(newPostKey);

    this.auth.getDataBaseListServico(newPostKey).set(dados).then((Response)=>{
      //console.log("Servico adicionado");
      this.events.publish('event:Reload-servicos-atendente');
      
      //this.events.publish("event:loginAtendente");
      this.navCtrl.pop();
    }).catch((error)=>{
      console.log(error);
    });
    
  }

  salvarIndex(id){

    if(this.n){
      this.r_n = this.salvarRegiao("norte",id);
    }
    if(this.s){
      this.r_s = this.salvarRegiao("sul",id);
    }
    if(this.tq){
      this.r_tr = this.salvarRegiao("taquaralto",id);
    }
    if(this.ts){
      this.r_ts = this.salvarRegiao("taquarusul",id);
    }
  }

  salvarRegiao(regiao,id){
    var end = "/index/"+ this.servico.tipo +"/"+ regiao;
    var key = this.auth.getDataBaseEnd(end).push(id).key;
    return key;
  }


}

