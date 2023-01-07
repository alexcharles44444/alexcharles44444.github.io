class ViewStringListActivity extends W4Activity {

    static viewStringListActivity = null;
    static stringList = [];

    onDestroy() {
        super.onDestroy();
        ViewStringListActivity.viewStringListActivity = null;
    }

    onCreate() {
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        this.getSupportActionBar().setTitle("");
        this.setContentView(R.layout.activity_view_string_list);
        ViewStringListActivity.viewStringListActivity = this;
        this.search_edittext = this.findViewById("Search_Bar");
        this.search_edittext.addEventListener('keyup', function () {
            ViewStringListActivity.viewStringListActivity.updateList();
        });

        this.updateList();
    }

    updateList() {
        super.updateList();
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        var list;
        if (!searchText.equals("")) {
            list = Asset.getSearchedAssets(ViewStringListActivity.stringList, searchText);
        } else {
            list = ViewStringListActivity.stringList;
        }
        this.stringListAdapter = new StringListAdapter(this, list);
        this.findViewById("StringList").setAdapter(this.stringListAdapter);
    }
}
