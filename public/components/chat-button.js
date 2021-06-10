import { LitElement, css, html } from 'lit-element';


class ChatButton extends LitElement {
  static get is(){
    return 'chat-button';
  }
  static get styles() {
    return css`
      button{
        background-color: #171853;
        color: white;
        padding: 8px;
        font-size: 16px;
        border: none;
        outline: none;
        opacity: 0.9;
        cursor: pointer;
        border-radius: 5px;
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
customElements.define(ChatButton.is, ChatButton);

