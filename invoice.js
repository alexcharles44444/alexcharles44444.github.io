const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const estimate = urlParams.get('estimate');

if (estimate != null) {
    document.getElementById("doc_text_number").innerHTML = "Estimate #";
    document.getElementById("doc_text_date").innerHTML = "Estimate Date";
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

var obj = new Object();
obj.name = "Tax1";
obj.rate = "10";
obj.compound = false;
_taxes.set("a", obj);
var obj = new Object();
obj.name = "Tax2";
obj.rate = "20";
obj.compound = false;
_taxes.set("b", obj);