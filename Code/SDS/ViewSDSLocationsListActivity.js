class ViewSDSLocationsListActivity extends W4Activity {

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
        a.getSupportActionBar().setTitle("View SDS Locations");
        a.setContentView(R.layout.activity_view_s_d_s_locations_list);

        a.findViewById("TemplatesButton").addEventListener("click", function () {
            var intent = new Intent(this, new ViewTemplateListActivity());
            intent.putExtra("assetType", Asset.PERMISSION_ALL_SUPPLIES);
            intent.putExtra("newEditActivity", new NewEditSupplyItemActivity());
            intent.putExtra("viewActivity", new ViewSupplyItemActivity());
            intent.putExtra("isSDS", true);
            a.startActivity(intent);
        });
        a.search_edittext = a.findViewById("Search_Bar");
        a.search_edittext.addEventListener('keyup', function () {
            a.updateList();
        });
    }


    updateList() {
        super.updateList();
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        var list;
        if (!searchText.equals("")) {
            list = Asset.getSearchedAssets(W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_SDS), searchText);
        } else {
            list = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_SDS);
            if (list.length == 1) {
                this.autoentry = true;
                let intent = new Intent(this, new ViewSDSListActivity());
                intent.putExtra("location_id", list[0].getW4id());
                this.startActivity(intent);
            }
        }
        var locationListAdapter = new LocationListAdapter(this, list, Asset.PERMISSION_ALL_SDS);
        this.findViewById("LocationsList").setAdapter(locationListAdapter);
    }
}
