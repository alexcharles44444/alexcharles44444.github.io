class ViewTextActivity extends W4Activity {
    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle(a.getIntent().getStringExtra("title"));
        a.setContentView(R.layout.activity_view_text);
        var text = a.getIntent().getStringExtra("text");
        var textView = a.findViewById("TextView");
        if (text != null) {
            textView.setText(text);
        }
    }
}
