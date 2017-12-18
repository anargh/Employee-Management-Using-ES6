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
const REQUEST_STATUS_OK = 200;
//JSON DATA CLASS
class JsonXhrRequest {
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
        if(jsonRequest.status == REQUEST_STATUS_OK  && jsonRequest.readyState == 4) {
          employeeJson = jsonRequest.response;
          document.dispatchEvent(responseRecieved);
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
class JsonData extends JsonXhrRequest {
  constructor(url, requestMethod) {
    super(url, requestMethod)
  }

  initTable(pages) {
    if(pages > 1) {
      let buttonContainer = document.querySelector('.button-container');
      let prevButton = document.createElement("button");
      prevButton.id = "prevButton";
      prevButton.innerText = "prev";
      prevButton.className = "emp-button";
      buttonContainer.appendChild(prevButton);
      const self = this;
      prevButton.addEventListener("click", (event) => this.scrollRecords(event.target));
      for(let loopIndex = 1; loopIndex <= tableStructure.totalPages; loopIndex++) {
        let pageNumberButton = document.createElement("button");
        pageNumberButton.innerText = loopIndex;
        pageNumberButton.className = "emp-button";
        buttonContainer.appendChild(pageNumberButton);
        pageNumberButton.addEventListener("click", (event) => {
          tableStructure.currentPage = Number(event.target.innerText);
          self.getRecordsForPage(tableStructure.currentPage);
        });
      }
      let nextButton = document.createElement("button");
      nextButton.id = "nextButton";
      nextButton.innerText = "next";
      nextButton.className = "emp-button";
      buttonContainer.appendChild(nextButton);
      nextButton.addEventListener("click", (event) => self.scrollRecords(event.target));
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
    for(let objectKey in records) {                                             //Get each employee's detail

      let tableRow = tableStructure.tableElement.insertRow(-1);
      let singleRecord = records[objectKey];                                    //Store all details of one employee
      for(let objectKey in singleRecord) {                                       //Insert each row. Row count = 0 initially.                                                           //INITIALIZE to -1 for each row
        try {                                                                   //GO through details of an employee
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
      const self = this;
      editButton.addEventListener("click", (event) => self.editRow(event.target.parentNode));                                         //Make each created row editable
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
  editRow(cellElement) {
    let parentRow = cellElement.parentNode;
    for(let loopIndex = 1; loopIndex < parentRow.childNodes.length - 1; loopIndex++) {
      let input = document.createElement("input");
      input.type = "text";
      input.size = "7";
      input.value = parentRow.childNodes[loopIndex].innerText;
      parentRow.childNodes[loopIndex].innerText = "";
      parentRow.childNodes[loopIndex].appendChild(input);
    }
    cellElement.getElementsByTagName("button")[0].remove();
    let update = document.createElement("button");
    update.innerText = "Update";
    cellElement.appendChild(update);
    const self = this;
    update.addEventListener("click", (event) => {
      let cellElement = event.target.parentNode;
      self.updateRow(cellElement, update);
    });
  }

  updateRow(cellElement, button) {
    let parentRow = cellElement.parentNode;
    let input = parentRow.querySelectorAll("input");
    for(let loopIndex = 0; loopIndex < input.length; loopIndex++) {
      let inputValue = document.createTextNode(input[loopIndex].value);
      input[loopIndex].parentNode.replaceChild(inputValue, input[loopIndex]);
    }
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    cellElement.replaceChild(editButton, button);
    this.printUpdatedRows(parentRow);
    const self = this;
    editButton.addEventListener("click", (event) =>  self.editRow(event.target.parentNode));
  }

  printUpdatedRows(tableRow) {
    let container, table;
    if(document.querySelector(".updatedRows table") == null) {
      container = document.querySelector(".updatedRows");
      table = document.createElement("table");
      table.className = "showdata";
      table.createCaption().appendChild(document.createTextNode("Updated Rows"));
      table.createCaption().className = "heading";
      container.appendChild(table);
      this.fillHeaders(table);
    }
    table = document.querySelector(".updatedRows table");
    this.checkRowExists(tableRow.childNodes[0], table);                                                     // Was the row previously updated? If so, remove old row.
    let row = table.insertRow(-1);
    let loopIndex = 0;
    while(loopIndex < tableRow.childNodes.length - 1) {
      let cell = row.insertCell(-1);
      cell.appendChild(document.createTextNode(tableRow.childNodes[loopIndex].innerText));
      loopIndex++;
    }
  }

  fillHeaders(table) {
    let row = table.insertRow();
    let headerTitle = ["ACEID", "Name", "Date of Birth", "Salary", "Phone", "Email"];
    for(let loopIndex = 0; loopIndex < headerTitle.length; loopIndex++) {
      row.insertCell(loopIndex).innerText = headerTitle[loopIndex];
    }
  }

  checkRowExists(aceIdCell, table) {
    for(let loopIndex = 1; loopIndex < table.rows.length; loopIndex++) {
      if(aceIdCell.innerText == table.rows[loopIndex].childNodes[0].innerText) {
        table.deleteRow(table.rows[loopIndex].rowIndex);
        return;
      }
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
