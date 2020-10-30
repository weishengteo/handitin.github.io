// The web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBBkFkeWNjzZkDePYrpzruJfaX3xfrC-pM",
  authDomain: "fit2101-39981.firebaseapp.com",
  databaseURL: "https://fit2101-39981.firebaseio.com",
  projectId: "fit2101-39981",
  storageBucket: "fit2101-39981.appspot.com",
  messagingSenderId: "129241193378",
  appId: "1:129241193378:web:083e6a8c6401664204f0fb",
  measurementId: "G-MPSCGG6ELN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

/**
* This method is used to generate a random background image out of the ones
* provided for the cards in the page.
*/
function initBackgroundImage(){
  var images = ['https://lms.monash.edu/theme/monash/pix/myoverview/blinds-silhouette-pastel-blue-micro-banner.jpg',
  'https://lms.monash.edu/theme/monash/pix/myoverview/shadows-black-green-micro-banner.jpg',
  'https://lms.monash.edu/theme/monash/pix/myoverview/inkblot-green-micro-banner.jpg',
  'https://lms.monash.edu/theme/monash/pix/myoverview/bubbles-abstract-blue-micro-banner.jpg'];

  // Randomly applies a background image from the ones given
  for(let i = 0; i<document.getElementsByClassName('mdl-card__title').length; i++){
    document.getElementsByClassName('mdl-card__title')[i].style.backgroundImage = 'url(' + images[Math.floor(Math.random() * images.length)] + ')';
    document.getElementsByClassName('mdl-card__title')[i].style.backgroundPosition = "center cover"
    document.getElementsByClassName('mdl-card__title')[i].style.backgroundRepeat = "no-repeat"
  }
}

function printUnits(){
  let output = "";
  let i = 0;

  db.collection("units")
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      output += "<div class = \"container\">"
      output += "<div class=\"demo-card-wide mdl-card mdl-shadow--2dp\">"
      output += "<div class=\"mdl-card__title\">"
      output += "<h2 class=\"mdl-card__title-text\">" + "Unit " + (i+1) + ": " + doc.data().unitname + "</h2>"
      output += "</div>"
      output += "<div class=\"mdl-card__supporting-text\">"
      output += "<b>Unit description:</b> " + doc.data().unitdesc + "<br><br>"
      output += "<b>Unit code:</b> " + doc.data().unitcode + "<br>"
      output += "</div>"
      output += "</div>"
      output += "</div>"
      i += 1;
    });
  })
  .then(() => {
    document.getElementById("unitListArea").innerHTML = output;
    initBackgroundImage();
  })
}

function submitForm(){
  let unitName = document.getElementById('unitName').value;
  let unitCode = document.getElementById('unitCode').value;
  let unitDesc = document.getElementById('unitDesc').value;

  db.collection("units").add({
    unitcode: unitCode,
    unitdesc: unitDesc,
    unitname: unitName,
  })
  .then(() => {
    window.location.reload()
  })
}

printUnits();
