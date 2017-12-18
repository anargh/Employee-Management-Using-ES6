class Users {
  constructor(user, password) {
    this.user = user;
    this.password = password;
    this.createSession();
  }
  createSession() {                                                             //To create session for the user.
    if(this.validateLogin() == true) {
      if(this.user == "admin" || this.password == "password") {
        sessionStorage.setItem("loggedIn","true");
        window.location.href = "display.html";
      }
    }
  }
  validateLogin() {                                                             //Validate the login fields
    let users = {
      username : {
            element : document.getElementById("username"),
            minlength : 5,
            maxlength : 16,
            error : false,
            errorMessage : ""
          },
      password : {
            element : document.getElementById("password"),
            minlength : 8,
            maxlength : 20,
            error : false,
            errorMessage : ""
      }
    }
    if(regexPattern["whiteSpace"].test(this.user)) {
      users["username"]["errorMessage"] = "Username should not contain whitespace";
      users["username"]["error"] = true;
    }
    else if((this.user.length < 5) || (this.user.length > 16)) {
      users["username"]["errorMessage"] = "Username should have 5 to 16 characters.";
      users["username"]["error"] = true;
    }
    else if(regexPattern["username"].test(this.user)) {
      users["username"]["errorMessage"] = "Username should not contain special characters.";
      users["username"]["error"] = true;
    }

    if((this.password.length < users["password"]["minlength"]) || (this.password.length > users["password"]["maxlength"])) {
      users["password"]["errorMessage"] = "Password should have 8 to 20 characters.";
      users["password"]["error"] = true;
    }
    let status = true;
    //Check for the results of validation
    for(let key in users) {
      if(users[key]["error"] == true) {
        printError(users[key]);                                                 //If errors are present, print the errors
        status = false;
      }
      else
        removeError(users[key]);                                                //Remove the errors
    }
    return status;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  let siginButton = document.getElementById("signin");
  (siginButton == null) ? null : siginButton.addEventListener("click", () => {  //If sigin button is present, add event listener click for it.
    new Users(document.getElementById("username").value, document.getElementById("password").value);
  });
});
//Check if user is logged in
if(sessionStorage.getItem("loggedIn") == null) {
  if(window.location.pathname != "/emp_es6/index.html")
    window.location.href = "index.html";
}

function logout() {                                                             //To Logout session
  sessionStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}
