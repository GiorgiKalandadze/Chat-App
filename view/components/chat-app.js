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
      message_value: {type:String},
      chat_passive: {type: String},
      typingArray: {type: Array},
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
    this.typingArray = [];
    this.message_value = '';
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
              return html`<status-row .link="${elem.link}" .name="${elem.name}" .status="${elem.status}"></status-row>`
            })}
          </div>
          <div class="cont">
            <div class="box" .scrollTop="${this.scrollTop}">
            <chat-button id="load-more"  .passive="${this.chat_passive}" @button-click="${this._onLoad}">${this.load_more_value}</chat-button>
              <div class="history"  >
                ${this.messageArray.map((elem) =>{
                  return html`<chat-row .link="${elem.link}" .name="${elem.name}" .text="${elem.text}" .me="${elem.me}"></chat-row>`
                })}
              </div>
              <div class="typing">
                ${this.typingArray.map((username) =>{    
                  
                  return html`<div class="typer">${username} is typing...</div>`
                })}
              </div>
            </div>
            <input type="text" id="message-input" @input="${this._onType}" placeholder="${this.message_placeholder}" .value="${this.message_value}"/>
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
    if(this.shadowRoot.getElementById('message-input').value == ''){
      return;
    }
    Manager.sendMessage(this.shadowRoot.getElementById('message-input').value);
    this.message_value = '';
    // console.log(this.shadowRoot.getElementById('message-input').value);
  }
  _onType(){
    Manager.typing(this.shadowRoot.getElementById('message-input').value);
    this.message_value =  this.shadowRoot.getElementById('message-input').value;
    
  }

  moveScroll(){
    this.scrollTop = this.shadowRoot.querySelector('.box').scrollHeight;
  }
  
}

customElements.define(ChatApp.is, ChatApp);

