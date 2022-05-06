class User extends Asset {
    constructor(a, b, c, d, e, f, g) {
        if (a === undefined) {
            super(MainActivity.currentUser.getCompanyid());
            this.constructor0();
        } else {
            super(a);
            this.constructor1(a, b, c, d, e, f, g);
        }
    }

    constructor0() {
        this.companyid = "";
        this.email = "";
        this.password = "";
        this.readPermissions = [];
        this.writePermissions = [];
        this.employeeNum = 0;
    }

    constructor1(id, companyid, email, password, readPermissions, writePermissions, employeeNum) {
        this.companyid = companyid;
        this.email = email;
        this.password = password;
        this.readPermissions = readPermissions;
        this.writePermissions = writePermissions;
        this.employeeNum = employeeNum;
    }

    static fromDS(dataSnapshot) {
        if (dataSnapshot == null)
            return null;
        var w4id = dataSnapshot["w4id"];
        var companyid = dataSnapshot["companyid"];
        var email = dataSnapshot["email"];
        var password = dataSnapshot["password"];

        var readPermissions = dataSnapshot["readPermissions"];
        var writePermissions = dataSnapshot["writePermissions"];
        
        if (readPermissions == null) {
            readPermissions = W4_Funcs.getAllFalsePermissions();
            MainActivity.w4Toast(null, first_name + " " + last_name + "'s profile is missing information about their read permissions. All their permissions have been revoked.", Toast.LENGTH_LONG);
        }
        if (writePermissions == null) {
            writePermissions = W4_Funcs.getAllFalsePermissions();
            MainActivity.w4Toast(null, first_name + " " + last_name + "'s profile is missing information about their write permissions. All their permissions have been revoked.", Toast.LENGTH_LONG);
        }
        
        var employeeNum = dataSnapshot["employeeNum"];
        return new User(w4id, companyid, email, password, readPermissions, writePermissions, employeeNum);
    }

    getCompanyid() {
        return this.companyid;
    }

    setCompanyid(companyid) {
        this.companyid = companyid;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getPassword() {
        return this.password;
    }

    setPassword(password) {
        this.password = password;
    }

    getReadPermissions() {
        return this.readPermissions;
    }

    setReadPermissions(readPermissions) {
        this.readPermissions = readPermissions;
    }

    getWritePermissions() {
        return this.writePermissions;
    }

    setWritePermissions(writePermissions) {
        this.writePermissions = writePermissions;
    }

    getEmployeeNum() {
        return this.employeeNum;
    }

    setEmployeeNum(employeeNum) {
        this.employeeNum = employeeNum;
    }
}
