function toggleDropDown(e) {
    var x = document.getElementById(e.currentTarget.id + "Block");
    if (activeBlock) {
        if (x.id != activeBlock && x.parentNode.id != activeBlock) {
            var a = document.getElementById(activeBlock);
            a.className = "hideDropDown";
            if (a.parentNode.className == "showDropDown") {
                a.parentNode.className = "hideDropDown";
            }
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
        var ar = document.getElementById("addRoadmap");
        var t = e.target;
        if (t != a && t.parentNode != a && t.parentNode.parentNode != a && 
            t.parentNode.parentNode != a &&
            t != w && t != c && t != r && t != ar) {
            var active = document.getElementById(activeBlock);
            active.className = "hideDropDown";
            if (active.parentNode.className == "showDropDown") {
                active.parentNode.className = "hideDropDown";
            }
        }
    }
}
var activeBlock = null;
var word = document.getElementById("addWord");
var category = document.getElementById("addCategory");
var roadmaps = document.getElementById("roadmaps")
var addRoadmap = document.getElementById("addRoadmap");

word.addEventListener("mouseup", toggleDropDown);
category.addEventListener("mouseup", toggleDropDown);
roadmaps.addEventListener("mouseup", toggleDropDown);
addRoadmap.addEventListener("mouseup", toggleDropDown);
window.addEventListener("mousedown", outsideClick);
