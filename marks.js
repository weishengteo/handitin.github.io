"use strict"
const USER_INFO = "USER INFO";
const GROUP_INDEX = "GROUP INDEX";
const UNIT_INDEX = "UNIT INDEX";
const PROJECT_CODE = "PROJECT CODE";
const PROJECT_INDEX = "PROJECT INDEX";
const GROUP_ID = "GROUP ID";
const UNIT_CODE = "UNIT CODE";
let memberInput = ""

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
* This method is used to obtain the index of the project that has
* been previously clicked by the user (and saved in local storage)
* in the projectslist page.
*/
function retrieveProjectCode()
{
  if(typeof (Storage) !== 'undefined')
  {
    if(localStorage.getItem(PROJECT_CODE) != undefined)
    {
      return localStorage.getItem(PROJECT_CODE);
    }
  }
  else
  {
    alert ('local storage is no supported in current browser')
  }
}

function retrieveGroupID()
{
  if(typeof (Storage) !== 'undefined')
  {
    if(localStorage.getItem(GROUP_ID) != undefined)
    {
      return localStorage.getItem(GROUP_ID);
    }
  }
  else
  {
    alert ('local storage is no supported in current browser')
  }
}

function retrieveUnitCode()
{
  if(typeof (Storage) !== 'undefined')
  {
    if(localStorage.getItem(UNIT_CODE) != undefined)
    {
      return localStorage.getItem(UNIT_CODE);
    }
  }
  else
  {
    alert ('local storage is no supported in current browser')
  }
}


function printTable(){
  let output = "";
  output += "<tbody>"
  output += "<table class=\"mdl-data-table mdl-js-data-table\">"
  output += "<thead>"
  output += "<tr>"
  output += "<th>No.</th>"
  output += "<th class=\"mdl-data-table__cell--non-numeric\">Project ID</th>"
  output += "<th>Marks</th>"
  output += "<th class=\"mdl-data-table__cell--non-numeric\">Remarks</th>"
  output += "</tr>"
  output += "</thead>"

  // Searches the database based on the username to find the group
  db.collection("users").where("username", "==", user.username)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      let projects = doc.data().projects
      let projectlist = projects.split(", ")

      for (let i = 0; i < projectlist.length; i++ ){
        output += "<tr>"
        output += "<td>" + (i+1) + "</td>"
        output += "<td class=\"mdl-data-table__cell--non-numeric\">" + doc.data().projgroup[projectlist[i]] + "</td>"
        output += "<td>" + doc.data().projgroupmarks[projectlist[i]] + "</td>"
        output += "<td class=\"mdl-data-table__cell--non-numeric\">" + doc.data().projgroupremarks[[projectlist[i]]] + "</td>"
        output += "</tr>"

        // Display once we reach the end of the loop.
        if(i == projectlist.length - 1){
          output += "</tbody>"
          output += "</table>"
          document.getElementById("marksArea").innerHTML = output;
        }
      }
    });
  })
}


// Function calls
let user = retrieveUserInfo();

printTable();
// TODO: add code for entering the contribution into the database by adding a new entry into the
// firestore "groups" collection under the "contributions" tab (based on the user's group)

// TODO: Implement the task adding (the dialog) by getting data from the dialog and adding it into the
// firestore database under the tasks field in the groups document
