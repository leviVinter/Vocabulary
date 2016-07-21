function showWordForm(e) {
    var x = document.getElementById("wordForm");
    if (x.className === "wordForm") {
        x.className = "show";
    } else {
        x.className = "wordForm";
    }  
}

var h4 = document.getElementById("h4");

h4.addEventListener("mouseup", showWordForm);

window.addEventListener("mousedown", function(e) {
    var x = document.getElementById("wordForm");
    var y = e.target.parentNode;
    if (e.target != x && y != x && y.parentNode != x) {
        document.getElementById("wordForm").className = "wordForm";
    }
});
