function showForm(e) {
    var x = document.getElementById(e.currentTarget.id + "Form");
    if (activeForm) {
        if (x.id != activeForm) {
            document.getElementById(activeForm).className = "hideDropDown";
        }
    }
    if (x.className === "hideDropDown") {
        x.className = "showDropDown";
        activeForm = x.id;
    } else {
        x.className = "hideDropDown";
    }  
}
var activeForm = null;
var word = document.getElementById("addWord");
var category = document.getElementById("addCategory");

word.addEventListener("mouseup", showForm);
category.addEventListener("mouseup", showForm);

window.addEventListener("mousedown", function(e) {
    if (activeForm) {
        var x = document.getElementById(activeForm);
        var y = document.getElementById("addWord");
        var a = document.getElementById("addCategory");
        var z = e.target;
        if (z != x && z.parentNode != x && z.parentNode.parentNode != x && z != y && z != a) {
            document.getElementById(activeForm).className = "hideDropDown";
        }
    }
});
