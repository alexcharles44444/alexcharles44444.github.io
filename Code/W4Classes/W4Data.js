
class W4Data {
    // var version = "";
    // var version_long = 0;
    // var test_version_long = 0;
    // var admins = [];
    // var companies = [];

    constructor(a) {
        if (a === undefined) {
            this.constructor0();
        } else {
            this.constructor1(a);
        }
    }

    constructor0() {
        this.version = "";
        this.version_long = 0;
        this.test_version_long = 0;
    }

    constructor1(dataSnapshot) {
        this.setVersion(dataSnapshot.child("version").val());
        this.setVersion_long(dataSnapshot.child("version_long").val());
        this.setTest_version_long(dataSnapshot.child("test_version_long").val());
    }

    getVersion() {
        return this.version;
    }

    setVersion(version) {
        this.version = version;
    }

    getVersion_long() {
        return this.version_long;
    }

    setVersion_long(version_long) {
        this.version_long = version_long;
    }

    getTest_version_long() {
        return this.test_version_long;
    }

    setTest_version_long(test_version_long) {
        this.test_version_long = test_version_long;
    }
}
