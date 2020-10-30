"use strict"
const USER_INFO = "USER INFO";
const GROUP_INDEX = "GROUP INDEX";
const UNIT_INDEX = "UNIT INDEX";
const PROJECT_CODE = "PROJECT CODE";
const PROJECT_INDEX = "PROJECT INDEX";
const GROUP_ID = "GROUP ID";
const UNIT_CODE = "UNIT CODE";
let memberInput = ""
let addUserInput = ""
let deleteUserInput = ""

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


/**
* This method is used to display the project info at the top of the
* page. It searches the firestore database for the project with the same id
* and retrieves the information from there.
*/
function displayProjInfo(){
  //building the table
  let ret = "";
  ret += '<table id="task-table" class="mdl-data-table mdl-js-data-table">'
  ret += '<thead><tr><th style="width: 15%">Unit name</th><th class="mdl-data-table__cell--non-numeric">Project name</th>  <th class="mdl-data-table__cell--non-numeric">Weightage</th> <th class="mdl-data-table__cell--non-numeric">Group ID</th> <th class="mdl-data-table__cell--non-numeric">Group member(s)</th> <th class="mdl-data-table__cell--non-numeric">Progress</th> <th class="mdl-data-table__cell--non-numeric">Marking Status</th>'

  db.collection("projects").where("projectid", "==", projCode)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      console.log("yay")
      console.log(projCode)
      ret += '<tr><td class="mdl-data-table__cell--non-numeric">' + doc.data().unitname + '</td>'
      ret += '<td class="mdl-data-table__cell--non-numeric">' + doc.data().projname + '</td>'
      ret += '<td class="mdl-data-table__cell--non-numeric">' + doc.data().weightage + '</td>'
      db.collection("groups").where("groupid", "==", groupID).where("project", "==", projCode)
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
          ret += '<td class="mdl-data-table__cell--non-numeric">' + doc.data().groupid + '</td>'
          ret += '<td class="mdl-data-table__cell--non-numeric">' + members + '</td>'
          ret += '<td class="mdl-data-table__cell--non-numeric">' + doc.data().contributions.length + " contributions made" + '</td>'
          ret += '<td class="mdl-data-table__cell--non-numeric">' + doc.data().markingStatus + '</td>'
        })
      })
      .then(() =>  document.getElementById("groupDetails").innerHTML = ret)
    });
  })
}

function printMembers(){
  let output = "";
  output += "<tbody>"
  output += '<table id="task-table" class="mdl-data-table mdl-js-data-table">'
  output += '<thead><tr><th style="width: 15%">No.</th><th class="mdl-data-table__cell--non-numeric">Username</th> <th class="mdl-data-table__cell--non-numeric">Email</th>  <th class="mdl-data-table__cell--non-numeric">Mark</th> <th class="mdl-data-table__cell--non-numeric">Feedback</th>'

  // Searches the database based on the username to find the group
  db.collection("groups").where("groupid", "==", groupID).where("project", "==", projCode)
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
      let memberList = members.split(", ")
      let memberEmailList = []

      for (let i = 0; i < memberList.length; i++){
        db.collection("users").where("username", "==", memberList[i])
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function (doc) {

           let marks = ""
           let units = doc.data().projgroupmarks
           let remarks = ""
           let remarksdb = doc.data().projgroupremarks

           for (let unit in units){
             if (unit == projCode){
               marks = units[unit]
             }
           }

           for (let unit in remarksdb){
             if (unit == projCode){
               remarks = remarksdb[unit]
             }
           }

            output += "<tr>"
            output += "<td>" + (i+1) + "</td>"
            output += "<td class=\"mdl-data-table__cell--non-numeric\">" + memberList[i] + "</td>"
            output += "<td class=\"mdl-data-table__cell--non-numeric\">" + doc.data().email + "</td>"
            output += "<td class=\"mdl-data-table__cell--non-numeric\">" + marks + "</td>"
            output += "<td class=\"mdl-data-table__cell--non-numeric\">" + remarks + "</td>"
            output += "</tr>"

            // Display once we reach the end of the loop.
            if(i == memberList.length - 1){
              output += "</tbody>"
              output += "</table>"
              document.getElementById("teamMembers").innerHTML = output;
            }
          })
        })
      }
    });
  })
}
/**
* This method is used to display the table for the contributions that
* has been inputted by the group into their project. It searches the
* group database to find the current user's group, then prints out the
* contributions that are recorded in it.
*/
function printTable(){
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
  output += "</tr>"
  output += "</thead>"

  // Searches the database based on the username to find the group
  db.collection("groups").where("groupid", "==", groupID).where("project", "==", projCode)
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
        output += "</tr>"

        // Display once we reach the end of the loop.
        if(i == doc.data().contributions.length - 1){
          output += "</tbody>"
          output += "</table>"
          document.getElementById("contributions").innerHTML = output;
        }
      }
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

  //searches the database based on the username to find the group
  db.collection("groups").where("project","==",projCode).where("groupid", "==", groupID)
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

        //displays information once we reach the end of the loop
        if(i == doc.data().tasks.length - 1){
          stringOutput += "</tbody>"
          stringOutput += "</table>"
          document.getElementById("tasks").innerHTML += stringOutput;
        }
      }
    });
  })

}

/*
This method is used for recording the input task selected by users
**/
function selectMember(selected)
{
  memberInput = selected[selected.selectedIndex].text
}

/*
This method is used for recording the input task selected by users
**/
function selectUserAdd(selected)
{
  addUserInput = selected[selected.selectedIndex].text
}

/*
This method is used for recording the input task selected by users
**/
function selectUserDelete(selected)
{
  deleteUserInput = selected[selected.selectedIndex].text
}

function displayMember(){
  db.collection("groups").where("project","==",projCode).where("groupid", "==", groupID)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      //building the selection option
      let members = ""
      for (let i = 0; i < doc.data().members.length; i++){
        members += doc.data().members[i]
        if (i != doc.data().members.length - 1){
          members += ", "
        }
      }
      let memberList = members.split(", ")

      let ret = "<option value='Select' hidden>Select</option>";
      for (let i = 0; i < memberList.length; i++){
        ret += "<option value='" + memberList[i] + "'>" + memberList[i] + "</option>";
      }
      document.getElementById('studentName').innerHTML = ret
    });
  })
}

function displayAddMember(){
  let noGroups = []
  //building the selection option
  db.collection("users")
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      if (doc.data().username != "admin"){
        let units = doc.data().units
        let unitlist = units.split(", ")

        if (unitlist.includes(unitCode)){
          let userGroups = doc.data().projgroup
          if (!userGroups.hasOwnProperty(projCode)){
            noGroups.push(doc.data().username)
          }
        }

        let ret = "<option value='Select' hidden>Select</option>";
        for (let i = 0; i < noGroups.length; i++){
          ret += "<option value='" + noGroups[i] + "'>" + noGroups[i] + "</option>";
        }
        document.getElementById('userAdd').innerHTML = ret
      }
    });
  })
}

function displayDeleteMember(){
  //building the selection option
  db.collection("groups").where("project","==",projCode).where("groupid", "==", groupID)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      //building the selection option
      let members = ""
      for (let i = 0; i < doc.data().members.length; i++){
        members += doc.data().members[i]
        if (i != doc.data().members.length - 1){
          members += ", "
        }
      }
      let memberList = members.split(", ")

      let ret = "<option value='Select' hidden>Select</option>";
      for (let i = 0; i < memberList.length; i++){
        ret += "<option value='" + memberList[i] + "'>" + memberList[i] + "</option>";
      }
      document.getElementById('userDelete').innerHTML = ret
    });
  })
}


function addMarks(){
  let student = memberInput;
  let mark = String(document.getElementById('j-marks').value);
  let remark = String(document.getElementById('j-remarks').value);

  db.collection("groups").where("project", "==", projCode).where("groupid", "==", groupID)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {

      db.collection("users").where("username", "==", student)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function (doc) {

          let newRemarkObj = {}
          let newMarkObj = {}

          let marks = doc.data().projgroupmarks
          for (let unit in marks){
            if (unit != projCode){
              newMarkObj[unit] = marks[unit]
            }
          }
          newMarkObj[projCode] = mark

          let remarks = doc.data().projgroupremarks
          for (let unit in remarks){
            if (unit != projCode){
              newRemarkObj[unit] = remarks[unit]
            }
          }
          newRemarkObj[projCode] = remark

          db.collection("users").doc(doc.id).update({
            projgroupmarks: newMarkObj,
            projgroupremarks: newRemarkObj
          })
          //refreshing page
          .then(() =>  window.location.reload())
        });
      })
    });
  })
}

function addStudent(){
  let student = addUserInput;

  db.collection("groups").where("project", "==", projCode).where("groupid", "==", groupID)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {

      let newMembers = []

      for (let i = 0; i < doc.data().members.length ; i++){
        newMembers.push(doc.data().members[i])
      }

      newMembers.push(student)
      db.collection("groups").doc(doc.id).update({
        members: newMembers
      })

      db.collection("users").where("username", "==", student)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function (doc) {

          let newProjGroup = {}
          let newMarkObj = {}
          let newRemarkObj = {}
          let projectString = doc.data().projects

          if (projectString == ""){
            projectString += projCode
          }
          else{
            projectString += ", " + projCode
          }

          let marks = doc.data().projgroupmarks
          for (let unit in marks){
            if (unit != projCode){
              newMarkObj[unit] = marks[unit]
            }
          }
          newMarkObj[projCode] = ""

          let groups = doc.data().projgroup
          for (let group in groups){
            if (group != projCode){
              newProjGroup[group] = groups[group]
            }
          }
          newProjGroup[projCode] = groupID

          let remarks = doc.data().projgroupremarks
          for (let unit in remarks){
            if (unit != projCode){
              newRemarkObj[unit] = remarks[unit]
            }
          }
          newRemarkObj[projCode] = ""

          console.log(projectString)

          db.collection("users").doc(doc.id).update({
            projgroupmarks: newMarkObj,
            projgroupremarks: newRemarkObj,
            projgroup: newProjGroup,
            projects: projectString
          })
          //refreshing page
          .then(() =>  window.location.reload())
        });
      })
    });
  })
}

function deleteStudent(){
  let student = deleteUserInput;

  db.collection("groups").where("project", "==", projCode).where("groupid", "==", groupID)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {

      let newMembers = []

      for (let i = 0; i < doc.data().members.length ; i++){
        if (doc.data().members[i] != student){
          newMembers.push(doc.data().members[i])
        }
      }

      db.collection("groups").doc(doc.id).update({
        members: newMembers
      })

      db.collection("users").where("username", "==", student)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function (doc) {

          let newProjGroup = {}
          let newMarkObj = {}
          let newRemarkObj = {}
          let projectString = doc.data().projects
          let newProjectString = ""
          let newProjectStringList = []
          let projectStringSplit = projectString.split (", ")

          for (let i = 0; i < projectStringSplit.length; i ++){
            if (projectStringSplit[i] != projCode){
              if (newProjectString == ""){
                newProjectString += projectStringSplit[i]
              }
              else{
                newProjectString += ", " + projectStringSplit[i]
              }
            }
          }

          let marks = doc.data().projgroupmarks
          for (let unit in marks){
            if (unit != projCode){
              newMarkObj[unit] = marks[unit]
            }
          }

          let groups = doc.data().projgroup
          for (let group in groups){
            if (group != projCode){
              newProjGroup[group] = groups[group]
            }
          }

          let remarks = doc.data().projgroupremarks
          for (let unit in remarks){
            if (unit != projCode){
              newRemarkObj[unit] = remarks[unit]
            }
          }

          console.log(newMarkObj)
          console.log(newRemarkObj)
          console.log(newProjGroup)
          console.log(newProjectString)

          db.collection("users").doc(doc.id).update({
            projgroupmarks: newMarkObj,
            projgroupremarks: newRemarkObj,
            projgroup: newProjGroup,
            projects: newProjectString
          })
          //refreshing page
          .then(() =>  window.location.reload())
        });
      })
    });
  })
}

function checkMarkingStatus(){
  let marks = 0;
  let maxPossibleMarks = 0;
  db.collection("users")
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      if (doc.data().projgroup[projCode] == groupID){
        maxPossibleMarks += 1;
        if (doc.data().projgroupmarks.hasOwnProperty(projCode) && doc.data().projgroupmarks[projCode] != ""){
          marks += 1;
        }
      }
    })
  })
  .then(() => {
    console.log(marks)
    console.log(maxPossibleMarks)
    if (marks == maxPossibleMarks){
      db.collection("groups").where("project", "==", projCode).where("groupid", "==", groupID)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function (doc) {
          db.collection("groups").doc(doc.id).update({
            markingStatus: "Marked"
          })
        })
      })
    }
    else if (marks > 0 && marks < maxPossibleMarks){
      db.collection("groups").where("project", "==", projCode).where("groupid", "==", groupID)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function (doc) {
          db.collection("groups").doc(doc.id).update({
            markingStatus: "In Progress"
          })
        })
      })
    }
    else if (marks == 0){
      db.collection("groups").where("project", "==", projCode).where("groupid", "==", groupID)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function (doc) {
          db.collection("groups").doc(doc.id).update({
            markingStatus: "Not Marked"
          })
        })
      })
    }
  })
}

// Function calls
let user = retrieveUserInfo();
let projCode = retrieveProjectCode();
projCode = String(projCode)
let groupID = retrieveGroupID();
groupID = groupID.substring(1,groupID.length-1)
let unitCode = retrieveUnitCode();
console.log(groupID)
console.log(unitCode)

displayProjInfo();
printTable();
printTask();
printMembers();
displayMember();
displayAddMember();
displayDeleteMember();
checkMarkingStatus();

// TODO: add code for entering the contribution into the database by adding a new entry into the
// firestore "groups" collection under the "contributions" tab (based on the user's group)

// TODO: Implement the task adding (the dialog) by getting data from the dialog and adding it into the
// firestore database under the tasks field in the groups document
