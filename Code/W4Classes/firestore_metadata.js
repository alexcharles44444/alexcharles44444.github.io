class FirestoreMetadata {
    constructor(max_employees) {
        this.max_employees = max_employees;
    }

    static fromDS(dataSnapshot) {
        if (dataSnapshot == null)
            return null;
        var max_employees = dataSnapshot["max_employees"];
        return new FirestoreMetadata(max_employees);
    }

    getMax_Employees() {
        return this.status;
    }

    setMax_Employees(max_employees) {
        this.max_employees = max_employees;
    }

    function_getMaxEmployeesInt() {
        return Number(this.max_employees);
    }
}