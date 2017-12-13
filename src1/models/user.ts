import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { Injectable } from '@angular/core';
import { Component } from '@angular/core';

export interface UserInterface{
    email: string;
    password: string;
    nome:string;
    telefone: string;
    telefone02: string;
    tipo:string;
}

export interface Regiao{
    norte:string;
    sul:string;
    taquaralto:string;
    taquarusul:string;
}

export interface Servicos{
    id:string;
    tipo:string;
    descricao:string;
    preco:number;
    duracao:string;
    endereco:string;
}

export interface Pedido{
    id:string;
    servico_Id:string;
    avaliacao: Avaliacao;
}

export interface Avaliacao{
    nota:number;
    comentario:string;

}

@Injectable()
@Component({})
export class User{

    private reportRef;
    public user :User;
    public pedido: Pedido[];

    constructor(private afAuth: AngularFireAuth,  private afDB: AngularFireDatabase){

    }

    logarComEmail(email:string, senha:string):string[]{

        var erro = "false";
        var mens = "Login ok";
        this.afAuth.auth.signInWithEmailAndPassword(email,senha).catch((error)=>{
            erro = "true";
            var errorCode = error.message;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
              mens = "Senha incorreta.";
            } else {
              mens = errorMessage;
            }
        });

        return new Array(erro,mens);
    }

    loadUserDatabase(){
        var end = "users/" + this.afAuth.auth.currentUser.uid + "/dados";

        this.reportRef = this.afDB.database.ref(end).orderByKey();

        this.reportRef.on('child_added', function(data) {
            console.log(data.val().email, data.val().senha);
        });
        console.log("foifoifoi");

    }

    teste(){
        console.log("foifoifoifoifoi !");
    }

}
