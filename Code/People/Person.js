class Person extends Asset {

    //  String first_name;
    //  String last_name;
    //  String phone;
    //  String email;
    //  int type;

    // var readPermissions = {
    //     {
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //     }
    // };
    // var writePermissions = {
    //     {
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //     }
    // };

    //  boolean requiringGPSClockIn;
    // var clockedIn = false;

    constructor(w4id, first_name, last_name, phone, email, type, requiringGPSClockIn, clockedIn, employeeNum) {
        super(w4id);
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone = phone;
        this.email = email;
        this.type = type;
        this.requiringGPSClockIn = requiringGPSClockIn;
        this.clockedIn = clockedIn;
        this.employeeNum = employeeNum; //Only exists to allow sending alerts in the app, true value is in 'users/'
    }

    static fromDS(dataSnapshot) {
        var w4id = dataSnapshot["w4id"];
        var first_name = dataSnapshot["first_name"];
        var last_name = dataSnapshot["last_name"];
        var phone = dataSnapshot["phone"];
        var email = dataSnapshot["email"];
        var type = dataSnapshot["type"];
        var requiringGPSClockIn = dataSnapshot["requiringGPSClockIn"];
        var clockedIn = dataSnapshot["clockedIn"];
        var employeeNum = dataSnapshot["employeeNum"];

        return new Person(w4id, first_name, last_name, phone, email, type, requiringGPSClockIn, clockedIn, employeeNum);
    }

    getFirst_name() {
        return this.first_name;
    }

    setFirst_name(first_name) {
        this.first_name = first_name;
    }

    getLast_name() {
        return this.last_name;
    }

    setLast_name(last_name) {
        this.last_name = last_name;
    }

    getPhone() {
        return this.phone;
    }

    setPhone(phone) {
        this.phone = phone;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    isRequiringGPSClockIn() {
        return this.requiringGPSClockIn;
    }

    setRequiringGPSClockIn(requiringGPSClockIn) {
        this.requiringGPSClockIn = requiringGPSClockIn;
    }

    isClockedIn() {
        return this.clockedIn;
    }

    setClockedIn(clockedIn) {
        this.clockedIn = clockedIn;
    }

    getEmployeeNum() {
        return this.employeeNum;
    }

    setEmployeeNum(employeeNum) {
        this.employeeNum = employeeNum;
    }

    static compareTo(a, o) {
        if (a.getLast_name() < o.getLast_name()) {
            return -1;
        }
        if (a.getLast_name() > o.getLast_name()) {
            return 1;
        }
        return 0;
    }

    canSeeNotifications() {
        return this.type == Asset.OWNER || this.type == Asset.MANAGER || this.type == Asset.SUPERVISOR;
    }

    canSeeEmployeeStatuses() {
        return this.type == Asset.OWNER || this.type == Asset.MANAGER || this.type == Asset.SUPERVISOR;
    }

    canExportReports() {
        return this.type == Asset.OWNER || this.type == Asset.MANAGER;
    }


    method_searchString() {
        return this.last_name + " " + this.first_name;
    }

    method_getInitials() {
        var first = "";
        var last = "";
        if (this.first_name != null && this.first_name.length > 0)
            first = this.first_name[0];
        if (this.last_name != null && this.last_name.length > 0)
            last = this.last_name[0];
        return (first + last).toUpperCase();
    }
}
