import { LitElement, html } from 'lit-element';
import {chatAppStyle} from '../style/chat-app-style.js';

class ChatApp extends LitElement {
  static get styles(){
    return chatAppStyle
  }
  static get properties() {
    return {
      username_placeholder: { type: String },
      username_input_value: {type: String},
      login_disabled: {type: Boolean},
      peopleArray: {type: Array},
      load_more_value: {type: String},
      message_placeholder: {type: String}
    };
  }
  constructor() {
    super();
    this.username_placeholder = 'User';
    this.username_input_value = ''; 
    this.login_disabled = false;
    this.peopleArray = [];
    this.load_more_value = 'Load More';
    this.message_placeholder = 'Message';
  }
  render() {
      return html`
      <div class="login-box">
        <input type="text" id="user-input" placeholder="${this.username_placeholder}" value="${this.username_input_value}"/>
        <chat-button id="login" ?disabled="${this.login_disabled}" @button-click="${this._onButtonClick}">Login</chat-button>
      </div>
    
      <div class="chat">
          <div class="people">
            ${this.peopleArray.map((elem) => {
              console.log(elem.name);
              return html`<p>${elem.name} - ${elem.status}</p>`
            })}
          </div>
          <div class="cont">
            <div class="box">
            <chat-button id="login"  @button-click="${this._onButtonClick}">Load More</chat-button>
              <div class="history"></div>
              <div class="typing"></div>
            </div>
            
            <input type="text" id="message-input" placeholder="${this.message_placeholder}"/>
            <chat-button id="send"  @button-click="${this._onButtonClick}">Send</chat-button>
          </div>
      </div>
      `;
  }

  _onButtonClick(e){
    // console.log('Catched login click in chat-app component');
    //Question - username and message not needed for both??? is it norm?
    let event = new CustomEvent('button-click', {
      detail: {
        name: e.target.innerHTML,
        username: this.shadowRoot.getElementById('user-input').value,
        message: this.shadowRoot.getElementById('message-input').value
      }
    });
    this.dispatchEvent(event);
  }
  clearPeople(){
    this.shadowRoot.querySelector('.people').innerHTML = '';
  }
  addPerson(elem){
    this.shadowRoot.querySelector('.people').appendChild(elem);
  }
  insertMessage(p, place){
    if(place === 'before'){
      this.shadowRoot.querySelector('.history').insertBefore(p, this.shadowRoot.querySelector('.history').firstChild); 
    } else if(place ==='after'){
      this.shadowRoot.querySelector('.history').appendChild(p); 
  
    }
  }

}

customElements.define('chat-app', ChatApp);

