function toggleDropDown(e) {
    var x = document.getElementById(e.currentTarget.id + "Block");
    if (activeBlock) {
        if (x.id != activeBlock) {
            document.getElementById(activeBlock).className = "hideDropDown";
        }
    }
    if (x.className === "hideDropDown") {
        x.className = "showDropDown";
        activeBlock = x.id;
    } else {
        x.className = "hideDropDown";
    }  
}
function outsideClick(e) {
    if (activeBlock) {
        var a = document.getElementById(activeBlock);
        var w = document.getElementById("addWord");
        var c = document.getElementById("addCategory");
        var r = document.getElementById("roadmaps");
        var t = e.target;
        if (t != a && t.parentNode != a && t.parentNode.parentNode != a && 
            t != w && t != c && t != r) {
            document.getElementById(activeBlock).className = "hideDropDown";
        }
    }
}
var activeBlock = null;
var word = document.getElementById("addWord");
var category = document.getElementById("addCategory");
var roadmaps = document.getElementById("roadmaps")

word.addEventListener("mouseup", toggleDropDown);
category.addEventListener("mouseup", toggleDropDown);
roadmaps.addEventListener("mouseup", toggleDropDown);
window.addEventListener("mousedown", outsideClick);
