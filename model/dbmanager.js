const Connection = require("./connection");

class DBManager{
    static set(collection){
        DBManager._collection = collection;
    }
    static get collection(){
        return DBManager._collection;
    }
    static loadChat(offset, number){
        return (Connection.db.collection(DBManager.collection)).find().sort({$natural:-1}).skip(offset).limit(number);
    }
    
    static addMessage(message){
        const newMessage = {user: message.user, text: message.message};
        Connection.db.collection(DBManager.collection).insertOne(newMessage, (err, res) => {
            if(err){
                console.error(err);
                return;
            }
            // console.log(`Message Inserted: ${message.user}\n${message.message}`)
        });
    }
}

module.exports = DBManager;