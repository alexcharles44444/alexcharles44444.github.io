class MainActivity extends AppCompatActivity {
    static version = "1.49141";
    static version_long = 149141;

    static w4_DB_Data = null;
    static w4_DB_Data_Secure = null;
    static companyData = null;
    static w4Notifications = [];
    static Task_Button_Start = "Start Task";
    static Task_Button_Resume = "Resume Task";
    static lastTaskSheet = null;
    static notificationManager = null;
    static emailOBJ = null;
    static firebaseStorage = firebase.storage();
    static theCompany = new TheCompany("");
    static current_email = null;
    static current_password = null;
    static override_current_email = null;
    static currentPerson = null;
    static currentPersonID = "";
    static currentUser = null;
    static firestoreCustomer = null;
    static shiftsReadyForClockIn = false;
    static locationsReadyForClockIn = false;
    static noLocationsText = "No locations exist for this item";
    static noShiftsText = "No shifts exist for this item";
    static noLocationsPermissionText = "You don't have permission to view the Location of this item";
    static missingAssetForSpinner = "A missing Asset caused a spinner error";
    static missingAsset = "A missing Asset caused an error";
    static notPermitted = "You don't have permission to view this";
    static noReportsPermission = "You must be an owner or a manager to export reports";
    static noDoTaskPermission = "You don't have permission to edit this task sheet";
    static allDatabaseDownloaded = false;
    static loggedIn = false;
    static w4SaveState = new W4SaveState();
    // static mAuth = firebase.auth();
    static mainActivity = null;
    static RIGHT_ARROW = "▶";
    static DOWN_ARROW = "\uD83D\uDD3D";
    static RED_CIRCLE = "\uD83D\uDD34";
    static BLUE_CIRCLE = "\uD83D\uDD35";
    static BLACK_CIRCLE = "⚫";
    static CLOCK_130 = "\uD83D\uDD5C";
    static NO_ENTRY_SIGN = "⛔";
    static NO_SIGN = "\uD83D\uDEAB";
    static CALENDAR = "📅";
    static netTaskGetLocations = 0;
    static netTaskGetMessages = 1;
    static netTaskGetPeople = 2;
    static netTaskGetShifts = 3;
    static netTaskGetSupplyItems = 4;
    static netTaskGetTimePunches = 5;
    static netTaskGetInspectionPlans = 6;
    static netTaskGetInspectionPlansOccurence = 7;
    static netTaskGetSingleUser = 8;
    static netTaskGetTasks = 9;
    static netTaskGetTasksOccurence = 10;
    static netTaskGetCompanyData = 11;
    static netTaskSize = 12;
    //Must be same size as netTaskSize!
    static firebaseReffsInProgress = [false, false, false, false, false, false, false, false, false, false, false, false];
    static firebaseReffsFirstLoad = [false, false, false, false, false, false, false, false, false, false, false, false];
    static firebaseReffInProgress = false;
    static requestCodeLocationDelete = 0;
    static requestCodePersonDelete = 1;
    static requestCodeSupplyItemDelete = 3;
    static requestCodeInspectionPlanDelete = 4;
    static requestCodeInspectionPlanInProgressDelete = 5;
    static requestCodeGetPersonForShift = 7;
    static requestCodeShiftDelete = 8;
    static requestCodeNewShiftCalendar = 9;
    static requestCodeEditShiftTimeStartCalendar = 13;
    static requestCodeEditShiftTimeEndCalendar = 14;
    static requestCodeEditShiftTimeEndRepeatCalendar = 15;
    static requestCode_LOGOUT = 18;
    static requestCodeNewTimePunchCalendar = 19;
    static requestCodeEditTimePunchCalendar = 20;
    static requestCodeTimePunchDelete = 21;
    static requestCodeTotalHoursStartCalendar = 22;
    static requestCodeTotalHoursEndCalendar = 23;
    static requestCodeCompletedInspectionPlanDelete = 24;
    static requestCodeTaskDelete = 25;
    static requestCodeTaskInProgressDelete = 26;
    static requestCodeTaskCompletedDelete = 27;
    static requestCodeSDSDelete = 36;
    static requestCodeSEStartCalendar = 37;
    static requestCodeSEEndCalendar = 38;
    static requestCode_ACCESS_LOCATION = 39;
    static requestCodeCalendar = 40;
    static requestCodeText = 41;
    static requestCodeReturnTemplateAsset = 42;

    static NOTIFICATION_CHANNEL_ID = "Cleanbook_44444";
    static NOTIFICATION_EXPIRATION_TIME = TimeUnit.DAYS.toMillis(7);
    static DB_PATH_COMPANIES = "companies";
    static DB_PATH_COMPANIES_DATA = "data";
    static DB_PATH_COMPANIES_DATA_NAME = "name";
    static DB_PATH_USERS = "users";
    static DB_PATH_USERS_PASSWORD = "password";
    static DB_PATH_ASSET_PEOPLE = "people";
    static DB_PATH_ASSET_LOCATIONS = "locations";
    static DB_PATH_ASSET_MESSAGES = "messages";
    static DB_PATH_ASSET_SHIFTS = "shifts";
    static DB_PATH_ASSET_TIME_PUNCHES = "time_punches";
    static DB_PATH_ASSET_INSPECTION_PLANS = "inspection_plans";
    static DB_PATH_ASSET_INSPECTION_PLANS_OCCURENCE = "inspection_plans_occurence";
    static DB_PATH_ASSET_TASKS = "tasks";
    static DB_PATH_ASSET_TASKS_OCCURENCE = "tasks_occurence";
    static DB_PATH_ASSET_SDS = "sds";
    static DB_PATH_ASSET_SUPPLY_ITEMS = "supply_items";
    static DB_PATH_DATA = "data";
    static DB_PATH_DATA_SECURE = "data_secure";
    static DB_PATH_DATA_SECURE_ADMINS = "admins";
    static DB_PATH_LOG = "log";
    static DB_PATH_FIRESTORE = "firestore";
    static DB_PATH_FIRESTORE_CUSTOMERS = "customers";
    static DB_PATH_TASKS_ENABLED = "tasksEnabled";
    static DB_PATH_EMPLOYEENUM = "employeeNum";
    static DB_PATH_USERS_READ_PERMISSIONS = "readPermissions";
    static DB_PATH_USERS_WRITE_PERMISSIONS = "writePermissions";
    static overrideAutoLogin = false;
    static metersToFeet = 3.28084;
    // static INTENT_CLASS_PATH = "com.where44444.cleanbook";

    static authListenerAdded = false;
    static SIGNINSTATE_CANCELLED = 0;
    static SIGNINSTATE_LOADING = 1;
    static signInState = MainActivity.SIGNINSTATE_CANCELLED;

    static firstStartUpWeb = true;
    static persistenceVar = firebase.auth.Auth.Persistence.NONE;

    getName() {
        return "MainActivity";
    }

    onCreate() {
        var a = this;
        super.onCreate();
        a.getSupportActionBar().hide(); //Hide bar at top with App Name on it
        a.setContentView(R.layout.activity_main);
        a.findViewById("maindiv").setVisibility(View.GONE);
        a.findViewById("forgot_password_div").setVisibility(View.GONE);
        document.getElementById("firstLoader").style.display = "";
        MainActivity.mainActivity = this;
        a.setLoginLoading(false);
        a.findViewById("version_main").setText("v. " + MainActivity.version);
        a.findViewById("StaySignedInCheckbox").setChecked(MainActivity.persistenceVar == firebase.auth.Auth.Persistence.LOCAL);

        a.findViewById("Login_Email").addEventListener("keyup", function (event) {
            if (checkEnterPress(event)) {
                _key_enter_just_pressed = true;
                event.preventDefault();
                document.getElementById("SignInButton").click();
            }
        });

        a.findViewById("Login_Password").addEventListener("keyup", function (event) {
            if (checkEnterPress(event)) {
                _key_enter_just_pressed = true;
                event.preventDefault();
                document.getElementById("SignInButton").click();
            }
        });

        var button = a.findViewById("SignInButton");
        button.addEventListener("click", function () {
            MainActivity.mainActivity.signIn();
        });
        var button = a.findViewById("CancelButton");
        button.addEventListener("click", function () {
            MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
            a.setLoginLoading(false);
        });

        a.findViewById("forgot_password_button").addEventListener("click", function () {
            a.findViewById("maindiv").setVisibility(View.GONE);
            a.findViewById("forgot_password_div").setVisibility(View.VISIBLE);
            a.findViewById("forgot_password_input").setText("");
        });

        a.findViewById("forgot_password_back_arrow").addEventListener("click", function () {
            a.findViewById("maindiv").setVisibility(View.VISIBLE);
            a.findViewById("forgot_password_div").setVisibility(View.GONE);
        });

        a.findViewById("forgot_password_input").addEventListener("keyup", function (event) {
            if (checkEnterPress(event)) {
                _key_enter_just_pressed = true;
                event.preventDefault();
                document.getElementById("SendForgotPasswordEmailButton").click();
            }
        });

        a.findViewById("SendForgotPasswordEmailButton").addEventListener("click", function () {
            firebase.auth().sendPasswordResetEmail(a.findViewById("forgot_password_input").getText())
                .then(() => {
                    MainActivity.dialogBox(this, "Email sent", "Password reset email has been sent, you may need to check your spam folder");
                })
                .catch((error) => {
                    // var errorCode = error.code;
                    var errorMessage = error.message;
                    MainActivity.dialogBox(this, "Error", errorMessage);
                });
        });

        a.loadState();
        // createNotificationChannel();

        FireBaseListeners.fireBaseListener_getData();
        a.findViewById("Login_Email").ele.focus();
        a.hideBackButton();
    }

    autoSignIn() {
        if (MainActivity.overrideAutoLogin) {
            MainActivity.overrideAutoLogin = false;
            this.findViewById("Login_Email").setValue(MainActivity.override_current_email);
            this.findViewById("Login_Password").setValue(MainActivity.current_password);
            this.signIn();
        } else {
            if (!MainActivity.authListenerAdded) {
                MainActivity.authListenerAdded = true;
                firebase.auth().onAuthStateChanged((user) => {
                    MainActivity.loggedIn = false;
                    var first = MainActivity.firstStartUpWeb;
                    MainActivity.firstStartUpWeb = false;
                    if (user) {
                        // console.log("AUTH STATE CHANGED | AUTH LOGGED IN|" + user.uid);
                        MainActivity.loggedIn = true;
                        if (first) {
                            MainActivity.signInState = MainActivity.SIGNINSTATE_LOADING;
                            MainActivity.mainActivity.setLoginLoading(true);
                            W4_Funcs.getPersonPasswordFromUID(firebase.auth().getUid(), function (password0) {
                                if (password0 != null) {
                                    MainActivity.mainActivity.findViewById("StaySignedInCheckbox").setChecked(true); //Only runs on first start up, not when signing in again from editing people
                                    MainActivity.mainActivity.findViewById("Login_Email").setValue(user.email);
                                    MainActivity.mainActivity.findViewById("Login_Password").setValue(password0);
                                    //sign in, set email and password fields
                                    MainActivity.mainActivity.signIn();
                                }
                                else {
                                    MainActivity.mainActivity.findViewById("Login_Email").setTextIsSelectable(true);
                                    MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
                                    MainActivity.mainActivity.setLoginLoading(false);
                                    MainActivity.dialogBox(MainActivity.mainActivity, "Error", "Cannot retrieve password, contact Clean Assistant Support at alexcharles44444@gmail.com");
                                }
                            });
                        }
                    } else {
                        // console.log("AUTH STATE CHANGED | Current User NULL");
                    }
                });
            }
        }
    }

    signIn() {
        if (this.findViewById("StaySignedInCheckbox").isChecked()) {
            MainActivity.persistenceVar = firebase.auth.Auth.Persistence.LOCAL;
        } else {
            MainActivity.persistenceVar = firebase.auth.Auth.Persistence.NONE;
        }

        MainActivity.current_email = this.findViewById("Login_Email").getText().toLowerCase();
        MainActivity.current_password = this.findViewById("Login_Password").getText();
        MainActivity.override_current_email = MainActivity.current_email;
        MainActivity.signInState = MainActivity.SIGNINSTATE_LOADING;
        this.setLoginLoading(true);
        const reffData = firebase.database().ref().child(MainActivity.DB_PATH_DATA);
        reffData.get().then((dataSnapshot) => {
            if (MainActivity.signInState == MainActivity.SIGNINSTATE_LOADING) {
                MainActivity.w4_DB_Data = new W4Data(dataSnapshot);
                if (MainActivity.version_long == MainActivity.w4_DB_Data.getVersion_long() || MainActivity.version_long == MainActivity.w4_DB_Data.getTest_version_long())
                    this.completeSignIn();
                else {
                    MainActivity.dialogBox(this, "New Version Available", "You are running version " + MainActivity.version + ". An update to version " + MainActivity.w4_DB_Data.getVersion() + " needs to be uploaded by Clean Assistant Developers");
                    MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
                    this.setLoginLoading(false);
                }
            }
        }).catch((error) => {
            // console.log("Failed to read version");
            console.error(error);
            MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
            this.setLoginLoading(false);
        });
    }

    completeSignIn() {
        if (MainActivity.current_email != null && MainActivity.current_email.length != 0 && MainActivity.current_password != null && MainActivity.current_password.length != 0) {
            firebase.auth().setPersistence(MainActivity.persistenceVar).then(function () {
                return firebase.auth().signInWithEmailAndPassword(MainActivity.current_email, MainActivity.current_password)
                    .then((userCredential) => {
                        MainActivity.currentPersonID = firebase.auth().getUid();
                        if (MainActivity.signInState == MainActivity.SIGNINSTATE_LOADING) {
                            if (firebase.auth().currentUser.emailVerified) {
                                MainActivity.mainActivity.completeSignIn2();
                            } else {
                                firebase.auth().currentUser.sendEmailVerification();
                                MainActivity.dialogBox(MainActivity.mainActivity, "⚠ Further Action Required", "An e-mail has been sent to this address. Please click the link in the email to verify your identity before logging in. You may need to check your spam folder.");
                                MainActivity.mainActivity.findViewById("Login_Email").setTextIsSelectable(true);
                                MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
                                MainActivity.mainActivity.setLoginLoading(false);
                            }
                        }
                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // console.log("signInWithEmail:failure|" + errorCode + "|" + errorMessage);
                        MainActivity.w4Toast(MainActivity.mainActivity, errorMessage, Toast.LENGTH_LONG);
                        MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
                        MainActivity.mainActivity.setLoginLoading(false);
                    });
            });
        } else {
            MainActivity.w4Toast(this, "Missing Email/Password", Toast.LENGTH_SHORT);
            MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
            this.setLoginLoading(false);
        }
    }

    static reffUserMain = null;

    completeSignIn2() {
        MainActivity.saveState(0);
        if (MainActivity.reffUserMain != null)
            MainActivity.reffUserMain.off();

        MainActivity.reffUserMain = firebase.database().ref().child(MainActivity.DB_PATH_USERS).child(firebase.auth().getUid());
        MainActivity.reffUserMain.on('value', function (dataSnapshot) {
            if (dataSnapshot.exists()) {
                MainActivity.currentUser = User.fromDS(dataSnapshot.val());
                if (MainActivity.signInState == MainActivity.SIGNINSTATE_LOADING) {
                    if (MainActivity.currentUser != null && MainActivity.currentUser.getCompanyid() != null) { //If user data already exists in "users"
                        var reffFirestore = firebase.database().ref().child(MainActivity.DB_PATH_FIRESTORE).child(MainActivity.DB_PATH_FIRESTORE_CUSTOMERS).child(MainActivity.currentUser.getCompanyid());
                        reffFirestore.get().then((dataSnapshot) => {
                            MainActivity.firestoreCustomer = FirestoreCustomer.fromDS(dataSnapshot.val());
                            if (MainActivity.firestoreCustomer != null && MainActivity.firestoreCustomer.status != null) { //Set up users profile in "users"
                                if (MainActivity.firestoreCustomer.getMetadata().function_getMaxEmployeesInt() >= MainActivity.currentUser.getEmployeeNum())
                                    MainActivity.mainActivity.completeSignIn3();
                                else {
                                    MainActivity.dialogBox(MainActivity.mainActivity, "⚠ Employee Limit Reached", "Your company's subscription only allows " + MainActivity.firestoreCustomer.getMetadata().getMax_employees() + " employees. You are number " + MainActivity.currentUser.getEmployeeNum());
                                    MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
                                    MainActivity.mainActivity.setLoginLoading(false);
                                }
                            }
                            else {
                                W4_Funcs.checkForFirestoreSubscription(firebase.auth().getUid(), function () {
                                    MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
                                    MainActivity.mainActivity.setLoginLoading(false);
                                });
                            }
                        }).catch((error) => {
                            W4_Funcs.checkForFirestoreSubscription(firebase.auth().getUid(), function () {
                                // console.log("Failed to load subscriptions");
                                console.error(error);
                                MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
                                MainActivity.mainActivity.setLoginLoading(false);
                            });
                        });
                    }
                    else { //Need to check here if user has a subscription in firestore to see if it's the owner's first time signing in
                        var reffFirestore = firebase.database().ref().child(MainActivity.DB_PATH_FIRESTORE).child(MainActivity.DB_PATH_FIRESTORE_CUSTOMERS).child(firebase.auth().getUid());
                        reffFirestore.get().then((dataSnapshot) => {
                            MainActivity.firestoreCustomer = FirestoreCustomer.fromDS(dataSnapshot.val());
                            if (MainActivity.firestoreCustomer != null && MainActivity.firestoreCustomer.status != null) { //Set up users profile in "users"
                                var uid = firebase.auth().getUid();
                                MainActivity.currentUser = new User(uid, uid, MainActivity.current_email, MainActivity.current_password, W4_Funcs.getOwnerPermissions(), W4_Funcs.getOwnerPermissions(), 0);
                                var ref = firebase.database().ref().child(MainActivity.DB_PATH_USERS).child(firebase.auth().getUid());
                                W4_Funcs.writeToDB(ref, MainActivity.currentUser);
                                MainActivity.mainActivity.completeSignIn3();
                            }
                            else {
                                W4_Funcs.checkForFirestoreSubscription(firebase.auth().getUid(), function () {
                                    MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
                                    MainActivity.mainActivity.setLoginLoading(false);
                                });
                            }
                        }).catch((error) => {
                            W4_Funcs.checkForFirestoreSubscription(firebase.auth().getUid(), function () {
                                // console.log("Failed to load subscriptions");
                                console.error(error);
                                MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
                                MainActivity.mainActivity.setLoginLoading(false);
                            });
                        });
                    }
                }
            } else {
                if (MainActivity.mainActivity != null) {
                    // MainActivity.w4Toast(MainActivity.mainActivity, "Failed to load user data", Toast.LENGTH_LONG);
                    // console.log("Failed to load users");
                    console.error(error);
                    MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
                    MainActivity.mainActivity.setLoginLoading(false);
                }
            }
        });
    }

    completeSignIn3() {
        var reff = firebase.database().ref().child(MainActivity.DB_PATH_USERS).child(firebase.auth().getUid()).child(MainActivity.DB_PATH_USERS_PASSWORD);
        W4_Funcs.writeToDB(reff, MainActivity.current_password, "");

        var reffCompanyData = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.currentUser.getCompanyid()).child(MainActivity.DB_PATH_COMPANIES_DATA);
        reffCompanyData.get().then((dataSnapshot) => {
            if (!dataSnapshot.exists()) {
                MainActivity.companyData = new CompanyData(firebase.auth().getUid(), "", MainActivity.current_email, false, 0, false, true);
                var ref = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.companyData.getW4id()).child(MainActivity.DB_PATH_COMPANIES_DATA);
                W4_Funcs.writeToDB(ref, MainActivity.companyData);
            } else {
                MainActivity.companyData = CompanyData.fromDS(dataSnapshot.val());
            }
            if (MainActivity.companyData == null || !MainActivity.companyData.isBlacklisted()) {
                var now = new W4DateTime();
                if (MainActivity.companyData == null || !MainActivity.companyData.isTrialPeriod() || now.getMillis() < MainActivity.companyData.getTrialEnd()) {
                    if (MainActivity.companyData == null) {
                        MainActivity.companyData = new CompanyData();
                    }
                    var intent = new Intent(this, new HomeActivity());
                    MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
                    this.setLoginLoading(false);
                    MainActivity.mainActivity.startActivityForResult(intent, MainActivity.requestCode_LOGOUT);
                } else {
                    MainActivity.dialogBox(this, "Trial Expired", "Your company's trial period for Clean Assistant is over. Please contact Clean Assistant support at:<br><br>alexcharles44444@gmail.com");
                    MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
                    this.setLoginLoading(false);
                }
            } else {
                MainActivity.dialogBox(this, "Access Disabled", "Your company's access to Clean Assistant has been disabled. Please contact Clean Assistant support at:<br><br>alexcharles44444@gmail.com");
                MainActivity.signInState = MainActivity.SIGNINSTATE_CANCELLED;
                this.setLoginLoading(false);
            }
        });
    }


    onActivityResult(requestCode, resultCode, data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCode_LOGOUT && resultCode == AppCompatActivity.RESULT_OK) {
            // this.findViewById("StaySignedInCheckbox").setChecked(false);
            this.findViewById("Login_Password").setValue("");
            // MainActivity.w4SaveState.setStaySignedIn(this.findViewById("StaySignedInCheckbox").isChecked());
            MainActivity.saveState(1);
        }
    }

    setLoginLoading(isLoading) {
        if (isLoading) {
            this.findViewById("Login_Password").setText("");
            this.findViewById("Login_Email").setInputType(InputType.TYPE_NULL);
            this.findViewById("Login_Password").setInputType(InputType.TYPE_NULL);
            this.findViewById("SignInButton").setVisibility(View.GONE);
            this.findViewById("SignIn_Progress").setVisibility(View.VISIBLE);
            this.findViewById("CancelButton").setVisibility(View.VISIBLE);
        } else {
            this.findViewById("Login_Email").setInputType(InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
            this.findViewById("Login_Password").setInputType(InputType.TYPE_TEXT_VARIATION_PASSWORD);
            this.findViewById("SignInButton").setVisibility(View.VISIBLE);
            this.findViewById("SignIn_Progress").setVisibility(View.GONE);
            this.findViewById("CancelButton").setVisibility(View.GONE);
        }
    }

    static saveState(code) {
        MainActivity.w4SaveState.saveToCookies();
    }

    loadState() {
        MainActivity.w4SaveState.loadFromCookies();
    }

    static toast = null;

    static _snackbar_times_shown = 0;
    static w4Toast(context, text, length) {
        var x = document.getElementById("snackbar");
        x.style.display = "";
        x.innerHTML = text;
        if (x.className != "hide")
            if (x.className == "refresh1")
                x.className = "refresh2";
            else
                x.className = "refresh1";
        else
            x.className = "show";
        ++MainActivity._snackbar_times_shown;

        setTimeout(function () {
            --MainActivity._snackbar_times_shown;
            if (MainActivity._snackbar_times_shown == 0) {
                x.className = "hide";

                setTimeout(function () {
                    x.style.display = "none";
                }, 500);

            }
        }, length);
    }

    static alertDialog = null;
    static dialogBox(context, title, text) {
        var box = document.getElementById("dialogbox");
        var boxText = document.getElementById("dialogbox_text");
        var boxOverlay = document.getElementById("dialogbox_black_overlay");
        box.className = "show";
        box.style.display = "";
        boxText.innerHTML = "<span style='font-size: 30px;'>" + title + "</span><br><br>" + text;
        boxOverlay.style.display = "";
    }

    static hideDialogBox() {
        var box = document.getElementById("dialogbox");
        var boxOverlay = document.getElementById("dialogbox_black_overlay");
        box.className = "hide";
        boxOverlay.style.display = "none";
        setTimeout(function () {
            if (box.className == "hide")
                box.style.display = "none";
        }, 500);
    }

    static getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                // console.log("Loaded " + cname + " JSON|" + JSON.parse(c.substring(name.length, c.length)) + "|");
                return JSON.parse(c.substring(name.length, c.length));
            }
        }
        return null;
    }

    static setCookie(cname, cvalue) {
        var exdays = 365;
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        var jvalue = JSON.stringify(cvalue);
        // console.log("Saved " + cname + " JSON|" + jvalue + "|");
        document.cookie = cname + "=" + jvalue + ";" + expires + "; SameSite=Strict; path=/";
    }
}
