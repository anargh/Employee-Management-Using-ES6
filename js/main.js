// Regular expression declaration
const regexPattern = {
    username : /[^a-zA-Z0-9]/,
    invalidName : /[^a-zA-Z\s]/,
    whiteSpace : /[\s]/g,
    employeeID : /^ACE\d\d\d\d$/,
    email : /^([a-zA-Z0-9](\.|_){0,1})+[A-Za-z0-9]\@([A-Za-z0-9])+\.[a-z]{2,4}$/,
    numbers : /[0-9]/,
    phoneNumber : /^[7-9]/,
    word : /\w+/g
}

let employeeDetail = {
  employeeID : {
        element : document.getElementById("employeeID"),
        minlength : 7,
        maxlength : 7,
        error : false,
        errorMessage : ""
      },
  employeeName : {
        element : document.getElementById("employeeName"),
        minlength : 3,
        maxlength : 16,
        error : false,
        errorMessage : ""
      },
  employeeSalary : {
        element : document.getElementById("employeeSalary"),
        minlength : 5,
        maxlength : 7,
        error : false,
        errorMessage : ""
      },
  employeeEmail : {
        element : document.getElementById("employeeEmail"),
        error : false,
        errorMessage : ""
      },
  employeePhone : {
    element : document.getElementById("employeePhone"),
    minlength : 10,
    maxlength : 10,
    error : false,
    errorMessage : ""
  }
};


class Employee {

  constructor() {
    let self = this;
    document.getElementById("addemployee").addEventListener("submit", function(event) {
      event.preventDefault();
      self.validateFields();
    });
  }

  addEmployee() {
    let submitData = {
      "employeeID" : employeeDetail["employeeID"]["element"].value,
      "employeeName" : employeeDetail["employeeID"]["element"].value,
      "employeeDOB" : employeeDetail["eDayDOB"]["element"].value.toString() +
                      employeeDetail["eMonthDOB"]["element"].value.toString() +
                      employeeDetail["eYearDOB"]["element"].value.toString(),
      "employeeSalary" : employeeDetail["employeeSalary"]["element"].value,
      "employeeEmail" : employeeDetail["employeeEmail"]["element"].value,
      "employeePhone" : employeeDetail["employeePhone"]["element"].value
    }

    alert("Submitted Data.");
    //sessionStorage.setItem("submittedData",JSON.stringify(employeeDetail));
    //window.location.href = "submitted.html";
  }

  validateFields() {

    console.log("Called validate employee");
    if(regexPattern["employeeID"].test(employeeDetail["employeeID"]["element"].value) == false) { //Check if ACEID is in proper format
      employeeDetail["employeeID"]["errorMessage"] = "Employee ID should be in the format <strong>ACE</strong> followed by 4 digits.";
      employeeDetail["employeeID"]["error"] = true;
    }
    else if(Number(employeeDetail["employeeID"]["element"].value.substring(3,7)) < 1) { //ACEID: 0000 is invalid.
      employeeDetail["employeeID"]["errorMessage"] = "Please enter valid ACE ID. ID Format: <strong>ACE</strong> followed by 4 digits.";
      employeeDetail["employeeID"]["error"] = true;
    }
    else {
      employeeDetail["employeeID"]["error"] = false;
      console.log("ID: "+employeeDetail["employeeID"]["error"]);
    }

    //Check Employee Name
    if((employeeDetail["employeeName"]["element"].value.length < employeeDetail["employeeName"]["minlength"]) || (employeeDetail["employeeName"]["element"].value.length > employeeDetail["employeeName"]["maxlength"])) {
      employeeDetail["employeeName"]["errorMessage"] = `Length of name should be between ${employeeDetail["employeeName"]["minlength"]} to ${employeeDetail["employeeName"]["maxlength"]} characters.`;
      employeeDetail["employeeName"]["error"] = true;
    }
    else if(regexPattern["invalidName"].test(employeeDetail["employeeName"]["element"].value) == true) { //Check for special characters or numbers.
      employeeDetail["employeeName"]["errorMessage"] = "Name should not contain numbers OR special characters.";
      employeeDetail["employeeName"]["error"] = true;
    }
    else if(isValidFullName() == false) {                                         //Check for whitespace and Allow spaces between first, middle and lastname
      employeeDetail["employeeName"]["errorMessage"] = "Only a single whitespace must be present between words. Allowed characters - [A-Z, \"whitespace\"]";
      employeeDetail["employeeName"]["error"] = true;
    }
    else
      employeeDetail["employeeName"]["error"] = false;

    if((employeeDetail["employeeSalary"]["element"].value < 5000) || (employeeDetail["employeeSalary"]["element"].value > 9999999) || (employeeDetail["employeeSalary"]["element"].value == "")) {
      employeeDetail["employeeSalary"]["errorMessage"] = "Acceptable salary range: &#8377;5,000 to &#8377;1,00,00,00.";
      employeeDetail["employeeSalary"]["error"] = true;
    }
    else if(isNaN(parseInt(employeeDetail["employeeSalary"]["element"].value)) == true) {
      employeeDetail["employeeSalary"]["errorMessage"] = "Salary should contain only numbers and must be in the range &#8377;5,000 to &#8377;1,00,00,00.";
      employeeDetail["employeeSalary"]["error"] = true;
    }
    else
      employeeDetail["employeeSalary"]["error"] = false;

    //Check employee phone number
    if((employeeDetail["employeePhone"]["element"].value.length < employeeDetail["employeePhone"]["minlength"]) || (employeeDetail["employeePhone"]["element"].value.length > employeeDetail["employeePhone"]["maxlength"])) {
      employeeDetail["employeePhone"]["errorMessage"] = "Phone number should have only 10 digits.";
      employeeDetail["employeePhone"]["error"] = true;
    }
    else if(regexPattern["phoneNumber"].test(employeeDetail["employeePhone"]["element"].value) == false) {
      employeeDetail["employeePhone"]["errorMessage"] = "Enter a valid phone number. Valid number starts with digit 7, 8 or 9.";
      employeeDetail["employeePhone"]["error"] = true;
    }
    else
      employeeDetail["employeePhone"]["error"] = false;

    //Check employee Email
    if(regexPattern["email"].test(employeeDetail["employeeEmail"]["element"].value) == false) {
      employeeDetail["employeeEmail"]["errorMessage"] = "Please enter a valid Email. Email Format: username@domain-name";
      employeeDetail["employeeEmail"]["error"] = true;
    }
    else
      employeeDetail["employeeEmail"]["error"] = false;

    //Check for the results of validation
    for(let key in employeeDetail) {
      if(employeeDetail[key]["error"] == true)
        printError(employeeDetail[key]);
      else {
        removeError(employeeDetail[key]);
      }
    }
  }
}

window.addEventListener('load', () => new Employee());

function isValidFullName() {
  let spaceCount = 0, wordCount = 0;
  while(regexPattern["whiteSpace"].exec(employeeDetail["employeeName"]["element"].value) != null)
    ++spaceCount;                                                               // No. of spaces
  while(regexPattern["word"].exec(employeeDetail["employeeName"]["element"].value) != null)
    ++wordCount;                                                                //No. of words
  if((wordCount - 1) == spaceCount)
    return true;                                                                // No consecutive spaces
  else
    return false;                                                               // Found consecutive spaces. Return error!
}

function printError(errorInfo) {                                                // To print detected errors and remove errors if valid data is entered
  let errorElementName = "info-" + errorInfo["element"].id,
      elementErrorMsg = errorInfo["errorMessage"];
  document.getElementById(errorElementName).style.display = "inline-block";
  document.getElementById(errorElementName).innerHTML = elementErrorMsg;
}

function removeError(errorInfo) {
          console.log("Remove Error called");                                           //To remove printed errors.
  let errorElementName = "info-" + errorInfo["element"].id;
  document.getElementById(errorElementName).style.display = "none";
  document.getElementById(errorElementName).innerHTML = "";
}
