class ViewMessageLocationsActivity extends W4Activity {

    static viewMessageLocationsActivity = null;

    onDestroy() {
        ViewMessageLocationsActivity.viewMessageLocationsActivity = null;
    }

    onResume() {
        super.onResume();
        if (this.autoentry)
            this.finish();
        else
            this.updateList();
    }

    onCreate() {
        var a = this;
        this.autoentry = false;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        this.getSupportActionBar().setTitle("Messages By Location");
        this.setContentView(R.layout.activity_view_message_locations_list);
        ViewMessageLocationsActivity.viewMessageLocationsActivity = this;
        this.search_edittext = this.findViewById("Search_Bar");
        this.search_edittext.addEventListener('keyup', function () {
            a.updateList();
        });
    }


    updateList() {
        super.updateList();
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        var list;
        if (!searchText.equals("")) {
            list = Asset.getSearchedAssets(W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_MESSAGES), searchText);
        } else {
            list = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_MESSAGES);
            if (list.length == 1) {
                this.autoentry = true;
                let intent = new Intent(this, new ViewMessageDialogueActivity());
                intent.putExtra("id", list[0].getW4id());
                this.startActivity(intent);
            }
        }
        this.locationListAdapter = new LocationListAdapter(this, list, Asset.PERMISSION_ALL_MESSAGES);
        this.findViewById("MessagesList").setAdapter(this.locationListAdapter);
    }
}
