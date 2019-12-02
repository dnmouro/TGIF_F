//GETTING DATA
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
      console.log(data)
      allHouseData = data.results[0].members;
      runAll(allHouseData);
    })
    .catch(function(error) {
      console.log("Request denied " + error.message)
    })
  }
  
getData();

function runAll() {
    democrats(allHouseData);
    republicans(allHouseData);
    independents(allHouseData);
    totalvotes(allHouseData);
    houseSize(allHouseData);
    houseAtAGlance(allHouseData);
    document.getElementById("load-spinner").style.display = "none";
    lessMV(allHouseData);
    mostEngaged(allHouseData);
    document.getElementById("load-spinner2").style.display = "none";
    mostMV(allHouseData);
    leastEngaged(allHouseData);
    document.getElementById("load-spinner3").style.display = "none";
}


// STATS OBJECT
var statistics = {
    d_number: 0, //used
    r_number: 0, //used
    i_number: 0, //used
    t_number: 0, //used
    d_voteWithParty: 0, //used
    r_voteWithParty: 0, //used
    i_voteWithParty: 0, //used
    a_voteWithParty: 0, //used
    d_voteAgainstParty: 0, 
    r_voteAgainstParty: 0, 
    d_missedMost: 0, 
    r_missedMost: 0, 
    d_missedLeast: 0, 
    d_missedLeast: 0
}

// VOTING DATA BY PARTY

    //DEMOCRATS
let democrats = function (allHouseData) {
  let dTotal =[];
  allHouseData.forEach (d_member => {
    if (d_member.party == "D") {
      dTotal.push(d_member.votes_with_party_pct);     
    }  
  })
  return statistics.d_voteWithParty = dTotal.reduce((a, b) => a + b, 0) / dTotal.length; //placing on table
}

    //REPUBLICANS
let republicans = function (allHouseData) {
  let rTotal = [];
  allHouseData.forEach (r_member => {
    if (r_member.party == "R") {
      rTotal.push(r_member.votes_with_party_pct);     
    }  
  })
  return statistics.r_voteWithParty = rTotal.reduce((a, b) => a + b, 0) / rTotal.length;//placing on table
}

    //INDEPENDENTS
let independents = function (allHouseData) {
  let iTotal = [];
  allHouseData.forEach (i_member => {
    if (i_member.party == "I" && iTotal.length > 0) {
      iTotal.push(i_member.votes_with_party_pct);  
    } else {
        iTotal.push(0);
    }  
  })
  return statistics.i_voteWithParty = iTotal.reduce((a, b) => a + b) / iTotal.length; //placing on table
}

    //TOTAL
let totalvotes = function(allHouseData) {
  let aTotal = [];
  allHouseData.forEach (member => {
    aTotal.push(member.votes_with_party_pct);
  })
  return statistics.a_voteWithParty = aTotal.reduce((a, b) => a + b) / aTotal.length; //placing on table
}


// CALCULATING SIZE
function houseSize() {
  var totalNumber = function(array, party_code) {
    return array.filter(member => member.party == party_code).length;
  }
  statistics.d_number = totalNumber(allHouseData, "D"); //placing on table
  statistics.r_number = totalNumber(allHouseData, "R"); //placing on table
  statistics.i_number = totalNumber(allHouseData, "I"); //placing on table
  statistics.t_number = totalNumber(allHouseData, "D") + totalNumber(allHouseData, "R") + totalNumber(allHouseData, "I");
}


//HOUSE AT A GLANCE TABLE
function houseAtAGlance() {
  var table = document.getElementById("house-glance");
  var tbody = document.getElementById("house-glance-body");
  var trow = document.getElementById("house-glance-d");
  trow.insertCell().innerHTML = statistics.d_number;
  trow.insertCell().innerHTML = statistics.d_voteWithParty.toFixed(2) + "%";
  tbody.appendChild(trow);
  table.appendChild(tbody);

  var table = document.getElementById("house-glance");
  var tbody = document.getElementById("house-glance-body");
  var trow = document.getElementById("house-glance-r");
  trow.insertCell().innerHTML = statistics.r_number;
  trow.insertCell().innerHTML = statistics.r_voteWithParty.toFixed(2) + "%";
  tbody.appendChild(trow);
  table.appendChild(tbody);

  var table = document.getElementById("house-glance");
  var tbody = document.getElementById("house-glance-body");
  var trow = document.getElementById("house-glance-i");
  trow.insertCell().innerHTML = statistics.i_number;
  trow.insertCell().innerHTML = statistics.i_voteWithParty.toFixed(2) + "%";
  tbody.appendChild(trow);
  table.appendChild(tbody);

  var table = document.getElementById("house-glance");
  var tbody = document.getElementById("house-glance-body");
  var trow = document.getElementById("house-glance-t");
  trow.insertCell().innerHTML = statistics.t_number;
  trow.insertCell().innerHTML = statistics.a_voteWithParty.toFixed(2) + "%";
  tbody.appendChild(trow);
  table.appendChild(tbody);
}


// HOUSE 10% LESS MISSED VOTES
let lessMV = function(allHouseData) {
  let mostRef;
  let lMV = [];
  allHouseData.forEach(member => {
    lMV.push(member.missed_votes_pct);
    mostRef = (lMV.sort((a, b) => (a - b)).slice(0, lMV.length / 100 * 10));
  })
  let finalResult = allHouseData.filter(member => member.missed_votes_pct <= mostRef[mostRef.length -1]);
return finalResult;
}

let mostEngaged = function(allHouseData) {
  let table = document.getElementById("most-eng-table");
  let tbody = document.getElementById("most-eng-body");
  lessMV(allHouseData).forEach (member => {
    let trow = document.createElement("tr");
    let fitSpace = " ";
    let fullname;
        if (member.middle_name == null) {
        fullname = (member.first_name + fitSpace + member.last_name).link(member.url);
        } else {
          fullname = (member.first_name + fitSpace + member.middle_name + fitSpace + member.last_name).link(member.url);
        }
    trow.insertCell().innerHTML = fullname;
    trow.insertCell().innerHTML = member.missed_votes;
    trow.insertCell().innerHTML = member.missed_votes_pct + "%";
    tbody.appendChild(trow); 
    })
  table.appendChild(tbody);
} 


// HOUSE 10% MOST MISSED VOTES
let mostMV = function(allHouseData) {
    let leastRef;
    let mMV = [];
    allHouseData.forEach(member => {
        mMV.push(member.missed_votes_pct);
        leastRef = (mMV.sort((a, b) => {return b - a}).slice(0, mMV.length / 100 * 10));
    })
    
    let finalResult = allHouseData.filter(member => member.missed_votes_pct >= leastRef[leastRef.length -1]);
    
    return finalResult;
}


let leastEngaged = function(allHouseData) {
  let table = document.getElementById("least-eng-table");
  let tbody = document.getElementById("least-eng-body");
  mostMV(allHouseData).forEach (member => {
    let trow = document.createElement("tr");
    let fitSpace = " ";
    let fullname;
        if (member.middle_name == null) {
        fullname = (member.first_name + fitSpace + member.last_name).link(member.url);
        } else {
          fullname = (member.first_name + fitSpace + member.middle_name + fitSpace + member.last_name).link(member.url);
        }
    trow.insertCell().innerHTML = fullname;
    trow.insertCell().innerHTML = member.missed_votes;
    trow.insertCell().innerHTML = member.missed_votes_pct + "%";
    tbody.appendChild(trow); 
    }) 
  table.appendChild(tbody);
} 

// TESTING
console.log(statistics);