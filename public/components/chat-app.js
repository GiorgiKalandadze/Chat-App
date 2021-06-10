import { LitElement, html } from 'lit-element';
import {chatAppStyle} from '../style/chat-app-style.js';
import {Manager} from '../js/manager.js'
import  './chat-app'  
import  './status-row'  
import  './chat-button'  
import  './chat-row'  

class ChatApp extends LitElement {
  static get is(){
    return 'chat-app';
  }
  static get styles(){
    return chatAppStyle
  }
  static get properties() {
    return {
      usernamePlaceholder: { type: String },
      usernameInputValue: {type: String},
      loginPassive: {type: String},
      peopleArray: {type: Array},
      scrollTop:{type: Number},
      chatPassive: {type: String},
      loadMoreValue: {type: String},
      messageArray: {type: Array},
      typingArray: {type: Array},
      messagePlaceholder: {type: String},
      messageValue: {type:String}
    };
  }
  constructor() {
    super();
    Manager.setUp();
    Manager.listen();
    this.usernamePlaceholder = 'User';
    this.usernameInputValue = ''; 
    this.loginPassive = '';
    this.peopleArray = [];
    this.scrollTop = 0;
    this.chatPassive = '';
    this.loadMoreValue = 'Load More';
    this.messageArray = [];
    this.typingArray = [];
    this.messagePlaceholder = 'Message';
    this.messageValue = '';
  }
  render() {
      return html`
      <div class="login-box">
        <input type="text" id="user-input"  .placeholder="${this.usernamePlaceholder}" .value="${this.usernameInputValue}"/>
        <chat-button id="login" .passive="${this.loginPassive}" @button-click="${this._onLogin}">Login</chat-button>
      </div>
      <div class="chat">
          <div class="people">
            ${this.peopleArray.map((elem) =>{
              return html`<status-row .link="${elem.link}" .name="${elem.name}" .status="${elem.status}"></status-row>`
            })}
          </div>
          <div class="cont">
            <div class="box" .scrollTop="${this.scrollTop}">
            <chat-button id="load-more"  .passive="${this.chatPassive}" @button-click="${this._onLoad}">${this.loadMoreValue}</chat-button>
              <div class="history"  >
                ${this.messageArray.map((elem) =>{
                  return html`<chat-row .link="${elem.link}" .name="${elem.name}" .text="${elem.text}" .me="${elem.me}"></chat-row>`
                  
                })}
              </div>
              <div class="typing">
                ${this.typingArray.map((username) =>{    
                  return html`<p class="typer">${username} is typing...</p>`
                })}
              </div>
            </div>
            <input type="text" id="message-input" @input="${this._onType}" .placeholder="${this.messagePlaceholder}" .value="${this.messageValue}"/>
            <chat-button id="send"  @button-click="${this._onSend}">Send</chat-button>
          </div>
      </div>
      `;
  }
  _onLogin(){
    if(Manager.user != undefined){
      return;
    }
    this.usernameInputValue = this.shadowRoot.getElementById('user-input').value;
    Manager.loginUser(this.shadowRoot.getElementById('user-input').value);
  }
  _onLoad(){
    if(Manager.user === undefined){
      return;
    }
    Manager.loadChat();
  }
  _onSend(){
    if(Manager.user === undefined){
      return;
    }
    Manager.sendMessage(this.shadowRoot.getElementById('message-input').value);
    this.messageValue = '';
  }
  _onType(){
    if(Manager.user === undefined){
      return;
    }
    Manager.typing(this.shadowRoot.getElementById('message-input').value);
    this.messageValue =  this.shadowRoot.getElementById('message-input').value;  
  }
  moveScroll(){
    this.scrollTop = this.shadowRoot.querySelector('.box').scrollHeight;
  }
}

customElements.define(ChatApp.is, ChatApp);

