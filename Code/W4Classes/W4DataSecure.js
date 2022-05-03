
class W4DataSecure {
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
        this.admins = [];
    }

    constructor1(dataSnapshot) {
        this.admins = [];
        var ds_val = dataSnapshot.child(MainActivity.DB_PATH_DATA_SECURE_ADMINS).val();
        for (const ds_key in ds_val) {
            let ds = ds_val[ds_key];
            this.admins.push(Admin.fromDS(ds));
        }
    }

    getAdmins() {
        return this.admins;
    }

    setAdmins(admins) {
        this.admins = admins;
    }

    doAdminsIncludeUID(admins, uid) {
        for (var i = 0; i < admins.length; ++i) {
            if (admins[i].uid.equals(uid))
                return true;
        }
        return false;
    }
}
