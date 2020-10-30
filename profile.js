"use strict"
// This js file is used for the profile page that the user can access to
// view their information and change their password.
const USER_INFO = "USER INFO";

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
* This method gets the current user's info and displays them
* on the page.
*/
function displayUserInfo()
{
  let user = retrieveUserInfo();
  let output = "";
  output += "<span id=\'userInformation\'>";
  output += "<u>User Details</u><br><br>"
  output += "User name: " + user.username + "<br>";
  output += "Email: " + user.email + "<br>";
  output += "User role: " + user.role + "<br>";
  output += "</span>"

  document.getElementById("info").innerHTML = output;
}

/**
* This method allows the user to change their password if they wish to
* do so. It requires the user to enter their old password as input and
* only allows for the password change to complete if the old password
* matches the one in the database.
*/
function changePass(){
  let user = retrieveUserInfo();
  let username = user.username;
  let change = false;

  // Firestore query to get all entries in the database that have the provided username
  db.collection("users").where("username", "==", username)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // Check if password in database is the same as the old password provided
          if(doc.data()["password"] == document.getElementById("oldpass").value){
            // Change the password if it is
            db.collection("users").doc(doc.id).update({ password: document.getElementById("newpass").value });
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Password has been changed!'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
          }
          else{
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Incorrect old password! Please try again!'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
          }
        });
      })
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

displayUserInfo();
