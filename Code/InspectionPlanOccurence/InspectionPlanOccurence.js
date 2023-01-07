class InspectionPlanOccurence extends InspectionPlan {

    // private boolean completed;
    // private String person_inspector_id;
    // private ArrayList<Integer> result = new ArrayList<>();
    // private ArrayList<ArrayList<Integer>> results = new ArrayList<>();

    constructor(inspectionPlan, date, completed, person_inspector_id, result, results) {
        super(inspectionPlan.getW4id(), inspectionPlan.getName(), inspectionPlan.getLocationID(), inspectionPlan.getShiftID(), inspectionPlan.getLocationSavedName(), Array.from(inspectionPlan.getArea_names()), W4_Funcs.clone2DArray(inspectionPlan.getPoints()), inspectionPlan.isTemplate());
        this.dateTime = date;
        this.completed = completed;
        this.person_inspector_id = person_inspector_id;
        this.result = result;
        this.results = results;
    }

    static fromDS(dataSnapshot) {
        var inspectionPlan = InspectionPlan.fromDS(dataSnapshot);
        var dateTime = dataSnapshot["dateTime"];
        var completed = dataSnapshot["completed"];
        var person_inspector_id = dataSnapshot["person_inspector_id"];
        var result = dataSnapshot["result"];
        var results = dataSnapshot["results"];

        if (result == null)
            result = [];
        if (results == null)
            results = [];
        return new InspectionPlanOccurence(inspectionPlan, dateTime, completed, person_inspector_id, result, results);
    }

    isCompleted() {
        return this.completed;
    }

    setCompleted(completed) {
        this.completed = completed;
    }

    getPerson_inspector_id() {
        return this.person_inspector_id;
    }

    setPerson_inspector_id(person_inspector_id) {
        this.person_inspector_id = person_inspector_id;
    }

    getResult() {
        return this.result;
    }

    setResult(result) {
        this.result = result;
    }

    getResults() {
        return this.results;
    }

    setResults(results) {
        this.results = results;
    }

    static compareTo(a, o) {
        if (a.getDateTime() < o.getDateTime()) {
            return 1;
        }
        if (a.getDateTime() > o.getDateTime()) {
            return -1;
        }
        return 0;
    }

    static cleanImages() {
        for (let image of DoInspectionPlanInProgressActivity.addedImages) {
            MainActivity.firebaseStorage.ref().child(image).delete()
                .then(() => {
                }).catch((error) => {
                    console.error(error);
                });
                MainActivity.w4Toast(MainActivity.mainActivity, "Discarded unsaved images", Toast.LENGTH_LONG);
        }
        DoInspectionPlanInProgressActivity.addedImages = [];
    }

    static loadThumbnails(id, plan, activity) {
        if (id != "") {
            var num = 0;
            for (var i = 0; i < plan.getArea_names().length; ++i) {
                InspectionPlanOccurence.loadThumbnail(num, plan.getArea_names()[i], id, activity);
                ++num;
                if (plan.getPoints().length > i)
                    for (var j = 0; j < plan.getPoints()[i].length; ++j) {
                        InspectionPlanOccurence.loadThumbnail(num, plan.getPoints()[i][j], id, activity);
                        ++num;
                    }
            }
        }
    }

    static loadThumbnail(num0, name, id, activity) {
        var listRef = MainActivity.firebaseStorage.ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.currentUser.getCompanyid()).child(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS_OCCURENCE).child(id).child(num0 + "|");
        listRef.listAll()
            .then(dir => {
                if (activity) {
                    var linearLayout = activity.findViewById("Inspection_Plan_Linear_Layout");
                    if (linearLayout) {
                        if (dir.items.length > 0) {
                            var ref = listRef.child(dir.items[0].name);
                            ref.getDownloadURL()
                                .then((url) => {
                                    linearLayout.getChildAt(num0).findViewById("ID_THUMBNAIL").setVisibility(View.VISIBLE);
                                    linearLayout.getChildAt(num0).findViewById("ID_THUMBNAIL").setImageResource(url);
                                    linearLayout.getChildAt(num0).findViewById("ID_THUMBNAIL").addEventListener("click", function () {
                                        var intent = new Intent(activity, new ViewImagesActivity());
                                        intent.putExtra("title", name);
                                        intent.putExtra("directory", MainActivity.DB_PATH_ASSET_INSPECTION_PLANS_OCCURENCE + "/" + id + "/" + num0 + "|");
                                        activity.startActivity(intent);
                                    });
                                });
                        }
                        else {
                            linearLayout.getChildAt(num0).findViewById("ID_THUMBNAIL").setVisibility(View.GONE);
                        }
                    }
                }
            }).catch(error => console.error(error));
    }
}
