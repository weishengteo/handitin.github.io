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

function displayStudents(){
  output = "";
  output += "<table class=\"mdl-data-table mdl-js-data-table\">"
  output += "<thead><tr><th>No.</th><th class=\"mdl-data-table__cell--non-numeric\">Username</th>"
  output += "<th class=\"mdl-data-table__cell--non-numeric\">Email</th>"
  output += "<th class=\"mdl-data-table__cell--non-numeric\">Current projects</th></tr></thead><tbody>"

  num = 1
  db.collection("users").get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      if (doc.data()['username'] != "admin"){
        output += "<tr><td>"+ num + "</td>"
        output += "<td class=\"mdl-data-table__cell--non-numeric\">" + doc.data()['username'] + "</td>"
        output += "<td class=\"mdl-data-table__cell--non-numeric\">" + doc.data()['email'] + "</th>"
        output += "<td class=\"mdl-data-table__cell--non-numeric\">" + doc.data()['projects'] + "</th></tr>"
        num += 1
      }
    })
  })
  .then(() => {
    output += "</tbody></table>";
    document.getElementById("studentListArea").innerHTML = output;
  })
}

displayStudents();

function groupProjectUnit(){
  let output = "";
  output += "<div style=\"color:black\"><form action=\"#\"><br>"
  output += "<h4><b>Unit Name:</b></h4><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%\">"
  output += "<select class=\"mdl-textfield__input\" id=\"groupProjectUnit\">"
  output += "<option value=\"Select\" hidden>Select</option>";

  db.collection("units").get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      output += "<option value=" + doc.data().unitcode + ">" + doc.data().unitcode + ": " + doc.data().unitname + "</option>"
    })
  })
  .then(() => {
    output += "</select></div><br>"
    output += "<button style=\"margin:auto;width:200px;height:auto;display:block;\" class=\"mdl-button mdl-js-button mdl-button--raised\" type=\"button\" onclick=\"groupProjectProject()\">Filter</button>"
    document.getElementById("addContributionsFormUnit").innerHTML = output;
  })
}

function groupProjectProject(){
  let unitSelection = document.getElementById('groupProjectUnit').value;
  let output = ""
  output += "<h4><b>Project Name:</b></h4><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\" style=\"width:100%\">"
  output += "<select class=\"mdl-textfield__input\" id=\"groupProjectProject\" onchange=\"groupProjectStudents()\">"
  output += "<option value=\"Select\" hidden>Select</option>";

  db.collection("projects").where("unitcode", "==", unitSelection).get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      output += "<option value=" + doc.data().projectid + ">" + doc.data().projectid + ": " + doc.data().projname + "</option>"
    })
  })
  .then(() => {
    output += "</select></div><br>"
    document.getElementById("addContributionsFormProject").innerHTML = output;
  })
}

function groupProjectStudents(){
  let projectSelection = document.getElementById('groupProjectProject').value;
  let output = ""
  output += "<h4><b>Students:</b></h4>"
  db.collection("users").get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      if (!doc.data().projects.includes(projectSelection) && doc.data().username != "admin"){
        output += "<label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=" + doc.data().username + ">"
        output += "<input name=\"students\" type=\"checkbox\" id=" + doc.data().username + " value='" + doc.data().username + "' class=\"mdl-checkbox__input\">"
        output += "<span class=\"mdl-checkbox__label\">" + doc.data().username + "</span></label><br>"
      }
    })
  })
  .then(() => {
    document.getElementById("addContributionsFormStudents").innerHTML = output;
  })
}

function submitForm(){
  let groupID = document.getElementById('groupid').value;
  let unitSelection = document.getElementById('groupProjectUnit').value;
  let projectSelection = document.getElementById('groupProjectProject').value;
  let checkboxes = document.querySelectorAll('input[name="students"]:checked');
  let students = [];
  Array.prototype.forEach.call(checkboxes, function(el) {
      students.push(el.value);
  });

  db.collection("groups").add({
    assignedmembers: [],
    contributions: [],
    groupid: groupID,
    members: students,
    project: projectSelection,
    taskcomments: [],
    tasks: [],
    tasksdesc: [],
    unitcode: unitSelection,
    markingStatus: "Not Marked"
  })
  .then(() => {
    i = 0;
    db.collection("users").get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (students.includes(doc.data().username)){
          console.log(doc.data())
          let newProj = doc.data().projects;
          if (newProj.length == 0){
            newProj += projectSelection
          }
          else{
            newProj += ", " + projectSelection
          }
          db.collection("users").doc(doc.id).update({
            projects: newProj
          })
          let newUnits = doc.data().units;
          if (!newUnits.includes(unitSelection)){
            if (newUnits.length == 0){
              newUnits += unitSelection
            }
            else{
              newUnits += ", " + unitSelection
            }
          }
          db.collection("users").doc(doc.id).update({
            units: newUnits
          })
          let newGroups = doc.data().projgroup
          newGroups[projectSelection] = groupID;
          db.collection("users").doc(doc.id).update({
            projgroup: newGroups
          })

          .then(()=>{
            i += 1;
            if (i == students.length){
              window.location.reload()
            }
          })
        }
      })
    })
  })
}

groupProjectUnit();
