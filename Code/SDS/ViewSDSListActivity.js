class ViewSDSListActivity extends W4Activity {
    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.location_id = a.getIntent().getStringExtra("location_id");
        var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), a.location_id);
        let title = "";
        if (location != null)
            title = "SDS at " + location.getName();

        a.getSupportActionBar().setTitle(title);
        a.setContentView(R.layout.activity_view_s_d_s_list);

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
        a.updateList();
    }

    updateList() {
        super.updateList();
        var list = W4_Funcs.getPermittedSuppliesList_ForX(Asset.PERMISSION_ALL_SDS);
        var trimmedList = [];
        for (let supplyItem of list) {
            if (supplyItem.getLocationID().equals(this.location_id))
                trimmedList.push(supplyItem);
        }
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        if (!searchText.equals("")) {
            trimmedList = Asset.getSearchedAssets(trimmedList, searchText);
        }
        var sdsListAdapter = new SDSListAdapter(this, trimmedList);
        this.findViewById("SDSList").setAdapter(sdsListAdapter);
    }
}