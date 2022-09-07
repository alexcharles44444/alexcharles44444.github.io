class ViewNotificationsListActivity extends W4Activity {

    static viewNotificationsListActivity = null;

    onDestroy() {
        super.onDestroy();
        ViewNotificationsListActivity.viewNotificationsListActivity = null;
    }


    onCreate() {
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        this.getSupportActionBar().setTitle("View Notifications");
        this.setContentView(R.layout.activity_view_notifications_list);
        ViewNotificationsListActivity.viewNotificationsListActivity = this;
        this.updateList();
    }


    updateList() {
        var a = this;
        super.updateList();
        var ll = this.findViewById("NotificationsLL");
        if (ll != null) {
            ll.removeAllViews();
            for (var i = 0; i < MainActivity.w4Notifications.length; ++i) {
                var i1 = i;
                var w4Notification = MainActivity.w4Notifications[i];
                var inflater = LayoutInflater.from(this);
                var notification_view = inflater.inflate(R.layout.notification_view, null, true);
                var content = "<span style='color: #878787; font-size: 10pt'>" + w4Notification.title + "</span><br><span style='color: #494949; font-size: 12pt'>" + w4Notification.text + "</span>";
                var button = notification_view.findViewById("Button");
                button.setText(content);
                button.ele.w4Notification = w4Notification;
                button.ele.children[0].w4Notification = w4Notification;
                button.addEventListener("click", function (event) {
                    var w4Notification = event.target.w4Notification;
                    if (w4Notification != null && w4Notification.pendingIntent != null) {
                        a.startActivity(w4Notification.pendingIntent);
                    }
                });
                var xButton = notification_view.findViewById("XButton");
                // xButton.ele.w4Notification = w4Notification;
                xButton.ele.i1 = i1;
                xButton.ele.children[0].i1 = i1;
                xButton.addEventListener("click", function (event) {
                    // var w4Notification = event.target.w4Notification;
                    var i1 = event.target.i1;
                    W4_Funcs.removeNotification(i1);
                    if (MainActivity.w4Notifications.length == 0) {
                        a.finish();
                    }
                });
                ll.addView(notification_view);
            }
        }
    }
}
