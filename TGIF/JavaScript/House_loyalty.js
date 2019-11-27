//GETTING DATA
var allHouseData = data.results[0].members;



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
var democrats = function (allHouseData) {
    allHouseData.forEach (d_member => {
        if (d_member.party == "D") {
            dTotal.push(d_member);     
        }  
    })
    console.log(dTotal);
}
democrats(allHouseData);

//REPUBLICANS
var rTotal = [];
var republicans = function (allHouseData) {
    allHouseData.forEach (r_member => {
        if (r_member.party == "R") {
            rTotal.push(r_member);     
        }  
    })
    console.log(rTotal);
}
republicans(allHouseData);

//INDEPENDENTS
var iTotal = [];
var independents = function (allHouseData) {
    allHouseData.forEach (i_member => {
        if (i_member.party == "I") {
            iTotal.push(i_member);  
        }  
    })
    console.log(iTotal);
}
independents(allHouseData);

// SIZE
var totalNumber = function(array, party_code) {
    return array.filter(member => member.party == party_code).length;
}
statistics.d_number = totalNumber(allHouseData, "D"); //placing on table
statistics.r_number = totalNumber(allHouseData, "R"); //placing on table
statistics.i_number = totalNumber(allHouseData, "I"); //placing on table
statistics.t_number = totalNumber(allHouseData, "D") + totalNumber(allHouseData, "R") + totalNumber(allHouseData, "I");


// AVERAGE VOTES WITH PARTY
var dvotesWithParty = []; //to store democrats voting data
var dVWP = function(dTotal) { //getting data
    dTotal.forEach(dmember => {
        dvotesWithParty.push(dmember.votes_with_party_pct);
    })
}
dVWP(dTotal);
var dvoteavg = dvotesWithParty => dvotesWithParty.reduce((a,b) => a + b, 0) / dvotesWithParty.length; //calculating avg
dvoteavg(dvotesWithParty);

var rvotesWithParty = []; //to store republicans voting data
var rVWP = function(rTotal) { //getting data
    rTotal.forEach(rmember => {
        rvotesWithParty.push(rmember.votes_with_party_pct);
    })
}
rVWP(rTotal);
var rvoteavg = rvotesWithParty => rvotesWithParty.reduce((a,b) => a + b, 0) / rvotesWithParty.length; //calculating avg
rvoteavg(rvotesWithParty);


var ivotesWithParty = [];
var iVWP = function(iTotal) { 
            if (iTotal.length > 0) {
                iTotal.forEach(imember => {
                ivotesWithParty.push(imember.votes_with_party_pct);
            })
        } else {
                ivotesWithParty.push(0);    
        }
}

iVWP(iTotal);

var ivoteavg = ivotesWithParty => ivotesWithParty.reduce((a,b) => a + b, 0) / ivotesWithParty.length; //calculating avg
ivoteavg(ivotesWithParty);


statistics.d_voteWithParty = dvoteavg(dvotesWithParty); //placing on table
statistics.r_voteWithParty = rvoteavg(rvotesWithParty); //placing on table
statistics.i_voteWithParty = ivoteavg(ivotesWithParty); //placing on table
statistics.a_votesWithParty = (dvoteavg(dvotesWithParty) + rvoteavg(rvotesWithParty) + ivoteavg(ivotesWithParty)) / 3;



//HOUSE AT A GLANCE TABLE
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
trow.insertCell().innerHTML = statistics.a_votesWithParty.toFixed(2) + "%";
tbody.appendChild(trow);
table.appendChild(tbody);

//LEAST LOYAL 10%
let leastLoyal = function(allHouseData) {
    let leastRef;
    let lLP = [];
    allHouseData.forEach(member => {
        lLP.push(member.votes_against_party_pct);
        leastRef = (lLP.sort((a, b) => (b - a)).slice(0, lLP.length / 100 * 10));
    })
    
    let finalResult = allHouseData.filter(member => member.votes_against_party_pct >= leastRef[leastRef.length -1]);
    
    return finalResult;    
}
leastLoyal(allHouseData);

var leastLoyalGroup = function(allHouseData) {
  var table = document.getElementById("least-loyal-table");
  var tbody = document.getElementById("least-loyal-body");
  leastLoyal(allHouseData).forEach (member => {
    var trow = document.createElement("tr");
    var fitSpace = " ";
    var fullname;
        if (member.middle_name == null) {
        fullname = (member.first_name + fitSpace + member.last_name).link(member.url);
        } else {
          fullname = (member.first_name + fitSpace + member.middle_name + fitSpace + member.last_name).link(member.url);
        }
    trow.insertCell().innerHTML = fullname;
    trow.insertCell().innerHTML = member.total_votes;
    trow.insertCell().innerHTML = member.votes_with_party_pct + "%";
    tbody.appendChild(trow); 
    })
    table.appendChild(tbody);
} 
leastLoyalGroup(allHouseData);

//MOST LOYAL 10%

let mostLoyal = function(allHouseData) {
    let mostRef;
    let mLP = [];
    allHouseData.forEach(member => {
        mLP.push(member.votes_with_party_pct);
        mostRef = (mLP.sort((a, b) => (b - a)).slice(0, mLP.length / 100 * 10));
    })
    console.log(mostRef);
    let finalResult = allHouseData.filter(member => member.votes_with_party_pct >= mostRef[mostRef.length -1]);
    
    return finalResult;    
}
mostLoyal(allHouseData);

var mostLoyalGroup = function(allHouseData) {
  var table = document.getElementById("most-loyal-table");
  var tbody = document.getElementById("most-loyal-body");
  mostLoyal(allHouseData).forEach (member => {
    var trow = document.createElement("tr");
    var fitSpace = " ";
    var fullname;
        if (member.middle_name == null) {
        fullname = (member.first_name + fitSpace + member.last_name).link(member.url);
        } else {
          fullname = (member.first_name + fitSpace + member.middle_name + fitSpace + member.last_name).link(member.url);
        }
    trow.insertCell().innerHTML = fullname;
    trow.insertCell().innerHTML = member.total_votes;
    trow.insertCell().innerHTML = member.votes_with_party_pct + "%";
    tbody.appendChild(trow); 
    })
    table.appendChild(tbody);
} 
mostLoyalGroup(allHouseData);



// TESTING
console.log(statistics);