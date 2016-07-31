// Navigation

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
    if(n > 30) {
        n = 30;
    }
    if (!n) return;
    var tempCont = document.createDocumentFragment();
    var input = null;
    var label = null;
    for(var i = 0; i < n; i++) {
        label = document.createElement("label");
        label.setAttribute("for", i);
        label.setAttribute("class", "roadmapPlaces");
        if (i < 9) {
            label.innerHTML = "&nbsp&nbsp";
            label.innerHTML += i + 1;
        } else {
            label.innerHTML = i + 1;
        }
        input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("name", i);
        input.setAttribute("class", "roadmapPlaces");
        tempCont.appendChild(label);
        tempCont.appendChild(input);
    }
    var br = document.createElement("br");
    br.setAttribute("class", "roadmapPlaces");
    tempCont.appendChild(br);
    var submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("id", "roadmapSubmit");
    submit.setAttribute("value", "Add");
    submit.setAttribute("class", "submit roadmapPlaces");
    tempCont.appendChild(submit);
    
    document.getElementById("roadmapForm").appendChild(tempCont);
}
var activeBlock = null;
var addWord = document.getElementById("addWord");
var addCategory = document.getElementById("addCategory");
var roadmaps = document.getElementById("roadmaps");
var addRoadmap = document.getElementById("addRoadmap");
var createInputs = document.getElementById("createInputs");

addWord.addEventListener("mouseup", toggleDropDown);
addCategory.addEventListener("mouseup", toggleDropDown);
roadmaps.addEventListener("mouseup", toggleDropDown);
addRoadmap.addEventListener("mouseup", toggleDropDown);
createInputs.addEventListener("mouseup", createInputText);
window.addEventListener("mousedown", outsideClick);

// Vocabulary section
function ajaxRequest() {
    var request = null;
    try {
        request = new XMLHttpRequest();
    } catch(e1) {
        try {
            request = new ActiveXObject("Msxm12.XMLHTTP");
        } catch(e2) {
            try {
                request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e3) {
                request = false;
            }
        }
    }
    return request;
}
function createCategoryCont(arr) {
    var tempCont = document.createDocumentFragment();
    var n = arr.length;
    var li = null, div = null, form = null, label1 = null, label2 = null, label3 = null;
    var input1 = null, input2 = null, input3 = null, textarea = null, input4 = null;
    var liHtml = null;
    for (var i = 1; i < n; i++) {
        li = document.createElement("li");
        li.className = "liCont";
        liHtml =
            '<div class="hideDropDown">' +
                '<form>' +
                    '<label for="meaning">Meaning:</label>' +
                    '<input type="text" name="meaning" value="' + arr[i].meaning + '"><br>' +
                    '<label for="grammar">Grammar:</label>' +
                    '<input type="text" name="grammar" value="' + arr[i].grammar + '"><br>' +
                    '<label for="story">Story</label><br>' +
                    '<textarea name="story">' + arr[i].story + '</textarea>' +
                    '<br>' +
                    '<input type="submit" class="submit" value="Save Changes">' +
                '</form>' +
            '</div>';
        li.innerHTML = arr[i].word + liHtml;
        tempCont.appendChild(li);
    }
    var categoryBlock = document.getElementById(arr[0] + "Block");
    if(n > 1) {
        categoryBlock.children[0].appendChild(tempCont);
    }
    categoryBlock.className = "categoryCont";
    var liCont = document.getElementsByClassName("liCont");

    for (var i = 0; i < liCont.length; i++) {
        liCont[i].addEventListener("click", toggleActiveLi);
    }
}
function categoryContHandleResponse() {
    if (this.readyState == 4) {
        if (this.status == 200) {
            if (this.responseText !== null) {
                var arr = JSON.parse(this.responseText);
                createCategoryCont(arr);
            } else {
                alert("Ajax error: No data received");
            }
        } else {
            alert("Ajax error: " + this.statusText);
        }
    }
}

function toggleCategoryCont(e) {
    var x = document.getElementById(e.currentTarget.parentNode.id + "Block");
    if (!x.children[0].children[0] && x.className == "hideDropDown") {
        var id = e.currentTarget.parentNode.id;
        var params = "category=" + id;
        var request = new ajaxRequest();
        request.open("POST", "getWords.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.onreadystatechange = categoryContHandleResponse;
        request.send(params);
    } else {
        if (x.className == "hideDropDown") {
            x.className = "categoryCont";
        } else {
            x.className = "hideDropDown";
            var li = x.children[0].children;
            for (var i = 0; i < li.length; i++) {
                li[i].className = "liCont";
                li[i].children[0].className = "hideDropDown";
            }
        }
    }
}

var category = document.getElementsByClassName("category");

for(var i = 0; i < category.length; i++) {
    category[i].addEventListener("click", toggleCategoryCont);
}
function autoGrowTextArea(textArea) {
    var textField = textArea;
    if(textArea.target) {
        textField = textArea.target;
    }
    if (textField.clientHeight < textField.scrollHeight) {
        textField.style.height = textField.scrollHeight + "px";
        if (textField.clientHeight < textField.scrollHeight) {
            textField.style.height = 
            (textField.scrollHeight * 2 - textField.clientHeight) + "px";
        }
    }
}

var liCont = document.getElementsByClassName("liCont");

for (var i = 0; i < liCont.length; i++) {
    liCont[i].addEventListener("click", toggleActiveLi);
}

function toggleActiveLi(e) {
    var x = e.target;
    var child = x.children[0];
    if (x.className == "liCont") {
        x.className = "liCont activeLi";
    } else {
        x.className = "liCont";
    }
    if (child.className == "hideDropDown") {
        child.className = "description";
    } else {
        child.className = "hideDropDown";
    }
    var textarea = child.children[0].children[8];
    autoGrowTextArea(textarea);
    textarea.addEventListener("keyup", autoGrowTextArea);
}