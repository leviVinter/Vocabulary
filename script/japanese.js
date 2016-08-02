// Navigation

function toggleDropDown(e) {
    e.preventDefault();
    var x = document.getElementById(e.currentTarget.id + "Block");
    if (activeBlock) {
        if (x.id != activeBlock && x.parentNode.id != activeBlock) {
            // Hide other dropdown
            var a = document.getElementById(activeBlock);
            a.className = "hideDropDown";
            if (a.parentNode.className == "showDropDown") {
                // Also hide Add New Memory Palace's parent
                a.parentNode.className = "hideDropDown";
                if (x == a.parentNode) {
                    // Avoid re-showing parent
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
    // Close Memory Palace list
    var mpList = document.getElementsByClassName("mpList activeMpList");
    var mpListForm = document.getElementsByClassName("activeMpListForm");
    while (mpList) {
        mpList[0].className = "mpList";
        mpListForm[0].className = "hideDropDown";
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
            var mpList = document.getElementsByClassName("mpList activeMpList");
            var mpListForm = document.getElementsByClassName("activeMpListForm");
            while (mpList) {
                mpList[0].className = "mpList";
                mpListForm[0].className = "hideDropDown";
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
    submit.setAttribute("type", "button");
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

addWord.addEventListener("click", toggleDropDown);
addCategory.addEventListener("click", toggleDropDown);
roadmaps.addEventListener("click", toggleDropDown);
addRoadmap.addEventListener("click", toggleDropDown);
createInputs.addEventListener("click", createInputText);
window.addEventListener("click", outsideClick);

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
function createCategoryCont(arr) {
    var n = arr.length;
    var li = "";
    for (var i = 1; i < n; i++) {
        li +=
            '<li class="liCont">' + arr[i].word +
                '<div class="hideDropDown">' +
                    '<form>' +
                        '<label for="meaning">Meaning:</label>' +
                        '<input type="text" name="meaning" value="' + arr[i].meaning + '"><br>' +
                        '<label for="grammar">Grammar:</label>' +
                        '<input type="text" name="grammar" value="' + arr[i].grammar + '"><br>' +
                        '<label for="story">Story</label><br>' +
                        '<textarea name="story">' + arr[i].story + '</textarea>' +
                        '<br>' +
                        '<input type="button" class="submit" value="Save Changes">' +
                    '</form>' +
                '</div>' +
            '</li>';
    }
    var id = arr[0].replace(/\s/g, "");
    var categoryBlock = document.getElementById(id + "Block");
    if(n > 1) {
        categoryBlock.children[0].innerHTML = li;
    }
    categoryBlock.className = "categoryCont";
    var liCont = document.getElementsByClassName("liCont");

    for (var i = 0; i < liCont.length; i++) {
        liCont[i].addEventListener("click", toggleActiveLi);
    }
}

function toggleCategoryCont(e) {
    var x = document.getElementById(e.currentTarget.parentNode.id + "Block");
    if (!x.children[0].children[0] && x.className == "hideDropDown") {
        var id = e.currentTarget.children[0].innerHTML;
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

// Add category
getCategories();
function getCategories() {
    var request = new ajaxRequest();
    request.open("GET", "getCategories.php", true);
    request.onreadystatechange = getCategoriesHandleResponse;
    request.send(null);
}
function getCategoriesHandleResponse() {
    if(this.readyState == 4) {
        if(this.status == 200) {
            if(this.responseText !== null) {
                var arr = JSON.parse(this.responseText);
                displayCategories(arr);
            }
        }
    }
}
function displayCategories(arr) {
    var htmlString = '';
    var optionString = '';
    for(var i = 0; i < arr.length; i++) {
        //Display categories in main section
        var id = arr[i].replace(/\s/g, "");
        htmlString +=		
            '<div id="' + id + '">' +
				'<a href="#" class="category" onclick="return false"><h2>' + arr[i] + '</h2>' +
					'<div id="categoryArrow" class="categoryArrow"></div></a>' +
				'<div id="' + id + 'Block" class="hideDropDown">' +
					'<ul>' +
					'</ul>' +
				'</div>' +
			'</div>';
        //Display options in AddWord select tag
        if(arr[i] == "Various") {
            optionString += '<option selected>' + arr[i] + '</option>';
            continue;
        }
        optionString += '<option>' + arr[i] + '</option>';
    }
    document.getElementById("vocabularyDiv").innerHTML += htmlString;
    var category = document.getElementsByClassName("category");

    for(var j = 0; j < category.length; j++) {
        category[j].addEventListener("click", toggleCategoryCont);
    }
    document.getElementById("chooseCategory").innerHTML += optionString;
}
// Add Category
document.getElementById("submitCategory").addEventListener("click", submitCategory);
function submitCategory() {
    var params = "newCategory=" + document.getElementById("categoryName").value;
    var request = new ajaxRequest();
    request.open("POST", "submitCategory.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = submitCategoryHandleResponse;
    request.send(params);
}
function submitCategoryHandleResponse() {
    if (this.readyState == 4) {
        if (this.status == 200) {
            if (this.responseText !== null) {
                var arr = JSON.parse(this.responseText);
                displayCategories(arr);
                document.getElementById("categoryName").value = "";
            } else {
                alert("Ajax error: No data received");
            }
        } else {
            alert("Ajax error: " + this.statusText);
        }
    }
}
// Memory Palaces
var mpList = document.getElementsByClassName("mpList");
for (var i = 0; i < mpList.length; i++) {
    mpList[i].addEventListener("click", toggleMpForm);
}
function toggleMpForm(e) {
    var target = e.currentTarget;
    var form = document.getElementById(target.id + "Form");
    if (target.className !== "mpList activeMpList") {
        target.className = "mpList activeMpList";
        form.className = "activeMpListForm";
    } else {
        target.className = "mpList";
        form.className = "hideDropDown";
    }
    if (activeBlock == "addRoadmapBlock") {
        document.getElementById(activeBlock).className = "hideDropDown";
    }
    activeBlock = target.parentNode.id;
}