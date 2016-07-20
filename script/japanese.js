function showWordForm(e) {
    var x = document.getElementById("wordForm");
    var y = e.target.parentNode;
    if (x.className === "wordForm") {
        x.className = "show";
    } else if (e.target != x && y != x && y.parentNode != x && y.parentNode.parentNode != x) {
        x.className = "wordForm";
    }
}
var addWord = document.getElementById("addWord");


addWord.addEventListener("mouseup", showWordForm);

window.addEventListener("mousedown", function(e) {
    var x = document.getElementById("addWord");
    var y = e.target.parentNode;
    if (y.parentNode != null) {
        if (e.target != x && y != x && y.parentNode != x && y.parentNode.parentNode != x) {
            document.getElementById("wordForm").className = "wordForm";
        }
    } else if (e.target != x && y != x && y.parentNode != x) {
        document.getElementById("wordForm").className = "wordForm";
    }
});
