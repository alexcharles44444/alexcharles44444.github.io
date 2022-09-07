class ViewSupplyItemLocationsListActivity extends W4Activity {

    static viewSupplyItemLocationsListActivity = null;

    onDestroy() {
        super.onDestroy();
        ViewSupplyItemLocationsListActivity.viewSupplyItemLocationsListActivity = null;
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
        a.getSupportActionBar().setTitle("View Supplies Locations");
        a.setContentView(R.layout.activity_view_supply_item_locations_list);
        ViewSupplyItemLocationsListActivity.viewSupplyItemLocationsListActivity = this;

        a.findViewById("TemplatesButton").addEventListener("click", function () {
            var intent = new Intent(this, new ViewTemplateListActivity());
            intent.putExtra("assetType", Asset.PERMISSION_ALL_SUPPLIES);
            intent.putExtra("newEditActivity", new NewEditSupplyItemActivity());
            intent.putExtra("viewActivity", new ViewSupplyItemActivity());
            a.startActivity(intent);

        });
        var button = a.findViewById("AddButton");
        if (MainActivity.currentUser.getWritePermissions()[Asset.PERMISSION_ALL_SUPPLIES] || MainActivity.currentUser.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SUPPLIES]) {
            a.findViewById("AddButton").setVisibility(View.VISIBLE);
            button.addEventListener("click", function () {
                var intent = new Intent(this, new NewEditSupplyItemActivity());
                a.startActivity(intent);

            });
        } else
            a.findViewById("AddButton").setVisibility(View.GONE);
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
            list = Asset.getSearchedAssets(W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_SUPPLIES), searchText);
        } else {
            list = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_SUPPLIES);
            if (list.length == 1) {
                this.autoentry = true;
                let intent = new Intent(this, new ViewSupplyItemListActivity());
                intent.putExtra("location_id", list[0].getW4id());
                this.startActivity(intent);
            }
        }
        var locationListAdapter = new LocationListAdapter(this, list, Asset.PERMISSION_ALL_SUPPLIES);
        this.findViewById("List").setAdapter(locationListAdapter);
    }
}
