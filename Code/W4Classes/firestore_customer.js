class FirestoreCustomer {
    constructor(status, product, admin_trial_end, email) {
        this.status = status;
        this.product = product;
        this.admin_trial_end = admin_trial_end;
        this.email = email;
    }

    static fromDS(dataSnapshot) {
        if (dataSnapshot == null)
            return null;
        var status = dataSnapshot["status"];
        var product = FirestoreProduct.fromDS(dataSnapshot["product"]);
        var admin_trial_end = 0;
        if (dataSnapshot["admin_trial_end"] != null)
            admin_trial_end = dataSnapshot["admin_trial_end"];
        var email = "";
        if (dataSnapshot["email"] != null)
            email = dataSnapshot["email"];

        return new FirestoreCustomer(status, product, admin_trial_end, email);
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }

    getProduct() {
        return this.product;
    }

    setProduct(product) {
        this.product = product;
    }

    getAdmin_trial_end() {
        return this.admin_trial_end;
    }

    setAdmin_trial_end(admin_trial_end) {
        this.admin_trial_end = admin_trial_end;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }
}