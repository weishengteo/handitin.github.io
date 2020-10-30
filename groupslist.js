"use strict"
const USER_INFO = "USER INFO";
const GROUP_INDEX = "GROUP INDEX";
const UNIT_INDEX = "UNIT INDEX";

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
  var images = ['https://lms.monash.edu/theme/monash/pix/myoverview/brush-strokes-abstract-pink-blue-micro-banner.jpg',
  'https://lms.monash.edu/theme/monash/pix/myoverview/geo-abstract-brown-micro-banner.jpg',
  'https://lms.monash.edu/theme/monash/pix/myoverview/layered-draping-purple-micro-banner.jpg',
  'https://lms.monash.edu/theme/monash/pix/myoverview/fibroblasts-under-the-microscope-green-micro-banner.jpg'];

  // Randomly applies a background image from the ones given
  for(let i = 0; i<document.getElementsByClassName('mdl-card__title').length; i++){
    document.getElementsByClassName('mdl-card__title')[i].style.backgroundImage = 'url(' + images[Math.floor(Math.random() * images.length)] + ')';
    document.getElementsByClassName('mdl-card__title')[i].style.backgroundPosition = "center cover"
    document.getElementsByClassName('mdl-card__title')[i].style.backgroundRepeat = "no-repeat"
  }
}

/**
* This method is used to obtain the user info (which is basically the
* basic information that the user has provided during registration) that has
* been previously saved in the browser's local storage in the login page).
*/
function retrieveUserInfo()
{
  if(typeof (Storage) !== 'undefined')
  {
    if(localStorage.getItem(USER_INFO) != undefined)
    {
      let data = JSON.parse(localStorage.getItem(USER_INFO));
      return data;
    }
  }
  else
  {
    alert ('local storage is no supported in current browser')
  }
}

/**
* This method is used to obtain the index of the unit that has
* been previously clicked by the user (and saved in local storage)
* in the unitslist page.
*/
function retrieveUnitIndex()
{
  if(typeof (Storage) !== 'undefined')
  {
    if(localStorage.getItem(UNIT_INDEX) != undefined)
    {
      let data = JSON.parse(localStorage.getItem(UNIT_INDEX));
      return data;
    }
  }
  else
  {
    alert ('local storage is no supported in current browser')
  }
}

/**
* This method is used to print the list of projects that are assigned to the user
* by the marker. The projects' information are saved under the projects collection
* in firestore. (It is assumed that the projects will be created by the marker and will
* be implemented later on). The list of projects that a user is in can be seen in the
* users collection under the projects field.
*/
function printGroups(){
  let index = retrieveUnitIndex();
  let user = retrieveUserInfo();
  let groups = Object.values(user.projgroup);
  let unit = user.units.split(", ")[index];
  let totalGroups = ""

  for (let i = 0; i < groups.length; i++){
    totalGroups += groups[i] + ", "
  }

  groups = totalGroups.substring(0,totalGroups.length-2).split(", ")
  let output = "";

  for (let i = 0; i < groups.length; i++){
    db.collection("groups").where("groupid", "==", groups[i]).where("unitcode", "==", unit)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function (doc) {
        output += "<div class = \"container\">"
        output += "<div class=\"demo-card-wide mdl-card mdl-shadow--2dp\">"
        output += "<div class=\"mdl-card__title\">"
        output += "<h2 class=\"mdl-card__title-text\">" + "Group " + doc.data().groupname + "</h2>"
        output += "</div>"
        output += "<div class=\"mdl-card__supporting-text\">"
        output += "<b>Group ID:</b> " + doc.data().groupid + "<br>"
        output += "<b>Group Name:</b> " + doc.data().groupname +"<br><br>"
        output += "<b>"
        output += "</div>"
        output += "<div class=\"mdl-card__actions mdl-card--border\">"
        output += "<a id=\"" + i + "\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" onclick = \"window.location.href=\'group.html\'; groupIndex(this.id);\">"
        output += "Get Started"
        output += "</a>"
        output += "</div>"
        output += "</div>"
        output += "</div>"
      });

      // Display once we reach the end of the loop.
      if(i == groups.length - 1){
        console.log("asdasd")
        document.getElementById("groupArea").innerHTML = output;
        initBackgroundImage();
      }
    })
  }
}

function groupIndex(clicked){
  if(typeof(Storage)!=="undefined")
  {
    let indexJSON = JSON.stringify(clicked);
    localStorage.setItem(GROUP_INDEX, indexJSON);
  }
  else
  {
    alert("Sorry, your browser does not support web storage...");
  }
}

printGroups();
