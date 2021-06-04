class User {
    constructor(user){
        this.username = user.username;
    }
    static get username(){
        return this.username;
    }
}

export {User}