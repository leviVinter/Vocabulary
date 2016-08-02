var activeDropdown = null;
main();

function main() {
    var mpList = document.getElementsByClassName("mpList");
    for (var i = 0; i < mpList.length; i++) {
        mpList[i].addEventListener("click", toggleMpForm);
    }

    document.getElementById("addWord").addEventListener("click", toggleDropdown);
    document.getElementById("addCategory").addEventListener("click", toggleDropdown);
    document.getElementById("roadmaps").addEventListener("click", toggleDropdown);
    document.getElementById("addRoadmap").addEventListener("click", toggleAddRoadmap);
    document.getElementById("createInputs").addEventListener("click", createInputText);
    document.getElementById("submitCategory").addEventListener("click", submitCategory);
    window.addEventListener("click", outsideClick);
}

// Navigation

function toggleDropdown(e) {
    e.preventDefault();
    // Hide Memory Palace forms if they're open
    var mpList = document.getElementsByClassName("mpList activeMpList");
    var mpListForm = document.getElementsByClassName("activeMpListForm");
    while (mpList.length > 0) {
        mpList[0].className = "mpList";
        mpListForm[0].className = "hideDropdown";
    }
    // Hide other navigation Dropdown if any is open
    var targetDropdown = document.getElementById(e.currentTarget.id + "Dropdown");
    if (activeDropdown && targetDropdown != activeDropdown) {
        activeDropdown.className = "hideDropdown";
        // Hide parent of open Dropdown if any
        if (activeDropdown.parentNode.className == "showDropdown") 
            activeDropdown.parentNode.className = "hideDropdown";
    }
    if (targetDropdown.className == "showDropdown") {
        targetDropdown.className = "hideDropdown";
        return;
    }
    targetDropdown.className = "showDropdown";
    activeDropdown = targetDropdown;
}
function toggleAddRoadmap(e) {
    e.preventDefault();
    var target = document.getElementById(e.currentTarget.id + "Dropdown");
    if(target.className == "") {
        target.className = "hideDropdown";
        activeDropdown = target.parentNode;
        return;
    }
    target.className = "";
    activeDropdown = target;
}
function toggleMpForm(e) {
    var target = e.currentTarget;
    var form = document.getElementById(target.id + "Form");
    if (target.className !== "mpList activeMpList") {
        target.className = "mpList activeMpList";
        form.className = "activeMpListForm";
    } else {
        target.className = "mpList";
        form.className = "hideDropdown";
    }
    if (activeDropdown.id == "addRoadmapDropdown") {
        return;
    }
    activeDropdown = target.parentNode;
}
function outsideClick(e) {
    if (activeDropdown) {
        var a = activeDropdown;
        var w = document.getElementById("addWord");
        var c = document.getElementById("addCategory");
        var r = document.getElementById("roadmaps");
        var ar = document.getElementById("addRoadmap");
        var ard = document.getElementById("addRoadmapDropdown");
        var t = e.target;
        if (t != a && t.parentNode != a && t.parentNode.parentNode != a && 
            t != w && t != c && t != r && t != ar &&
            t.parentNode.children[1] != a) {
            activeDropdown.className = "hideDropdown";
            if (activeDropdown.parentNode.className == "showDropdown") {
                activeDropdown.parentNode.className = "hideDropdown";
            }
            var mpList = document.getElementsByClassName("mpList activeMpList");
            var mpListForm = document.getElementsByClassName("activeMpListForm");
            while (mpList.length > 0) {
                mpList[0].className = "mpList";
                mpListForm[0].className = "hideDropdown";
            }
        }
    }
}
function createInputText(e) {
    if(document.getElementsByClassName("addRoadmapPlaces")) {
        var removeInput = document.getElementsByClassName("addRoadmapPlaces");
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
        label.setAttribute("class", "addRoadmapPlaces");
        if (i < 9) {
            label.innerHTML = "&nbsp&nbsp";
            label.innerHTML += i + 1;
        } else {
            label.innerHTML = i + 1;
        }
        input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("name", i);
        input.setAttribute("class", "addRoadmapPlaces");
        tempCont.appendChild(label);
        tempCont.appendChild(input);
    }
    var br = document.createElement("br");
    br.setAttribute("class", "addRoadmapPlaces");
    tempCont.appendChild(br);
    var submit = document.createElement("input");
    submit.setAttribute("type", "button");
    submit.setAttribute("id", "addRoadmapSubmit");
    submit.setAttribute("value", "Add");
    submit.setAttribute("class", "submit addRoadmapPlaces");
    tempCont.appendChild(submit);
    
    document.getElementById("addRoadmapForm").appendChild(tempCont);
}


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
                '<div class="hideDropdown">' +
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
    var categoryDropdown = document.getElementById(id + "Dropdown");
    if(n > 1) {
        categoryDropdown.children[0].innerHTML = li;
    }
    categoryDropdown.className = "categoryCont";
    var liCont = document.getElementsByClassName("liCont");

    for (var i = 0; i < liCont.length; i++) {
        liCont[i].addEventListener("click", toggleActiveLi);
    }
}

function toggleCategoryCont(e) {
    var x = document.getElementById(e.currentTarget.parentNode.id + "Dropdown");
    if (!x.children[0].children[0] && x.className == "hideDropdown") {
        var id = e.currentTarget.children[0].innerHTML;
        var params = "category=" + id;
        var request = new ajaxRequest();
        request.open("POST", "getWords.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.onreadystatechange = categoryContHandleResponse;
        request.send(params);
    } else {
        if (x.className == "hideDropdown") {
            x.className = "categoryCont";
        } else {
            x.className = "hideDropdown";
            var li = x.children[0].children;
            for (var i = 0; i < li.length; i++) {
                li[i].className = "liCont";
                li[i].children[0].className = "hideDropdown";
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
    if (child.className == "hideDropdown") {
        child.className = "description";
    } else {
        child.className = "hideDropdown";
    }
    var textarea = child.children[0].children[8];
    autoGrowTextArea(textarea);
    textarea.addEventListener("keyup", autoGrowTextArea);
}

// Display category
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
				'<div id="' + id + 'Dropdown" class="hideDropdown">' +
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
// Create Category
function submitCategory() {
    var params = "newCategory=" + document.getElementById("categoryName").value;
    var request = new ajaxRequest();
    request.open("POST", "submitCategory.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = submitCategoryHandleResponse;
    request.send(params);
}

function submitCategoryHandleResponse() {
    if (this.readyState != 4) 
        return;
    if (this.status != 200) {
        alert("Ajax error: " + this.statusText);
        return;
    }
    if (this.responseText === null) {
        alert("Ajax error: No data received");
        return;
    }
    var arr = JSON.parse(this.responseText);
    displayCategories(arr);
    document.getElementById("categoryName").value = "";
}
// Memory Palaces
