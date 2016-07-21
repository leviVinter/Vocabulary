function showWordForm(e) {
    var x = document.getElementById("addWordForm");
    if (x.className === "addWordForm") {
        x.className = "show";
    } else {
        x.className = "addWordForm";
    }  
}

var h4 = document.getElementById("addWordHead");

h4.addEventListener("mouseup", showWordForm);

window.addEventListener("mousedown", function(e) {
    var x = document.getElementById("addWordForm");
    var y = document.getElementById("addWordHead");
    var z = e.target;
    if (z != x && z.parentNode != x && z.parentNode.parentNode != x && z != y) {
        document.getElementById("addWordForm").className = "addWordForm";
    }
});
