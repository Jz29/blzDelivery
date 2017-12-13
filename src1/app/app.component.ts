import { Component  } from '@angular/core';
import { Platform , NavController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { TabsPage } from '../pages/tabs/tabs';
import { TabsAtendentePage } from '../pages/tabsatendente/tabsatendente';
import { LoginPage } from '../pages/login/login';
import { Events } from 'ionic-angular';
import { App } from 'ionic-angular';
import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any ;

  constructor(private authProv:AuthProvider, private app: App, public events: Events,afAuth: AngularFireAuth, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    const authObserver = afAuth.authState.subscribe(user=>{
      if(user){
        this.authProv.userType().on("value",(snapshot)=>{
          if(snapshot.val().usertype == "client"){
            this.rootPage = TabsPage;
          }else{
            this.rootPage = TabsAtendentePage;
          }
        },(error)=> {
          console.log("Error: " + error.code);
        });
        
        authObserver.unsubscribe();
      }else{
        this.rootPage = LoginPage;
        authObserver.unsubscribe();
      }
    });


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngAfterViewInit() {
    this.events.subscribe('event:logout', ()=>{
      const ANIMATION = { animate: true, direction: 'back' };
      //this.navCrt.setRoot(LoginPage);
      
      //this.navCrt.popToRoot();
      //this.app.navPop();
      let nav = this.app.getRootNav();
      nav.setRoot(LoginPage);
      nav.popToRoot();
      this.events.publish('event:clearLoginPage');
      
    });

    this.events.subscribe('event:loginUser', ()=>{
      const ANIMATION = { animate: true, direction: 'back' };
      let nav = this.app.getRootNav();
      nav.push(TabsPage);
    });

    this.events.subscribe('event:loginAtendente', ()=>{
      const ANIMATION = { animate: true, direction: 'back' };
      let nav = this.app.getRootNav();
      nav.push(TabsAtendentePage);
    });




  }
  
}
