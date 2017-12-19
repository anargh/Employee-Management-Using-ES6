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

class Employee {
  constructor() {

    this.employeeDetail = {
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
      eDayDOB : {
            element : document.getElementById("eDayDOB")
          },
      eMonthDOB : {
            element : document.getElementById("eMonthDOB")
          },
      eYearDOB : {
            element : document.getElementById("eYearDOB")
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

    if(document.getElementById("addemployee"))
      document.getElementById("addemployee").addEventListener("submit", (event) => {
        event.preventDefault();
        this.addEmployee();
      });
      /*let inputFields = document.querySelectorAll("#addemployee input");
      for(let loopIndex = 0; loopIndex < inputFields.length; loopIndex++) {
        inputFields[loopIndex].addEventListener("blur", () => this.validateFields());
      }*/
  }
  addEmployee() {
    if(!this.validateFields())
      return false;
    let submitData = {
      "employeeID" : this.employeeDetail["employeeID"]["element"].value,
      "employeeName" : this.employeeDetail["employeeName"]["element"].value,
      "employeeDOB" : this.employeeDetail["eDayDOB"]["element"].value.toString()+"-"+
                      this.employeeDetail["eMonthDOB"]["element"].value.toString().toUpperCase()+"-"+
                      this.employeeDetail["eYearDOB"]["element"].value.toString(),
      "employeeSalary" : this.employeeDetail["employeeSalary"]["element"].value,
      "employeeEmail" : this.employeeDetail["employeeEmail"]["element"].value,
      "employeePhone" : this.employeeDetail["employeePhone"]["element"].value
    }

    alert("Submitted Data.");
    sessionStorage.setItem("submittedData",JSON.stringify(submitData));
    window.location.href = "submitted.html";
  }
  validateFields() {
    //Check employee ID
    if(regexPattern["employeeID"].test(this.employeeDetail["employeeID"]["element"].value) == false) { //Check if ACEID is in proper format
      this.employeeDetail["employeeID"]["errorMessage"] = "Employee ACEID should be in the format <strong>ACE</strong> followed by 4 digits.";
      this.employeeDetail["employeeID"]["error"] = true;
    }
    else if(Number(this.employeeDetail["employeeID"]["element"].value.substring(3,7)) < 1) { //ACEID: 0000 is invalid.
      this.employeeDetail["employeeID"]["errorMessage"] = "Please enter valid ACEID. ID Format: <strong>ACE</strong> followed by 4 digits.";
      this.employeeDetail["employeeID"]["error"] = true;
    }
    else
      this.employeeDetail["employeeID"]["error"] = false;
    //Check Employee Name
    if((this.employeeDetail["employeeName"]["element"].value.length < this.employeeDetail["employeeName"]["minlength"]) || (this.employeeDetail["employeeName"]["element"].value.length > this.employeeDetail["employeeName"]["maxlength"])) {
      this.employeeDetail["employeeName"]["errorMessage"] = `Length of name should be between ${this.employeeDetail["employeeName"]["minlength"]} to ${this.employeeDetail["employeeName"]["maxlength"]} characters.`;
      this.employeeDetail["employeeName"]["error"] = true;
    }
    else if(regexPattern["invalidName"].test(this.employeeDetail["employeeName"]["element"].value) == true) { //Check for special characters or numbers.
      this.employeeDetail["employeeName"]["errorMessage"] = "Name should not contain numbers OR special characters.";
      this.employeeDetail["employeeName"]["error"] = true;
    }
    else if(isValidFullName(this.employeeDetail["employeeName"]["element"].value) == false) {                                         //Check for whitespace and Allow spaces between first, middle and lastname
      this.employeeDetail["employeeName"]["errorMessage"] = "Only a single whitespace must be present between words. Allowed characters - [A-Z, \"whitespace\"]";
      this.employeeDetail["employeeName"]["error"] = true;
    }
    else
      this.employeeDetail["employeeName"]["error"] = false;

    if((this.employeeDetail["employeeSalary"]["element"].value < 5000) || (this.employeeDetail["employeeSalary"]["element"].value > 9999999) || (this.employeeDetail["employeeSalary"]["element"].value == "")) {
      this.employeeDetail["employeeSalary"]["errorMessage"] = "Acceptable salary range: &#8377;5,000 to &#8377;1,00,00,00.";
      this.employeeDetail["employeeSalary"]["error"] = true;
    }
    else if(isNaN(parseInt(this.employeeDetail["employeeSalary"]["element"].value)) == true) {
      this.employeeDetail["employeeSalary"]["errorMessage"] = "Salary should contain only numbers and must be in the range &#8377;5,000 to &#8377;1,00,00,00.";
      this.employeeDetail["employeeSalary"]["error"] = true;
    }
    else
      this.employeeDetail["employeeSalary"]["error"] = false;

    //Check employee phone number
    if((this.employeeDetail["employeePhone"]["element"].value.length < this.employeeDetail["employeePhone"]["minlength"]) || (this.employeeDetail["employeePhone"]["element"].value.length > this.employeeDetail["employeePhone"]["maxlength"])) {
      this.employeeDetail["employeePhone"]["errorMessage"] = "Phone number should have only 10 digits.";
      this.employeeDetail["employeePhone"]["error"] = true;
    }
    else if(regexPattern["phoneNumber"].test(this.employeeDetail["employeePhone"]["element"].value) == false) {
      this.employeeDetail["employeePhone"]["errorMessage"] = "Enter a valid phone number. Valid number starts with digit 7, 8 or 9.";
      this.employeeDetail["employeePhone"]["error"] = true;
    }
    else
      this.employeeDetail["employeePhone"]["error"] = false;

    //Check employee Email
    if(regexPattern["email"].test(this.employeeDetail["employeeEmail"]["element"].value) == false) {
      this.employeeDetail["employeeEmail"]["errorMessage"] = "Please enter a valid Email. Email Format: username@domain-name";
      this.employeeDetail["employeeEmail"]["error"] = true;
    }
    else
      this.employeeDetail["employeeEmail"]["error"] = false;

    let status = true;
    //Check for the results of validation
    for(let key in this.employeeDetail) {
      if(this.employeeDetail[key]["error"] == true) {
        printError(this.employeeDetail[key]);
        status = false;
      }
      else {
        if(this.employeeDetail[key].hasOwnProperty("error")) removeError(this.employeeDetail[key]);
      }
    }
    return status;
  }

}

let employee;
window.addEventListener('load', () => employee = new Employee());

function isValidFullName(name) {
  let spaceCount = 0, wordCount = 0;
  while(regexPattern["whiteSpace"].exec(name) != null)
    ++spaceCount;                                                               // No. of spaces
  while(regexPattern["word"].exec(name) != null)
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

function removeError(errorInfo) {                                               //To remove printed errors.
  let errorElementName = "info-" + errorInfo["element"].id;
  document.getElementById(errorElementName).style.display = "none";
  document.getElementById(errorElementName).innerHTML = "";
}
