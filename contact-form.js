

const firebaseConfig = {
  apiKey: "AIzaSyBVm1GrGziSazlDCGTRJLhIpeWdLTLnXSs",
  authDomain: "cleanbook-b42d5.firebaseapp.com",
  databaseURL: "https://cleanbook-b42d5.firebaseio.com",
  projectId: "cleanbook-b42d5",
  storageBucket: "cleanbook-b42d5.appspot.com",
  messagingSenderId: "332358043151",
  appId: "1:332358043151:web:36d348bb2ce8f496f9857a",
  measurementId: "G-QGCNQC096N"
};
firebase.initializeApp(firebaseConfig);
const firestore_db = firebase.firestore();

function formButtonClicked() {
  document.getElementById("contact_form").style.display = "none";
  document.getElementById("contact_form_submitted").style.display = "";

  var date = new Date();
  firestore_db.collection("contact_form").doc(String(date.getTime())).set({
    name: document.getElementById("form_name").value,
    email: document.getElementById("form_email").value,
    phone: document.getElementById("form_phone").value,
    company: document.getElementById("form_company").value,
    cleaners: document.getElementById("form_cleaners").value,
    other: document.getElementById("form_other").value
  }).then(() => {
  })
}