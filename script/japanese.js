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
    var x = document.getElementById("number");
    var n = x.value;
    var tempCont = document.createDocumentFragment();
    var input = null;
    var label = null;
    for(var i = 0; i < n; i++) {
        label = document.createElement("label");
        label.setAttribute("for", i);
        label.setAttribute("class", "roadmapPlaces");
        label.innerHTML = i + 1;
        input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("name", i);
        input.setAttribute("class", "roadmapPlaces");
        tempCont.appendChild(label);
        tempCont.appendChild(input);
    }
    var br = document.createElement("br");
    tempCont.appendChild(br);
    var submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("id", "roadmapSubmit");
    submit.setAttribute("value", "Submit");
    submit.setAttribute("class", "roadmapPlaces");
    tempCont.appendChild(submit);
    
    document.getElementById("roadmapForm").appendChild(tempCont);
}
var activeBlock = null;
var word = document.getElementById("addWord");
var category = document.getElementById("addCategory");
var roadmaps = document.getElementById("roadmaps")
var addRoadmap = document.getElementById("addRoadmap");
var createInputs = document.getElementById("createInputs")

word.addEventListener("mouseup", toggleDropDown);
category.addEventListener("mouseup", toggleDropDown);
roadmaps.addEventListener("mouseup", toggleDropDown);
addRoadmap.addEventListener("mouseup", toggleDropDown);
createInputs.addEventListener("mouseup", createInputText);
window.addEventListener("mousedown", outsideClick);


