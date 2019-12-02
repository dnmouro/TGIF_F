function getData() {

  fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
    method: "GET",
    headers: {
      "X-API-KEY":"fO45V24YhZk3uH43ic0AHoLhP279hWBXRF6IqpTp"
    }
  })
  .then(function(response) {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(function(json) {
    data = json
    houseArray = data.results[0].members;
    runAll(houseArray);
  })
  .catch(function(error) {
    console.log("Request denied " + error.message)
  })
}

getData();

function runAll() {
  accessall(houseArray);
  stateList(houseArray);
  document.getElementById("load-spinner").style.display = "none";
}


//TABLE

var accessall = function(houseArray) {
  var table = document.getElementById("house-data");
  var tbody = document.getElementById("house-body");
  houseArray.forEach (representative => {
    var trow = document.createElement("tr");
    var fitSpace = " ";
    var fullname;
      if (representative.middle_name == null) {
      fullname = representative.first_name + fitSpace + representative.last_name;
      } else {
        fullname = representative.first_name + fitSpace + representative.middle_name + fitSpace + representative.last_name;
        }
    var representativePage = fullname.link(representative.url)    
    trow.insertCell().innerHTML = representativePage;
    trow.insertCell().innerHTML = representative.party;
    trow.insertCell().innerHTML = representative.state;
    trow.insertCell().innerHTML = representative.seniority;
    trow.insertCell().innerHTML = representative.votes_with_party_pct + "%";
    tbody.appendChild(trow);
  })
  table.appendChild(tbody);
}


// BUILDING STATE DROPBOX
let getState = function (houseArray) {
  let stateArray =[]; // to collect all states
  houseArray.forEach (representative => {
    stateArray.push(representative.state);  
  })
  return (stateArray = [...new Set(stateArray.sort())]);//deleting duplicates and sorting by alpha
}

let stateList = function (houseArray) {
  let stateArray = getState(houseArray)
  let optionS = document.getElementById("form-group");
  for (i = 0; i < stateArray.length; i++) {
    let gOptions = document.createElement("option");
    gOptions.innerHTML = stateArray[i];
    optionS.appendChild(gOptions);
  }
}


//PARTY FILTERS

  //storing the selection
  function choiceArray() {
    document.getElementById("form-group").addEventListener("change", () => filterAll());
    Array.from(document.querySelectorAll("input[name=checkbox]"))
    .forEach (sel => sel.addEventListener("change", () => filterAll()));
  }
  choiceArray();


  function filterAll() {
    let filteredMembers = [];
    document.getElementById("house-body").innerHTML = "";
    var checkResult = Array.from(document.querySelectorAll("input[name=checkbox]:checked")).map(function(oninput) {return oninput.value}); //getting the value
    var checkState = document.getElementById("form-group").value;
    console.log(checkState);
    if (checkResult.length == 0 && checkState == "ALL") {
      accessall(houseArray);
    }
    if (checkResult.length == 0 && checkState !== "ALL") {
      accessall(houseArray.filter(member => member.state == checkState));
    }
    if (checkResult.length > 0 && checkState == "ALL") {
      document.getElementById("house-body").innerHTML = "";
      houseArray.forEach(validate => {
        if (checkResult.includes(validate.party)){
          document.getElementById("house-body").innerHTML = "";
          filteredMembers.push(validate);
          accessall(filteredMembers);
        }
      })
    }
    if (checkResult.length > 0 && checkState !== "ALL") {
      document.getElementById("house-body").innerHTML = "";
      houseArray.forEach(validate => {
        if (checkResult.includes(validate.party)){
          document.getElementById("house-body").innerHTML = "";
          filteredMembers.push(validate);
          accessall(filteredMembers.filter(member => member.state == checkState));
        }
      })
    }
  } 

