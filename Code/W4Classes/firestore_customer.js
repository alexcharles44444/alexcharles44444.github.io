class FirestoreCustomer {
    constructor(status, metadata) {
        this.status = status;
        this.metadata = metadata;
    }

    static fromDS(dataSnapshot) {
        if (dataSnapshot == null)
            return null;
        var status = dataSnapshot["status"];
        var metadata = FirestoreMetadata.fromDS(dataSnapshot["product"]["metadata"]);
        return new FirestoreCustomer(status, metadata);
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }

    getMetadata() {
        return this.metadata;
    }

    setMetadata(metadata) {
        this.metadata = metadata;
    }
}