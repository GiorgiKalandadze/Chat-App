import { LitElement, css, html } from 'lit-element';


class ChatButton extends LitElement {
  static get styles() {
    return css`
      button{
        background-color: #171853;
        color: white;
        padding: 10px;
        font-size: 18px;
        border: none;
        outline: none;
        opacity: 0.9;
        cursor: pointer;
      }
      button:hover{
          opacity: 1;
      }
      .passive{
        cursor: not-allowed;
       
      }
    `;
  }
  static get properties() {
    return {
        passive: {type:String},
        button_disabled: {type:Boolean}
    };
  }
  constructor(){
    super();
    this.passive = '';
    this.button_disabled = false;
  }
  render() {
      return html`
        <button class="${this.passive}"  @click="${this._onClick}"><slot></slot></button>
      `;
  }
  _onClick(e){
    let event = new CustomEvent('button-click');
    this.dispatchEvent(event);
  }
  
}

customElements.define('chat-button', ChatButton);

