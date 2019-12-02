
//Read More Button
 

function myFunction() {
    var x = document.getElementById("butMoLe").getAttribute("aria-expanded"); 
    console.log(x);
    if (x == "true") 
    {
    document.getElementById("butMoLe").innerHTML = "Read More";
    } else {
    document.getElementById("butMoLe").innerHTML = "Read Less";
    }
    
}
document.getElementById("butMoLe").addEventListener("click", () => myFunction());

