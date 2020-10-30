"use strict"
const USER_INFO = "USER INFO";
const PROJECT_INDEX = "PROJECT INDEX";
let taskInput = "";
let memberInput = "";
let selectedContribution = "";
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

/**
* This method is used to display the project info at the top of the
* page. It searches the firestore database for the project with the same id
* and retrieves the information from there.
*/
function displayProjInfo(){
  let output = retrieveProjectIndex();
  // Splits the string into an array with the separation being the comma
  let projects = user.projects.split(", ");

  //building the table
  let ret = "";
  ret += '<table id="task-table" class="mdl-data-table mdl-js-data-table">'
  ret += '<thead><tr><th style="width: 15%">Unit name</th><th class="mdl-data-table__cell--non-numeric">Project name</th>  <th class="mdl-data-table__cell--non-numeric">Weightage</th> <th class="mdl-data-table__cell--non-numeric">Group member(s)</th> <th class="mdl-data-table__cell--non-numeric">Progress</th>'

  db.collection("projects").where("projectid", "==", currentproject)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      ret += '<tr><td class="mdl-data-table__cell--non-numeric">' + doc.data().unitname + '</td>'
      ret += '<td class="mdl-data-table__cell--non-numeric">' + doc.data().projname + '</td>'
      ret += '<td class="mdl-data-table__cell--non-numeric">' + doc.data().weightage + '%</td>'
      db.collection("groups").where("members", "array-contains", user.username).where("groupid", "==", user.projgroup[currentproject])
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function (doc) {
          let members = ""
          for (let i = 0; i < doc.data().members.length; i++){
            members += doc.data().members[i]
            if (i != doc.data().members.length - 1){
              members += ", "
            }
          }
          ret += '<td class="mdl-data-table__cell--non-numeric">' + members + '</td>'
          ret += '<td class="mdl-data-table__cell--non-numeric">' + doc.data().contributions.length + " contributions made" + '</td>'
        })
      })
      .then(() =>  document.getElementById("projectinfo").innerHTML = ret)
    });
  })
}

/**
This method loads the tasks that has been recorded in the firestore.
The method will receive tasks from the firestore
and prints them in a table form in the project page
*/
function printTask()
{
  //building the table
  let stringOutput = ""
  stringOutput += '<table id="task-table" class="mdl-data-table mdl-js-data-table">'
  stringOutput += '<thead><tr><th style="width: 15%">No.</th><th class="mdl-data-table__cell--non-numeric">Task Name</th>  <th class="mdl-data-table__cell--non-numeric">Description</th> <th class="mdl-data-table__cell--non-numeric">Comments</th> <th class="mdl-data-table__cell--non-numeric">Estimated hours to Complete</th> <th class="mdl-data-table__cell--non-numeric">Assigned to:</th>'
  stringOutput += '<th class="mdl-data-table__cell--non-numeric">Delete Task</th></tr></thead><tbody>'
  //searches the database based on the username to find the group
  db.collection("groups").where("members", "array-contains", user.username).where("groupid", "==", user.projgroup[currentproject])
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      let tempName = [];
      let tempDesc = [];
      for (let i = 0; i < doc.data().tasks.length; i++){
        stringOutput += '<tr><td>' + (i+1) + '</td><td class="mdl-data-table__cell--non-numeric">'
        stringOutput += doc.data().tasks[i]
        stringOutput += '</td><td class="mdl-data-table__cell--non-numeric">'
        stringOutput += doc.data().tasksdesc[i]
        stringOutput += '</td><td class="mdl-data-table__cell--non-numeric">'
        stringOutput += doc.data().taskcomments[i]
        stringOutput += '</td><td class="mdl-data-table__cell--non-numeric">'
        stringOutput += doc.data().taskestimate[i]
        stringOutput += '</td><td class="mdl-data-table__cell--non-numeric">'
        stringOutput += doc.data().assignedmembers[i]
        stringOutput += '</td><td class="mdl-data-table__cell--non-numeric">'
        stringOutput += "<button type = \"button\" class=\"mdl-button mdl-js-button mdl-button--raised\" onclick=\"deleteTask(" + i + ")\"> Delete </button></td>"

        //displays information once we reach the end of the loop
        if(i == doc.data().tasks.length - 1){
          stringOutput += "</tbody>"
          stringOutput += "</table>"
          document.getElementById("tasktablecontent").innerHTML += stringOutput;
        }
      }
    });
  })

}

/**
function for deleting each row in the table of tasks
*/
function deleteTask(index)
{
  //searches the database based on the username to find the group
  db.collection("groups").where("members", "array-contains", user.username).where("groupid", "==", user.projgroup[currentproject])
  .get()
  .then(function(querySnapshot) {

    querySnapshot.forEach(function (doc) {
      let tempTask = []
      let tempDesc =[]
      let tempComm = []
      let tempAss = []
      //building the array to push into the database
      for (let i = 0; i < doc.data().tasks.length; i++){
        tempTask.push(doc.data().tasks[i])
      }
      for (let i = 0; i < doc.data().tasksdesc.length; i++){
        tempDesc.push(doc.data().tasksdesc[i])
      }
      for (let i = 0; i < doc.data().taskcomments.length; i++){
        tempComm.push(doc.data().taskcomments[i])
      }
      for (let i = 0; i < doc.data().assignedmembers.length; i++){
        tempAss.push(doc.data().assignedmembers[i])
      }
      //splicing to remove the index which was deleted
      tempTask.splice(index,1)
      tempDesc.splice(index,1)
      tempComm.splice(index,1)
      tempAss.splice(index,1)
      //updating the database
      db.collection("groups").doc(doc.id).update({
        tasks: tempTask
      })
      db.collection("groups").doc(doc.id).update({
        tasksdesc: tempDesc
      })
      db.collection("groups").doc(doc.id).update({
        taskcomments: tempComm
      })
      db.collection("groups").doc(doc.id).update({
        assignedmembers: tempAss
      })
      //refreshing page
      .then(() =>  window.location.reload())
    });
  })
}
/*
This method is called when a new tasks is added. This method will
store the newly added tasks into the firestore when the submit
button is clicked.
**/
function addTask(){
  //getting information from the dialog box
  let taskName = document.getElementById('j-source').value
  let taskDescription = document.getElementById('j-destination').value
  let taskComments = document.getElementById('j-dest2').value
  let taskEstimate = document.getElementById('j-dest3').value
  let assigned = memberInput
  //searching based on username for groups
  db.collection("groups").where("members", "array-contains", user.username).where("groupid", "==", user.projgroup[currentproject])
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      let tempName = [];
      let tempDesc = [];
      let tempComm = [];
      let tempAss = [];
      let tempEst = [];
      for (let i = 0; i < doc.data().tasks.length; i++){
        tempName.push(doc.data().tasks[i]);
      }
      tempName.push(taskName);
      db.collection("groups").doc(doc.id).update({
        tasks: tempName
      })

      for (let i = 0; i < doc.data().tasksdesc.length; i++){
        tempDesc.push(doc.data().tasksdesc[i]);
      }
      tempDesc.push(taskDescription);
      db.collection("groups").doc(doc.id).update({
        tasksdesc: tempDesc
      })

      for (let i = 0; i < doc.data().taskcomments.length; i++){
        tempComm.push(doc.data().taskcomments[i]);
      }
      tempComm.push(taskComments);
      db.collection("groups").doc(doc.id).update({
        taskcomments: tempComm
      })

      for (let i = 0; i < doc.data().assignedmembers.length; i++){
        tempAss.push(doc.data().assignedmembers[i]);
      }
      tempAss.push(assigned);
      db.collection("groups").doc(doc.id).update({
        assignedmembers: tempAss
      })

      for (let i = 0; i < doc.data().taskestimate.length; i++){
        tempEst.push(doc.data().taskestimate[i]);
      }
      tempEst.push(taskEstimate);
      db.collection("groups").doc(doc.id).update({
        taskestimate: tempEst
      })
      //refreshing page
      .then(() =>  window.location.reload())
    });
  })
  document.getElementById('j-source').value = ''
  document.getElementById('j-destination').value = ''
  document.getElementById('j-dest2').value = ''
}

/*
This method is used for recording the input task selected by users
**/
function selectTask(selected)
{
  taskInput = selected[selected.selectedIndex].text
}

function selectMember(selected)
{
  memberInput = selected[selected.selectedIndex].text
}

/*
This method is used for displaying the drop down list of the available tasks
to the user in the form of contribution
**/
function displayTask(id)
{
  //searches the database based on the username to find the group
  db.collection("groups").where("members", "array-contains", user.username).where("groupid", "==", user.projgroup[currentproject])
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      //building the selection option
      let tasksDropDowninnerHTML = "<option value='Select' hidden>Select</option>";
      for (let i = 0; i < doc.data().tasks.length; i++){
        tasksDropDowninnerHTML += "<option value='" + doc.data().tasks[i] + "'>" + doc.data().tasks[i] + "</option>";
      }
      document.getElementById(id).innerHTML = tasksDropDowninnerHTML
    });
  })
}

function displayMembers(id)
{
  //searches the database based on the username to find the group
  db.collection("groups").where("members", "array-contains", user.username).where("groupid", "==", user.projgroup[currentproject])
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      //building the selection option
      let tasksDropDowninnerHTML = "<option value='Select' hidden>Select</option>";
      for (let i = 0; i < doc.data().members.length; i++){
        tasksDropDowninnerHTML += "<option value='" + doc.data().members[i] + "'>" + doc.data().members[i] + "</option>";
      }
      document.getElementById(id).innerHTML = tasksDropDowninnerHTML
    });
  })
}

/**
* This method is used to display the table for the contributions that
* has been inputted by the group into their project. It searches the
* group database to find the current user's group, then prints out the
* contributions that are recorded in it.
*/
function printContribution(){
  let output = "";
  output += "<tbody>"
  output += "<table class=\"mdl-data-table mdl-js-data-table\">"
  output += "<thead>"
  output += "<tr>"
  output += "<th>No.</th>"
  output += "<th class=\"mdl-data-table__cell--non-numeric\">Task Name</th>"
  output += "<th class=\"mdl-data-table__cell--non-numeric\">Member</th>"
  output += "<th>Hours contributed</th>"
  output += "<th class=\"mdl-data-table__cell--non-numeric\">Remarks</th>"
  output += "<th class=\"mdl-data-table__cell--non-numeric\">Edit Contribution</th>"
  output += "</tr>"
  output += "</thead>"

  // Searches the database based on the username to find the group
  db.collection("groups").where("members", "array-contains", user.username).where("groupid", "==", user.projgroup[currentproject])
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      for (let i = 0; i < doc.data().contributions.length; i++ ){
        output += "<tr>"
        output += "<td>" + (i+1) + "</td>"
        output += "<td class=\"mdl-data-table__cell--non-numeric\">" + doc.data().contributions[i].taskname + "</td>"
        output += "<td class=\"mdl-data-table__cell--non-numeric\">" + doc.data().contributions[i].members + "</td>"
        output += "<td>" + doc.data().contributions[i].hours + "</td>"
        output += "<td class=\"mdl-data-table__cell--non-numeric\">" + doc.data().contributions[i].remarks + "</td>"
        output += "<td class=\"mdl-data-table__cell--non-numeric edit-contri\"><button type = \"button\" class=\"mdl-button mdl-js-button mdl-button--raised\" onclick=\"selectContribution(" + i + ")\"> Edit </button></td>"
        output += "</tr>"

        // Display once we reach the end of the loop.
        if(i == doc.data().contributions.length - 1){
          output += "</tbody>"
          output += "</table>"
          document.getElementById("tablecontent").innerHTML = output;

          // This block of code is used to display the dialog for the "EDIT" button
          var dialog = document.getElementById('dialogContribution');
          var showModalButton = document.getElementsByClassName("edit-contri");
          console.log(showModalButton);
          if (! dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
          }
          for (let i = 0; i < showModalButton.length; i++){
            showModalButton[i].addEventListener('click', function() {
              dialog.showModal();
            });
          }
          dialog.querySelector('#contricancel').addEventListener('click', function() {
            dialog.close();
          });
          dialog.querySelector('#contrisubmit').addEventListener('click', function() {
            editContribution();
          });
        }
      }
    });
  })
}

function selectContribution(selected){
  selectedContribution = selected;
  displayTask('contributiontaskname');

  db.collection("groups").where("members", "array-contains", user.username).where("groupid", "==", user.projgroup[currentproject])
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      let tempContribution = doc.data().contributions[selected]
      console.log(tempContribution)
      document.getElementById("contributiontaskname").value = tempContribution["taskname"]
      document.getElementById("c-hours").value = tempContribution["hours"]
      document.getElementById("c-remarks").value = tempContribution["remarks"]
    });
  })
}

function editContribution(){
  let newTask = document.getElementById("contributiontaskname").value;
  let newHours = document.getElementById("c-hours").value;
  let newRemarks = document.getElementById("c-remarks").value;

  db.collection("groups").where("members", "array-contains", user.username).where("groupid", "==", user.projgroup[currentproject])
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      let tempContri = [];

      for (let i = 0; i<doc.data().contributions.length; i++){
        tempContri.push(doc.data().contributions[i]);
      }

      tempContri[selectedContribution] = {
        hours: newHours,
        members: user.username,
        remarks: newRemarks,
        taskname: newTask
      }

      db.collection("groups").doc(doc.id).update({
        contributions: tempContri
      })
      .then(() =>  window.location.reload());
    });
  })
}

/*
this method takes in the fields of values typed/selected by the user and updates it
in the database.
**/
function addContributions()
{
  let taskName = taskInput
  let hoursTaken = document.getElementById('j-hours').value;
  let remarks = document.getElementById('j-remarks').value;
  //searches the database based on the username to find the group
  db.collection("groups").where("members", "array-contains", user.username).where("groupid", "==", user.projgroup[currentproject])
  .get()
  .then(function(querySnapshot) {

    querySnapshot.forEach(function (doc) {
      let tempContri = []
      //looping to build the array which holds the values of contributions
      for (let i = 0; i < doc.data().contributions.length; i++){
        tempContri.push(doc.data().contributions[i])
      }
      let value = {
        hours: hoursTaken,
        members: user.username,
        remarks: remarks,
        taskname: taskName
      }
      tempContri.push(value)
      //updating the contributions field with the tempcontri array
      db.collection("groups").doc(doc.id).update({
        contributions: tempContri
      })
      //refreshing page
      .then(() =>  window.location.reload())
    });
  })
}

// This block of code is used for the "ADD TASK" button
var dialog = document.getElementById('dialogTask');
var showModalButton = document.querySelector('.add-task');
if (! dialog.showModal) {
  dialogPolyfill.registerDialog(dialog);
}
showModalButton.addEventListener('click', function() {
  dialog.showModal();
});
dialog.querySelector('.close').addEventListener('click', function() {
  dialog.close();
});
dialog.querySelector('.submit').addEventListener('click', function() {
  var snackbarContainer = document.querySelector('#demo-toast-example');
  addTask();
  var data = {message: 'Task has been added.'};
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
  dialog.close();
});

// Function calls
let user = retrieveUserInfo();
let output = retrieveProjectIndex();
// Splits the string into an array with the separation being the comma
let projects = user.projects.split(", ");
// currentproject is the id of the current project
let currentproject = projects[output];
displayProjInfo();
printContribution();
printTask();
displayTask('task');
displayMembers('members');
// TODO: add code for entering the contribution into the database by adding a new entry into the
// firestore "groups" collection under the "contributions" tab (based on the user's group)

// TODO: Implement the task adding (the dialog) by getting data from the dialog and adding it into the
// firestore database under the tasks field in the groups document
