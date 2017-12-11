
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
      this.mensagemError(error.code);    
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
