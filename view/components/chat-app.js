import { LitElement, html } from 'lit-element';
import {chatAppStyle} from '../style/chat-app-style.js';
import {Manager} from '../js/manager.js'
import  './chat-app'  //It's not "normal" import. It is webpack import
import  './status-row'  //It's not "normal" import. It is webpack import
import  './chat-button'  //It's not "normal" import. It is webpack import
import  './chat-row'  //It's not "normal" import. It is webpack import


class ChatApp extends LitElement {
  static get is(){
    return 'chat-app';
  }
  static get styles(){
    return chatAppStyle
  }
  static get properties() {
    return {
      username_placeholder: { type: String },
      username_input_value: {type: String},
      button_disabled: {type: Boolean},
      peopleArray: {type: Array},
      load_more_value: {type: String},
      message_placeholder: {type: String},
      messageArray: {type: Array},
      login_passive: {type: String},
      scrollTop:{type: Number},
      scrollHeight:{type: Number},
      chat_passive: {type: String},
      msg: {type:String}
    };
  }
  constructor() {
    super();
    Manager.setUp();
    Manager.listen();

    this.username_placeholder = 'User';
    this.username_input_value = ''; 
    this.button_disabled = false;
    this.peopleArray = [];
    this.messageArray = [];
    this.load_more_value = 'Load More';
    this.message_placeholder = 'Message';
    this.login_passive = '';
    this.chat_passive = '';
    this.scrollTop = 0;
    this.scrollHeight;
    this.msg = "";
  }
  render() {
      return html`
      <div class="login-box">
        <input type="text" id="user-input"  .placeholder="${this.username_placeholder}" .value="${this.username_input_value}"/>
        <chat-button id="login" .passive="${this.login_passive}" @button-click="${this._onLogin}">Login</chat-button>
      </div>
    
      <div class="chat">
          <div class="people">
            ${this.peopleArray.map((elem) =>{
              return html`<status-row link="${elem.link}" name="${elem.name}" .status="${elem.status}"></status-row>`
            })}
          </div>
          <div class="cont">
            <div class="box">
            <chat-button id="login"  .passive="${this.chat_passive}" @button-click="${this._onLoad}">${this.load_more_value}</chat-button>
              <div class="history"  scrollTop="${this.scrollTop}" scrollHeight="${this.scrollHeight}">
                ${this.messageArray.map((elem) =>{
                  
                  return html`<chat-row .link="${elem.link}" .name="${elem.name}" .text="${elem.text}" .me="${elem.me}"></chat-row>`
                })}
              </div>
              <div class="typing"></div>
            </div>
            
            <input type="text" id="message-input"  placeholder="${this.message_placeholder}"/>
            <chat-button id="send"  @button-click="${this._onSend}">Send</chat-button>
          </div>
      </div>
      `;
  }
  _onLogin(){
    Manager.loginUser(this.shadowRoot.getElementById('user-input').value);
  }
  _onLoad(){
    Manager.loadChat();
  }
  _onSend(){
    Manager.sendMessage(this.shadowRoot.getElementById('message-input').value);
  }

}

customElements.define(ChatApp.is, ChatApp);

