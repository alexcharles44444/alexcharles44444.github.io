class FirestoreMetadata {
    constructor(max_locations) {
        this.max_locations = max_locations;
    }

    static fromDS(dataSnapshot) {
        if (dataSnapshot == null)
            return null;
        var max_locations = dataSnapshot["max_locations"];
        return new FirestoreMetadata(max_locations);
    }

    getMax_locations() {
        return this.max_locations;
    }

    setMax_locations(max_locations) {
        this.max_locations = max_locations;
    }

    function_getMaxLocationsInt() {
        return Number(this.max_locations);
    }
}