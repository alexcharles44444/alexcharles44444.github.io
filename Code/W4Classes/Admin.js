class Admin extends Asset {
    constructor(a, b) {
        if (a === undefined) {
            super(MainActivity.currentUser.getCompanyid());
            this.constructor0();
        } else {
            super(a);
            this.constructor1(a, b);
        }
    }

    constructor0() {
        this.email = "";
    }

    constructor1(id, email) {
        this.email = email;
    }

    static fromDS(dataSnapshot) {
        var w4id = dataSnapshot["w4id"];
        var email = dataSnapshot["email"];
        return new Admin(w4id, email);
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }
}
