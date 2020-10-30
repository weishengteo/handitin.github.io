"use strict"
const USER_INFO = "USER INFO";
const GROUP_INDEX = "GROUP INDEX";
const UNIT_INDEX = "UNIT INDEX";
const PROJECT_INDEX = "PROJECT INDEX"
const PROJECT_CODE = "PROJECT CODE"
const GROUP_ID = "GROUP ID"

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
function retrieveProjectIndex()
{
  if(typeof (Storage) !== 'undefined')
  {
    if(localStorage.getItem(PROJECT_INDEX) != undefined)
    {
      let data = JSON.parse(localStorage.getItem(PROJECT_INDEX));
      return data;
    }
  }
  else
  {
    alert ('local storage is no supported in current browser')
  }
}

function retrieveProjectCode()
{
  if(typeof (Storage) !== 'undefined')
  {
    if(localStorage.getItem(PROJECT_CODE) != undefined)
    {
      return localStorage.getItem(PROJECT_CODE)
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
function printGroups(input = 0){
  let index = retrieveProjectIndex();
  let user = retrieveUserInfo();
  let projCode = retrieveProjectCode();
  let output = "";

  if (input == 0){
    let index = 1;
    let status = "Not Marked"
    db.collection("groups").where("project", "==", projCode).where("markingStatus", "==", status)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function (doc) {
        output += "<div class = \"container\">"
        output += "<div class=\"demo-card-wide mdl-card mdl-shadow--2dp\">"
        output += "<div class=\"mdl-card__title\">"
        output += "<h2 class=\"mdl-card__title-text\">" + "Group " + index + "</h2>"
        output += "</div>"
        output += "<div class=\"mdl-card__supporting-text\">"
        output += "<b>Group ID:</b> " + doc.data().groupid + "<br>"
        output += "<b>Group Members:</b> " + doc.data().members.toString() + "<br>"
        output += "<b>Marking Status:</b> " + doc.data().markingStatus +"<br>"
        output += "</div>"
        output += "<div class=\"mdl-card__actions mdl-card--border\">"
        output += "<a id=\"" + doc.data().groupid + "\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" onclick = \"groupIndex(this.id); window.location.href=\'groupmarker.html\';\">"
        output += "Get Started"
        output += "</a>"
        output += "</div>"
        output += "</div>"
        output += "</div>"
        index += 1
      });
    })
    .then(() => {
      document.getElementById("notMarkedProjects").innerHTML = output;
      initBackgroundImage();
    })
  }
  else if (input == 1) {
    let index = 1;
    let status = "In Progress"
    db.collection("groups").where("project", "==", projCode).where("markingStatus", "==", status)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function (doc) {
        output += "<div class = \"container\">"
        output += "<div class=\"demo-card-wide mdl-card mdl-shadow--2dp\">"
        output += "<div class=\"mdl-card__title\">"
        output += "<h2 class=\"mdl-card__title-text\">" + "Group " + index + "</h2>"
        output += "</div>"
        output += "<div class=\"mdl-card__supporting-text\">"
        output += "<b>Group ID:</b> " + doc.data().groupid + "<br>"
        output += "<b>Group Members:</b> " + doc.data().members.toString() + "<br>"
        output += "<b>Marking Status:</b> " + doc.data().markingStatus +"<br>"
        output += "</div>"
        output += "<div class=\"mdl-card__actions mdl-card--border\">"
        output += "<a id=\"" + doc.data().groupid + "\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" onclick = \"groupIndex(this.id); window.location.href=\'groupmarker.html\';\">"
        output += "Get Started"
        output += "</a>"
        output += "</div>"
        output += "</div>"
        output += "</div>"
        index += 1
      });
    })
    .then(() => {
      document.getElementById("inProgressProjects").innerHTML = output;
      initBackgroundImage();
    })
  }
  else{
    let index = 1;
    let status = "Marked"
    db.collection("groups").where("project", "==", projCode).where("markingStatus", "==", status)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function (doc) {
        output += "<div class = \"container\">"
        output += "<div class=\"demo-card-wide mdl-card mdl-shadow--2dp\">"
        output += "<div class=\"mdl-card__title\">"
        output += "<h2 class=\"mdl-card__title-text\">" + "Group " + index + "</h2>"
        output += "</div>"
        output += "<div class=\"mdl-card__supporting-text\">"
        output += "<b>Group ID:</b> " + doc.data().groupid + "<br>"
        output += "<b>Group Members:</b> " + doc.data().members.toString() + "<br>"
        output += "<b>Marking Status:</b> " + doc.data().markingStatus +"<br>"
        output += "</div>"
        output += "<div class=\"mdl-card__actions mdl-card--border\">"
        output += "<a id=\"" + doc.data().groupid + "\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" onclick = \"groupIndex(this.id); window.location.href=\'groupmarker.html\';\">"
        output += "Get Started"
        output += "</a>"
        output += "</div>"
        output += "</div>"
        output += "</div>"
        index += 1
      });
    })
    .then(() => {
      document.getElementById("markedProjects").innerHTML = output;
      initBackgroundImage();
    })
  }
}

function groupIndex(groupID){
  if(typeof(Storage)!=="undefined")
  {
    let groupidJSON = JSON.stringify(groupID);
    localStorage.setItem(GROUP_ID, groupidJSON);
  }
  else
  {
    alert("Sorry, your browser does not support web storage...");
  }
}

printGroups();
