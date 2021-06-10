import { css } from 'lit-element';
export const chatAppStyle = css
`
*{
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: 'Calibri', sans-serif;
}
#user-input{
    border: none;
    border-bottom:1px solid grey;
    font-size: 18px;
    outline:none;
}
.login-box{
    margin-left: auto;
    margin-right: auto;
    border: 2px solid grey;
    display: flex;
    width: 400px;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
}
.chat{
    padding: 10px;
    width: 500px;
    display: flex;
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
}
.people{
    width: 200px;
    background-color: #171853;
}

.cont{
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 2px solid grey;
    padding: 5px; 
}
.box{
    height: 400px;
    margin-bottom: 10px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.history{
    padding: 5px;
    width: 100%;
}
.typing{
    display:flex;
    flex-direction:column;
    justify-content: flex-start;
    width: 100%;
}
.typer{
    padding: 2px;
    color: black;
    font-size: 15px;
    margin-bottom :5px;
}
#message-input{
    padding: 10px;
    font-size: 18px;
    border: 1px solid gray;
    outline:none;
    border-radius: 10px;
    margin-bottom: 10px;
}
`