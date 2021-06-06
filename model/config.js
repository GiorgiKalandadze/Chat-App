class Config {
    static set(){
        Config.port = 7000;
        Config.dbURL = 'mongodb+srv://giorgi:giorgi@bogcluster.dzhv7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        Config.dataBaseName = "Bog";
        Config.collectionName = "chat";
        Config.chatStartOffset = 0;
    }
}

module.exports = Config;