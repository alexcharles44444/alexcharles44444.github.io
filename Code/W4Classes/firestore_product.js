class FirestoreProduct {
    constructor(metadata) {
        this.metadata = metadata;
    }

    static fromDS(dataSnapshot) {
        if (dataSnapshot == null)
            return null;
        var metadata = FirestoreMetadata.fromDS(dataSnapshot["metadata"]);
        return new FirestoreProduct(metadata);
    }

    getMetadata() {
        return this.metadata;
    }

    setMetadata(metadata) {
        this.metadata = metadata;
    }
}