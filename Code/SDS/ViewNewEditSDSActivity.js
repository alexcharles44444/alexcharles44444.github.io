class ViewNewEditSDSActivity extends W4Activity {
    static FILETYPE = 1;
    // var this.selectedSDSSupplyItemID = null;
    // var this.fileUri = null;

    static webview;
    static imageview;
    static button_file_left;
    static button_file_right;
    static fileNav;
    // var this.W4FSOs = [];
    static currentURI; //Is set to -1 in w4OnCreate()


    static FILETYPE_PDF = 1;
    static FILETYPE_IMAGE = 2;

    // PdfRenderer pdfRenderer;
    // PdfRenderer.Page currentPage;
    // ParcelFileDescriptor parcelFileDescriptor;

    onDestroy() {
        super.onDestroy();
        FireBaseListeners.viewNewEditSDSActivity = null;
    }


    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.selectedSDSSupplyItemID = a.getIntent().getStringExtra("id");
        let supplyItem = Asset.getAssetbyId(MainActivity.theCompany.getSupplyItemList(), a.selectedSDSSupplyItemID);
        let title = "";
        if (supplyItem != null)
            title = supplyItem.getName();
        a.getSupportActionBar().setTitle(title);
        a.setContentView(R.layout.activity_view_new_edit_s_d_s);
        FireBaseListeners.viewNewEditSDSActivity = a;
        a.W4FSOs = [];
        var button = a.findViewById("AddSDSButton");
        if (MainActivity.currentUser.getWritePermissions()[Asset.PERMISSION_ALL_SDS] || MainActivity.currentUser.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SDS]) {
            button.addEventListener("click", function () {
                if (a.findViewById("Button_Add_PDF").getVisibility() == View.GONE) {
                    a.findViewById("Button_Add_PDF").setVisibility(View.VISIBLE);
                    a.findViewById("Button_Add_Image").setVisibility(View.VISIBLE);
                } else {
                    a.findViewById("Button_Add_PDF").setVisibility(View.GONE);
                    a.findViewById("Button_Add_Image").setVisibility(View.GONE);
                }
            });

            a.findViewById("Button_Add_PDF").ele.addEventListener('change', a.readFile, false);
            a.findViewById("Button_Add_Image").ele.addEventListener('change', a.readFile, false);

            // var button1 = a.findViewById("Button_Add_PDF");
            // button1.addEventListener("click", function () {
            //     a.findViewById("Button_Add_PDF").setVisibility(View.GONE);
            //     a.findViewById("Button_Add_Image").setVisibility(View.GONE);
            //     getPhotoInternetPermissionAndChoose(ViewNewEditSDSActivity.FILETYPE_PDF);
            // });
            // var button1 = a.findViewById("Button_Add_Image");
            // button1.addEventListener("click", function () {
            //     a.findViewById("Button_Add_PDF").setVisibility(View.GONE);
            //     a.findViewById("Button_Add_Image").setVisibility(View.GONE);
            //     getPhotoInternetPermissionAndChoose(ViewNewEditSDSActivity.FILETYPE_IMAGE);
            // });

            var button1 = a.findViewById("Delete_SDS");
            button1.addEventListener("click", function () {
                if (ViewNewEditSDSActivity.currentURI < a.W4FSOs.length) {
                    var intent = new Intent(a, new ConfirmActivity());
                    intent.putExtra("description", "Are you sure you want to delete this SDS Sheet?");
                    a.startActivityForResult(intent, MainActivity.requestCodeSDSDelete);
                }
            });
        }
        ViewNewEditSDSActivity.button_file_left = a.findViewById("File_Left");
        ViewNewEditSDSActivity.button_file_right = a.findViewById("File_Right");
        ViewNewEditSDSActivity.fileNav = a.findViewById("FileNav");

        ViewNewEditSDSActivity.button_file_left.addEventListener("click", function () {
            a.traverseNavigation(-1);
        });

        ViewNewEditSDSActivity.button_file_right.addEventListener("click", function () {
            a.traverseNavigation(1);
        });
        ViewNewEditSDSActivity.webview = a.findViewById("WebView");
        ViewNewEditSDSActivity.imageview = a.findViewById("ImageView");
        // ViewNewEditSDSActivity.imageViewPdf = a.findViewById("ImageView");
        // var resetMatrix = ViewNewEditSDSActivity.imageViewPdf.getImageMatrix();
        // ViewNewEditSDSActivity.imageViewPdf.setOnTouchListener(a);
        //        ViewNewEditSDSActivity.webview.getSettings().setJavaScriptEnabled(true);
        // ViewNewEditSDSActivity.webview.getSettings().setLoadWithOverviewMode(true);
        // ViewNewEditSDSActivity.webview.getSettings().setUseWideViewPort(true);
        // ViewNewEditSDSActivity.webview.getSettings().setBuiltInZoomControls(true);

        a.w4OnCreate();

        ViewNewEditSDSActivity.webview.ele.style.height = (window.innerHeight - 170) + "px"
    }

    w4OnCreate() {
        var a = this;
        a.findViewById("MissingSDS").setVisibility(View.GONE);
        a.findViewById("Uploading_Progress").setVisibility(View.GONE);
        a.findViewById("Deleting_Progress").setVisibility(View.GONE);
        a.findViewById("Downloading_Progress").setVisibility(View.VISIBLE);
        ViewNewEditSDSActivity.fileNav.setVisibility(View.GONE);
        ViewNewEditSDSActivity.webview.setVisibility(View.GONE);
        a.findViewById("Button_Add_PDF").setVisibility(View.GONE);
        a.findViewById("AddSDSButton").setVisibility(View.GONE);
        a.findViewById("Delete_SDS").setVisibility(View.GONE);
        ViewNewEditSDSActivity.imageview.setVisibility(View.GONE);
        a.W4FSOs = [];
        ViewNewEditSDSActivity.currentURI = -1;
        var listRef = MainActivity.firebaseStorage.ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.currentUser.getCompanyid()).child(MainActivity.DB_PATH_ASSET_SDS).child(a.selectedSDSSupplyItemID);
        listRef.listAll()
            .then((res) => {
                if (res.items.length == 0)
                    a.showUIAfterDownloadFinished();

                res.items.forEach((item) => {
                    a.W4FSOs.push(new W4FirebaseStorageObject());
                });
                var i = 0;
                res.items.forEach((item) => {
                    // All the items under listRef.
                    var name = item.name;
                    var obj = a.W4FSOs[i];
                    ++i;
                    var ref = listRef.child(name);
                    ref.getDownloadURL()
                        .then((url) => {
                            // obj.uri = uri.toString();
                            if (name.length > 4 && name.substring(name.length - 4, name.length).equals(".pdf")) {
                                obj.downloaded = true;
                                obj.type = ViewNewEditSDSActivity.FILETYPE_PDF;
                                obj.name = name;
                                obj.url = url;
                                a.traverseNavigation(0);
                            } else {
                                obj.downloaded = true;
                                obj.type = ViewNewEditSDSActivity.FILETYPE_IMAGE;
                                obj.name = name;
                                obj.url = url;
                                a.traverseNavigation(0);
                            }
                        });
                });
            });
    }

    areAllFilesDownloaded() {
        var a = this;
        for (let obj of a.W4FSOs) {
            if (!obj.downloaded)
                return false;
        }
        a.showUIAfterDownloadFinished();
        return true;
    }

    showUIAfterDownloadFinished() {
        var a = this;
        if (FireBaseListeners.viewNewEditSDSActivity != null) {
            FireBaseListeners.viewNewEditSDSActivity.findViewById("Downloading_Progress").setVisibility(View.GONE);
            if (a.W4FSOs.length == 0)
                FireBaseListeners.viewNewEditSDSActivity.findViewById("MissingSDS").setVisibility(View.VISIBLE);

            if (MainActivity.currentUser.getWritePermissions()[Asset.PERMISSION_ALL_SDS] || MainActivity.currentUser.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SDS]) {
                FireBaseListeners.viewNewEditSDSActivity.findViewById("AddSDSButton").setVisibility(View.VISIBLE);
                if (a.W4FSOs.length > 0)
                    FireBaseListeners.viewNewEditSDSActivity.findViewById("Delete_SDS").setVisibility(View.VISIBLE);
            } else {
                FireBaseListeners.viewNewEditSDSActivity.findViewById("AddSDSButton").setVisibility(View.GONE);
                FireBaseListeners.viewNewEditSDSActivity.findViewById("Delete_SDS").setVisibility(View.GONE);
            }
        }
    }

    traverseNavigation(i2) {
        var a = this;
        if (a.areAllFilesDownloaded()) {
            var i3 = ViewNewEditSDSActivity.currentURI;
            if (i3 < 0)
                i3 = 0;
            var i = ViewNewEditSDSActivity.currentURI + i2;
            if (i < 0)
                i = 0;
            var overrideLeftButton = false;
            var overrideRightButton = false;
            if (i < a.W4FSOs.length) {
                ViewNewEditSDSActivity.webview.setVisibility(View.VISIBLE);
                a.set_iFrame(a.W4FSOs[i]);
                if (a.W4FSOs.length > 1) {
                    ViewNewEditSDSActivity.fileNav.setVisibility(View.VISIBLE);
                    if (i == 0 && !overrideLeftButton) {
                        ViewNewEditSDSActivity.button_file_left.setVisibility(View.INVISIBLE);
                        ViewNewEditSDSActivity.button_file_left.ele.disabled = true;
                    }
                    else {
                        ViewNewEditSDSActivity.button_file_left.setVisibility(View.VISIBLE);
                        ViewNewEditSDSActivity.button_file_left.ele.disabled = false;
                    }
                    if (i == a.W4FSOs.length - 1 && !overrideRightButton) {
                        ViewNewEditSDSActivity.button_file_right.setVisibility(View.INVISIBLE);
                        ViewNewEditSDSActivity.button_file_right.ele.disabled = true;
                    }
                    else {
                        ViewNewEditSDSActivity.button_file_right.setVisibility(View.VISIBLE);
                        ViewNewEditSDSActivity.button_file_right.ele.disabled = false;
                    }
                } else {
                    ViewNewEditSDSActivity.fileNav.setVisibility(View.GONE);
                }
                ViewNewEditSDSActivity.currentURI = i;
            }
        }
    }

    onActivityResult(requestCode, resultCode, data) {
        var a = this;
        //        console.log("On Activity result|" + requestCode + "|" + resultCode + "|" + data.getDataString());
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == ViewNewEditSDSActivity.FILETYPE && resultCode == AppCompatActivity.RESULT_OK && data != null && data.getData() != null) {
            a.fileUri = data.getData();
            // console.log("Chose pdf: " + a.fileUri.getPath());
            a.Fileuploader();
        } else if (requestCode == MainActivity.requestCodeSDSDelete && resultCode == AppCompatActivity.RESULT_OK) {
            if (ViewNewEditSDSActivity.currentURI < a.W4FSOs.length) {
                a.findViewById("Deleting_Progress").setVisibility(View.VISIBLE);
                MainActivity.w4Toast(a, "Deleting SDS Sheet...", Toast.LENGTH_SHORT);
                MainActivity.firebaseStorage.ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.currentUser.getCompanyid()).child(MainActivity.DB_PATH_ASSET_SDS).child(a.selectedSDSSupplyItemID).child(a.W4FSOs[ViewNewEditSDSActivity.currentURI].name).delete()
                    .then(() => {
                        MainActivity.w4Toast(a, "Deletion successful!", Toast.LENGTH_SHORT);
                        a.w4OnCreate();
                    }).catch((error) => {
                        MainActivity.w4Toast(a, "Deletion failure!", Toast.LENGTH_SHORT);
                    });
            }
        }
    }

    static filesUploaded = 0;
    static filesUploading = 0;
    Fileuploader() {
        var a = this;
        a.findViewById("Uploading_Progress").setVisibility(View.VISIBLE);
        MainActivity.w4Toast(a, "Uploading...", Toast.LENGTH_SHORT);
        var reff = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.currentUser.getCompanyid()).child(MainActivity.DB_PATH_ASSET_SUPPLY_ITEMS).child(a.selectedSDSSupplyItemID).push();
        // console.log("Beginning file upload " + W4_Funcs.getExtension(a.fileUri.name));
        var Ref = MainActivity.firebaseStorage.ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.currentUser.getCompanyid()).child(MainActivity.DB_PATH_ASSET_SDS).child(a.selectedSDSSupplyItemID).child(reff.key + "." + W4_Funcs.getExtension(a.fileUri.name));
        Ref.put(a.fileUri).then((snapshot) => {
            ++ViewNewEditSDSActivity.filesUploaded;
            if (ViewNewEditSDSActivity.filesUploaded == ViewNewEditSDSActivity.filesUploading && MainActivity.loggedIn) {
                // console.log("File(s) uploaded successfully");
                MainActivity.w4Toast(a, "Upload Successful!", Toast.LENGTH_SHORT);
                a.w4OnCreate();
            }
        }).catch((error) => {
            console.error("File upload failed:|" + error.code + "|" + error.message);
            MainActivity.dialogBox(a, "File upload failed!" + error.message);
            a.findViewById("Uploading_Progress").setVisibility(View.GONE);
        });
    }

    readFile(evt) {
        
        ViewNewEditSDSActivity.filesUploading = evt.target.files.length;
        ViewNewEditSDSActivity.filesUploaded = 0;
        for (let f of evt.target.files) {
            if (f) {
                var intent = new Intent();
                intent.setData(f);
                FireBaseListeners.viewNewEditSDSActivity.onActivityResult(ViewNewEditSDSActivity.FILETYPE, AppCompatActivity.RESULT_OK, intent);
            } else {
                alert("Failed to load file");
            }
        }
        FireBaseListeners.viewNewEditSDSActivity.findViewById("Button_Add_PDF").setVisibility(View.GONE);
        FireBaseListeners.viewNewEditSDSActivity.findViewById("Button_Add_Image").setVisibility(View.GONE);
        FireBaseListeners.viewNewEditSDSActivity.findViewById("Button_Add_PDF_Input").ele.value = "";
        FireBaseListeners.viewNewEditSDSActivity.findViewById("Button_Add_Image_Input").ele.value = "";
    }

    set_iFrame(obj) {
        ViewNewEditSDSActivity.webview.setVisibility(View.GONE);
        ViewNewEditSDSActivity.imageview.setVisibility(View.GONE);
        if (obj.type == ViewNewEditSDSActivity.FILETYPE_IMAGE) {
            ViewNewEditSDSActivity.imageview.ele.src = obj.url;
            ViewNewEditSDSActivity.imageview.setVisibility(View.VISIBLE);
        }
        else {
            ViewNewEditSDSActivity.webview.ele.src = obj.url;
            ViewNewEditSDSActivity.webview.setVisibility(View.VISIBLE);
        }


        var modal = document.getElementById("myModal");
        var img = document.getElementById("ImageView");
        var modalImg = document.getElementById("img01");
        var closeButton = document.getElementById("closeButton");
        img.onclick = function () {
            modal.style.display = "block";
            modalImg.style.display = "block";
            modalImg.src = img.src;
            imgzoom = 1;
            currentTranslate.x = 0;
            currentTranslate.y = 0;
            setImgTransform();
        }

        // When the user clicks on <span> (x), close the modal
        var closeFunc = function () {
            modal.style.display = "none";
            modalImg.style.display = "none";
        }
        closeButton.onclick = closeFunc;
        // modal.onclick = closeFunc;
    }
}
