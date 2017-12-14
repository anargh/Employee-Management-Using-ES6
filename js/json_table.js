//DEFINE CUSTOM ERRORS
class RequestError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "RequestError";
  }
}
class EmptyFieldError extends RequestError {
    constructor(message) {
      super(message);
      this.message = message;
      this.name = "EmptyFieldError";
    }
}

const tableStructure = {
  tableElement : document.getElementById("showdata"),
  recordPerPage : 5,
  initialPage : 1,
  currentPage : 1,
  totalPages : 0,
  isTableInit : false
}

let employeeJson = { };

//JSON DATA CLASS
class JsonXhrRequest {
  constructor(url,requestMethod) {
    this.responseType = 'json';
    this.requestJson(url, requestMethod);
  }

  requestJson(url,requestMethod) {
    console.log("Requesting...");
    let jsonRequest = new XMLHttpRequest();
    jsonRequest.open(requestMethod, url);
    jsonRequest.responseType = this.responseType;
    jsonRequest.send();
    jsonRequest.onreadystatechange = () => {
      try {
        if(jsonRequest.status == 200 && jsonRequest.readyState == 4) {
          employeeJson = jsonRequest.response;
          document.dispatchEvent(responseRecieved);
          console.log("Response Recieved");
        }
        else if(jsonRequest.status >= 300)
          throw new RequestError("There was a problem retrieving the requested resource.");
      }
      catch(error if error instanceof RequestError) {
        showError(error.name, error.message);
      }
    }
  }
}
//new JsonTabulated(1) for initializing table
class JsonData extends JsonXhrRequest {
  constructor(url, requestMethod) {
    super(url, requestMethod)
  }

  initTable(pages) {
    console.log("Initializing");
    if(pages > 1) {
      let buttonContainer = document.querySelector('.button-container');
      let prevButton = document.createElement("button");
      prevButton.id = "prevButton";
      prevButton.innerText = "prev";
      prevButton.className = "emp-button";
      buttonContainer.appendChild(prevButton);
      const self = this;
      prevButton.addEventListener("click", function(event) {
        self.scrollRecords(event.target);
      });
      for(let loopIndex = 1; loopIndex <= tableStructure.totalPages; loopIndex++) {
        let pageNumberButton = document.createElement("button");
        pageNumberButton.innerText = loopIndex;
        pageNumberButton.className = "emp-button";
        buttonContainer.appendChild(pageNumberButton);
        pageNumberButton.addEventListener("click", function(event) {
          tableStructure.currentPage = Number(event.target.innerText);
          self.getRecordsForPage(tableStructure.currentPage);
        });
      }
      let nextButton = document.createElement("button");
      nextButton.id = "nextButton";
      nextButton.innerText = "next";
      nextButton.className = "emp-button";
      buttonContainer.appendChild(nextButton);
      nextButton.addEventListener("click", function(event) {
        self.scrollRecords(event.target);
      });
    }
    tableStructure.isTableInit = true;
  }
  getRecordsForPage(page) {
    tableStructure.currentPage = page;
    let recordCount = 1;
    if(employeeJson == null)
      return false;
    else
      recordCount = Object.keys(employeeJson).length;
    tableStructure.totalPages = Math.ceil(recordCount / tableStructure.recordPerPage);
    if(tableStructure.isTableInit == false)
      this.initTable(tableStructure.totalPages);
    let startIndex = ((tableStructure.currentPage - 1) * tableStructure.recordPerPage) + 1,
        endIndex = startIndex + tableStructure.recordPerPage;
    this.removeRows(tableStructure.tableElement.rows.length - 1);
    let singlePageRecords = employeeJson.slice(startIndex, endIndex);
    this.insertIntoTable(singlePageRecords);
  }
  insertIntoTable(records) {
    for(let objectKey in records) {                                     //Get each employee's detail
                                                                        //Store all details of one employee
      let tableRow = tableStructure.tableElement.insertRow(-1);
      let singleRecord = records[objectKey];
      for(let objectKey in singleRecord) {                                  //Insert each row. Row count = 0 initially.                                                           //INITIALIZE to -1 for each row
        try {                                                                     //GO through details of an employee
          if(singleRecord[objectKey] == undefined || singleRecord[objectKey] == "") {
            throw new EmptyFieldError("Field " + objectKey + " is empty. Please check the data.");
            break;
          }
          let tableCell = tableRow.insertCell(-1);                       // Insert cell in each row
          let cellContent = document.createTextNode(singleRecord[objectKey]); // Insert cell content
          tableCell.appendChild(cellContent);                                     // Append the cell content to the table cell
        } catch(error if error instanceof EmptyFieldError) {
            showError(error.name, error.message);;
        }
      }
      let editButton = document.createElement("button");
      editButton.innerText = "Edit";
      tableRow.insertCell(-1).appendChild(editButton);
      editButton.addEventListener("click", function(event) {
        //editRow(event.target.parentNode);                                         //Make each created row editable
        console.log("Clicked Edit");
      });
    }
    document.getElementById("nextButton").disabled = (tableStructure.currentPage == tableStructure.totalPages) ? true : false;
    document.getElementById("prevButton").disabled = (tableStructure.currentPage == 1) ? true : false;
  }
  scrollRecords(button) {
    let direction = button.innerText.toLowerCase();                                   // Direction - forward (next) or backward (prev)
    if((direction == "next") && (tableStructure.currentPage < tableStructure.totalPages)) {
      ++tableStructure.currentPage;
      this.getRecordsForPage(tableStructure.currentPage);
    }
    if((direction == "prev") && (tableStructure.currentPage > 1)) {
      --tableStructure.currentPage;
      this.getRecordsForPage(tableStructure.currentPage);
    }
  }
  removeRows(rowCount) {
    for(; rowCount > 0; --rowCount)
      tableStructure.tableElement.deleteRow(rowCount);
  }
}

let json = null;
document.addEventListener("DOMContentLoaded", () => json = new JsonData("http://127.0.0.1/emp_es6/employee.json","POST"));
let responseRecieved = new CustomEvent("ResponseRecieved");
document.addEventListener("ResponseRecieved", () => json.getRecordsForPage(tableStructure.currentPage));

function showError(name, message) {
  tableStructure.tableElement.style.display = 'none';
  let errorMessage = document.getElementById("tableErrorBox");
  errorMessage.style.display = 'block';
  errorMessage.innerHTML = "ERROR: <strong>" + name + "</strong>: " + message + "<br /> Returned Response: ";
}
