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
    if(document.getElementsByClassName("createMemopalInput").length > 0) {
        var removeInput = document.getElementsByClassName("createMemopalInput");
        var removeLabel = document.getElementsByClassName("createMemopalLabel");
        while (removeInput.length > 0) {
            removeInput[0].parentNode.removeChild(removeInput[0]);
            removeLabel[0].parentNode.removeChild(removeLabel[0]);
        }
        var button = document.getElementById("createMemopalSubmit");
        button.parentNode.removeChild(button);
        var br = document.getElementsByClassName("createMemopalBr")[0];
        br.parentNode.removeChild(br);
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
        label.for = j;
        label.className = "createMemopalLabel";
        if (j < 9) {
            label.innerHTML = "&nbsp&nbsp";
            label.innerHTML += j + 1;
        } else {
            label.innerHTML = j + 1;
        }
        input = document.createElement("input");
        input.type = "text";
        input.name = j;
        input.className = "createMemopalInput";
        tempCont.appendChild(label);
        tempCont.appendChild(input);
    }
    var br = document.createElement("br");
    br.className = "createMemopalBr";
    tempCont.appendChild(br);
    var submit = document.createElement("input");
    submit.type = "button";
    submit.id = "createMemopalSubmit";
    submit.value = "Add";
    submit.className = "submit";
    tempCont.appendChild(submit);
    document.getElementById("createMemopalForm").appendChild(tempCont);
    document.getElementById("createMemopalSubmit").addEventListener("click", submitMemopal);
}
function toggleMemopalPlaces(e) {
    e.preventDefault();
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
function hideDropdown(e) {
    if (!activeDropdown) 
        return;
    var a = activeDropdown;
    var w = document.getElementById("addWord");
    var c = document.getElementById("addCategory");
    var r = document.getElementById("memopals");
    var ar = document.getElementById("createMemopal");
    var ard = document.getElementById("createMemopalDropdown");
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
    document.getElementById("createMemopal").className = "";
    document.getElementById("createMemopalDropdown").className = "hideDropdown";
    var mpList = document.getElementsByClassName("mpList activeMpList");
    var mpListForm = document.getElementsByClassName("activeMpListForm");
    while (mpList.length > 0) {
        mpList[0].className = "mpList";
        mpListForm[0].className = "hideDropdown";
    }
}

//
// Main section
//
function toggleCategoryCont(e) {
    e.preventDefault();
    var targetDropdown = document.getElementById(e.currentTarget.parentNode.id + "Dropdown");
    if (!targetDropdown.children[0].children[0] && targetDropdown.className == "hideDropdown") {
        requestCategoryCont(e.currentTarget);
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

function toggleFlashcard(e) {
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
    // Make textarea height dynamic
    var textarea = child.children[12];
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
    var selectedOption = target.options[target.selectedIndex].text;
    var id = selectedOption.replace(/\s/g, "");
    var choosePlace = document.getElementById(target.parentNode.id + "Places");
    while (choosePlace.options.length > 0) {
        choosePlace.remove(0);
    }
    if (selectedOption == "None") { return; }
    var placeList = document.getElementsByClassName("__" + id);
    var fragment = document.createDocumentFragment();
    var option = null;
    for (var i = 0; i < placeList.length; i++) {
        option = document.createElement("option");
        option.text = placeList[i].value;
        fragment.appendChild(option);
    }
    choosePlace.appendChild(fragment);
}