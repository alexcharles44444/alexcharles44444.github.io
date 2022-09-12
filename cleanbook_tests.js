let testing_enabled = false; //Disable by commenting out cleanbook_tests.js script tag in index.html
let a_click = 0;
let a_click_list = 1;
let a_valid_input = 2;
let a_valid_label = 3;
let a_valid_check = 4;
let a_valid_list_size = 5;
let a_set_input = 6;
let a_set_check = 7;
let a_stop = 8;
let a_set_input_indexed = 9;
let a_valid_input_indexed = 10;
let a_waitForFirebase = 11;
let a_message = 12;

var i_test_asset = 0;
var i_test_num = 0;

class TestPart {
    constructor(ele, action, text, wait, indexes) {
        this.ele = ele;
        this.action = action;
        this.text = text;
        this.wait = wait;
        this.indexes = indexes;
    }
}

function t(ele, action, text, wait, indexes) {
    return new TestPart(ele, action, text, wait, indexes);
}

//!!!!!!MANUAL TESTS REQUIRED!!!!!!!
//Test adding and deleting SDS and importing template SDS

var test_parts = [[
    //Create new person
    t("PeopleButton", a_click),
    t("AddPersonButton", a_click),
    t("Edit_Person_FirstName", a_set_input, "Gina"),
    t("Edit_Person_LastName", a_set_input, "Cross"),
    t("Edit_Person_Phone", a_set_input, "123-123-1234"),
    t("New_Person_Email", a_set_input, "legojedi4@gmail.com"),
    t("Edit_Person_Password", a_set_input, "abcdef"),
    t("Edit_Person_Password2", a_set_input, "abcdef"),
    t("Accept_Edit", a_click, null, 4000),
    //Validate new
    t("dialogbox_button", a_click),
    t("PeopleButton", a_click),
    t("PeopleList", a_click_list, 1, 1000),
    t("Edit_Person_FirstName", a_valid_input, "Gina"),
    t("Edit_Person_LastName", a_valid_input, "Cross"),
    t("Edit_Person_Phone", a_valid_input, "123-123-1234"),
    t("Edit_Person_Email", a_valid_label, "legojedi4@gmail.com"),
    t("Edit_Person_Type_Spinner", a_valid_input, "Employee"),
    t("Edit_Person_RequiresGPS_CheckBox", a_valid_check, true),
    //Make edits
    t("Edit_Person_FirstName", a_set_input, "Gina1"),
    t("Edit_Person_LastName", a_set_input, "Cross1"),
    t("Edit_Person_Phone", a_set_input, "123-123-12341"),
    t("Edit_Person_Password", a_set_input, "abcdefg"),
    t("Edit_Person_Password2", a_set_input, "abcdefg"),
    t("Edit_Person_Type_Spinner", a_set_input, "Supervisor"),
    t("Edit_Person_RequiresGPS_CheckBox", a_set_check, false),
    t("Accept_Edit", a_click, null, 1000),
    //Validate edits
    t("PeopleList", a_click_list, 1, 1000),
    t("Edit_Person_FirstName", a_valid_input, "Gina1"),
    t("Edit_Person_LastName", a_valid_input, "Cross1"),
    t("Edit_Person_Phone", a_valid_input, "123-123-12341"),
    t("Edit_Person_Type_Spinner", a_valid_input, "Supervisor"),
    t("Edit_Person_RequiresGPS_CheckBox", a_valid_check, false),
    //Test new password
    t("sidebar_logout_button", a_click, null, 1000),
    t("Login_Email", a_set_input, "legojedi4@gmail.com"),
    t("Login_Password", a_set_input, "abcdefg"),
    t("SignInButton", a_click, null, 2000),
    t("dialogbox_button", a_click), //Verify email pop up
    t(null, a_stop),
    t("Login_Password", a_set_input, "abcdefg"),
    t("SignInButton", a_click, null, 4000),
    //Log Out and Log in as Owner Account
    t("sidebar_logout_button", a_click, null, 1000),
    t("Login_Email", a_set_input, "alexjob44@gmail.com"),
    t("Login_Password", a_set_input, "abcdef"),
    t("SignInButton", a_click, null, 4000),
    //Locations
    t("LocationsButton", a_click),
    t("AddLocationButton", a_click),
    t("Edit_Location_Name", a_set_input, "Six Flags Magic Mountain"),
    t("Edit_Location_Address1", a_set_input, "26101 Magic Mountain Pkwy"),
    t("Edit_Location_Address2", a_set_input, "10"),
    t("Edit_Location_City", a_set_input, "Valencia"),
    t("Edit_Location_State", a_set_input, "CA"),
    t("Edit_Location_Zip", a_set_input, "91355"),
    t("Edit_Location_Phone", a_set_input, "(661) 255-4100"),
    t("Edit_Location_GPSRadius", a_set_input, "1000"),
    t("Edit_Location_Email", a_set_input, "magicmountain@sixflags.com"),
    t("Edit_Location_Security", a_set_input, "Lock main gate afterwards"),
    t("Edit_Location_Instructions", a_set_input, "Clean all ride restraints, sweep paths, empty litter bins, patrol exits of more thrilling rides"),
    t("Accept_Edit_Location", a_click, null, 500),
    //Validate new location
    t("LocationsList", a_click_list, 1),
    t("Edit_Location_Name", a_valid_input, "Six Flags Magic Mountain"),
    t("Edit_Location_Address1", a_valid_input, "26101 Magic Mountain Pkwy"),
    t("Edit_Location_Address2", a_valid_input, "10"),
    t("Edit_Location_City", a_valid_input, "Valencia"),
    t("Edit_Location_State", a_valid_input, "CA"),
    t("Edit_Location_Zip", a_valid_input, "91355"),
    t("Edit_Location_Phone", a_valid_input, "(661) 255-4100"),
    t("Edit_Location_Country_Spinner", a_valid_input, "United States"),
    t("Edit_Location_GPSRadius", a_valid_input, "1000"),
    t("Edit_Location_Email", a_valid_input, "magicmountain@sixflags.com"),
    t("Edit_Location_Security", a_valid_input, "Lock main gate afterwards"),
    t("Edit_Location_Instructions", a_valid_input, "Clean all ride restraints, sweep paths, empty litter bins, patrol exits of more thrilling rides"),
    //Apply edits
    t("Edit_Location_Name", a_set_input, "Six Flags Magic Mountain1"),
    t("Edit_Location_Address1", a_set_input, "26101 Magic Mountain Pkwy1"),
    t("Edit_Location_Address2", a_set_input, "101"),
    t("Edit_Location_City", a_set_input, "Valencia1"),
    t("Edit_Location_State", a_set_input, "CA1"),
    t("Edit_Location_Zip", a_set_input, "91355a"),
    t("Edit_Location_Phone", a_set_input, "(661) 255-4100a"),
    t("Edit_Location_Country_Spinner", a_set_input, "Canada"),
    t("Edit_Location_GPSRadius", a_set_input, "2000"),
    t("Edit_Location_Email", a_set_input, "magicmountain@sixflags.com1"),
    t("Edit_Location_Security", a_set_input, "Lock main gate afterwards1"),
    t("Edit_Location_Instructions", a_set_input, "Clean all ride restraints, sweep paths, empty litter bins, patrol exits of more thrilling rides1"),
    t("Accept_Edit_Location", a_click, null, 500),
    //Validate edits
    t("LocationsList", a_click_list, 1),
    t("Edit_Location_Name", a_valid_input, "Six Flags Magic Mountain1"),
    t("Edit_Location_Address1", a_valid_input, "26101 Magic Mountain Pkwy1"),
    t("Edit_Location_Address2", a_valid_input, "101"),
    t("Edit_Location_City", a_valid_input, "Valencia1"),
    t("Edit_Location_State", a_valid_input, "CA1"),
    t("Edit_Location_Zip", a_valid_input, "91355a"),
    t("Edit_Location_Phone", a_valid_input, "(661) 255-4100a"),
    t("Edit_Location_Country_Spinner", a_valid_input, "Canada"),
    t("Edit_Location_GPSRadius", a_valid_input, "2000"),
    t("Edit_Location_Email", a_valid_input, "magicmountain@sixflags.com1"),
    t("Edit_Location_Security", a_valid_input, "Lock main gate afterwards1"),
    t("Edit_Location_Instructions", a_valid_input, "Clean all ride restraints, sweep paths, empty litter bins, patrol exits of more thrilling rides1"),
    t("activity_back_arrow", a_click),
    t("activity_back_arrow", a_click),
    //Shifts
    t("ShiftsButton", a_click),
    t("AddShiftButton", a_click),
    t("Edit_ShiftTime_Name", a_set_input, "Morning"),
    t("Edit_ShiftTime_Location_Spinner", a_set_input, "Six Flags Magic Mountain1"),
    t("Edit_ShiftTime_Start_Hours_Spinner", a_set_input, "10"),
    t("Edit_ShiftTime_Start_Minutes_Spinner", a_set_input, "00"),
    t("Edit_ShiftTime_Start_AM_PM_Spinner", a_set_input, "AM"),
    t("Edit_ShiftTime_End_Hours_Spinner", a_set_input, "12"),
    t("Edit_ShiftTime_End_Minutes_Spinner", a_set_input, "30"),
    t("Edit_ShiftTime_End_AM_PM_Spinner", a_set_input, "PM"),
    t("Edit_ShiftTime_RepeatCheckBox", a_set_check, true),
    t("Edit_ShiftTime_RepeatUnit", a_set_input, "Weekly"),
    t("Edit_Shift_Time_RepeatEvery", a_set_input, "2"),
    t("Edit_ShiftTime_Radio_AfterOccurences", a_click),
    t("Edit_ShiftTime_RepeatOccurences", a_set_input, "10"),
    t("Edit_ShiftTime_Add_Person", a_click),
    t("PeopleList", a_click_list, 1),
    t("Accept_Edit_ShiftTime", a_click),
    t("ShiftList", a_click_list, 0),
    t("Edit_ShiftTime_Name", a_valid_input, "Morning"),
    t("Edit_ShiftTime_Location_Spinner", a_valid_input, "Six Flags Magic Mountain1"),
    t("Edit_ShiftTime_Start_Hours_Spinner", a_valid_input, "10"),
    t("Edit_ShiftTime_Start_Minutes_Spinner", a_valid_input, "00"),
    t("Edit_ShiftTime_Start_AM_PM_Spinner", a_valid_input, "AM"),
    t("Edit_ShiftTime_End_Hours_Spinner", a_valid_input, "12"),
    t("Edit_ShiftTime_End_Minutes_Spinner", a_valid_input, "30"),
    t("Edit_ShiftTime_End_AM_PM_Spinner", a_valid_input, "PM"),
    t("Edit_ShiftTime_RepeatCheckBox", a_valid_check, true),
    t("Edit_ShiftTime_RepeatUnit", a_valid_input, "Weekly"),
    t("Edit_Shift_Time_RepeatEvery", a_valid_input, "2"),
    t("Edit_ShiftTime_Radio_AfterOccurences", a_valid_check, true),
    t("Edit_ShiftTime_RepeatOccurences", a_valid_input, "10"),
    t("Edit_ShiftTime_Add_Person_List", a_valid_list_size, 1),
    //Apply edits
    t("Edit_ShiftTime_Name", a_set_input, "Morning1"),
    t("Edit_ShiftTime_Start_Hours_Spinner", a_set_input, "1"),
    t("Edit_ShiftTime_Start_Minutes_Spinner", a_set_input, "05"),
    t("Edit_ShiftTime_Start_AM_PM_Spinner", a_set_input, "PM"),
    t("Edit_ShiftTime_End_Hours_Spinner", a_set_input, "5"),
    t("Edit_ShiftTime_End_Minutes_Spinner", a_set_input, "35"),
    t("Edit_ShiftTime_End_AM_PM_Spinner", a_set_input, "PM"),
    t("Edit_ShiftTime_RepeatUnit", a_set_input, "Monthly"),
    t("Edit_Shift_Time_RepeatEvery", a_set_input, "3"),
    t("Edit_ShiftTime_Radio_DayOfWeek", a_click),
    t("Edit_ShiftTime_Radio_OnDate", a_click),
    t("XButton", a_click), //Remove person
    t("Accept_Edit_ShiftTime", a_click),
    //Validate edits
    t("ShiftList", a_click_list, 0),
    t("Edit_ShiftTime_Name", a_valid_input, "Morning1"),
    t("Edit_ShiftTime_Location_Spinner", a_valid_input, "Six Flags Magic Mountain1"),
    t("Edit_ShiftTime_Start_Hours_Spinner", a_valid_input, "1"),
    t("Edit_ShiftTime_Start_Minutes_Spinner", a_valid_input, "05"),
    t("Edit_ShiftTime_Start_AM_PM_Spinner", a_valid_input, "PM"),
    t("Edit_ShiftTime_End_Hours_Spinner", a_valid_input, "5"),
    t("Edit_ShiftTime_End_Minutes_Spinner", a_valid_input, "35"),
    t("Edit_ShiftTime_End_AM_PM_Spinner", a_valid_input, "PM"),
    t("Edit_ShiftTime_RepeatCheckBox", a_valid_check, true),
    t("Edit_ShiftTime_RepeatUnit", a_valid_input, "Monthly"),
    t("Edit_Shift_Time_RepeatEvery", a_valid_input, "3"),
    t("Edit_ShiftTime_Radio_DayOfWeek", a_valid_check, true),
    t("Edit_ShiftTime_Radio_OnDate", a_valid_check, true),
    t("Edit_ShiftTime_RepeatOccurences", a_valid_input, "10"),
    t("Edit_ShiftTime_Add_Person_List", a_valid_list_size, 0),
    t("activity_back_arrow", a_click),
    t("activity_back_arrow", a_click),
    //Tasks
    t("TasksButton", a_click),
    t("TaskTypeList", a_click_list, 1),
    t("AddTaskButton", a_click),
    t("Task_Name", a_set_input, "Food Court"),
    t("ID_SUBTASK_PLUS_BUTTON", a_click),
    t("Task_Linear_Layout", a_set_input_indexed, "Tables", null, [0, 0, 0, 1, 2, 0]), //Task
    t("Task_Linear_Layout", a_set_input_indexed, "1", null, [0, 0, 0, 1, 3, 0]), //Hours
    t("Task_Linear_Layout", a_set_input_indexed, "45", null, [0, 0, 0, 1, 4, 0]), //Mins
    t("Task_Linear_Layout", a_set_input_indexed, "Spray", null, [1, 0, 0, 1]), //Subtask
    t("Task_Linear_Layout", a_set_input_indexed, "Wipe", null, [2, 0, 0, 1]),//Subtask
    t("Task_Add_Area", a_click),
    t("Task_Linear_Layout", a_set_input_indexed, "Counters", null, [3, 0, 0, 1, 2, 0]), //Task
    t("Task_Linear_Layout", a_set_input_indexed, "2", null, [3, 0, 0, 1, 3, 0]), //Hours
    t("Task_Linear_Layout", a_set_input_indexed, "15", null, [3, 0, 0, 1, 4, 0]), //Mins
    t("Task_Linear_Layout", a_set_input_indexed, "Clean", null, [4, 0, 0, 1]),//Subtask
    t("Accept_Add_Task", a_click),
    //Validate New
    t("TasksList", a_click_list, 0),
    t("Task_Name", a_valid_input, "Food Court"),
    t("Task_Shift_Spinner", a_valid_input, "Six Flags Magic Mountain1 1:05 pm to 5:35 pm"),
    t("Task_Linear_Layout", a_valid_input_indexed, "Tables", null, [0, 0, 0, 1, 2, 0]), //Task
    t("Task_Linear_Layout", a_valid_input_indexed, "1", null, [0, 0, 0, 1, 3, 0]), //Hours
    t("Task_Linear_Layout", a_valid_input_indexed, "45", null, [0, 0, 0, 1, 4, 0]), //Mins
    t("Task_Linear_Layout", a_valid_input_indexed, "Spray", null, [1, 0, 0, 1]), //Subtask
    t("Task_Linear_Layout", a_valid_input_indexed, "Wipe", null, [2, 0, 0, 1]),//Subtask
    t("Task_Linear_Layout", a_valid_input_indexed, "Counters", null, [3, 0, 0, 1, 2, 0]), //Task
    t("Task_Linear_Layout", a_valid_input_indexed, "2", null, [3, 0, 0, 1, 3, 0]), //Hours
    t("Task_Linear_Layout", a_valid_input_indexed, "15", null, [3, 0, 0, 1, 4, 0]), //Mins
    t("Task_Linear_Layout", a_valid_input_indexed, "Clean", null, [4, 0, 0, 1]),//Subtask
    //Apply Edits
    t("Task_Linear_Layout", a_set_input_indexed, "Tables1", null, [0, 0, 0, 1, 2, 0]), //Task
    t("Task_Linear_Layout", a_set_input_indexed, "2", null, [0, 0, 0, 1, 3, 0]), //Hours
    t("Task_Linear_Layout", a_set_input_indexed, "46", null, [0, 0, 0, 1, 4, 0]), //Mins
    t("Task_Linear_Layout", a_set_input_indexed, "Spray1", null, [1, 0, 0, 1]), //Subtask
    t("Task_Linear_Layout", a_set_input_indexed, "Wipe1", null, [2, 0, 0, 1]),//Subtask
    t("Task_Linear_Layout", a_set_input_indexed, "Counters1", null, [3, 0, 0, 1, 2, 0]), //Task
    t("Task_Linear_Layout", a_set_input_indexed, "3", null, [3, 0, 0, 1, 3, 0]), //Hours
    t("Task_Linear_Layout", a_set_input_indexed, "16", null, [3, 0, 0, 1, 4, 0]), //Mins
    t("Task_Linear_Layout", a_set_input_indexed, "Clean1", null, [4, 0, 0, 1]),//Subtask
    t("Accept_Add_Task", a_click),
    //Validate Edits
    t("TasksList", a_click_list, 0),
    t("Task_Linear_Layout", a_valid_input_indexed, "Tables1", null, [0, 0, 0, 1, 2, 0]), //Task
    t("Task_Linear_Layout", a_valid_input_indexed, "2", null, [0, 0, 0, 1, 3, 0]), //Hours
    t("Task_Linear_Layout", a_valid_input_indexed, "46", null, [0, 0, 0, 1, 4, 0]), //Mins
    t("Task_Linear_Layout", a_valid_input_indexed, "Spray1", null, [1, 0, 0, 1]), //Subtask
    t("Task_Linear_Layout", a_valid_input_indexed, "Wipe1", null, [2, 0, 0, 1]),//Subtask
    t("Task_Linear_Layout", a_valid_input_indexed, "Counters1", null, [3, 0, 0, 1, 2, 0]), //Task
    t("Task_Linear_Layout", a_valid_input_indexed, "3", null, [3, 0, 0, 1, 3, 0]), //Hours
    t("Task_Linear_Layout", a_valid_input_indexed, "16", null, [3, 0, 0, 1, 4, 0]), //Mins
    t("Task_Linear_Layout", a_valid_input_indexed, "Clean1", null, [4, 0, 0, 1]),//Subtask
    t("activity_back_arrow", a_click),
    //Tasks Template
    t("TemplatesButton", a_click),
    t("AddTemplateButton", a_click),
    t("Task_Name", a_set_input, "Viper Queue Line"),
    t("ID_SUBTASK_PLUS_BUTTON", a_click),
    t("Task_Linear_Layout", a_set_input_indexed, "Hand Rails", null, [0, 0, 0, 1, 2, 0]), //Task
    t("Task_Linear_Layout", a_set_input_indexed, "1", null, [0, 0, 0, 1, 3, 0]), //Hours
    t("Task_Linear_Layout", a_set_input_indexed, "01", null, [0, 0, 0, 1, 4, 0]), //Mins
    t("Task_Linear_Layout", a_set_input_indexed, "Spray", null, [1, 0, 0, 1]), //Subtask
    t("Task_Linear_Layout", a_set_input_indexed, "Wipe", null, [2, 0, 0, 1]),//Subtask
    t("Task_Add_Area", a_click),
    t("Task_Linear_Layout", a_set_input_indexed, "Turnstiles", null, [3, 0, 0, 1, 2, 0]), //Task
    t("Task_Linear_Layout", a_set_input_indexed, "2", null, [3, 0, 0, 1, 3, 0]), //Hours
    t("Task_Linear_Layout", a_set_input_indexed, "02", null, [3, 0, 0, 1, 4, 0]), //Mins
    t("Task_Linear_Layout", a_set_input_indexed, "Clean", null, [4, 0, 0, 1]),//Subtask
    t("Accept_Add_Task", a_click),
    t("activity_back_arrow", a_click),
    t("TasksList", a_click_list, 0),
    t("Import_Template", a_click),
    t("TemplateList", a_click_list, 0),
    t("Task_Linear_Layout", a_valid_input_indexed, "Hand Rails", null, [0, 0, 0, 1, 2, 0]), //Task
    t("Task_Linear_Layout", a_valid_input_indexed, "1", null, [0, 0, 0, 1, 3, 0]), //Hours
    t("Task_Linear_Layout", a_valid_input_indexed, "01", null, [0, 0, 0, 1, 4, 0]), //Mins
    t("Task_Linear_Layout", a_valid_input_indexed, "Spray", null, [1, 0, 0, 1]), //Subtask
    t("Task_Linear_Layout", a_valid_input_indexed, "Wipe", null, [2, 0, 0, 1]),//Subtask
    t("Task_Linear_Layout", a_valid_input_indexed, "Turnstiles", null, [3, 0, 0, 1, 2, 0]), //Task
    t("Task_Linear_Layout", a_valid_input_indexed, "2", null, [3, 0, 0, 1, 3, 0]), //Hours
    t("Task_Linear_Layout", a_valid_input_indexed, "02", null, [3, 0, 0, 1, 4, 0]), //Mins
    t("Task_Linear_Layout", a_valid_input_indexed, "Clean", null, [4, 0, 0, 1]),//Subtask
    t("activity_back_arrow", a_click),
    t("activity_back_arrow", a_click),
    t("activity_back_arrow", a_click),

    //Supplies
    t("SupplyItemsButton", a_click),
    t("List", a_click_list, 1),
    t("AddSupplyItemButton", a_click),
    t("SupplyItem_Name", a_set_input, "Comet Cleaner"),
    t("SupplyItem_Brand", a_set_input, "Comet"),
    t("SupplyItem_Sku", a_set_input, "123456-7"),
    t("SupplyItem_Price", a_set_input, "3.25"),
    t("SupplyItem_Quantity", a_set_input, "3"),
    t("SupplyItem_SuppliedBy", a_set_input, "Supplier"),
    t("SupplyItem_Notes", a_set_input, "Buy in bulk"),
    t("Accept_SupplyItem", a_click),
    //Validate new Supplies
    t("SupplyItemList", a_click_list, 0),
    t("SupplyItem_Name", a_valid_input, "Comet Cleaner"),
    t("SupplyItem_Brand", a_valid_input, "Comet"),
    t("SupplyItem_Sku", a_valid_input, "123456-7"),
    t("SupplyItem_Price", a_valid_input, "3.25"),
    t("SupplyItem_Quantity", a_valid_input, "3"),
    t("SupplyItem_SuppliedBy", a_valid_input, "Supplier"),
    t("SupplyItem_Location_Spinner", a_valid_input, "Six Flags Magic Mountain1"),
    t("SupplyItem_Notes", a_valid_input, "Buy in bulk"),
    //Apply edits
    t("SupplyItem_Name", a_set_input, "Comet Cleaner1"),
    t("SupplyItem_Brand", a_set_input, "Comet1"),
    t("SupplyItem_Sku", a_set_input, "123456-71"),
    t("SupplyItem_Price", a_set_input, "3.251"),
    t("SupplyItem_Quantity", a_set_input, "31"),
    t("SupplyItem_SuppliedBy", a_set_input, "Supplier1"),
    t("SupplyItem_Notes", a_set_input, "Buy in bulk1"),
    t("Accept_SupplyItem", a_click),
    // Validate edited Supplies
    t("SupplyItemList", a_click_list, 0),
    t("SupplyItem_Name", a_valid_input, "Comet Cleaner1"),
    t("SupplyItem_Brand", a_valid_input, "Comet1"),
    t("SupplyItem_Sku", a_valid_input, "123456-71"),
    t("SupplyItem_Price", a_valid_input, "3.25"),
    t("SupplyItem_Quantity", a_valid_input, "31"),
    t("SupplyItem_SuppliedBy", a_valid_input, "Supplier1"),
    t("SupplyItem_Location_Spinner", a_valid_input, "Six Flags Magic Mountain1"),
    t("SupplyItem_Notes", a_valid_input, "Buy in bulk1"),
    t("activity_back_arrow", a_click),
    //Test request/fulfill supplies
    t("RequestSuppliesButton", a_click),
    t("Request_Supplies_Amount", a_set_input, "3"),
    t("Accept_Request_Supplies", a_click),
    t("FulfillSuppliesButton", a_click),
    t("SupplyItemList", a_click_list, 0),
    t("SupplyItem_Quantity", a_valid_input, "34"),
    t("activity_back_arrow", a_click),
    //Supplies Templates
    t("TemplatesButton", a_click),
    t("AddTemplateButton", a_click),
    t("SupplyItem_Name", a_set_input, "Window Cleaner"),
    t("SupplyItem_Brand", a_set_input, "Windex"),
    t("SupplyItem_Sku", a_set_input, "987654-321"),
    t("SupplyItem_Price", a_set_input, "5.55"),
    t("SupplyItem_Quantity", a_set_input, "1"),
    t("SupplyItem_SuppliedBy", a_set_input, "Another Supplier"),
    t("SupplyItem_Notes", a_set_input, "Buy on sale"),
    t("Accept_SupplyItem", a_click),
    t("activity_back_arrow", a_click),
    t("SupplyItemList", a_click_list, 0),
    t("Import_Template", a_click),
    t("TemplateList", a_click_list, 0),
    t("dialogbox_button", a_click),
    t("SupplyItem_Name", a_valid_input, "Window Cleaner"),
    t("SupplyItem_Brand", a_valid_input, "Windex"),
    t("SupplyItem_Sku", a_valid_input, "987654-321"),
    t("SupplyItem_Price", a_valid_input, "5.55"),
    t("SupplyItem_Quantity", a_valid_input, "1"),
    t("SupplyItem_SuppliedBy", a_valid_input, "Another Supplier"),
    t("SupplyItem_Location_Spinner", a_valid_input, "Six Flags Magic Mountain1"),
    t("SupplyItem_Notes", a_valid_input, "Buy on sale"),
    t("activity_back_arrow", a_click),
    t("activity_back_arrow", a_click),
    t("activity_back_arrow", a_click),

    //Inspections
    t("InspectionPlansButton", a_click),
    t("AddInspectionPlanButton", a_click),
    t("InspectionPlan_Name", a_set_input, "Nature Park"),
    t("ID_POINT_PLUS", a_click),
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Benches", null, [0, 0]), //Area
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Spray", null, [1, 1]), //Point
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Wipe", null, [2, 1]), //Point
    t("Inspection_Plan_Add_Area", a_click),
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Paths", null, [3, 0]), //Area
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Sweep", null, [4, 1]), //Point
    t("Accept_InspectionPlan", a_click),
    //Validate new
    t("InspectionPlansList", a_click_list, 0),
    t("InspectionPlan_Name", a_valid_input, "Nature Park"),
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Benches", null, [0, 0]), //Area
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Spray", null, [1, 1]), //Point
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Wipe", null, [2, 1]), //Point
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Paths", null, [3, 0]), //Area
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Sweep", null, [4, 1]), //Point
    //Apply edits
    t("InspectionPlan_Name", a_set_input, "Nature Park1"),
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Benches1", null, [0, 0]), //Area
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Spray1", null, [1, 1]), //Point
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Wipe1", null, [2, 1]), //Point
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Paths1", null, [3, 0]), //Area
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Sweep1", null, [4, 1]), //Point
    t("Accept_InspectionPlan", a_click),
    //Validate edits
    t("InspectionPlansList", a_click_list, 0),
    t("InspectionPlan_Name", a_valid_input, "Nature Park1"),
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Benches1", null, [0, 0]), //Area
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Spray1", null, [1, 1]), //Point
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Wipe1", null, [2, 1]), //Point
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Paths1", null, [3, 0]), //Area
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Sweep1", null, [4, 1]), //Point
    t("activity_back_arrow", a_click),
    //New Inspection Template
    t("TemplatesButton", a_click),
    t("AddTemplateButton", a_click),
    t("InspectionPlan_Name", a_set_input, "Gift Shop"),
    t("ID_POINT_PLUS", a_click),
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Counters", null, [0, 0]), //Area
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Spray", null, [1, 1]), //Point
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Wipe", null, [2, 1]), //Point
    t("Inspection_Plan_Add_Area", a_click),
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Shelves", null, [3, 0]), //Area
    t("Inspection_Plan_Linear_Layout", a_set_input_indexed, "Sweep", null, [4, 1]), //Point
    t("Accept_InspectionPlan", a_click),
    //Validate Template
    t("TemplateList", a_click_list, 0),
    t("InspectionPlan_Name", a_valid_input, "Gift Shop"),
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Counters", null, [0, 0]), //Area
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Spray", null, [1, 1]), //Point
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Wipe", null, [2, 1]), //Point
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Shelves", null, [3, 0]), //Area
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Sweep", null, [4, 1]), //Point
    t("activity_back_arrow", a_click),
    t("activity_back_arrow", a_click),
    //Validate template from import
    t("InspectionPlansList", a_click_list, 0),
    t("Import_Template", a_click, null, null, null),
    t("TemplateList", a_click_list, 0, null, null),
    t("InspectionPlan_Name", a_valid_input, "Gift Shop"),
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Counters", null, [0, 0]), //Area
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Spray", null, [1, 1]), //Point
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Wipe", null, [2, 1]), //Point
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Shelves", null, [3, 0]), //Area
    t("Inspection_Plan_Linear_Layout", a_valid_input_indexed, "Sweep", null, [4, 1]), //Point
    t("activity_back_arrow", a_click),
    t("activity_back_arrow", a_click),

    //Time Punches
    //New
    t("TimePunchesButton", a_click, null, null, null),
    t("TimePunchTypeList", a_click_list, 0, null, null),
    t("AddTimePunchButton", a_click, null, null, null),
    t("Edit_TimePunch_HoursSpinner", a_set_input, "11", null, null),
    t("Edit_TimePunch_MinutesSpinner", a_set_input, "00", null, null),
    t("Edit_TimePunch_AMPMSpinner", a_set_input, "PM", null, null),
    t("Edit_TimePunch_ClockOut_Radio", a_click, null, null, null),
    t("Accept_Edit_TimePunch", a_click, null, null, null),
    //Validate New
    t("TimePunchList", a_click_list, 0, null, null),
    t("Edit_TimePunch_HoursSpinner", a_valid_input, "11", null, null),
    t("Edit_TimePunch_MinutesSpinner", a_valid_input, "00", null, null),
    t("Edit_TimePunch_AMPMSpinner", a_valid_input, "PM", null, null),
    t("Edit_TimePunch_ClockOut_Radio", a_valid_check, true, null, null),
    //Apply edits
    t("Edit_TimePunch_HoursSpinner", a_set_input, "12", null, null),
    t("Edit_TimePunch_MinutesSpinner", a_set_input, "05", null, null),
    t("Edit_TimePunch_AMPMSpinner", a_set_input, "AM", null, null),
    t("Edit_TimePunch_ClockIn_Radio", a_click, null, null, null),
    t("Accept_Edit_TimePunch", a_click, null, null, null),
    //Validate edits
    t("TimePunchList", a_click_list, 0, null, null),
    t("Edit_TimePunch_HoursSpinner", a_valid_input, "12", null, null),
    t("Edit_TimePunch_MinutesSpinner", a_valid_input, "05", null, null),
    t("Edit_TimePunch_AMPMSpinner", a_valid_input, "AM", null, null),
    t("Edit_TimePunch_ClockIn_Radio", a_valid_check, true, null, null),
    t("activity_back_arrow", a_click),
    t("activity_back_arrow", a_click),
    t("activity_back_arrow", a_click),

    //Delete location and check that all dependents get deleted
    t("LocationsButton", a_click, null, null, null),
    t("LocationsList", a_click_list, 1, null, null),
    t("Delete_Edit_Location", a_click, null, null, null),
    t("YesConfirm", a_click, null, null, null),
    t("activity_back_arrow", a_click, null, null, null),

    t(MainActivity.DB_PATH_ASSET_TASKS, a_waitForFirebase, 1, null, null), //Template left over
    t(MainActivity.DB_PATH_ASSET_LOCATIONS, a_waitForFirebase, 1, null, null), //Original "Home" Location
    t(MainActivity.DB_PATH_ASSET_SHIFTS, a_waitForFirebase, 0, null, null),
    t(MainActivity.DB_PATH_ASSET_SUPPLY_ITEMS, a_waitForFirebase, 1, null, null), //Template left over
    t(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS, a_waitForFirebase, 1, null, null), //Template left over
    t(MainActivity.DB_PATH_ASSET_TIME_PUNCHES, a_waitForFirebase, 0, null, null),
    t(MainActivity.DB_PATH_ASSET_MESSAGES, a_waitForFirebase, 1, null, null),

    //Create and delete individual assets
    t("ShiftsButton", a_click, null, null, null),
    t("AddShiftButton", a_click, null, null, null),
    t("Accept_Edit_ShiftTime", a_click, null, null, null),
    t("ShiftList", a_click_list, 0, null, null),
    t("Delete_Edit_ShiftTime", a_click, null, null, null),
    t("YesConfirm", a_click, null, null, null),
    t(MainActivity.DB_PATH_ASSET_SHIFTS, a_waitForFirebase, 0, null, null),
    t("AddShiftButton", a_click, null, null, null),
    t("Accept_Edit_ShiftTime", a_click, null, null, null), //Create another shift so we can create other assets
    t("activity_back_arrow", a_click, null, null, null),
    t("TasksButton", a_click, null, null, null),
    t("AddTaskButton_ByType", a_click, null, null, null),
    t("Accept_Add_Task", a_click, null, null, null),
    t("TaskTypeList", a_click_list, 0, null, null),
    t("TasksList", a_click_list, 0, null, null),
    t("Delete_Edit_Task", a_click, null, null, null),
    t("YesConfirm", a_click, null, null, null),
    t(MainActivity.DB_PATH_ASSET_TASKS, a_waitForFirebase, 1, null, null),
    t("activity_back_arrow", a_click, null, null, null),
    t("activity_back_arrow", a_click, null, null, null),
    t("SupplyItemsButton", a_click, null, null, null),
    t("AddSupplyItemButton", a_click, null, null, null),
    t("Accept_SupplyItem", a_click, null, null, null),
    t("SupplyItemList", a_click_list, 0, null, null),
    t("Delete_SupplyItem", a_click, null, null, null),
    t("YesConfirm", a_click, null, null, null),
    t(MainActivity.DB_PATH_ASSET_SUPPLY_ITEMS, a_waitForFirebase, 1, null, null),
    t("activity_back_arrow", a_click, null, null, null),
    t("activity_back_arrow", a_click, null, null, null),
    t("InspectionPlansButton", a_click, null, null, null),
    t("AddInspectionPlanButton", a_click, null, null, null),
    t("Accept_InspectionPlan", a_click, null, null, null),
    t("InspectionPlansList", a_click_list, 0, null, null),
    t("Delete_Inspection_Plan", a_click, null, null, null),
    t("YesConfirm", a_click, null, null, null),
    t(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS, a_waitForFirebase, 1, null, null),
    t("activity_back_arrow", a_click, null, null, null),
    t("TimePunchesButton", a_click, null, null, null),
    t("TimePunchTypeList", a_click_list, 0, null, null),
    t("AddTimePunchButton", a_click, null, null, null),
    t("Accept_Edit_TimePunch", a_click, null, null, null),
    t("TimePunchList", a_click_list, 0, null, null),
    t("Delete_Edit_TimePunch", a_click, null, null, null),
    t("YesConfirm", a_click, null, null, null),
    t(MainActivity.DB_PATH_ASSET_TIME_PUNCHES, a_waitForFirebase, 0, null, null),
    t("activity_back_arrow", a_click, null, null, null),
    t("activity_back_arrow", a_click, null, null, null),
    t("ShiftsButton", a_click, null, null, null),
    t("ShiftList", a_click_list, 0, null, null),
    t("Delete_Edit_ShiftTime", a_click, null, null, null),
    t("YesConfirm", a_click, null, null, null),
    t("activity_back_arrow", a_click, null, null, null),

    t("LocationsButton", a_click, null, null, null),
    t("AddLocationButton", a_click, null, null, null),
    t("Accept_Edit_Location", a_click, null, null, null),
    t("activity_back_arrow", a_click, null, null, null),

    t("MessagesButton", a_click, null, null, null),
    t("MessagesList", a_click_list, 0, null, null),
    t("message_input", a_set_input, "Message goes here", null, null),
    t("message_send_button", a_click, null, null, null),
    t(MainActivity.DB_PATH_ASSET_MESSAGES, a_waitForFirebase, 3, null, null),
    t("activity_back_arrow", a_click, null, null, null),
    t("activity_back_arrow", a_click, null, null, null),
    t("LocationsButton", a_click, null, null, null),
    t("LocationsList", a_click_list, 0, null, null),
    t("Delete_Edit_Location", a_click, null, null, null),
    t("YesConfirm", a_click, null, null, null),
    t(MainActivity.DB_PATH_ASSET_MESSAGES, a_waitForFirebase, 1, null, null),
    t(MainActivity.DB_PATH_ASSET_LOCATIONS, a_waitForFirebase, 1, null, null),
    t("activity_back_arrow", a_click, null, null, null),

    //Test Tasks Disabled
    t("OwnerToolsButton", a_click, null, null, null),
    t("Owner_Tools_Tasks_Enabled", a_click, null, 1000, null),
    t("dialogbox_button", a_click, null, null, null),
    t("activity_back_arrow", a_click, null, null, null),
    t("sidebar_logout_button", a_click, null, 1000, null),
    t("Login_Email", a_set_input, "alexjob44@gmail.com"),
    t("Login_Password", a_set_input, "abcdef", null, null),
    t("SignInButton", a_click, null, null, null),
    t(null, a_message, "Check that tasks button is disabled", 4000, null),
    t("OwnerToolsButton", a_click, null, null, null),
    t("Owner_Tools_Tasks_Enabled", a_click, null, null, null),
]];

var error_found = false;
function errorlog(log) {
    error_found = true;
    // console.log("%c" + log, "color: red");
    console.error(log);
}

if (testing_enabled)
    login_loop();
document.getElementById("TEST_WARNING").style.display = "block";

function login_loop() {
    var email_ele = document.getElementById("Login_Email");
    if (!MainActivity.loggedIn && email_ele != null && !email_ele.disabled) {
        email_ele.value = "alexjob44@gmail.com";
        document.getElementById("Login_Password").value = "abcdef";
        document.getElementById("SignInButton").click();
    }

    if (MainActivity.loggedIn) {
        setTimeout(testing, 1000);
    }
    else {
        setTimeout(login_loop, 100);
    }
}


function testing() {
    if (i_test_asset < test_parts.length && i_test_num < test_parts[i_test_asset].length) {
        var t = test_parts[i_test_asset][i_test_num];
        switch (t.action) {
            case a_click:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for click|" + t.ele);
                else
                    ele.click();
                break;
            case a_click_list:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for click|" + t.ele);
                else {
                    if (t.text >= ele.children.length)
                        errorlog("Element has " + ele.children.length + " children|" + t.ele + "| Requested index " + t.text);
                    else
                        for (var i = 0; i < ele.children[t.text].children.length; ++i) {
                            var ele0 = ele.children[t.text].children[i];
                            if (ele0.tagName == "BUTTON") {
                                ele0.click();
                                break;
                            }
                        }
                }
                break;
            case a_valid_input:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for valid|" + t.ele);
                else
                    if (ele.value != t.text)
                        errorlog("Failed to validate text|" + t.ele + "|" + t.text);
                break;
            case a_valid_label:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for valid|" + t.ele);
                else
                    if (ele.innerHTML != t.text)
                        errorlog("Failed to validate label|" + t.ele + "|" + t.text);
                break;
            case a_valid_check:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for valid|" + t.ele);
                else
                    if (ele.checked != t.text)
                        errorlog("Failed to validate checkbox|" + t.ele + "|" + t.text);
                break;
            case a_valid_list_size:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for valid list size|" + t.ele);
                else
                    if (ele.children.length != t.text)
                        errorlog("Failed to validate list size|" + t.ele + "|" + t.text);
                break;
            case a_set_input:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for set|" + t.ele);
                else
                    ele.value = t.text;
                break;
            case a_set_input_indexed:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for set indexed|" + t.ele);
                else {
                    for (var i = 0; i < t.indexes.length; ++i) {
                        var index = t.indexes[i];
                        if (index >= ele.children.length) {
                            errorlog("Element" + i + " has " + ele.children.length + " children|" + t.ele + "| Requested index " + index);
                            break;
                        }
                        else {
                            ele = ele.children[index];
                            if (i == t.indexes.length - 1)
                                ele.value = t.text;
                        }

                    }
                }
                break;
            case a_valid_input_indexed:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for set indexed|" + t.ele);
                else {
                    for (var i = 0; i < t.indexes.length; ++i) {
                        var index = t.indexes[i];
                        if (index >= ele.children.length) {
                            errorlog("Element" + i + " has " + ele.children.length + " children|" + t.ele + "| Requested index " + index);
                            break;
                        }
                        else {
                            ele = ele.children[index];
                            if (i == t.indexes.length - 1)
                                if (ele.value != t.text)
                                    errorlog("Failed to validate text|" + t.ele + "|" + t.text);
                        }

                    }
                }
                break;
            case a_set_check:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for set|" + t.ele);
                else
                    ele.checked = t.text;
                break;
            case a_waitForFirebase:
                var reff = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES + "/" + MainActivity.currentUser.getCompanyid() + "/" + t.ele);
                reff.get().then((dataSnapshot) => {
                    var val = dataSnapshot.val();
                    var size = 0;
                    if (val != null)
                        size = W4_Funcs.objSize(val);
                    if (size != t.text)
                        errorlog("Failed to validate firebase data|" + t.ele + "|Expected size: " + t.text + "|Actual size " + size + "|");
                    else
                        testing();
                }).catch((error) => {
                    errorlog(error);
                });
                break;
            case a_message:
                MainActivity.dialogBox(HomeActivity.homeActivity, "", t.text);
                break;
        }
        ++i_test_num;
        if (i_test_num >= test_parts[i_test_asset].length) {
            i_test_num = 0;
            ++i_test_asset;
        }
        if (t.wait == null)
            t.wait = 200;
        if (error_found || t.action == a_stop)
            document.getElementById("TEST_CONTINUE_BUTTON").style.display = "block";
        else if (t.action == a_waitForFirebase) {
        }
        else
            setTimeout(testing, t.wait);
    }
    else
        console.log("Testing complete");
}

function test_continue() {
    document.getElementById("TEST_CONTINUE_BUTTON").style.display = "none";
    error_found = false;
    testing();
}