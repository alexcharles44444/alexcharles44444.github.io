/* global firebase, firebaseui, Stripe */

/**
 * Replace with your publishable key from the Stripe Dashboard
 * https://dashboard.stripe.com/apikeys
 */
// const STRIPE_PUBLISHABLE_KEY = "pk_test_51KUdlfHIiPodnP4DDdXYPaUTtBrcbVnK7rMYw3Au395ZzP7a7C0RjyZWNzXsJoVlNKEMBbeOva9EiNu9Q75schHV00rWocfRTe";
const STRIPE_PUBLISHABLE_KEY = "pk_live_51KUdlfHIiPodnP4Dx41nQVebqwUXYFGybKg0ThgnpPaxf2QOEpHDJVc44kMnQctP0JkwLCVM97GvCK9insHtJfq400UT8KID3O";

/**
 * Your Firebase config from the Firebase console
 * https://firebase.google.com/docs/web/setup#config-object */


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

/**
 * Initialize Firebase
 */
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
let currentUser;


document.getElementById("firebaseui-auth-container").style.display = "none";
document.getElementById("start_buttons").style.display = "none";

function signIn() {
  var ele = document.getElementsByClassName("firebaseui-title")[0];
  if (ele != null) {
    document.getElementById("firebaseui-auth-container").style.display = "";
    document.getElementById("start_buttons").style.display = "none";
    ele.innerHTML = "Sign in";
  }
}

function newAccount() {
  var ele = document.getElementsByClassName("firebaseui-title")[0];
  if (ele != null) {
    document.getElementById("firebaseui-auth-container").style.display = "";
    document.getElementById("start_buttons").style.display = "none";
    ele.innerHTML = "Create account";
  }
}

function accountBack() {
  document.getElementById("firebaseui-auth-container").style.display = "none";
  document.getElementById("start_buttons").style.display = "";
  firebaseUI.start('#firebaseui-auth-container', firebaseUiConfig);
}

/**
 * Firebase Authentication configuration
 */
const firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());
const firebaseUiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return false;
    },
    uiShown: () => {
      document.querySelector('#loader').style.display = 'none';
    },
  },
  signInFlow: 'popup',
  // signInSuccessUrl: '/',
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  // Your terms of service url.
  tosUrl: '../CleanAssistant_Docs/EULA.txt',
  // Your privacy policy url.
  privacyPolicyUrl: '../CleanAssistant_Docs/Privacy_Policy.html',
};
firebase.auth().onAuthStateChanged((firebaseUser) => {
  if (firebaseUser) {
    // console.log("Logged in");
    document.querySelector('#loader').style.display = 'none';
    document.getElementById("loader0").style.display = "";
    document.getElementById("start_buttons").style.display = "none";
    document.getElementById("firebaseui-auth-container").style.display = "none";
    document.querySelector('main').style.display = "block";
    document.querySelector(".products").innerHTML = "";
    document.querySelector("#my-subscription").style.display = "none";
    document.querySelector("#subscribe").style.display = "none";
    currentUser = firebaseUser.uid;
    startDataListeners();
  } else {
    // console.log("Logged out");
    document.getElementById("loader0").style.display = "none";
    document.getElementById("start_buttons").style.display = "";
    document.querySelector('main').style.display = 'none';
    firebaseUI.start('#firebaseui-auth-container', firebaseUiConfig);
  }
});


/**
 * Data listeners
 */
function startDataListeners() {
  // Get all our products and render them to the page
  const products = document.querySelector(".products");
  const template = document.querySelector("#product");
  db.collection("products")
    .where("active", "==", true)
    .get()
    .then(function (querySnapshot) {
      products.innerHTML = "";
      document.getElementById("loader0").style.display = "none";
      querySnapshot.forEach(async function (doc) {
        const priceSnap = await doc.ref
          .collection("prices")
          .orderBy("unit_amount")
          .get();
        if (!"content" in document.createElement("template")) {
          console.error("Your browser doesn't support HTML template elements.");
          return;
        }

        const product = doc.data();
        const container = template.content.cloneNode(true);

        container.querySelector("h2").innerText = product.name;
        container.querySelector(".description").innerText =
          product.description || "";
        // Prices dropdown
        var content0 = "";
        var i = 0;
        priceSnap.docs.forEach((doc) => {
          ++i;
          if (i == 1) {
            const priceId = doc.id;
            const priceData = doc.data();
            const content = document.createTextNode(
              `${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: priceData.currency
              }).format((priceData.unit_amount / 100).toFixed(2))} per ${priceData.interval
              }`
            );
            content0 = content;
            const option = document.createElement("option");
            option.value = priceId;
            option.appendChild(content);
            container.querySelector("#price").appendChild(option);
          }
        });
        container.querySelector("#price").style.display = "none";
        container.querySelector("#price_div").innerHTML = content0.textContent;

        if (product.images.length) {
          const img = container.querySelector("img");
          img.src = product.images[0];
          img.alt = product.name;
        }

        const form = container.querySelector("form");
        form.addEventListener("submit", subscribe);

        products.appendChild(container);
      });
    });

  db.collection("customers")
    .doc(currentUser)
    .collection("subscriptions")
    .where("status", "in", ["trialing", "active"])
    .onSnapshot(async (snapshot) => {
      if (snapshot.empty) {
        // Show products
        document.querySelector("#my-subscription").style.display = "none";
        document.querySelector("#subscribe").style.display = "block";
        return;
      }
      document.querySelector("#my-subscription").style.display = "block";
      document.querySelector("#subscribe").style.display = "none";
      // In this implementation we only expect one Subscription to exist
      const subscription = snapshot.docs[0].data();
      const priceData = (await subscription.price.get()).data();
      document.querySelector(
        "#my-subscription p"
      ).textContent = `You are paying ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: priceData.currency
      }).format((priceData.unit_amount / 100).toFixed(2))} per ${priceData.interval
        }`;
    });
}
/**
 * Event listeners
 */
document
  .getElementById("signout")
  .addEventListener("click", () => firebase.auth().signOut());

// Checkout handler
async function subscribe(event) {
  document.getElementById("loader0").style.display = "";
  event.preventDefault();
  document.querySelectorAll('button').forEach((b) => (b.disabled = true));
  const formData = new FormData(event.target);

  const docRef = await db
    .collection("customers")
    .doc(currentUser)
    .collection("checkout_sessions")
    .add({
      price: formData.get("price"),
      allow_promotion_codes: true,
      success_url: window.location.origin,
      cancel_url: window.location.origin
    });

  // Wait for the CheckoutSession to get attached by the extension
  docRef.onSnapshot((snap) => {
    const { sessionId } = snap.data();
    if (sessionId) {
      // We have a session, let's redirect to Checkout
      const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
      stripe.redirectToCheckout({ sessionId });
      document.getElementById("loader0").style.display = "none";
    }
  });
}

// Billing portal handler
const functionLocation = "us-central1"; // us-central1, for example
document
  .querySelector("#billing-portal-button")
  .addEventListener("click", async (event) => {
    document.getElementById("loader0").style.display = "";
    document.querySelectorAll('button').forEach((b) => (b.disabled = true));

    // Call billing portal function
    const functionRef = firebase
      .app()
      .functions(functionLocation)
      .httpsCallable("ext-firestore-stripe-payments-createPortalLink");
    // .httpsCallable("ext-firestore-stripe-subscriptions-createPortalLink");
    var windowReference = window.open();
    const { data } = await functionRef({ returnUrl: window.location.origin });
    // window.location.assign(data.url);
    console.log("Recieved url");
    windowReference.location = data.url;
    // window.open(data.url);
    document.getElementById("loader0").style.display = "none";
    document.querySelectorAll('button').forEach((b) => (b.disabled = false));
  });