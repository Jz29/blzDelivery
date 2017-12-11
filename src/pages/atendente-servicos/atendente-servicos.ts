import { Component } from '@angular/core';
import { Platform ,Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Servicos } from '../../models/user';
import { CriarservicoPage } from '../criarservico/criarservico';
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the AtendenteServicosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-atendente-servicos',
  templateUrl: 'atendente-servicos.html',
})
export class AtendenteServicosPage {
  aux = [];
  servicos = [];
  msg;
  titulo;
  constructor(private localNotifications: LocalNotifications, public plt: Platform, public events: Events,public auth:AuthProvider ,public navCtrl: NavController, public navParams: NavParams) {
    /*
    if (this.plt.is('cordova')) {
      this.notication();
    }
    */
    this.init();
  }

    /*
  notication(){
    this.localNotifications.schedule({
      id: 1,
      at: new Date(new Date().getTime() + 10600),
      title: 'BLz Delivery' ,
      text: 'Falta meia hora pro atendimento !',
      sound: 'file://assets/alert.mp3',
      data: { secret: "key" }
    });
    
    this.localNotifications.hasPermission()
    .then((res: any) => {
      if (res.isEnabled) {
        this.titulo = 'We have permission to send push notifications';
      } else {
        this.titulo = 'We do not have permission to send push notifications';
      }
  
    });
    
  }
  */

  ionViewDidLoad() {
    this.events.subscribe('event:Reload-servicos-atendente', ()=>{
      //this.servicos = [];
      this.init();
    });
  }

  init(){
    //this.servicos.splice(0,this.servicos.length);
    //this.servicos = []
    this.msg = "";    
    this.getData();
  }

  getData(){
    //this.servicos = [];
    if(this.servicos.length > 0){
      this.servicos = [];
    }
    
    this.auth.getDataBase("users","servicos").once("value",(snapshots)=>{
      //console.log(snapshots.exists());
      if(!snapshots.exists()){
        return;
      }
      this.servicos = [];
      for (var item in snapshots.val()) {
        //console.log(item);
        this.getServicoFromDatabase(item,snapshots.val()[item]);
      }
      
    });
    
  }

  getServicoFromDatabase(idServico,id){
    var end = "/servicos/"+ id;
    this.auth.getDataBaseEnd(end).on("value",(snap)=>{
      
      this.servicos.push({
        regiao:snap.val().regiao,
        idSer:idServico,
        id:id,
        preco : snap.val().preco,
        descricao : snap.val().descricao,
        duracao : snap.val().duracao,
        tipo : snap.val().tipo,
        });
    });
  }

  adicionarSevico(){
    this.navCtrl.push(CriarservicoPage);
  }

  RemoverServico(servico){

    var id = servico.id;
    var idSer = servico.idSer;
    var refData = this.auth.getDataBaseEndereco("/servicos/"+id+"/status").set("removido");
    var ref = this.auth.getDataBaseListUser("servicos/"+idSer).remove();
    this.removerIndex(servico.tipo,servico.regiao,id);
    
    //console.log(id);
    this.servicos =[];
    this.init();
    //this.getData();
  }

  removerIndex(tipo,regiao,id){

    if(regiao.norte){
      //console.log("regiao.norte.key");
      this.auth.getDataBaseEndereco("/index/"+tipo+"/norte/"+regiao.rnorte).remove();
    }
    if(regiao.sul){
      //console.log("regiao.sul.key");
      this.auth.getDataBaseEndereco("/index/"+tipo+"/sul/"+regiao.rsul).remove();
    }
    if(regiao.taquaralto){
      //console.log("regiao.taquaralto.key");
      this.auth.getDataBaseEndereco("/index/"+tipo+"/taquaralto/"+regiao.rtr).remove();
    }
    if(regiao.taquarusul){
      
      var ed = "/index/"+tipo+"/taquarusul/"+regiao.rts
      //console.log(ed);
      this.auth.getDataBaseEndereco(ed).remove();
    }
  }

  recaregar(){
    this.init()
  }
}
