import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { TabsAtendentePage } from '../pages/tabsatendente/tabsatendente';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ServicosPage } from '../pages/servicos/servicos';
import { UsuarioPage } from '../pages/usuario/usuario';
import { ListaatendimentoPage } from '../pages/listaatendimento/listaatendimento';
import { ContatoPage } from '../pages/contato/contato';
import {CriarservicoPage} from '../pages/criarservico/criarservico';
import {AtendentePedidosPage} from '../pages/atendente-pedidos/atendente-pedidos';
import {AtendenteServicosPage} from '../pages/atendente-servicos/atendente-servicos';
import {CriarPedidosPage } from '../pages/criar-pedidos/criar-pedidos';
import {PedidosClientePage} from '../pages/pedidos-cliente/pedidos-cliente'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Push} from '@ionic-native/push';
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';
// import { GoogleMaps } from '@ionic-native/google-maps';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth} from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider } from '../providers/auth/auth';

var config = {
  apiKey: "AIzaSyDZSpa0HSztj0Mi13_uI2kPAAvxvBcIsxA",
  authDomain: "blz-delivery.firebaseapp.com",
  databaseURL: "https://blz-delivery.firebaseio.com",
  projectId: "blz-delivery",
  storageBucket: "blz-delivery.appspot.com",
  messagingSenderId: "442969224846"
};

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LoginPage,
    RegisterPage,
    ServicosPage,
    UsuarioPage,
    CriarPedidosPage,
    ContatoPage,
    AtendentePedidosPage,
    AtendenteServicosPage,
    TabsAtendentePage,
    CriarservicoPage,
    ListaatendimentoPage,
    PedidosClientePage,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    RegisterPage,
    ServicosPage,
    UsuarioPage,
    ContatoPage,
    AtendentePedidosPage,
    AtendenteServicosPage,
    TabsAtendentePage,
    CriarservicoPage,
    CriarPedidosPage,
    ListaatendimentoPage,
    PedidosClientePage,

  ],
  providers: [
    LocalNotifications,
    FCM,
    Push,
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider
  ]
})
export class AppModule {}
