
//GETTING DATA

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
      throw new Error(response.statusText);
    })
    .then(function(json) {
      data = json
      console.log(data)
      allSenateData = data.results[0].members;
      runAll(allSenateData);
    })
    .catch(function(error) {
      console.log("Request denied " + error.message)
    })
  }
  
getData();
    
function runAll() {
    democrats(allSenateData);
    republicans(allSenateData);
    independents(allSenateData);
    totalvotes(allSenateData)
    senateSize(allSenateData);
    senateAtAGlance(allSenateData);
    document.getElementById("load-spinner").style.display = "none";
    lessMV(allSenateData);
    mostEngaged(allSenateData);
    document.getElementById("load-spinner2").style.display = "none";
    mostMV(allSenateData);
    leastEngaged(allSenateData);
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
    i_votesWithParty: 0, //used
    a_votesWithParty: 0, //used
    d_voteAgainstParty: 0, 
    r_voteAgainstParty: 0, 
    d_missedMost: 0, 
    r_missedMost: 0, 
    d_missedLeast: 0, 
    d_missedLeast: 0
  }


// VOTING DATA BY PARTY

  //DEMOCRATS
let democrats = function (allSenateData) {
  let dTotal =[];
  allSenateData.forEach (d_senator => {
    if (d_senator.party == "D") {
      dTotal.push(d_senator.votes_with_party_pct);     
    }  
  }) 
  return statistics.d_voteWithParty = dTotal.reduce((a,b) => a + b, 0) / dTotal.length; //placing on table
}
  
  //REPUBLICANS  
let republicans = function (allSenateData) {
  let rTotal = [];
    allSenateData.forEach (r_senator => {
      if (r_senator.party == "R") {
        rTotal.push(r_senator.votes_with_party_pct);     
    }  
  })
  return statistics.r_voteWithParty = rTotal.reduce((a,b) => a + b, 0) / rTotal.length; //placing on table
}
  
  //INDEPENDENTS
let independents = function (allSenateData) {
  let iTotal = [];
  allSenateData.forEach (i_senator => {
    if (i_senator.party == "I") {
      iTotal.push(i_senator.votes_with_party_pct);  
    }  
  })
return statistics.i_voteWithParty = iTotal.reduce((a,b) => a+b, 0) / iTotal.length; //placing on table
}

  //TOTAL
let totalvotes = function (allSenateData) {
    let aTotal = [];
    allSenateData.forEach (senator => {
        aTotal.push(senator.votes_with_party_pct);
    })
    return statistics.a_votesWithParty = aTotal.reduce((a,b) => a + b, 0) /aTotal.length; //placing on table
}

// CALCULATING SIZE
function senateSize() {
  var totalNumber = function(array, party_code) {
    return array.filter(senator => senator.party == party_code).length;
  }
  statistics.d_number = totalNumber(allSenateData, "D"); //placing on table
  statistics.r_number = totalNumber(allSenateData, "R"); //placing on table
  statistics.i_number = totalNumber(allSenateData, "I"); //placing on table
  statistics.t_number = totalNumber(allSenateData, "D") + totalNumber(allSenateData, "R") + totalNumber(allSenateData, "I");
}


//SENATE AT A GLANCE TABLE
function senateAtAGlance() {
  var table = document.getElementById("senate-glance");
  var tbody = document.getElementById("sen-glance-body");
  var trow = document.getElementById("sen-glance-d");
  trow.insertCell().innerHTML = statistics.d_number;
  trow.insertCell().innerHTML = statistics.d_voteWithParty.toFixed(2) + "%";
  tbody.appendChild(trow);
  table.appendChild(tbody);

  var table = document.getElementById("senate-glance");
  var tbody = document.getElementById("sen-glance-body");
  var trow = document.getElementById("sen-glance-r");
  trow.insertCell().innerHTML = statistics.r_number;
  trow.insertCell().innerHTML = statistics.r_voteWithParty.toFixed(2) + "%";
  tbody.appendChild(trow);
  table.appendChild(tbody);

  var table = document.getElementById("senate-glance");
  var tbody = document.getElementById("sen-glance-body");
  var trow = document.getElementById("sen-glance-i");
  trow.insertCell().innerHTML = statistics.i_number;
  trow.insertCell().innerHTML = statistics.i_voteWithParty.toFixed(2) + "%";
  tbody.appendChild(trow);
  table.appendChild(tbody);

  var table = document.getElementById("senate-glance");
  var tbody = document.getElementById("sen-glance-body");
  var trow = document.getElementById("sen-glance-t");
  trow.insertCell().innerHTML = statistics.t_number;
  trow.insertCell().innerHTML = statistics.a_votesWithParty.toFixed(2) + "%";
  tbody.appendChild(trow);
  table.appendChild(tbody);
}


// SENATE 10% LESS MISSED VOTES
let lessMV = function(allSenateData) {
    let mostRef;
    let lMV = [];
    allSenateData.forEach(senator => {
        lMV.push(senator.missed_votes_pct);
        mostRef = (lMV.sort((a, b) => {return a - b}).slice(0, lMV.length / 100 * 10));
    })
    
    let finalResult = allSenateData.filter(senator => senator.missed_votes_pct <= mostRef[mostRef.length -1]);
    
    return finalResult;
}

var mostEngaged = function(allSenateData) {
  var table = document.getElementById("most-eng-table");
  var tbody = document.getElementById("most-eng-body");
  lessMV(allSenateData).forEach (senator => {
    var trow = document.createElement("tr");
    var fitSpace = " ";
    //var fullname = (senator.middle_name == null) ? fullname = senator.first_name + fitSpace + senator.lastname : fullname = senator.first_name + fitSpace + senator.middle_name + fitSpace + senator.last_name;
    var fullname;
        if (senator.middle_name == null) {
        fullname = (senator.first_name + fitSpace + senator.last_name).link(senator.url);
        } else {
          fullname = (senator.first_name + fitSpace + senator.middle_name + fitSpace + senator.last_name).link(senator.url);
        }
    trow.insertCell().innerHTML = fullname;
    trow.insertCell().innerHTML = senator.missed_votes;
    trow.insertCell().innerHTML = senator.missed_votes_pct + "%";
    tbody.appendChild(trow); 
    })
    table.appendChild(tbody);
} 


// SENATE 10% MOST MISSED VOTES
let mostMV = function(allSenateData) {
    let leastRef;
    let mMV = [];
    allSenateData.forEach(senator => {
        mMV.push(senator.missed_votes_pct);
        leastRef = (mMV.sort((a, b) => {return b - a}).slice(0, mMV.length / 100 * 10));
    })
    
    let finalResult = allSenateData.filter(senator => senator.missed_votes_pct >= leastRef[leastRef.length -1]);
    
    return finalResult;
}


var leastEngaged = function(allSenateData) {
  var table = document.getElementById("least-eng-table");
  var tbody = document.getElementById("least-eng-body");
  mostMV(allSenateData).forEach (senator => {
    var trow = document.createElement("tr");
    var fitSpace = " ";
    var fullname;
        if (senator.middle_name == null) {
        fullname = (senator.first_name + fitSpace + senator.last_name).link(senator.url);
        } else {
          fullname = (senator.first_name + fitSpace + senator.middle_name + fitSpace + senator.last_name).link(senator.url);
        }
    trow.insertCell().innerHTML = fullname;
    trow.insertCell().innerHTML = senator.missed_votes;
    trow.insertCell().innerHTML = senator.missed_votes_pct + "%";
    tbody.appendChild(trow); 
    }) 
    table.appendChild(tbody);
} 




// TESTING
console.log(statistics);