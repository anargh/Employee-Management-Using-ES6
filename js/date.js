const monthObj = {
  "jan" : {
            "name"  : "January",
            "monthIndex" : "01",
            "count" : "31"
          },
  "feb" : {
            "name"  : "February",
            "monthIndex" : "02",
            "count" : "28",
            "leapYearCount" : "29"
          },
  "mar" : {
            "name"  : "March",
            "monthIndex" : "03",
            "count" : "31"
          },
  "apr" : {
            "name"  : "April",
            "monthIndex" : "04",
            "count" : "30"
          },
  "may" : {
            "name"  : "May",
            "monthIndex" : "05",
            "count" : "31"
          },
  "jun" : {
            "name"  : "June",
            "monthIndex" : "06",
            "count" : "30"
          },
  "jul" : {
            "name"  : "July",
            "monthIndex" : "07",
            "count" : "31"
          },
  "aug" : {
            "name"  : "August",
            "monthIndex" : "08",
            "count" : "31"
          },
  "sep" : {
            "name"  : "September",
            "monthIndex" : "09",
            "count" : "30"
          },
  "oct" : {
            "name"  : "October",
            "monthIndex" : "10",
            "count" : "31"
          },
  "nov" : {
            "name"  : "November",
            "monthIndex" : "11",
            "count" : "30"
          },
  "dec" : {
            "name"  : "December",
            "monthIndex" : "12",
            "count" : "31"
          }
}

class Calendar {
  constructor() {
    this.day = document.getElementById("eDayDOB");
    this.month = document.getElementById("eMonthDOB");
    this.year = document.getElementById("eYearDOB");

  }

  createMonthOptions() {
    console.log("Called create month "+new Date(Date.now()).toLocaleString());
    let monthOptionElement = "";
    for(let objectKey in monthObj) {                                            //To create day options
      monthOptionElement = document.createElement("option");
      monthOptionElement.value = objectKey;
      monthOptionElement.innerText = monthObj[objectKey]["name"];
      this.month.appendChild(monthOptionElement);
    }
    console.log("Value: "+this.month.value);
    this.month.addEventListener("change", this.createDayOptions());               //Add listener for month value change.
  }

  createYearOptions() {
    console.log("Called create year "+new Date(Date.now()).toLocaleString());                                                  //Create year option element
    let currentYear = new Date().getFullYear();
    let yearOptionElement = "";
    for (let loopYear = currentYear - 60; loopYear < (currentYear - 18); ++loopYear) {
      yearOptionElement = document.createElement("option");
      this.year.appendChild(yearOptionElement);
      yearOptionElement.value = loopYear;
      yearOptionElement.innerText = loopYear;
    }
    this.year.addEventListener("change", this.createDayOptions());                  //Add listener for year value change.
  }

  createDayOptions() {
    console.log("Called create day "+new Date(Date.now()).toLocaleString());
    let selectedDay;                                                            //Create day options
    if(this.day.hasChildNodes()) {
      selectedDay = this.day.value;                                             //Remember the day selected previously
      removeChildElements(this.day.firstChild);                                            //Remove all child elements
    }
    console.log(this);
    let selectedYear = this.year.value;
    let selectedMonth = this.month.value;
    console.log("Value: "+this.month.value);
    let countOfDays = monthObj[selectedMonth]["count"];
    if(this.month.value == "feb" && isLeapYear(Number(this.year.value)))
      countOfDays = monthObj[this.month.value]["leapYearCount"];
    let dayOption = "";
    for(let loopIndex = 1; loopIndex <= parseInt(countOfDays) ; ++loopIndex) {  //Set day options according to month selected
      dayOption = document.createElement("option");
      let dayValue = "";
      if(loopIndex < 10) {                                                      //For 1 to 9, prepend 0. Eg: 1 is 01
        dayOption.setAttribute("value", Number("0"+loopIndex));
        dayOption.innerText = loopIndex;
      }
      else {
        dayOption.setAttribute("value", loopIndex);
        dayOption.innerText = loopIndex;
      }
      this.day.appendChild(dayOption);
      if(Number(selectedDay) == dayOption.value)
        this.day.value = loopIndex;                                     //If previously a day was selected, keep it. Else day will be set to 1
    }
  }

  setDateOptions(element, optionValue) {                                 //Set the date values in select elements
    if(element.hasChildNodes()) {
      let options = element.options;
      for(let loopIndex = 0; loopIndex < options.length; loopIndex++)
        if(options[loopIndex].value == optionValue)
          element.selectedIndex = loopIndex;
    }
  }
}

function removeChildElements(Element) {                                         //To remove child elements of an element
  while(Element.contains(Element.firstChild))
    Element.removeChild(Element.firstChild);
}

function isLeapYear(yearValue) {                                                //Check if given year is leap year
  yearValue = Number(yearValue);
  if(yearValue < 1900) return false;
  if(((yearValue % 4) == 0) && ((yearValue % 100) > 0) || ((yearValue % 400) == 0))
    return true;
  else
    return false;
}

document.addEventListener("DOMContentLoaded", () => {
  let calendar = new Calendar();
  calendar.createYearOptions();
  calendar.createMonthOptions();
  calendar.createDayOptions();
});
