class TextActivity extends W4Activity {
    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("Input Text");
        a.setContentView(R.layout.activity_text);
        var hint = a.getIntent().getStringExtra("hint");
        var text = a.getIntent().getStringExtra("text");
        var editText = a.findViewById("clearableEditText");
        if (hint != null) {
            editText.setHint(hint);
            if (hint.equals("Password"))
                editText.ele.type = "password";
        }
        if (text != null) {
            editText.setText(text);
        }

        editText.addEventListener("keyup", function (event) {
            if (checkEnterPress(event)) {
                _key_enter_just_pressed = true;
                event.preventDefault();
                a.findViewById("Accept").ele.click();
            }
        });

        editText.ele.focus();

        a.findViewById("Cancel").addEventListener("click", function () {
            a.finish();
        });

        a.findViewById("Accept").addEventListener("click", function () {
            a.getIntent().putExtra("text", editText.getText());
            a.setResult(AppCompatActivity.RESULT_OK, a.getIntent());
            a.finish();
        });
    }
}
