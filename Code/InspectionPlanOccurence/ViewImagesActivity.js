class ViewImagesActivity extends W4Activity {
    static FILETYPE = 1;
    static imageview;
    static button_file_left;
    static button_file_right;
    static fileNav;

    static currentURI; //Is set to -1 in w4OnCreate()
    static FILETYPE_IMAGE = 2;

    static viewImagesActivity = null;

    onDestroy() {
        super.onDestroy();
        ViewImagesActivity.viewImagesActivity = null;
    }


    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        let title = a.getIntent().getStringExtra("title");
        a.directory = a.getIntent().getStringExtra("directory");
        if (title == null)
            title = "";
        a.getSupportActionBar().setTitle(title);
        a.setContentView(R.layout.activity_view_images);
        ViewImagesActivity.viewImagesActivity = a;
        if (MainActivity.currentUser.getWritePermissions()[Asset.PERMISSION_ALL_INSPECTIONS] || MainActivity.currentUser.getWritePermissions()[Asset.PERMISSION_ASSIGNED_INSPECTIONS]) {
            a.findViewById("Button_Add_Image").ele.addEventListener('change', a.readFile, false);

            var button1 = a.findViewById("Delete_Image");
            button1.addEventListener("click", function () {
                if (ViewImagesActivity.currentURI < a.W4FSOs.length) {
                    var intent = new Intent(a, new ConfirmActivity());
                    intent.putExtra("description", "Are you sure you want to delete this image?");
                    a.startActivityForResult(intent, MainActivity.requestCodeDelete);
                }
            });
        }
        ViewImagesActivity.button_file_left = a.findViewById("File_Left");
        ViewImagesActivity.button_file_right = a.findViewById("File_Right");
        ViewImagesActivity.fileNav = a.findViewById("FileNav");

        ViewImagesActivity.button_file_left.addEventListener("click", function () {
            a.traverseNavigation(-1);
        });

        ViewImagesActivity.button_file_right.addEventListener("click", function () {
            a.traverseNavigation(1);
        });
        ViewImagesActivity.imageview = a.findViewById("ImageView");

        a.w4OnCreate();
    }

    w4OnCreate() {
        var a = this;
        a.findViewById("MissingImage").setVisibility(View.GONE);
        a.findViewById("Uploading_Progress").setVisibility(View.GONE);
        a.findViewById("Deleting_Progress").setVisibility(View.GONE);
        a.findViewById("Downloading_Progress").setVisibility(View.VISIBLE);
        ViewImagesActivity.fileNav.setVisibility(View.GONE);
        a.findViewById("Button_Add_Image").setVisibility(View.GONE);
        a.findViewById("Delete_Image").setVisibility(View.GONE);
        ViewImagesActivity.imageview.setVisibility(View.GONE);

        a.W4FSOs = [];
        ViewImagesActivity.currentURI = -1;
        var listRef = MainActivity.firebaseStorage.ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.currentUser.getCompanyid()).child(a.directory);
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
                            if (name.length > 4 && name.substring(name.length - 4, name.length).equals(".pdf")) {
                                // obj.downloaded = true;
                                // obj.type = ViewImagesActivity.FILETYPE_PDF;
                                // obj.name = name;
                                // obj.url = url;
                                // a.traverseNavigation(0);
                            } else {
                                obj.downloaded = true;
                                obj.type = ViewImagesActivity.FILETYPE_IMAGE;
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
        if (ViewImagesActivity.viewImagesActivity != null) {
            ViewImagesActivity.viewImagesActivity.findViewById("Downloading_Progress").setVisibility(View.GONE);
            if (a.W4FSOs.length == 0)
                ViewImagesActivity.viewImagesActivity.findViewById("MissingImage").setVisibility(View.VISIBLE);

            if (MainActivity.currentUser.getWritePermissions()[Asset.PERMISSION_ALL_INSPECTIONS] || MainActivity.currentUser.getWritePermissions()[Asset.PERMISSION_ASSIGNED_INSPECTIONS]) {
                ViewImagesActivity.viewImagesActivity.findViewById("Button_Add_Image").setVisibility(View.VISIBLE);
                if (a.W4FSOs.length > 0)
                    ViewImagesActivity.viewImagesActivity.findViewById("Delete_Image").setVisibility(View.VISIBLE);
            } else {
                ViewImagesActivity.viewImagesActivity.findViewById("Button_Add_Image").setVisibility(View.GONE);
                ViewImagesActivity.viewImagesActivity.findViewById("Delete_Image").setVisibility(View.GONE);
            }
        }
    }

    traverseNavigation(i2) {
        var a = this;
        if (a.areAllFilesDownloaded()) {
            var i = ViewImagesActivity.currentURI + i2;
            if (i < 0)
                i = 0;
            var overrideLeftButton = false;
            var overrideRightButton = false;
            if (i < a.W4FSOs.length) {
                a.set_iFrame(a.W4FSOs[i]);
                if (a.W4FSOs.length > 1) {
                    ViewImagesActivity.fileNav.setVisibility(View.VISIBLE);
                    if (i == 0 && !overrideLeftButton) {
                        ViewImagesActivity.button_file_left.setVisibility(View.INVISIBLE);
                        ViewImagesActivity.button_file_left.ele.disabled = true;
                    }
                    else {
                        ViewImagesActivity.button_file_left.setVisibility(View.VISIBLE);
                        ViewImagesActivity.button_file_left.ele.disabled = false;
                    }
                    if (i == a.W4FSOs.length - 1 && !overrideRightButton) {
                        ViewImagesActivity.button_file_right.setVisibility(View.INVISIBLE);
                        ViewImagesActivity.button_file_right.ele.disabled = true;
                    }
                    else {
                        ViewImagesActivity.button_file_right.setVisibility(View.VISIBLE);
                        ViewImagesActivity.button_file_right.ele.disabled = false;
                    }
                } else {
                    ViewImagesActivity.fileNav.setVisibility(View.GONE);
                }
                ViewImagesActivity.currentURI = i;
            }
        }
    }

    onActivityResult(requestCode, resultCode, data) {
        var a = this;
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == ViewImagesActivity.FILETYPE && resultCode == AppCompatActivity.RESULT_OK && data != null && data.getData() != null) {
            a.fileUri = data.getData();
            a.Fileuploader();
        } else if (requestCode == MainActivity.requestCodeDelete && resultCode == AppCompatActivity.RESULT_OK) {
            if (ViewImagesActivity.currentURI < a.W4FSOs.length) {
                a.findViewById("Deleting_Progress").setVisibility(View.VISIBLE);
                MainActivity.w4Toast(this, "Deleting Image...", Toast.LENGTH_SHORT);
                MainActivity.firebaseStorage.ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.currentUser.getCompanyid()).child(a.directory).child(a.W4FSOs[ViewImagesActivity.currentURI].name).delete()
                    .then(() => {
                        MainActivity.w4Toast(this, "Deletion successful!", Toast.LENGTH_SHORT);
                        a.w4OnCreate();
                    }).catch((error) => {
                        MainActivity.w4Toast(this, "Deletion failure!", Toast.LENGTH_SHORT);
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
        var reff = firebase.database().ref().push();
        var Ref = MainActivity.firebaseStorage.ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.currentUser.getCompanyid()).child(a.directory).child(reff.key + "." + W4_Funcs.getExtension(a.fileUri.name));

        var path = MainActivity.DB_PATH_COMPANIES + "/" + MainActivity.currentUser.getCompanyid() + "/" + a.directory + "/" + reff.key + "." + W4_Funcs.getExtension(a.fileUri.name);
        DoInspectionPlanInProgressActivity.addedImages.push(path);
        Ref.put(a.fileUri).then((snapshot) => {
            ++ViewImagesActivity.filesUploaded;
            if (ViewImagesActivity.filesUploaded == ViewImagesActivity.filesUploading && MainActivity.loggedIn) {
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
        ViewImagesActivity.filesUploading = evt.target.files.length;
        ViewImagesActivity.filesUploaded = 0;
        for (let f of evt.target.files) {
            if (f) {
                var intent = new Intent();
                intent.setData(f);
                ViewImagesActivity.viewImagesActivity.onActivityResult(ViewImagesActivity.FILETYPE, AppCompatActivity.RESULT_OK, intent);
            } else {
                alert("Failed to load file");
            }
        }
        ViewImagesActivity.viewImagesActivity.findViewById("Button_Add_Image_Input").ele.value = "";
    }

    set_iFrame(obj) {
        ViewImagesActivity.imageview.setVisibility(View.GONE);
        if (obj.type == ViewImagesActivity.FILETYPE_IMAGE) {
            ViewImagesActivity.imageview.ele.src = obj.url;
            ViewImagesActivity.imageview.setVisibility(View.VISIBLE);
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
