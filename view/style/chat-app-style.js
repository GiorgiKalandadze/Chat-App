import { css } from 'lit-element';

export const chatAppStyle = css
`
*{
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}
.login-box{
    margin-left: auto;
    margin-right: auto;
    border: 2px solid grey;
    display: flex;
    width: 400px;
    align-items: center;
    justify-content: space-between;
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
    border: 2px solid grey;
    background-color: #171853;
}
.online{
    border: 1px solid black;
    font-size: 15px;
    padding: 3px;
}
.cont{
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 2px solid grey;
    padding: 5px;
}
.box{
    border: 1px solid green;
    height: 400px;
    margin-bottom: 10px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;
}
#load-more{
    padding: 0px;
    font-size: 10px;
    width: 100px;
    height: 30px;
}
.history{
    padding: 5px;
    width: 100%;
  
}
.msg, .my-msg{
    border: 1px solid purple;
    width: 100%;
    margin-bottom: 3px;
}
.my-msg{
   text-align: right;
    /* float: right; */
    color: red;
}
input{
    padding: 10px;
    font-size: 18px;
}

strong{
    color: blue;
}
#message-input{
    margin-bottom: 10px;
}

`