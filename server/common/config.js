class Config {
    static get options(){
        return {
            port:7000,
            dbURL:'mongodb+srv://giorgi:giorgi@bogcluster.dzhv7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            dataBaseName:"Bog",
            collectionName:"chat",
            chatStartOffset:0,
            chatStartQuantity:10,
            chatLoadQuantity:5
        }
    }
}

module.exports = Config;