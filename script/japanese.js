function toggleDropDown(e) {
    var x = document.getElementById(e.currentTarget.id + "Block");
    if (activeBlock) {
        if (x.id != activeBlock && x.parentNode.id != activeBlock) {
            var a = document.getElementById(activeBlock);
            a.className = "hideDropDown";
            if (a.parentNode.className == "showDropDown") {
                a.parentNode.className = "hideDropDown";
                if (x == a.parentNode) {
                    return;
                }
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
            t != w && t != c && t != r && t != ar) {
            var active = document.getElementById(activeBlock);
            active.className = "hideDropDown";
            if (active.parentNode.className == "showDropDown") {
                active.parentNode.className = "hideDropDown";
            }
        }
    }
}
function createInputText(e) {
    if(document.getElementsByClassName("roadmapPlaces")) {
        var removeInput = document.getElementsByClassName("roadmapPlaces");
        var n = removeInput.length;
        for(var i = 0; i < n; i++) {
            removeInput[0].parentNode.removeChild(removeInput[0]);
        }
    }
    var x = document.getElementById(e.currentTarget.id);
    var n = x.options[x.selectedIndex].value;
    var div = document.createDocumentFragment();
    var input = null;
    for(var i = 0; i < n; i++) {
        input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("class", "roadmapPlaces")
        div.appendChild(input);
    }
    var br = document.createElement("br");
    div.appendChild(br);
    var submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("value", "Submit");
    submit.setAttribute("class", "roadmapPlaces");
    div.appendChild(submit);
    
    document.getElementById("roadmapForm").appendChild(div);
}
var activeBlock = null;
var word = document.getElementById("addWord");
var category = document.getElementById("addCategory");
var roadmaps = document.getElementById("roadmaps")
var addRoadmap = document.getElementById("addRoadmap");
var selectRoadmap = document.getElementById("selectRoadmap");

word.addEventListener("mouseup", toggleDropDown);
category.addEventListener("mouseup", toggleDropDown);
roadmaps.addEventListener("mouseup", toggleDropDown);
addRoadmap.addEventListener("mouseup", toggleDropDown);
selectRoadmap.addEventListener("change", createInputText);
window.addEventListener("mousedown", outsideClick);


