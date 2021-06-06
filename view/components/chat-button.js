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
    `;
  }
  constructor(){
    super();
  }
  render() {
      return html`
        <button @click="${this._onClick}"><slot></slot></button>
      `;
  }
  _onClick(e){
    let event = new CustomEvent('button-click');
    this.dispatchEvent(event);
  }
  
}

customElements.define('chat-button', ChatButton);

