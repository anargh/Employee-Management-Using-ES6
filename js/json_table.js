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
class JsonData {
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
        if(jsonRequest.status == 200) {
          employeeJson = jsonRequest.response;
          document.dispatchEvent(responseRecieved);
          console.log("Response Recieved");
        }
        else
          throw new RequestError("There was a problem retrieving the requested resource.");
      }
      catch(error if error instanceof RequestError) {
        showError(error.name, error.message);
      }
    }
  }
}
//new JsonTabulated(1) for initializing table
class JsonTabulated {
  constructor() {
    this.printRecords(tableStructure.currentPage);
  }

  initTable(pages) {
    console.log("Initializing");
    if(pages > 1) {
      let prevButton = document.createElement("button");
      prevButton.id = "prevButton";
      prevButton.innerText = "Prev";
      prevButton.className = "emp-button";
      buttonContainer.appendChild(prevButton);
      const self = this;
      prevButton.addEventListener("click", function(event) {
        self.scrollRecords(event.target);
      });
      for(let loopIndex = 1; loopIndex <= tableStructure[totalPages]; loopIndex++) {
        let pageNumberButton = document.createElement("button");
        pageNumberButton.innerText = loopIndex;
        pageNumberButton.className = "emp-button";
        buttonContainer.appendChild(pageNumberButton);
        pageNumberButton.addEventListener("click", function(event) {
          currentPage = Number(event.target.innerText);
          self.printRecords(currentPage);
        });
      }
      let nextButton = document.createElement("button");
      nextButton.id = "nextButton";
      nextButton.innerText = "Prev";
      nextButton.className = "emp-button";
      buttonContainer.appendChild(nextButton);
      nextButton.addEventListener("click", function(event) {
        self.scrollRecords(event.target);
      });
    }
  }
  printRecords(page) {
    tableStructure.currentPage = page;
    let recordCount = Object.keys(employeeJson).length;
    tableStructure.totalPages = Math.ceil(recordCount / tableStructure.recordPerPage);
    if(tableStructure.isTableInit == false)
      this.initTable(tableStructure.totalPages);
    let startIndex = ((tableStructure.currentPage - 1) * tableStructure.recordPerPage) + 1,
        endIndex = startIndex + tableStructure.recordPerPage;
    this.removeRows(tableStructure[tableElement].rows.length - 1);
    singlePageRecords = employeeJson.slice(startIndex, endIndex);
  }
  scrollRecords(button) {
    direction = button.innerText.toLowerCase();                                   // Direction - forward (next) or backward (prev)
    if((direction == "next") && (tableStructure.currentPage < tableStructure.totalPages)) {
      ++currentPage;
      printRecords(tableStructure.currentPage);
    }
    if((direction == "prev") && (tableStructure.currentPage > 1)) {
      --currentPage;
      printRecords(tableStructure.currentPage);
    }
  }
  removeRows(rowCount) {
    for(; rowCount > 0; --rowCount)
      tableStructure[tableElement].deleteRow(rowCount);
  }
}
console.log("Here");
document.addEventListener("DOMContentLoaded", () => new JsonData("http://127.0.0.1/emp_es6/employee.json","POST"));
let responseRecieved = new CustomEvent("ResponseRecieved");
document.addEventListener("ResponseRecieved", () => new JsonTabulated);

function showError(name, message) {
  tableStructure.tableElement.style.display = 'none';
  let errorMessage = document.getElementById("tableErrorBox");
  errorMessage.style.display = 'block';
  errorMessage.innerHTML = "ERROR: <strong>" + name + "</strong>: " + message + "<br /> Returned Response: ";
}
