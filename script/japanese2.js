//
// Startup functions
//
function addAllEventListeners() {
    document.getElementById("addWord").addEventListener("click", toggleNavDropdown);
    document.getElementById("addCategory").addEventListener("click", toggleNavDropdown);
    document.getElementById("memopals").addEventListener("click", toggleNavDropdown);
    document.getElementById("submitCategory").addEventListener("click", submitCategory);
    document.getElementById("submitWord").addEventListener("click", createWord);
    document.getElementById("addMemopalCreateInputs").addEventListener("click", createAddMemopalInputs);
    document.getElementById("addMemopal").addEventListener("click", toggleAddMemopal);
    window.addEventListener("click", hideDropdown);
}
function loadAtStartup() {
    var request = new ajaxRequest();
    request.open("GET", "loadAtStartup.php", true);
    request.onreadystatechange = loadAtStartupHandleResponse;
    request.send(null);
}
function loadAtStartupHandleResponse() {
    var obj = readyStateChange(this);
    if (obj) {
        displayCategories(obj.categories);
        displayMemopals(obj.memopals);
    }
}
function displayCategories(arr) {
    var fragmentDiv = document.createDocumentFragment();
    var fragmentOpt = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
        var id = arr[i].replace(/\s/g, "");
        var div1 = document.createElement("div");
        div1.id = id;
        var a = document.createElement("a");
        a.href = "#";
        a.className = "category";
        var h2 = document.createElement("h2");
        h2.innerText = arr[i];
        var div2 = document.createElement("div");
        div2.className = "categoryArrow";
        a.appendChild(h2);
        a.appendChild(div2);
        var div3 = document.createElement("div");
        div3.id = id + "Dropdown";
        div3.className = "hideDropdown";
        var div4 = document.createElement("div");
        if (arr[i] !== "Default") {
            div4.className = "deleteButton";
            div4.title = "Delete category";
            div4.addEventListener("click", deleteCategory);
        }
        var ul = document.createElement("ul");
        div3.appendChild(div4);
        div3.appendChild(ul);
        div1.appendChild(a);
        div1.appendChild(div3);
        fragmentDiv.appendChild(div1);
        // Display options in AddWord select tag
        var option = document.createElement("option");
        if (arr[i] == "Default") {
            option.selected = true;
        }
        option.text = arr[i];
        fragmentOpt.appendChild(option);
    }
    document.getElementById("mainSectionDiv").appendChild(fragmentDiv);
    document.getElementById("chooseCategory").appendChild(fragmentOpt);
    var category = document.getElementsByClassName("category");

    for(var j = 0; j < category.length; j++) {
        category[j].addEventListener("click", toggleCategoryCont);
    }
}
function displayMemopals(arr) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
        var name = arr[i][0];
        var id = name.replace(/\s/g, "");
        var a = document.createElement("a");
        a.href = "#";
        a.id = "__" + id;
        a.className = "memopalList";
        a.innerText = name;
        a.addEventListener("click", toggleMemopalPlaces);
        var div1 = document.createElement("div");
        div1.id = "__" + id + "Dropdown";
        div1.className = "hideDropdown";
        var div2 = document.createElement("div");
        div2.className = "deleteButton";
        div2.title = "Delete Memory Palace";
        div1.appendChild(div2);
        var place = null;
        for (var j = 1; j < arr[i].length; j++) {
            place = arr[i][j];
            var label = document.createElement("label");
            if (j < 10) {
                label.innerHTML = "&nbsp;&nbsp;" + j;
            } else {
                label.innerHTML = j;
            }
            var input = document.createElement("input");
            input.className = "memopalListFormInput __" + id;
            input.type = "text";
            input.value = place;
            var br = document.createElement("br");
            div1.appendChild(label);
            div1.appendChild(input);
            div1.appendChild(br);
        }
        var button = document.createElement("input");
        button.type = "button";
        button.value = "Update";
        div1.appendChild(button);
        fragment.appendChild(a);
        fragment.appendChild(div1);
    }
    document.getElementById("memopalsDropdown").appendChild(fragment);
    displayMemopalsInAddWord();
}
function displayMemopalsInAddWord() {
    var chooseMemopal = document.getElementById("chooseMemopal");
    var memopals = document.getElementsByClassName("memopalList");
    var fragment = document.createDocumentFragment();
    var option = null;
    for (var i = 0; i < memopals.length; i++) {
        option = document.createElement("option");
        option.text = memopals[i].innerText;
        fragment.appendChild(option);
    }
    chooseMemopal.appendChild(fragment);
    chooseMemopal.addEventListener("change", displayPlacesOnChange);
}
//
// Get category Content
//
function requestCategoryCont(target) {
    var categoryName = target.children[0].innerHTML;
    var params = "category=" + categoryName;
    var request = new ajaxRequest();
    request.open("POST", "getWords.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = categoryContHandleResponse;
    request.send(params);
    return;
}
function categoryContHandleResponse() {
    var arr = readyStateChange(this);
    if (arr) {
        createCategoryCont(arr);
    }
}
function createCategoryCont(arr) {
    var memopals = document.getElementsByClassName("memopalList");
    for (var i = 0; i < arr.length; i++) {
        var li = document.createElement("li");
        li.className = "liCont";
        var a = document.createElement("a");
        a.href = "#";
        a.innerText = arr[i].word;
        var div1 = document.createElement("div");
        div1.id = "word" + arr[i].wordID + "__";
        div1.className = "hideDropdown";
        var div2 = document.createElement("div");
        div2.className = "deleteButton";
        div2.title = "Delete word";
        var labelMeaning = document.createElement("label");
        labelMeaning.innerText = "Meaning:";
        var inputMeaning = document.createElement("input");
        inputMeaning.type = "text";
        inputMeaning.value = arr[i].meaning;
        var br1 = document.createElement("br");
        var labelGrammar = document.createElement("label");
        labelGrammar.innerText = "Grammar:";
        var inputGrammar = document.createElement("input");
        inputGrammar.type = "text";
        inputGrammar.value = arr[i].grammar;
        var br2 = document.createElement("br");
        var span = document.createElement("span");
        span.innerText = "Memory Palace";
        var select1 = document.createElement("select");
        var option = document.createElement("option");
        if (!arr[i].memopal) {
            option.selected = true;
        }
        option.text  = "None";
        select1.appendChild(option);
        for (var j = 0; j < memopals.length; j++) {
            option = document.createElement("option");
            if (memopals[j].innerText == arr[i].memopal) {
                option.selected = true;
            }
            option.text = memopals[j].innerText;
            select1.appendChild(option);
        }
        var br3 = document.createElement("br");
        var select2 = document.createElement("select");
        select2.id = "word" + arr[i].wordID + "__Places";
        select2.className = "placeSelectFlashcard";
        option = document.createElement("option");
        if (arr[i].memopal) {
            var id = arr[i].memopal.replace(/\s/g, "");
            var places = document.getElementsByClassName("__" + id);
            for (var k = 0; k < places.length; k++) {
                option = document.createElement("option");
                option.text = places[k].value;
                if (places[k].value == arr[i].place) {
                    option.selected = true;
                }
                select2.appendChild(option);
            }
        }
        var labelStory = document.createElement("label");
        labelStory.innerText = "Story";
        var br4 = document.createElement("br");
        var textarea = document.createElement("textarea");
        if (!arr[i].story) {
            textarea.value = "";
        } else {
            textarea.value = arr[i].story;
        }
        var br5 = document.createElement("br");
        var button = document.createElement("input");
        button.type = "button";
        button.className = "submit";
        button.value = "Save Changes";
        div1.appendChild(div2);
        div1.appendChild(labelMeaning);
        div1.appendChild(inputMeaning);
        div1.appendChild(br1);
        div1.appendChild(labelGrammar);
        div1.appendChild(inputGrammar);
        div1.appendChild(br2);
        div1.appendChild(span);
        div1.appendChild(select1);
        div1.appendChild(br3);
        div1.appendChild(select2);
        div1.appendChild(labelStory);
        div1.appendChild(br4);
        div1.appendChild(textarea);
        div1.appendChild(br5);
        div1.appendChild(button);
        li.appendChild(a);
        li.appendChild(div1);
        var idCategory = arr[i].category.replace(/\s/g, "");
        var categoryDropdown = document.getElementById(idCategory + "Dropdown");
        categoryDropdown.className = "showCategoryCont";
        categoryDropdown.children[1].appendChild(li);
        a.addEventListener("click", toggleFlashcard);
        select1.addEventListener("change", displayPlacesOnChange);
        div2.addEventListener("click", deleteWord);
    }
}
//
// Create new word
//
function createWord() {
    var word = document.getElementById("addWordWord").value;
    var meaning = document.getElementById("addWordMeaning").value;
    var grammar = document.getElementById("addWordGrammar").value;
    var chooseCategory = document.getElementById("chooseCategory");
    var category = chooseCategory.options[chooseCategory.selectedIndex].text;
    var chooseMemopal = document.getElementById("chooseMemopal");
    var memopal = chooseMemopal.options[chooseMemopal.selectedIndex].text;
    var place = null;
    if (memopal == "None") {
        memopal = null;
    } else {
      var choosePlace = document.getElementById("choosePlace");
      place = choosePlace.options[choosePlace.selectedIndex].text;
    }
    var story = document.getElementById("addWordStory").value;
    var params = "word=" + word;
    // check which parameters to send
    var valueArr = [meaning, grammar, category, memopal, place, story];
    var keyArr = ["&meaning=", "&grammar=", "&category=", "&memopal=", "&place=", "&story="];
    for (var i = 0; i < valueArr.length; i++) {
        if (valueArr[i]) {
            params += keyArr[i] + valueArr[i];
        }
    }
    var request = new ajaxRequest();
    request.open("POST", "createWord.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = createWordHandleResponse;
    request.send(params);
}
function createWordHandleResponse() {
    var arr = readyStateChange(this);
    if (arr) {
        alert("You added a new word! Congratulations!");
        // Check if the category container is loaded. If not don't add new word to the container
        var categoryContId = arr[0].category.replace(/\s/g, "") + "Dropdown";
        var categoryCont = document.getElementById(categoryContId);
        if (!categoryCont.children[1].children[0] && categoryCont.className == "hideDropdown")
          return;
        createCategoryCont(arr);
    }
}
//
// Create Category
//
function submitCategory() {
    var params = "newCategory=" + document.getElementById("addCategoryName").value;
    var request = new ajaxRequest();
    request.open("POST", "submitCategory.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = submitCategoryHandleResponse;
    request.send(params);
}

function submitCategoryHandleResponse() {
    var arr = readyStateChange(this);
    if (arr) {
        alert("You added a new category. Congratulations!");
        displayCategories(arr);
        document.getElementById("categoryName").value = "";
    }
}
//
// Create Memory Palace
//
function submitMemopal(e) {
    var name = document.getElementById("addMemopalName").value;
    if (!name) {
        alert("Type in name for new Memory Palace");
        return;
    }
    var places = document.getElementsByClassName("addMemopalInput");
    var placesValue = [];
    for (var i = 0; i < places.length; i++) {
        if (places[i].value === "") {
            alert("Type in value for each place in the new Memory Palace");
            return;
        }
        placesValue.push(places[i].value);
    }
    var request = new ajaxRequest();
    var params = "name=" + name + "&places=" + placesValue;
    request.open("POST", "submitMemoryPalace.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = submitMemopalHandleResponse;
    request.send(params);
}
function submitMemopalHandleResponse() {
    var arr = readyStateChange(this);
    if (arr) {
        displayMemopalAfterSubmit();
    }
}
function displayMemopalAfterSubmit() {
    alert("Good Job duder");
    var name = document.getElementById("addMemopalName").value;
    var nameId = name.replace(/\s/g, "");
    var places = document.getElementsByClassName("addMemopalInput");
    var fragment = document.createDocumentFragment();
    var a = document.createElement("a");
    a.href = "#";
    a.id = "__" + nameId;
    a.className = "memopalList";
    a.innerHTML = name;
    var div1 = document.createElement("div");
    div1.id = "__" + nameId + "Dropdown";
    div1.className = "hideDropdown";
    var div2 = document.createElement("div");
    div2.className = "deleteButton";
    div2.title = "Delete Memory Palace";
    div1.appendChild(div2);
    var label = null, input = null, br = null;
    for (var i = 0; i < places.length; i++) {
        label = document.createElement("label");
        if (i < 9) {
            label.innerHTML = "&nbsp;&nbsp" + (i + 1);
        } else {
            label.innerHTML = i + 1;
        }
        input = document.createElement("input");
        input.className = "memopalListFormInput __" + nameId;
        input.type = "text";
        input.value = places[i].value;
        br = document.createElement("br");
        div1.appendChild(label);
        div1.appendChild(input);
        div1.appendChild(br);
    }
    var button = document.createElement("input");
    button.id = "memopalListUpdate";
    button.type = "button";
    button.value = "Update";
    div1.appendChild(button);
    fragment.appendChild(a);
    fragment.appendChild(div1);
    document.getElementById("memopalsDropdown").appendChild(fragment);
    document.getElementById("__" + nameId).addEventListener("click", toggleMemopalPlaces);
    // Remove text in inputs
    document.getElementById("addMemopalName").value = "";
    for (var j = 0; j < places.length; j++) {
        places[j].value = "";
    }
    // Add Memory Palace as option in Add Word
    var chooseMemopal = document.getElementById("chooseMemopal");
    var option = document.createElement("option");
    option.text = name;
    chooseMemopal.appendChild(option);
}
//
// Delete word
//
function deleteWord(e) {
    if (!confirm("Do you really want to delete this WORD?")) {
        return;
    }
    var parentId = e.currentTarget.parentNode.id;
    var length = parentId.length;
    var wordId = parentId.slice(4, length - 2);
    var params = "wordID=" + wordId;
    var request = new ajaxRequest();
    request.open("POST", "deleteWord.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = deleteWordHandleResponse;
    request.send(params);
}
function deleteWordHandleResponse() {
    var str = readyStateChange(this);
    if (str) {
        deleteWordFromCategoryCont(str);
    }
}
function deleteWordFromCategoryCont(str) {
    var id = "word" + str + "__";
    var liParent = document.getElementById(id).parentNode;
    liParent.parentNode.removeChild(liParent);
}
//
// Delete Category
//
function deleteCategory(e) {
    if (!confirm("Do you really want to delete this CATEGORY and all its contents?")) {
        return;
    }
    var categoryName = e.currentTarget.parentNode.parentNode.children[0].children[0].innerText;
    var categoryDropdownId = categoryName.replace(/\s/g, "") + "Dropdown";
    var allLi = document.getElementById(categoryDropdownId).children[1].children;
    var wordIds = [];
    for (var i = 0; i < allLi.length; i++) {
        var flashcardId = allLi[i].children[1].id;
        var idLength = flashcardId.length;
        var id = flashcardId.slice(4, idLength - 2);
        wordIds.push(id);
    }
    var params = "category=" + categoryName + "&wordIds=" + wordIds;
    var request = new ajaxRequest();
    request.open("POST", "deleteCategory.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = deleteCategoryHandleResponse;
    request.send(params);
}
function deleteCategoryHandleResponse() {
    var str = readyStateChange(this);
    if (str) {
        removeCategoryFromMainSection(str);
    }
}
function removeCategoryFromMainSection(str) {
    var id = str.replace(/\s/g, "");
    var category = document.getElementById(id);
    category.parentNode.removeChild(category);
}