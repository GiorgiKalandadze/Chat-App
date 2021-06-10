import { LitElement, css, html } from 'lit-element';

class ChatRow extends LitElement {
    static get is(){
        return 'chat-row';
    }
    static get styles() {
        return css`
            .cont{
                width: 100%;       
            }
            .row{
                display:flex;
                
                margin-bottom: 10px;
            }
            .avatar{
                width:30px;
                height:30px;
                color: white;
                text-align: center;
                margin-right: 5px;
            }
            .box{
                background-color: lightblue;
                border-radius: 5px;
                padding: 5px;
                display:flex;
                flex-direction:column;
            }
            .name{
                font-weight: bold;
                font-size: 15px;
            }
            .text{
                font-size: 14px;
                max-width: 160px;
                word-wrap: break-word;
            }
            .me{
                display:flex;
                justify-content: flex-end;
                margin-left: auto; 
                margin-right: 0;
            }
            
        `;
    }
    static get properties() {
        return {
            link: {type:String},
            name: {type:String},
            text: {type:String},
            me: {type:String}
        };
    }
    constructor(){
        super();
        this.link = '';
        this.name = '';
        this.text = '';
        this.me = '';
    }
    render() {
        return html`
            <div class="cont">
                <div class="row ${this.me}">
                    <img class="avatar" src="${this.link}"/>
                    <div class="box">    
                        <div class="name">${this.name}</div>
                        <div class="text">${this.text}</div>
                    </div>
                </div>
            </div>
        `;
  }
}

customElements.define(ChatRow.is, ChatRow);

