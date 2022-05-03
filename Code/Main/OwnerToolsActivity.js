class OwnerToolsActivity extends W4Activity {

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("Owner Tools");
        a.setContentView(R.layout.activity_owner_tools);
        a.findViewById("Tasks_Enabled_Div").setVisibility(View.GONE);
        a.findViewById("loader").setVisibility(View.VISIBLE);

        var reffTasks = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.currentUser.getCompanyid()).child(MainActivity.DB_PATH_COMPANIES_DATA).child(MainActivity.DB_PATH_TASKS_ENABLED);
        reffTasks.get().then((dataSnapshot) => {
            a.findViewById("loader").setVisibility(View.GONE);
            if (dataSnapshot.exists()) {
                a.findViewById("Owner_Tools_Tasks_Enabled").setChecked(dataSnapshot.val());
            }
            a.findViewById("Tasks_Enabled_Div").setVisibility(View.VISIBLE);
        });

        a.findViewById("Owner_Tools_Tasks_Enabled").addEventListener("click", function () {
            W4_Funcs.writeToDB(reffTasks, a.findViewById("Owner_Tools_Tasks_Enabled").isChecked(), "Tasks Enabled changed to: " + a.findViewById("Owner_Tools_Tasks_Enabled").isChecked());
            MainActivity.dialogBox(MainActivity.mainActivity, "Restart Required", "Log out or Refresh the page for changes to take effect");
        });
    }
}
