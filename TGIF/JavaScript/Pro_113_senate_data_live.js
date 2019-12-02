function getData() {

  fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
    method: "GET",
    headers: {
      "X-API-KEY":"fO45V24YhZk3uH43ic0AHoLhP279hWBXRF6IqpTp"
    }
  })
  .then(function(response) {
    if (response.ok) {
      return response.json();
    }
    throw new Error(respoinse.statusText);
  })
  .then(function(json) {
    data = json
    senatorsArray = data.results[0].members;
    runAll(senatorsArray);
  })
  .catch(function(error) {
    console.log("Request denied " + error.message)
  })
}

getData();


function runAll() {
  accessall(senatorsArray);
  stateList(senatorsArray);
  document.getElementById("load-spinner").style.display = "none";
}



//TABLE
var accessall = function(senatorsArray) {
  var table = document.getElementById("senate-data");
  var tbody = document.getElementById("senate-body");
  senatorsArray.forEach (senator => {
    var trow = document.createElement("tr");
    var fitSpace = " ";
    var fullname;
        if (senator.middle_name == null) {
        fullname = senator.first_name + fitSpace + senator.last_name;
        } else {
          fullname = senator.first_name + fitSpace + senator.middle_name + fitSpace + senator.last_name;
        }
    var senatorPage = fullname.link(senator.url);
    trow.insertCell().innerHTML = senatorPage;
    trow.insertCell().innerHTML = senator.party;
    trow.insertCell().innerHTML = senator.state;
    trow.insertCell().innerHTML = senator.seniority;
    trow.insertCell().innerHTML = senator.votes_with_party_pct + "%";
    tbody.appendChild(trow); 
    })
    table.appendChild(tbody);
} 


//BUILDING STATE DROPBOX
let getState = function (senatorsArray) {
  let stateArray =[]; // to collect all states
  senatorsArray.forEach (senator => {
    stateArray.push(senator.state);  
  })
  return (stateArray = [...new Set(stateArray.sort())]);//deleting duplicates and sorting by alpha
}

let stateList = function (senatorsArray) {
  let stateArray = getState(senatorsArray);
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
  document.getElementById("senate-body").innerHTML = "";
  var checkResult = Array.from(document.querySelectorAll("input[name=checkbox]:checked")).map(function(oninput) {return oninput.value}); //getting the value
  var checkState = document.getElementById("form-group").value;
  console.log(checkState);
  if (checkResult.length == 0 && checkState == "ALL") {
    accessall(senatorsArray);
  }
  if (checkResult.length == 0 && checkState !== "ALL") {
    accessall(senatorsArray.filter(member => member.state == checkState));
  }
  if (checkResult.length > 0 && checkState == "ALL") {
    document.getElementById("senate-body").innerHTML = "";
    senatorsArray.forEach(validate => {
      if (checkResult.includes(validate.party)){
        document.getElementById("senate-body").innerHTML = "";
        filteredMembers.push(validate);
        accessall(filteredMembers);
      }
    })
  }
  if (checkResult.length > 0 && checkState !== "ALL") {
    document.getElementById("senate-body").innerHTML = "";
    senatorsArray.forEach(validate => {
      if (checkResult.includes(validate.party)){
        document.getElementById("senate-body").innerHTML = "";
        filteredMembers.push(validate);
        accessall(filteredMembers.filter(member => member.state == checkState));
      }
    })
  }
} 

//SPINNER

//$(window).load(function() {
  // Animate loader off screen
//  $("#load-spinner").fadeOut("slow");;
//});



