class AdminToolsActivity extends W4Activity {
    static adminToolsActivity = null;

    onDestroy() {
        super.onDestroy();
        AdminToolsActivity.adminToolsActivity = null;
    }


    onCreate() {
        let a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("Admin Tools");
        a.setContentView(R.layout.activity_admin_tools);
        AdminToolsActivity.adminToolsActivity = this;

        a.findViewById("Add_Free_Trial").addEventListener("click", function () {
            var intent = new Intent(this, new TextActivity());
            intent.putExtra("hint", "Email Address");
            a.startActivityForResult(intent, MainActivity.requestCodeEmail);
        });

        a.updateList();
    }


    updateList() {
        let a = this;
        super.updateList();
        let llTrials = a.findViewById("TrialsLL");
        llTrials.removeAllViews();

        let reffTrials = firebase.database().ref().child(MainActivity.DB_PATH_FIRESTORE).child(MainActivity.DB_PATH_FIRESTORE_CUSTOMERS);
        reffTrials.get().then((dataSnapshot) => {
            var ds_val = dataSnapshot.val();
            for (const ds_key in ds_val) {
                let ds = ds_val[ds_key];
                if (ds["admin_trial_end"] != null && ds["admin_trial_end"] != 0) {
                    let inflater = LayoutInflater.from(AdminToolsActivity.adminToolsActivity);
                    let view = inflater.inflate(R.layout.admin_tools_free_trial_view, null, true);
                    let button = view.findViewById("xbutton");
                    let textView = view.findViewById("text1");
                    textView.setText(ds["email"]);

                    let end = new W4DateTime(ds["admin_trial_end"]);
                    let textView2 = view.findViewById("text2");
                    textView2.setText("Ends " + W4_Funcs.getFriendlyDateText(end));


                    button.addEventListener("click", function () {
                        let reffTrial = firebase.database().ref().child(MainActivity.DB_PATH_FIRESTORE).child(MainActivity.DB_PATH_FIRESTORE_CUSTOMERS).child(ds_key);
                        W4_Funcs.deleteFromDB(reffTrial, "Removed Admin Trial " + ds_key);
                        AdminToolsActivity.adminToolsActivity.updateList();
                    });

                    llTrials.addView(view);
                }
            }
        });
    }

    onActivityResult(requestCode, resultCode, data) {
        let a = this;
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == AppCompatActivity.RESULT_OK) {
            if (requestCode == MainActivity.requestCodeEmail) {
                let email = data.getStringExtra("text").toLowerCase();
                if (W4_Funcs.isValidEmail(email)) {
                    let reffUsers = firebase.database().ref().child(MainActivity.DB_PATH_USERS);
                    reffUsers.get().then((dataSnapshot) => {
                        let found = false;
                        let id = "";
                        var ds_val = dataSnapshot.val();
                        for (const ds_key in ds_val) {
                            let ds = ds_val[ds_key];
                            if (ds["email"].equals(email)) {
                                if (!ds["companyid"].equals(ds_key)) {
                                    MainActivity.w4Toast(a, "Error: This user is not an owner", Toast.LENGTH_LONG);
                                    return;
                                }
                                id = ds_key;
                                found = true;
                                break;
                            }
                        }
                        if (found) {
                            //Need to make sure stripe.js writes client account to firebase /users
                            a.writeFreeTrial(id, email);
                        } else {
                            a.temp_email = email;
                            //Create account then writeFreeTrial()
                            let intent = new Intent(AdminToolsActivity.adminToolsActivity, new TextActivity());
                            intent.putExtra("hint", "Password");
                            a.startActivityForResult(intent, MainActivity.requestCodePassword);
                        }

                    });
                } else {
                    MainActivity.w4Toast(AdminToolsActivity.adminToolsActivity, "E-mail address is invalid", Toast.LENGTH_LONG);
                    let intent = new Intent(AdminToolsActivity.adminToolsActivity, new TextActivity());
                    intent.putExtra("hint", "Email Address");
                    intent.putExtra("text", email);
                    a.startActivityForResult(intent, MainActivity.requestCodeEmail);
                }
            } else if (requestCode == MainActivity.requestCodePassword) {
                let password = data.getStringExtra("text").toLowerCase();
                if (password.length >= 6) {
                    a.createAccount(a.temp_email, password);
                } else {
                    MainActivity.w4Toast(AdminToolsActivity.adminToolsActivity, "Password must be at least 6 characters long", Toast.LENGTH_LONG);
                    let intent = new Intent(AdminToolsActivity.adminToolsActivity, new TextActivity());
                    intent.putExtra("hint", "Password");
                    intent.putExtra("text", password);
                    a.startActivityForResult(intent, MainActivity.requestCodePassword);
                }
            }
        }
    }

    createAccount(email, password) {
        let a = this;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                let id = firebase.auth().getUid();
                firebase.auth().signInWithEmailAndPassword(MainActivity.current_email, MainActivity.current_password)
                    .then((userCredential) => {
                        let user = new User(id, id, email, password, W4_Funcs.getOwnerPermissions(), W4_Funcs.getOwnerPermissions(), 0);
                        let reffUser = firebase.database().ref().child(MainActivity.DB_PATH_USERS).child(id);
                        W4_Funcs.writeToDB(reffUser, user, "Added new trial person user data to users " + id);
                        MainActivity.w4Toast(AdminToolsActivity.adminToolsActivity, "Successfully Created Account", Toast.LENGTH_LONG);
                        a.writeFreeTrial(id, email);
                    }).catch((error) => {
                        MainActivity.w4Toast(AdminToolsActivity.adminToolsActivity, "Could not authenticate your credentials", Toast.LENGTH_LONG);
                        console.log("signInWithEmail:failure");
                        System.exit(8);
                    });
            }).catch((error) => {
                MainActivity.w4Toast(AdminToolsActivity.adminToolsActivity, error.message, Toast.LENGTH_LONG);
                console.log("createUserWithEmail:failure, current mauth " + firebase.auth().getUid());
            });
    }

    writeFreeTrial(id, email) {
        let reffUser = firebase.database().ref().child(MainActivity.DB_PATH_FIRESTORE).child(MainActivity.DB_PATH_FIRESTORE_CUSTOMERS).child(id);
        reffUser.get().then((dataSnapshot) => {
            if (dataSnapshot.exists()) {
                MainActivity.w4Toast(AdminToolsActivity.adminToolsActivity, "Error: This client already has a subscription", Toast.LENGTH_LONG);
            } else {
                let reffFirestore = firebase.database().ref().child(MainActivity.DB_PATH_FIRESTORE).child(MainActivity.DB_PATH_FIRESTORE_CUSTOMERS).child(id);
                let end = new W4DateTime();
                end = W4_Funcs.addDays(end, 14);
                W4_Funcs.writeToDB(reffFirestore, new FirestoreCustomer("active", new FirestoreProduct(new FirestoreMetadata("9999999999999")), end.getMillis(), email), "Added Admin Trial Firestore " + id);
                AdminToolsActivity.adminToolsActivity.updateList();
            }
        });
    }
}
