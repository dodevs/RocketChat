/**
 * React Native Chat
 * Desenvolvido por Douglas Silva
 * Baseado no exemplo de vinnyoodles
 * https://github.com/vinnyoodles/react-native-socket-io-example
 */

import React, { Component } from 'react'; //Classe a ser herdada
import SocketIOClient from 'socket.io-client'; //Cliente para conectar com o server
import { GiftedChat } from 'react-native-gifted-chat'; //Interface de chat
import {
  Platform, //Nao ta usando
  StyleSheet, // Ta usando, mas nao implementado 
  Text, // Nao ta usando
  AsyncStorage,
  View
} from 'react-native';

const USER_ID = '@userId'; //Define a constante o asyncStorage

/* const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
}); */ 

export default class App extends Component<{}> {
  // Método construtor passando as propriedades
  constructor(props){
    // Passa props para a classe pai
    super(props);
    //Inicializa com as propriedades e depois modifica com 'setState'
    this.state = {
      messages : [],
      userId: null
    }
    // Inicializando as funções
    this.determineUSer = this.determineUSer.bind(this);
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this._storeMessages = this._storeMessages.bind(this);
    // Criando a instancia do socket-client. Irá conectar automaticamente
    this.socket = SocketIOClient('http://172.16.1.141:3000');
    // Quando a mensagem é recebida pelo socket
    this.socket.on('message', this.onReceivedMessage);
    // Executa função
    this.determineUSer();
  }

  /**
   * Quando o usuario entrar no  bate papo, checa se 
   * Se 
   */

  determineUSer(){
    // Armazenamento local
    AsyncStorage.getItem(USER_ID) //Pega a constante
      .then((userId) => { // 
        if(!userId) {
          this.socket.emit('userJoined', null);
          this.socket.on('userJoined', (userId) => {
            AsyncStorage.setItem(USER_ID, userId);
            this.setState({ userId });
          });
        } else {
          this.socket.emit('userJoined', userId);
          this.setState({ userId });
        }
      })
      .catch((e) => alert(e));
  }

  // Quando a mensagem chega, executa o método para salva-lo
  onReceivedMessage(messages) {
    this._storeMessages(messages); // Ver na função
  }  

  onSend(messages=[]) { //Quando envia mensagem
    this.socket.emit('message', messages[0]); //Envia o socket com a mensagem
    this._storeMessages(messages); // Ver na função
  }

  _storeMessages(messages){
    this.setState((previousState) => { // Passa o state atual
      return {
        // Retorna com as mensagens antigas e novas
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  render() {
    var user = {_id: this.state.userId || -1 };

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={user}
      />
    );
  }
}

const styles = StyleSheet.create({
  
});
