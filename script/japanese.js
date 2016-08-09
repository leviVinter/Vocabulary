var activeDropdown = null;
main();

function main() {
    loadAtStartup();
    addAllEventListeners();
}
//
// Navigation
//
function toggleNavDropdown(e) {
    e.preventDefault();
    hideMemopalDropdowns();
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
function toggleAddMemopal(e) {
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
function createAddMemopalInputs(e) {
    var form = e.currentTarget.parentNode;
    // Remove already created inputs
    var formChildren = form.children;
    while (formChildren.length > 6) {
        formChildren[6].parentNode.removeChild(formChildren[6]);
    }
    var n = form.inputNumber.value;
    if (!n) 
        return;
    if (n <= 0) 
        return;
    if (n > 30) {
        n = 30;
    }
    var fragment = document.createDocumentFragment();
    var input, label;
    for (var j = 0; j < n; j++) {
        label = document.createElement("label");
        label.className = "addMemopalLabel";
        if (j < 9) {
            label.innerHTML = "&nbsp&nbsp" + (j + 1);
        } else {
            label.innerHTML = j + 1;
        }
        input = document.createElement("input");
        input.type = "text";
        input.className = "addMemopalInput";
        fragment.appendChild(label);
        fragment.appendChild(input);
    }
    var br = document.createElement("br");
    var button = document.createElement("input");
    button.type = "button";
    button.value = "Add";
    button.className = "submit";
    button.addEventListener("click", submitMemopal);
    fragment.appendChild(br);
    fragment.appendChild(button);
    form.appendChild(fragment);
}
function toggleMemopalPlaces(e) {
    e.preventDefault();
    var target = e.currentTarget;
    var form = document.getElementById(target.id + "Dropdown");
    if (target.className !== "memopalList activeMemopalList") {
        target.className = "memopalList activeMemopalList";
        form.className = "activeMemopalListForm";
    } else {
        target.className = "memopalList";
        form.className = "hideDropdown";
    }
}
function hideDropdown(e) {
    if (!activeDropdown) 
        return;
    var a = activeDropdown;
    var w = document.getElementById("addWord");
    var c = document.getElementById("addCategory");
    var r = document.getElementById("memopals");
    var ar = document.getElementById("addMemopal");
    var ard = document.getElementById("addMemopalDropdown");
    var t = e.target;
    // Check if a nav dropdown is open. Close if it is
    if (t != a && t.parentNode != a && t.parentNode.parentNode != a &&  
        t.parentNode.parentNode.parentNode != a &&
        t != w && t != c && t != r && t != ar) {
        activeDropdown.className = "hideDropdown";
        hideMemopalDropdowns();
    }
}
function hideMemopalDropdowns() {
    document.getElementById("addMemopal").className = "";
    document.getElementById("addMemopalDropdown").className = "hideDropdown";
    var memopalList = document.getElementsByClassName("memopalList activeMemopalList");
    var memopalListForm = document.getElementsByClassName("activeMemopalListForm");
    while (memopalList.length > 0) {
        memopalList[0].className = "memopalList";
        memopalListForm[0].className = "hideDropdown";
    }
}

//
// Main section
//
function toggleCategoryCont(e) {
    e.preventDefault();
    var targetDropdown = document.getElementById(e.currentTarget.parentNode.id + "Dropdown");
    if (!targetDropdown.children[1].children[0] && targetDropdown.className == "hideDropdown") {
        requestCategoryCont(e.currentTarget);
    }
    if (targetDropdown.className == "hideDropdown") {
        targetDropdown.className = "showCategoryCont";
    } else {
        targetDropdown.className = "hideDropdown";
        var words = targetDropdown.children[1].children;
        for (var i = 0; i < words.length; i++) {
            words[i].className = "liCont";
            words[i].children[1].className = "hideDropdown";
        }
    }
}

function toggleFlashcard(e) {
    e.preventDefault();
    var targetParent = e.target.parentNode;
    var child = targetParent.children[1];
    if (targetParent.className == "liCont") {
        targetParent.className = "liCont activeLi";
        child.className = "flashcard";
    } else {
        targetParent.className = "liCont";
        child.className = "hideDropdown";
    }
    // Make textarea height dynamic
    var textarea = child.children[13];
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
//
// General event handlers
//
function displayPlacesOnChange(e) {
    var target = e.currentTarget;
    var form = target.parentNode;
    var memopal = target.options[target.selectedIndex].text;
    var id = memopal.replace(/\s/g, "");
    var placeSelect = form.placeSelect;
    while (placeSelect.options.length > 0) {
        placeSelect.remove(0);
    }
    if (memopal == "None")
        return;
    var placeList = document.getElementsByClassName("__" + id);
    var fragment = document.createDocumentFragment();
    var option = null;
    for (var i = 0; i < placeList.length; i++) {
        option = document.createElement("option");
        option.text = placeList[i].value;
        fragment.appendChild(option);
    }
    placeSelect.appendChild(fragment);
}