//TODO IMPORTANT UPDATE THIS
var version = "1.1";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const estimate = urlParams.get('estimate');

var _savedColor = "";
setBarColor("skyblue");

if (estimate != null) {
    document.getElementById("doc_text_number").innerHTML = "Estimate #";
    document.getElementById("doc_text_date").innerHTML = "Estimate Date";
    document.getElementById("doc_text_bar").innerHTML = "Estimate";
}

document.getElementById("invoice_date").value = getMMDDYYYYText(new Date(), "/");

function addLogoClick() {
    document.getElementById("logo_input").click();
}

function addSignatureClick() {
    document.getElementById("signature_input").click();
}

const fileInput = document.getElementById('logo_input');
const imageElement = document.getElementById('logo_img');

const signatureInput = document.getElementById('signature_input');
const imageSignature = document.getElementById('signature_img');

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    logo_upload(file);
    fileInput.value = "";
});

signatureInput.addEventListener('change', () => {
    const file = signatureInput.files[0];
    signature_upload(file);
    signatureInput.value = "";
});

function logo_upload(file) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
        imageElement.src = reader.result;
    });

    reader.readAsDataURL(file);

    document.getElementById("drop-zone").style.height = "20px";
    document.getElementById("add_image_text").style.marginTop = "0px";
}

function signature_upload(file) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
        imageSignature.src = reader.result;
        imageSignature.style.display = "";
    });

    reader.readAsDataURL(file);

    document.getElementById("drop-zone2").style.height = "20px";
    document.getElementById("add_signature_text").style.marginTop = "0px";
    document.getElementById("drop-zone2").style.top = "0px";
}

const dropZone = document.getElementById('drop-zone');
const dropZone2 = document.getElementById('drop-zone2');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false)
    dropZone2.addEventListener(eventName, preventDefaults, false)
    document.body.addEventListener(eventName, preventDefaults, false)
});

// Highlight drop zone when file is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false)
    dropZone2.addEventListener(eventName, highlight, false)
});

// Remove highlight when file is dragged out of the drop zone
['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false)
    dropZone2.addEventListener(eventName, unhighlight, false)
});

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);
dropZone2.addEventListener('drop', handleDrop2, false);

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}

function highlight() {
    dropZone.classList.add('highlight');
}

function unhighlight() {
    dropZone.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    logo_upload(files[0]);
}

function handleDrop2(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    signature_upload(files[0]);
}

function getMMDDYYYYText(dateTime, separator) {
    if (separator == null)
        separator = " / ";
    var dd = dateTime.getDate();
    var mm = dateTime.getMonth() + 1; //January is 0!
    var yyyy = dateTime.getFullYear();
    if (dd < 10)
        dd = '0' + dd;
    if (mm < 10)
        mm = '0' + mm;
    return mm + separator + dd + separator + yyyy;
}

function addItem() {
    var item = new Object();
    item.desc = "";
    item.amount = "0.00";
    item.taxes = [];
    _items.set(getNewKey("items"), item);
    populateItems();
}

function removeItem(key) {
    _items.delete(key);
    populateItems();
}

function saveItems() {
    for (let [key, item] of _items) {
        item.desc = document.getElementById("name_" + key).value;
        item.amount = document.getElementById("amount_" + key).value;
    }
}

var _items = new Map();
var _taxes = new Map();
function populateItems() {
    var table = document.createElement("table");
    table.insertRow(0);
    table.rows[0].classList.add("color_bar");
    table.rows[0].innerHTML = "<td>Description</td><td>Amount</td><td>Tax</td><td></td>";
    for (let [key, item] of _items) {
        var row = table.insertRow();
        row.insertCell();
        row.insertCell();
        var input = document.createElement("textarea");
        // input.type = 'text';
        input.value = item.desc;
        input.style.width = "300px";
        input.style.height = "30px";
        input.style.marginBottom = "-15px";
        input.style.paddingTop = "10px";
        input.id = "name_" + key;
        input.onkeyup = saveItems;
        row.cells[0].appendChild(input);

        var input = document.createElement("input");
        input.id = "amount_" + key;
        input.type = 'number';
        input.value = get_USD_String(item.amount);
        input.onblur = function () {
            input.value = get_USD_String(input.value);
        };
        input.onkeyup = recalculateTotal;
        row.cells[1].appendChild(input);
        var i0 = 0;
        var html = "";
        for (let tax of item.taxes) {
            if (_taxes.has(tax)) {
                var tax0 = _taxes.get(tax);
                if (i0 != 0)
                    html += "<br>";
                var compound = "";
                if (tax0.compound)
                    compound = " (C)";
                html += tax0.name + " " + tax0.rate + "%" + compound;
                ++i0;
            }
        }
        row.insertCell();
        row.insertCell();
        if (html == "")
            html = "<button class='no-print' style='padding: 10px;' onclick='taxEdit(\"" + key + "\");'>Add Tax +</button>"
        else {
            html = "<button style='padding: 10px;' onclick='taxEdit(\"" + key + "\");'>" + html + "</button>";
            html += "&nbsp;&nbsp;&nbsp;<button class='no-print' title='Remove Tax' style='width: 30px; height: 30px;' onclick='removeTax(\"" + key + "\");'>X</button>";
        }
        row.cells[2].innerHTML = html;
        row.cells[3].innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class='no-print' title='Remove Item' style='width: 50px; height: 50px;' onclick='removeItem(\"" + key + "\");'>X</button>";
    }
    document.getElementById("items_div").innerHTML = "";
    document.getElementById("items_div").appendChild(table);
    recalculateTotal();
    setBarColor(_savedColor);
}

function get_USD_String(num) {
    if (isNaN(num))
        num = 0;
    num = String(Math.round(num * 100));
    if (num.length > 2)
        return num.substring(0, num.length - 2) + "." + num.substring(num.length - 2, num.length);
    else if (num.length == 2)
        return "0." + num;
    else if (num.length == 1)
        return "0.0" + num;
    return "0.00";
}

var _selected_tax_item = null;
function taxEdit(key) {
    _selected_tax_item = key;
    document.getElementById("dialogbox_black_overlay").style.display = "";
    document.getElementById("taxbox").style.display = "";
    populateTaxes();
}

function saveTax() {
    var item = _items.get(_selected_tax_item);
    item.taxes = [];
    for (let [key, tax] of _taxes) {
        if (document.getElementById("tax_applied_" + key).checked)
            item.taxes.push(key);
        tax.name = document.getElementById("tax_name_" + key).value;
        tax.rate = document.getElementById("tax_rate_" + key).value;
        tax.compound = document.getElementById("tax_compound_" + key).checked;
    }

    document.getElementById("dialogbox_black_overlay").style.display = "none";
    document.getElementById("taxbox").style.display = "none";
    populateItems();
}

function recalculateTotal() {
    saveItems();
    var taxHtml = "";
    var taxAmountsHtml = "";
    var totalTax = 0;
    var subtotal = 0;
    for (let [key, item] of _items) {
        var amount = Number(document.getElementById("amount_" + key).value);
        if (isNaN(amount))
            amount = 0;
        subtotal += amount;
        var thisTaxAmount = 0;
        for (let taxref of item.taxes) { //Standard
            var tax = _taxes.get(taxref);
            if (!tax.compound) {
                taxHtml += tax.name + " " + get_USD_String(tax.rate) + "%<br>";
                tax.rate = Number(tax.rate);
                if (isNaN(tax.rate))
                    tax.rate = 0;
                var taxamount = amount * tax.rate * 0.01;
                totalTax += taxamount;
                thisTaxAmount += taxamount;
                taxAmountsHtml += "$" + get_USD_String(taxamount) + "<br>";
            }
        }
        for (let taxref of item.taxes) { //Compound
            var tax = _taxes.get(taxref);
            if (tax.compound) {
                taxHtml += tax.name + " (C) " + get_USD_String(tax.rate) + "%<br>";
                tax.rate = Number(tax.rate);
                if (isNaN(tax.rate))
                    tax.rate = 0;
                var taxamount = (amount + thisTaxAmount) * tax.rate * 0.01;
                totalTax += taxamount;
                taxAmountsHtml += "$" + get_USD_String(taxamount) + "<br>";
            }
        }
    }
    document.getElementById("taxes_cell").innerHTML = taxHtml;
    document.getElementById("tax_amounts_cell").innerHTML = taxAmountsHtml;
    document.getElementById("cell_subtotal").innerHTML = "$" + get_USD_String(subtotal);
    document.getElementById("cell_total").innerHTML = "$" + get_USD_String(subtotal + totalTax);
}

function addNewTax() {
    var tax = new Object();
    tax.name = document.getElementById("tax_name").value;
    tax.rate = document.getElementById("tax_rate").value;
    tax.compound = document.getElementById("tax_compound").checked;
    var key = getNewKey("taxes");
    _taxes.set(key, tax);

    _items.get(_selected_tax_item).taxes.push(key);

    document.getElementById("tax_name").value = "";
    document.getElementById("tax_rate").value = "10.0";
    document.getElementById("tax_compound").checked = false;

    populateTaxes();
    document.getElementById("new_tax_div").style.display = "none";
    document.getElementById("show_tax_div_button").style.display = "";
}

function removeTax(key) {
    _items.get(key).taxes = [];
    populateItems();
}

function deleteTax(key) {
    _taxes.delete(key);
    for (let [key0, item] of _items)
        if (item.taxes.includes(key)) {
            item.taxes.splice(item.taxes.indexOf(key), 1);
        }
    populateTaxes();
    populateItems();
}

function populateTaxes() {
    var html = "<table>";
    var i = 0;
    for (let [key, val] of _taxes) {
        if (i == 0)
            html += "<tr><th>Applied</th><th>Name</th><th>Tax Rate %</th><th>Compound Tax</th></tr>";
        html += "<tr><td>"
            + "<input style='position: relative; top: 4px; height: 20px; width: 20px;' type='checkbox' id='tax_applied_" + key + "'" + (_items.get(_selected_tax_item).taxes.includes(key) ? "checked" : "") + ">"
            + "</td>"
            + "<td>"
            + '<input id="tax_name_' + key + '" type="text" value="' + val.name + '">'
            + "</td>"
            + "<td>"
            + '<input id="tax_rate_' + key + '" type="number" value="' + val.rate + '">'
            + "</td>"
            + "<td>"
            + '<input style="position: relative; top: 4px; height: 20px; width: 20px;" id="tax_compound_' + key + '" type="checkbox"' + (val.compound ? "checked" : "") + '>'
            + "</td>"
            + "<td>"
            + "<button class='no-print' style='width: 40px; height: 40px;' onclick='deleteTax(\"" + key + "\");'>X</button>"
            + "</td>"
            + "</tr>"
        ++i;
    }
    html += "</table>";

    document.getElementById("tax_selection").innerHTML = html;
}

function getNewKey(reff) {
    var ref = firebase.database().ref(reff).push();
    return ref.key;
}

addItem();

// var obj = new Object();
// obj.name = "Tax1";
// obj.rate = "10";
// obj.compound = false;
// _taxes.set("a", obj);
// var obj = new Object();
// obj.name = "Tax2";
// obj.rate = "20";
// obj.compound = false;
// _taxes.set("b", obj);

var _colorNames = [
    "aliceblue",
    "antiquewhite",
    "aqua",
    "aquamarine",
    "azure",
    "beige",
    "bisque",
    "black",
    "blanchedalmond",
    "blue",
    "blueviolet",
    "brown",
    "burlywood",
    "cadetblue",
    "chartreuse",
    "chocolate",
    "coral",
    "cornflowerblue",
    "cornsilk",
    "crimson",
    "cyan",
    "darkblue",
    "darkcyan",
    "darkgoldenrod",
    "darkgray",
    "darkgreen",
    "darkgrey",
    "darkkhaki",
    "darkmagenta",
    "darkolivegreen",
    "darkorange",
    "darkorchid",
    "darkred",
    "darksalmon",
    "darkseagreen",
    "darkslateblue",
    "darkslategray",
    "darkslategrey",
    "darkturquoise",
    "darkviolet",
    "deeppink",
    "deepskyblue",
    "dimgray",
    "dimgrey",
    "dodgerblue",
    "firebrick",
    "floralwhite",
    "forestgreen",
    "fuchsia",
    "gainsboro",
    "ghostwhite",
    "gold",
    "goldenrod",
    "gray",
    "green",
    "greenyellow",
    "grey",
    "honeydew",
    "hotpink",
    "indianred",
    "indigo",
    "ivory",
    "khaki",
    "lavender",
    "lavenderblush",
    "lawngreen",
    "lemonchiffon",
    "lightblue",
    "lightcoral",
    "lightcyan",
    "lightgoldenrodyellow",
    "lightgray",
    "lightgreen",
    "lightgrey",
    "lightpink",
    "lightsalmon",
    "lightseagreen",
    "lightskyblue",
    "lightslategray",
    "lightslategrey",
    "lightsteelblue",
    "lightyellow",
    "lime",
    "limegreen",
    "linen",
    "magenta",
    "maroon",
    "mediumaquamarine",
    "mediumblue",
    "mediumorchid",
    "mediumpurple",
    "mediumseagreen",
    "mediumslateblue",
    "mediumspringgreen",
    "mediumturquoise",
    "mediumvioletred",
    "midnightblue",
    "mintcream",
    "mistyrose",
    "moccasin",
    "navajowhite",
    "navy",
    "oldlace",
    "olive",
    "olivedrab",
    "orange",
    "orangered",
    "orchid",
    "palegoldenrod",
    "palegreen",
    "paleturquoise",
    "palevioletred",
    "papayawhip",
    "peachpuff",
    "peru",
    "pink",
    "plum",
    "powderblue",
    "purple",
    "red",
    "rosybrown",
    "royalblue",
    "saddlebrown",
    "salmon",
    "sandybrown",
    "seagreen",
    "seashell",
    "sienna",
    "silver",
    "skyblue",
    "slateblue",
    "slategray",
    "slategrey",
    "snow",
    "springgreen",
    "steelblue",
    "tan",
    "teal",
    "thistle",
    "tomato",
    "turquoise",
    "violet",
    "wheat",
    "white",
    "whitesmoke",
    "yellow",
    "yellowgreen"
];

var _colorHexes = [
    "#f0f8ff",
    "#faebd7",
    "#00ffff",
    "#7fffd4",
    "#f0ffff",
    "#f5f5dc",
    "#ffe4c4",
    "#000000",
    "#ffebcd",
    "#0000ff",
    "#8a2be2",
    "#a52a2a",
    "#deb887",
    "#5f9ea0",
    "#7fff00",
    "#d2691e",
    "#ff7f50",
    "#6495ed",
    "#fff8dc",
    "#dc143c",
    "#00ffff",
    "#00008b",
    "#008b8b",
    "#b8860b",
    "#a9a9a9",
    "#006400",
    "#a9a9a9",
    "#bdb76b",
    "#8b008b",
    "#556b2f",
    "#ff8c00",
    "#9932cc",
    "#8b0000",
    "#e9967a",
    "#8fbc8f",
    "#483d8b",
    "#2f4f4f",
    "#2f4f4f",
    "#00ced1",
    "#9400d3",
    "#ff1493",
    "#00bfff",
    "#696969",
    "#696969",
    "#1e90ff",
    "#b22222",
    "#fffaf0",
    "#228b22",
    "#ff00ff",
    "#dcdcdc",
    "#f8f8ff",
    "#ffd700",
    "#daa520",
    "#808080",
    "#008000",
    "#adff2f",
    "#808080",
    "#f0fff0",
    "#ff69b4",
    "#cd5c5c",
    "#4b0082",
    "#fffff0",
    "#f0e68c",
    "#e6e6fa",
    "#fff0f5",
    "#7cfc00",
    "#fffacd",
    "#add8e6",
    "#f08080",
    "#e0ffff",
    "#fafad2",
    "#d3d3d3",
    "#90ee90",
    "#d3d3d3",
    "#ffb6c1",
    "#ffa07a",
    "#20b2aa",
    "#87cefa",
    "#778899",
    "#778899",
    "#b0c4de",
    "#ffffe0",
    "#00ff00",
    "#32cd32",
    "#faf0e6",
    "#ff00ff",
    "#800000",
    "#66cdaa",
    "#0000cd",
    "#ba55d3",
    "#9370db",
    "#3cb371",
    "#7b68ee",
    "#00fa9a",
    "#48d1cc",
    "#c71585",
    "#191970",
    "#f5fffa",
    "#ffe4e1",
    "#ffe4b5",
    "#ffdead",
    "#000080",
    "#fdf5e6",
    "#808000",
    "#6b8e23",
    "#ffa500",
    "#ff4500",
    "#da70d6",
    "#eee8aa",
    "#98fb98",
    "#afeeee",
    "#db7093",
    "#ffefd5",
    "#ffdab9",
    "#cd853f",
    "#ffc0cb",
    "#dda0dd",
    "#b0e0e6",
    "#800080",
    "#ff0000",
    "#bc8f8f",
    "#4169e1",
    "#8b4513",
    "#fa8072",
    "#f4a460",
    "#2e8b57",
    "#fff5ee",
    "#a0522d",
    "#c0c0c0",
    "#87ceeb",
    "#6a5acd",
    "#708090",
    "#708090",
    "#fffafa",
    "#00ff7f",
    "#4682b4",
    "#d2b48c",
    "#008080",
    "#d8bfd8",
    "#ff6347",
    "#40e0d0",
    "#ee82ee",
    "#f5deb3",
    "#ffffff",
    "#f5f5f5",
    "#ffff00",
    "#9acd32"
];

function initialCaps(str) {
    var char = str.charAt(0).toUpperCase();
    str = char + str.substring(1, str.length);
    return str;
}


function COMPARE_COLOR(a, b) {
    const mult1 = 0;
    if (a.hsb[0] + a.hsb[2] * mult1 < b.hsb[0] + b.hsb[2] * mult1) {
        return -1;
    }
    if (a.hsb[0] + a.hsb[2] * mult1 > b.hsb[0] + b.hsb[2] * mult1) {
        return 1;
    }
    return 0;
}

var colorPairs = [];
for (var i = 0; i < _colorNames.length; ++i) {
    var obj = new Object();
    obj.hex = _colorHexes[i];
    obj.name = initialCaps(_colorNames[i]);
    obj.hsb = HexToHSB(obj.hex);
    colorPairs.push(obj);
}
colorPairs.sort(COMPARE_COLOR);

var colorChooserHtml = "";
for (let pair of colorPairs) {
    colorChooserHtml += "<div onclick='setBarColor(\"" + pair.hex + "\");'  class='clickable' style='display: inline-block; margin-right: 3px; width: 20px; height: 20px; background-color: " + pair.hex + ";' title='" + pair.name + "'></div>"
}
document.getElementById("color_chooser").innerHTML = colorChooserHtml;

function toggleColors() {
    var ele = document.getElementById("color_chooser");
    if (ele.style.display == "none")
        ele.style.display = "";
    else
        ele.style.display = "none";
}

function setBarColor(color) {
    _savedColor = color;
    var eles = document.getElementsByClassName("color_bar");
    for (let ele of eles) {
        ele.style.backgroundColor = color;
        if (useBlackText(color))
            ele.style.color = "black";
        else
            ele.style.color = "white";
    }
}

function HexToHSB(hex) {
    hex = hex.replace(/^#/, '');
    hex = hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex;

    var red = parseInt(hex.substr(0, 2), 16) / 255,
        green = parseInt(hex.substr(2, 2), 16) / 255,
        blue = parseInt(hex.substr(4, 2), 16) / 255;

    var cMax = Math.max(red, green, blue),
        cMin = Math.min(red, green, blue),
        delta = cMax - cMin,
        saturation = cMax ? (delta / cMax) : 0;

    switch (cMax) {
        case 0:
            return [0, 0, 0];
        case cMin:
            return [0, 0, cMax];
        case red:
            return [60 * (((green - blue) / delta) % 6) || 0, saturation, cMax];
        case green:
            return [60 * (((blue - red) / delta) + 2) || 0, saturation, cMax];
        case blue:
            return [60 * (((red - green) / delta) + 4) || 0, saturation, cMax];
    }
}

function useBlackText(hex) {
    var hexStr = hex.replace(/^#/, '');
    var R = parseInt("0x" + hexStr.substring(0, 2)) / 255;
    var G = parseInt("0x" + hexStr.substring(2, 4)) / 255;
    var B = parseInt("0x" + hexStr.substring(4, 6)) / 255;
    var gamma = 2.2;
    var L = 0.2126 * Math.pow(R, gamma)
        + 0.7152 * Math.pow(G, gamma)
        + 0.0722 * Math.pow(B, gamma);
    return (L > 0.5);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            // console.log("Loaded " + cname + " JSON|" + JSON.parse(c.substring(name.length, c.length)) + "|");
            return JSON.parse(c.substring(name.length, c.length));
        }
    }
    return null;
}

function setCookie(cname, cvalue) {
    var exdays = 365;
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    var jvalue = JSON.stringify(cvalue);
    // console.log("Saved " + cname + " JSON|" + jvalue + "|");
    document.cookie = cname + "=" + jvalue + ";" + expires + "; SameSite=Strict; path=/";
}

setUI(false, false, "", true);
firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
        document.getElementById("log_out").style.display = "block";
        setUI(false, false, "Checking for a subscription...", true);
        var reff = firebase.database().ref().child("users").child(firebase.auth().getUid());
        reff.get().then((dataSnapshot) => {
            var user = dataSnapshot.val();
            if (user != null) {
                var reff0 = firebase.database().ref().child("firestore").child("customers").child(user.companyid);
                reff0.get().then((dataSnapshot2) => {
                    var subscription = dataSnapshot2.val();
                    if (subscription != null && (subscription.status == "active" || subscription.status == "trialing")) {
                        setUI(true, false, "", false);
                    }
                    else {
                        setUI(false, false, "<h2>Looks like you don't have an active subscription, or it may still be processing. You can get one <a style='color: blue;' href='https://www.cleanassistant.app/stripe.html'>Here.</a>", false);
                    }
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                setUI(false, false, "<h2>Looks like your account is not set up correctly yet. Please contact us at info@cleanassistant.net for help.", false);
            }
        }).catch((error) => {
            console.error(error);
        });
    } else {
        document.getElementById("log_out").style.display = "none";
        setUI(false, true, "", false);
        if (getCookie("freeTrialUsed") == null) {
            setCookie("freeTrialUsed", true);
            setUI(true, false, "", false);
        }
    }
});

function setUI(showInvoice, showLogin, message, loading) {
    document.getElementById("invoice_div").style.display = "none";
    document.getElementById("login_div").style.display = "none";
    document.getElementById("loader").style.display = "none";
    if (showInvoice)
        document.getElementById("invoice_div").style.display = "";
    if (showLogin)
        document.getElementById("login_div").style.display = "";
    document.getElementById("message_div").innerHTML = message;
    if (loading)
        document.getElementById("loader").style.display = "block";
}

function log_in() {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function () {
        var email = document.getElementById("Login_Email").value;
        var password = document.getElementById("Login_Password").value;
        return firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
            })
            .catch((error) => {
                setUI(false, true, error.message, false);
                console.error(error);
            });
    });
}

function log_out() {
    firebase.auth().signOut();
}

var KEY_ENTER = "Enter";
var KEY_NUMPADENTER = "NumpadEnter"
document.getElementById("Login_Email").addEventListener("keyup", function (event) {
    if (event.code == (KEY_ENTER) || event.code == (KEY_NUMPADENTER)) {
        event.preventDefault();
        document.getElementById("SignInButton").click();
    }
});

document.getElementById("Login_Password").addEventListener("keyup", function (event) {
    if (event.code == (KEY_ENTER) || event.code == (KEY_NUMPADENTER)) {
        event.preventDefault();
        document.getElementById("SignInButton").click();
    }
});

var cacheCookie = getCookie("cache_version");
if(cacheCookie == null || cacheCookie != version){
    setCookie("cache_version", version);
    window.location.reload(true);
}