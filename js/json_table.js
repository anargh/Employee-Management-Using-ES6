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
    let jsonRequest = new XMLHttpRequest();
    jsonRequest.open(requestMethod, url);
    jsonRequest.responseType = this.responseType;
    jsonRequest.send();
    jsonRequest.onreadystatechange = () => {
      try {
        if(jsonRequest.status == 200)
          employeeJson = jsonRequest.response;
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
class JsonTabulated extends JsonData {
  constructor() {
    this.printRecords(tableStructure[currentPage]);
  }

  initTable(pages) {
    if(pages > 1) {
      let prevButton = document.createElement("button");
      prevButton.id = "prevButton";
      prevButton.innerText = "Prev";
      prevButton.className = "emp-button";
      buttonContainer.appendChild(prevButton);
    }
  }
  printRecords(page) {
    let recordCount = Object.keys(employeeJson).length;
    tableStructure.totalPages = Math.ceil(recordCount / tableStructure.recordPerPage);
    if(tableStructure[isTableInit] == false)
      this.initTable(tableStructure.totalPages);
    let startIndex = ((currentPage - 1) * recordPerPage) + 1,
        endIndex = startIndex + recordPerPage;
    this.removeRows(tableStructure[tableElement].rows.length - 1);
    singlePageRecords = employeeJson.slice(startIndex, endIndex);
  }
  removeRows(rowCount) {
    for(; rowCount > 0; --rowCount)
      tableStructure[tableElement].deleteRow(rowCount);
  }
}

function showError(name, message) {
  tableElement.style.display = 'none';
  var errorMessage = document.getElementById("tableErrorBox");
  errorMessage.style.display = 'block';
  errorMessage.innerHTML = "ERROR: <strong>" + name + "</strong>: " + message + "<br /> Returned Response: " +jsonRequest.status+": "+jsonRequest.statusText;
}
