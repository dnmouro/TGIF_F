//GETTING DATA
var allSenateData = data.results[0].members;



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


//DEMOCRATS
var dTotal =[];
var democrats = function (allSenateData) {
    allSenateData.forEach (d_senator => {
        if (d_senator.party == "D") {
            dTotal.push(d_senator);     
        }  
    })
    console.log(dTotal);
}
democrats(allSenateData);

//REPUBLICANS
var rTotal = [];
var republicans = function (allSenateData) {
    allSenateData.forEach (r_senator => {
        if (r_senator.party == "R") {
            rTotal.push(r_senator);     
        }  
    })
    console.log(rTotal);
}
republicans(allSenateData);

//INDEPENDENTS
var iTotal = [];
var independents = function (allSenateData) {
    allSenateData.forEach (i_senator => {
        if (i_senator.party == "I") {
            iTotal.push(i_senator);  
        }  
    })
    console.log(iTotal);
}
independents(allSenateData);

// SIZE
var totalNumber = function(array, party_code) {
    return array.filter(senator => senator.party == party_code).length;
}
statistics.d_number = totalNumber(allSenateData, "D"); //placing on table
statistics.r_number = totalNumber(allSenateData, "R"); //placing on table
statistics.i_number = totalNumber(allSenateData, "I"); //placing on table
statistics.t_number = totalNumber(allSenateData, "D") + totalNumber(allSenateData, "R") + totalNumber(allSenateData, "I");


// AVERAGE VOTES WITH PARTY
var dvotesWithParty = []; //to store democrats voting data
var dVWP = function(dTotal) { //getting data
    dTotal.forEach(dsenator => {
        dvotesWithParty.push(dsenator.votes_with_party_pct);
    })
}
dVWP(dTotal);
var dvoteavg = dvotesWithParty => dvotesWithParty.reduce((a,b) => a + b, 0) / dvotesWithParty.length; //calculating avg
dvoteavg(dvotesWithParty);

var rvotesWithParty = []; //to store republicans voting data
var rVWP = function(rTotal) { //getting data
    rTotal.forEach(rsenator => {
        rvotesWithParty.push(rsenator.votes_with_party_pct);
    })
}
rVWP(rTotal);
var rvoteavg = rvotesWithParty => rvotesWithParty.reduce((a,b) => a + b, 0) / rvotesWithParty.length; //calculating avg
rvoteavg(rvotesWithParty);


var ivotesWithParty = []; //to store independents voting data
var iVWP = function(iTotal) { //getting data
    iTotal.forEach(isenator => {
        ivotesWithParty.push(isenator.votes_with_party_pct);
    })
}
iVWP(iTotal);
var ivoteavg = ivotesWithParty => ivotesWithParty.reduce((a,b) => a + b, 0) / ivotesWithParty.length; //calculating avg
ivoteavg(ivotesWithParty);

statistics.d_voteWithParty = dvoteavg(dvotesWithParty); //placing on table
statistics.r_voteWithParty = rvoteavg(rvotesWithParty); //placing on table
statistics.i_voteWithParty = ivoteavg(ivotesWithParty); //placing on table
statistics.a_votesWithParty = (dvoteavg(dvotesWithParty) + rvoteavg(rvotesWithParty) + ivoteavg(ivotesWithParty)) / 3; //placing on table


//SENATE AT A GLANCE TABLE
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

//LEAST LOYAL 10%
let leastLoyal = function(allSenateData) {
    let leastRef;
    let lLP = [];
    allSenateData.forEach(senator => {
        lLP.push(senator.votes_against_party_pct);
        leastRef = (lLP.sort((a, b) => (b - a)).slice(0, lLP.length / 100 * 10));
    })
    
    let finalResult = allSenateData.filter(senator => senator.votes_against_party_pct >= leastRef[leastRef.length -1]);
    
    return finalResult;    
}
leastLoyal(allSenateData);

var leastLoyalGroup = function(allSenateData) {
  var table = document.getElementById("least-loyal-table");
  var tbody = document.getElementById("least-loyal-body");
  leastLoyal(allSenateData).forEach (senator => {
    var trow = document.createElement("tr");
    var fitSpace = " ";
    var fullname;
        if (senator.middle_name == null) {
        fullname = (senator.first_name + fitSpace + senator.last_name).link(senator.url);
        } else {
          fullname = (senator.first_name + fitSpace + senator.middle_name + fitSpace + senator.last_name).link(senator.url);
        }
    trow.insertCell().innerHTML = fullname;
    trow.insertCell().innerHTML = senator.total_votes;
    trow.insertCell().innerHTML = senator.votes_with_party_pct + "%";
    tbody.appendChild(trow); 
    })
    table.appendChild(tbody);
} 
leastLoyalGroup(allSenateData);

//MOST LOYAL 10%

let mostLoyal = function(allSenateData) {
    let mostRef;
    let mLP = [];
    allSenateData.forEach(senator => {
        mLP.push(senator.votes_against_party_pct);
        mostRef = (mLP.sort((a, b) => (a - b)).slice(0, mLP.length / 100 * 10));
    })
    
    let finalResult = allSenateData.filter(senator => senator.votes_against_party_pct <= mostRef[mostRef.length -1]);
    
    return finalResult;    
}
mostLoyal(allSenateData);

var mostLoyalGroup = function(allSenateData) {
  var table = document.getElementById("most-loyal-table");
  var tbody = document.getElementById("most-loyal-body");
  mostLoyal(allSenateData).forEach (senator => {
    var trow = document.createElement("tr");
    var fitSpace = " ";
    var fullname;
        if (senator.middle_name == null) {
        fullname = (senator.first_name + fitSpace + senator.last_name).link(senator.url);
        } else {
          fullname = (senator.first_name + fitSpace + senator.middle_name + fitSpace + senator.last_name).link(senator.url);
        }
    trow.insertCell().innerHTML = fullname;
    trow.insertCell().innerHTML = senator.total_votes;
    trow.insertCell().innerHTML = senator.votes_with_party_pct + "%";
    tbody.appendChild(trow); 
    })
    table.appendChild(tbody);
} 
mostLoyalGroup(allSenateData);


// TESTING
console.log(statistics);