class StringListAdapter extends ArrayAdapter {

    //     final Activity activity;
    //     final ArrayList<Person> personList;
    //     final boolean intentReturnPersonPos;

    //     static ViewHolder viewHolder;
    // var ID = 0;

    /**
     * Constructor
     *
     * @param context The activity of the current activity so it
     *                knows how to display the list in the listview
     * @param stringList The list of items to display in the list view
     *                 with their names and quantities
     */
    constructor(context, stringList) {
        super(context, R.layout.generic_list_item, stringList);
        this.activity = context;
        this.stringList = stringList;
    }

    /**
     * @param position The index of where the item is on the list, 0 is top, next is 1, etc.
     * @param view
     * @param parent
     * @return
     */
    getView(position, view, parent) {
        var a = this;
        var string = this.stringList[position];
        var inflater = LayoutInflater.from(this.getContext());
        view = inflater.inflate(R.layout.generic_list_item, null, true);
        var button = view.findViewById("Generic_Button");
        button.setText(string.display);

        var activity = this.activity;
        button.addEventListener("click", function () {
            activity.getIntent().putExtra("index1", string.index1);
            activity.getIntent().putExtra("string", string.string);
            activity.setResult(AppCompatActivity.RESULT_OK, activity.getIntent());
            activity.finish();
        });

        return view;
    };
}
