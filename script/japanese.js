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
    hideMpDropdowns();
    // Hide other navigation Dropdown if any is open
    var targetDropdown = document.getElementById(e.currentTarget.id + "Dropdown");
    if (activeDropdown && targetDropdown != activeDropdown) {
        activeDropdown.className = "hideDropdown";
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
    var target = document.getElementById(e.currentTarget.id);
    var targetDropdown = document.getElementById(e.currentTarget.id + "Dropdown");
    if(target.className === "activeAddMemopal") {
        target.className = "";
        targetDropdown.className = "hideDropdown";
        return;
    }
    target.className = "activeAddMemopal";
    targetDropdown.className = "";
}
function toggleMpForm(e) {
    var target = e.currentTarget;
    var form = document.getElementById(target.id + "Dropdown");
    if (target.className !== "mpList activeMpList") {
        target.className = "mpList activeMpList";
        form.className = "activeMpListForm";
    } else {
        target.className = "mpList";
        form.className = "hideDropdown";
    }
}
function outsideClick(e) {
    if (!activeDropdown) 
        return;
    var a = activeDropdown;
    var w = document.getElementById("addWord");
    var c = document.getElementById("addCategory");
    var r = document.getElementById("roadmaps");
    var ar = document.getElementById("addRoadmap");
    var ard = document.getElementById("addRoadmapDropdown");
    var t = e.target;

    if (t != a && t.parentNode != a && t.parentNode.parentNode != a &&  
        t.parentNode.parentNode.parentNode != a &&
        t != w && t != c && t != r && t != ar) {
        activeDropdown.className = "hideDropdown";
        hideMpDropdowns();
    }
}
function hideMpDropdowns() {
    document.getElementById("addRoadmap").className = "";
    document.getElementById("addRoadmapDropdown").className = "hideDropdown";
    var mpList = document.getElementsByClassName("mpList activeMpList");
    var mpListForm = document.getElementsByClassName("activeMpListForm");
    while (mpList.length > 0) {
        mpList[0].className = "mpList";
        mpListForm[0].className = "hideDropdown";
    }
}
function createInputText(e) {
    if(document.getElementsByClassName("addRoadmapPlaces")) {
        var removeInput = document.getElementsByClassName("addRoadmapPlaces");
        var length = removeInput.length;
        for(var i = 0; i < length; i++) {
            removeInput[0].parentNode.removeChild(removeInput[0]);
        }
    }
    var n = document.getElementById("number").value;
    if (n <= 0) {
        return;
    }
    if(n > 30) {
        n = 30;
    }
    if (!n) return;
    var tempCont = document.createDocumentFragment();
    var input = null;
    var label = null;
    for(var j = 0; j < n; j++) {
        label = document.createElement("label");
        label.setAttribute("for", j);
        label.setAttribute("class", "addRoadmapPlaces");
        if (j < 9) {
            label.innerHTML = "&nbsp&nbsp";
            label.innerHTML += j + 1;
        } else {
            label.innerHTML = j + 1;
        }
        input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("name", j);
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
function handleResponseReturnArray(that) {
    if (that.readyState !== 4)
        return;
    if (that.status !== 200) {
        alert("Ajax error: " + that.statusText);
        return;
    }
    if (that.responseText === null) {
        alert("Ajax error: No data received");
        return;
    }
    var arr = JSON.parse(that.responseText);
    return arr;
}
function categoryContHandleResponse() {
    var arr = handleResponseReturnArray(this);
    if (arr) {
        createCategoryCont(arr);
    }
}
function createCategoryCont(arr) {
    var n = arr.length;
    var li = "";
    for (var i = 1; i < n; i++) {
        li +=
            '<li class="liCont">' + 
                '<a href="#">' + arr[i].word + '</a>' +
                '<div class="hideDropdown">' +
                    '<label for="meaning">Meaning:</label>' +
                    '<input type="text" name="meaning" value="' + arr[i].meaning + '"><br>' +
                    '<label for="grammar">Grammar:</label>' +
                    '<input type="text" name="grammar" value="' + arr[i].grammar + '"><br>' +
                    '<label for="story">Story</label><br>' +
                    '<textarea name="story">' + arr[i].story + '</textarea>' +
                    '<br>' +
                    '<input type="button" class="submit" value="Save Changes">' +
                '</div>' +
            '</li>';
    }
    // put content in the correct category
    var id = arr[0].replace(/\s/g, "");
    var categoryDropdown = document.getElementById(id + "Dropdown");
    if(n > 1) {
        categoryDropdown.children[0].innerHTML = li;
    }
    categoryDropdown.className = "showCategoryCont";
    // add eventListener for every <a> in the category
    var liCont = document.getElementsByClassName("liCont");

    for (var j = 0; j < liCont.length; j++) {
        liCont[j].children[0].addEventListener("click", toggleActiveLi);
    }
}

function toggleCategoryCont(e) {
    e.preventDefault();
    var targetDropdown = document.getElementById(e.currentTarget.parentNode.id + "Dropdown");
    if (!targetDropdown.children[0].children[0] && targetDropdown.className == "hideDropdown") {
        var categoryName = e.currentTarget.children[0].innerHTML;
        var params = "category=" + categoryName;
        var request = new ajaxRequest();
        request.open("POST", "getWords.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.onreadystatechange = categoryContHandleResponse;
        request.send(params);
        return;
    }
    if (targetDropdown.className == "hideDropdown") {
        targetDropdown.className = "showCategoryCont";
    } else {
        targetDropdown.className = "hideDropdown";
        var words = targetDropdown.children[0].children;
        for (var i = 0; i < words.length; i++) {
            words[i].className = "liCont";
            words[i].children[1].className = "hideDropdown";
        }
    }
}
function toggleActiveLi(e) {
    e.preventDefault();
    var targetParent = e.target.parentNode;
    var child = targetParent.children[1];
    if (targetParent.className == "liCont") {
        targetParent.className = "liCont activeLi";
        child.className = "description";
    } else {
        targetParent.className = "liCont";
        child.className = "hideDropdown";
    }
    var textarea = child.children[8];
    autoGrowTextArea(textarea);
    textarea.addEventListener("keyup", autoGrowTextArea);
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

// Display category
getCategories();
function getCategories() {
    var request = new ajaxRequest();
    request.open("GET", "getCategories.php", true);
    request.onreadystatechange = getCategoriesHandleResponse;
    request.send(null);
}
function getCategoriesHandleResponse() {
    var arr = handleResponseReturnArray(this);
    if (arr) {
        displayCategories(arr);
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
    var arr = handleResponseReturnArray(this);
    if (arr) {
        displayCategories(arr);
        document.getElementById("categoryName").value = "";
    }
}