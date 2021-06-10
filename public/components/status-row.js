import { LitElement, css, html } from 'lit-element';

class StatusRow extends LitElement {
    static get is(){
        return 'status-row';
      }
    static get styles() {
        return css`
            .cont{
                width: 100%;       
            }
            .row{
                display:flex;
                margin-bottom: 10px;
                padding: 10px;
            }
            .avatar{
                width:30px;
                height:30px;
                margin-right: 5px;
            }
            .box{
                display:flex;
                flex-direction:column;
            }
            .name{
                color: white;
                font-weight: bold;
                font-size: 15px;
            }
            .icon{
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-right: 5px;
            }
            .status{
                display: flex;
                align-items: center;
                color: white;
                font-size: 13px;
            }
            .offline{
                background-color: red;
            }
            .online{
                background-color: green;
            }
            
        `;
    }
    static get properties() {
        return {
            link: {type:String},
            name: {type:String},
            status: {type:String},
        };
    }
    constructor(){
        super();
        this.link = '';
        this.name = '';   
        this.status = '';
    }
    render() {
        return html`
            <div class="cont">
                <div class="row">
                    <img class="avatar" src="${this.link}"/>
                    <div class="box">    
                        <div class="name">${this.name}</div>
                        <div class="status">
                            <div class="icon ${this.status}"></div>
                            <div class="status">${this.status}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define(StatusRow.is, StatusRow);

