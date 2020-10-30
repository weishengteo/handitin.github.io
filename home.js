"use strict"
// This js file is used for the home page that is shown after the user has
// logged in.
const USER_INFO = "USER INFO";

/**
* This method dictates the message that is printed in the home page
* depending on whether the current user is a student or marker.
*/
function printWelcome(){
  let user = retrieveUserInfo();
  let output = "";
  output += "<div class=\"bottom-left\">Welcome, " + user.username + "<br>";

  if (user.role == "student"){
    output += "Please proceed to record your project information."
  }
  else if (user.role == "marker"){
    output += "Please proceed to mark the projects."
  }
  output += "</div>"
  document.getElementById("welcome").innerHTML = output;
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

// Prints the home page message
printWelcome();
