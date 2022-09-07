class ViewSupplyItemListActivity extends W4Activity {

    onDestroy() {
        super.onDestroy();
        FireBaseListeners.viewSupplyItemListActivity = null;
    }

    onResume() {
        super.onResume();
        this.updateList();
    }

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.location_id = a.getIntent().getStringExtra("location_id");
        var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), a.location_id);
        let title = "";
        if (location != null)
            title = "Supplies at " + location.getName();

        a.getSupportActionBar().setTitle(title);
        a.setContentView(R.layout.activity_view_supply_item_list);
        FireBaseListeners.viewSupplyItemListActivity = a;

        a.findViewById("TemplatesButton").addEventListener("click", function () {
            var intent = new Intent(a, new ViewTemplateListActivity());
            intent.putExtra("assetType", Asset.PERMISSION_ALL_SUPPLIES);
            intent.putExtra("newEditActivity", new NewEditSupplyItemActivity());
            intent.putExtra("viewActivity", new ViewSupplyItemActivity());
            a.startActivity(intent);
        });
        var button = a.findViewById("AddSupplyItemButton");
        if (MainActivity.currentUser.getWritePermissions()[Asset.PERMISSION_ALL_SUPPLIES] || MainActivity.currentUser.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SUPPLIES]) {
            a.findViewById("AddSupplyItemButton").setVisibility(View.VISIBLE);
            button.addEventListener("click", function () {
                var intent = new Intent(a, new NewEditSupplyItemActivity());
                intent.putExtra("location_id", a.location_id);
                a.startActivity(intent);

            });
        } else
            a.findViewById("AddSupplyItemButton").setVisibility(View.GONE);

        a.findViewById("Button_Export_Supply_Requests2").addEventListener("click", function () {
            ReportTypesActivity.buttonExportSupplyRequests(a);
        });
        a.search_edittext = a.findViewById("Search_Bar");
        a.search_edittext.addEventListener('keyup', function () {
            a.updateList();
        });
    }


    updateList() {
        super.updateList();
        var list = W4_Funcs.getPermittedSuppliesList();
        var trimmedList = [];
        for (let supplyItem of list) {
            if (supplyItem.getLocationID().equals(this.location_id))
                trimmedList.push(supplyItem);
        }
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        if (!searchText.equals("")) {
            trimmedList = Asset.getSearchedAssets(trimmedList, searchText);
        }
        this.supplyItemListAdapter = new SupplyItemListAdapter(this, trimmedList);
        this.findViewById("SupplyItemList").setAdapter(this.supplyItemListAdapter);
    }
}
