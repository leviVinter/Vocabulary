//
// Startup functions
//
function addAllEventListeners() {
    document.getElementById("addWord").addEventListener("click", toggleNavDropdown);
    document.getElementById("addCategory").addEventListener("click", toggleNavDropdown);
    document.getElementById("memopals").addEventListener("click", toggleNavDropdown);
    document.getElementById("submitCategory").addEventListener("click", submitCategory);
    document.getElementById("submitWord").addEventListener("click", submitWord);
    document.getElementById("addMemopalCreateInputs").addEventListener("click", createAddMemopalInputs);
    document.getElementById("addMemopal").addEventListener("click", toggleAddMemopal);
    document.getElementById("subject").addEventListener("click", toggleNavDropdown);
    window.addEventListener("click", hideDropdown);
}
function loadAtStartup() {
    var subject = document.getElementById("subject").innerText;
    var params = "subject=" + subject;
    var request = new ajaxRequest();
    request.open("POST", "php/loadAtStartup.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = loadAtStartupHandleResponse;
    request.send(params);
}
function loadAtStartupHandleResponse() {
    var obj = readyStateChange(this);
    if (obj) {
        displayCategories(obj.categories);
        displayMemopals(obj.memopals);
        displayMemopalsInAddWord();
    }
}
function displayCategories(arr) {
    var fragmentDiv = document.createDocumentFragment();
    var fragmentOpt = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
        var id = arr[i].replace(/\s/g, "");
        var div1 = document.createElement("div");
        div1.id = id;
        var div2 = document.createElement("div");
        div2.className = "category";
        var h2 = document.createElement("h2");
        h2.innerText = arr[i];
        var div3 = document.createElement("div");
        div3.className = "categoryArrow";
        div2.appendChild(h2);
        div2.appendChild(div3);
        var div4 = document.createElement("div");
        div4.id = id + "Dropdown";
        div4.className = "hideDropdown";
        var div5 = document.createElement("div");
        if (arr[i] !== "Default") {
            div5.className = "deleteButton";
            div5.title = "Delete category";
            div5.addEventListener("click", deleteCategory);
        }
        var ul = document.createElement("ul");
        div4.appendChild(div5);
        div4.appendChild(ul);
        div1.appendChild(div2);
        div1.appendChild(div4);
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
        var h4 = document.createElement("h4");
        h4.id = "__" + id;
        h4.className = "memopalList";
        h4.innerText = name;
        h4.addEventListener("click", toggleMemopalPlaces);
        var form = document.createElement("form");
        form.id = "__" + id + "Dropdown";
        form.className = "hideDropdown";
        var div2 = document.createElement("div");
        div2.className = "deleteButton";
        div2.title = "Delete Memory Palace";
        div2.addEventListener("click", deleteMemopal);
        form.appendChild(div2);
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
            form.appendChild(label);
            form.appendChild(input);
            form.appendChild(br);
        }
        var button = document.createElement("input");
        button.type = "button";
        button.value = "Update";
        button.addEventListener("click", updateMemopal);
        form.appendChild(button);
        fragment.appendChild(h4);
        fragment.appendChild(form);
    }
    document.getElementById("memopalsDropdown").appendChild(fragment);
    
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
    var subject = document.getElementById("subject").innerText;
    var categoryName = target.children[0].innerHTML;
    var params = "category=" + categoryName + "&subject=" + subject;
    var request = new ajaxRequest();
    request.open("POST", "php/getWords.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = categoryContHandleResponse;
    request.send(params);
    return;
}
function categoryContHandleResponse() {
    var arr = readyStateChange(this);
    if (arr) {
        createCategoryCont(arr);
        var idCategory = arr[0].category.replace(/\s/g, "");
        var categoryDropdown = document.getElementById(idCategory + "Dropdown");
        categoryDropdown.className = "showCategoryCont";
    }
}
function createCategoryCont(arr) {
    var idCategory = arr[0].category.replace(/\s/g, "");
    var categoryDropdown = document.getElementById(idCategory + "Dropdown");
    var memopals = document.getElementsByClassName("memopalList");
    for (var i = 0; i < arr.length; i++) {
        var li = document.createElement("li");
        li.className = "liCont";
        var h4 = document.createElement("h4");
        h4.innerText = arr[i].word;
        h4.addEventListener("click", toggleFlashcard);
        var form = document.createElement("form");
        form.id = "word" + arr[i].wordID + "__";
        form.className = "hideDropdown";
        var div2 = document.createElement("div");
        div2.className = "deleteButton";
        div2.title = "Delete word";
        div2.addEventListener("click", deleteWord);
        var labelMeaning = document.createElement("label");
        labelMeaning.innerText = "Meaning:";
        var inputMeaning = document.createElement("input");
        inputMeaning.type = "text";
        inputMeaning.value = arr[i].meaning;
        inputMeaning.name = "meaning";
        var br1 = document.createElement("br");
        var labelGrammar = document.createElement("label");
        labelGrammar.innerText = "Grammar:";
        var inputGrammar = document.createElement("input");
        inputGrammar.type = "text";
        inputGrammar.value = arr[i].grammar;
        inputGrammar.name = "grammar";
        var br2 = document.createElement("br");
        var span = document.createElement("span");
        span.innerText = "Memory Palace";
        var select1 = document.createElement("select");
        select1.className = "chooseMemopal";
        select1.name = "memopalSelect";
        select1.addEventListener("change", displayPlacesOnChange);
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
        select2.name = "placeSelect";
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
        textarea.name = "story";
        var br5 = document.createElement("br");
        var button = document.createElement("input");
        button.type = "button";
        button.className = "submit";
        button.value = "Save Changes";
        button.addEventListener("click", updateFlashcard);
        form.appendChild(div2);
        form.appendChild(labelMeaning);
        form.appendChild(inputMeaning);
        form.appendChild(br1);
        form.appendChild(labelGrammar);
        form.appendChild(inputGrammar);
        form.appendChild(br2);
        form.appendChild(span);
        form.appendChild(select1);
        form.appendChild(br3);
        form.appendChild(select2);
        form.appendChild(labelStory);
        form.appendChild(br4);
        form.appendChild(textarea);
        form.appendChild(br5);
        form.appendChild(button);
        li.appendChild(h4);
        li.appendChild(form);
        categoryDropdown.children[1].appendChild(li);
    }
}
//
// Create new word
//
function submitWord(e) {
    var subject = document.getElementById("subject").innerText;
    var form = e.currentTarget.parentNode;
    var word = form.word.value;
    if (!word) {
        alert("You must type in a word");
        return;
    }
    var meaning = form.meaning.value;
    var grammar = form.grammar.value;
    var categorySelect = form.category;
    var category = categorySelect.options[categorySelect.selectedIndex].text;
    var memopalSelect = form.memopalSelect;
    var memopal = memopalSelect.options[memopalSelect.selectedIndex].text;
    var place;
    if (memopal === "None") {
        memopal = null;
        place = null;
    } else {
        var placeSelect = form.placeSelect;
        place = placeSelect.options[placeSelect.selectedIndex].text;
    }
    var story = form.story.value;
    var params = "word=" + word + "&subject=" + subject + "&category=" + category;
    // If variable doesn't have a value, don't send it
    var valueArr = [meaning, grammar, memopal, place, story];
    var keyArr = ["&meaning=", "&grammar=", "&memopal=", "&place=", "&story="];
    for (var i = 0; i < valueArr.length; i++) {
        if (valueArr[i]) {
            params += keyArr[i] + valueArr[i];
        }
    }
    var request = new ajaxRequest();
    request.open("POST", "php/submitWord.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = submitWordHandleResponse;
    request.send(params);
}
function submitWordHandleResponse() {
    var arr = readyStateChange(this);
    if (arr) {
        alert("You added a new word! Congratulations!");
        // Remove inputs from Add Word
        var form = document.getElementById("addWordDropdown");
        form.word.value = "";
        form.meaning.value = "";
        form.grammar.value = "";
        form.category.selectedIndex = 0;
        form.memopalSelect.selectedIndex = 0;
        var placeSelect = form.placeSelect;
        while (placeSelect.hasChildNodes()) {
            placeSelect.removeChild(placeSelect.lastChild);
        }
        placeSelect.selectedIndex = 0;
        form.story.value = "";
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
function submitCategory(e) {
    var form = e.currentTarget.parentNode;
    var name = form.name.value;
    var subject = document.getElementById("subject").innerText;
    if (!name) {
        alert("You must type in a Category name");
        return;
    }
    var params = "category=" + name + "&subject=" + subject;
    var request = new ajaxRequest();
    request.open("POST", "php/submitCategory.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = submitCategoryHandleResponse;
    request.send(params);
}
function submitCategoryHandleResponse() {
    var arr = readyStateChange(this);
    if (arr) {
        alert("You added a new category. Congratulations!");
        displayCategories(arr);
        document.getElementById("addCategoryName").value = "";
    }
}
//
// Create Memory Palace
//
function submitMemopal(e) {
    var form = e.currentTarget.parentNode;
    var name = form.name.value;
    if (!name) {
        alert("Type in name for new Memory Palace");
        return;
    }
    var places = document.getElementsByClassName("addMemopalInput");
    var placeValues = [];
    for (var i = 0; i < places.length; i++) {
        if (!places[i].value) {
            alert("Type in value for each place in the new Memory Palace");
            return;
        }
        placeValues.push(places[i].value);
    }
    var request = new ajaxRequest();
    var params = "name=" + name + "&places=" + placeValues;
    request.open("POST", "php/submitMemoryPalace.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = submitMemopalHandleResponse;
    request.send(params);
}
function submitMemopalHandleResponse() {
    var arr = readyStateChange(this);
    if (arr) {
        displayMemopals(arr);
        // Remove text in inputs
        document.getElementById("addMemopalName").value = "";
        var places = document.getElementsByClassName("addMemopalInput");
        for (var i = 0; i < places.length; i++) {
            places[i].value = "";
        }
        // Add Memory Palace as option in Add Word
        var chooseMemopal = document.getElementsByClassName("chooseMemopal");
        for (var j = 0; j < chooseMemopal.length; j++) {
            var option = document.createElement("option");
            option.text = arr[0][0];
            chooseMemopal[j].appendChild(option);
        }
    }
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
    request.open("POST", "php/deleteWord.php", true);
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
    var params = "category=" + categoryName;
    var request = new ajaxRequest();
    request.open("POST", "php/deleteCategory.php", true);
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
    // remove this category from selection in Add Word
    var categoryOptions = document.getElementById("chooseCategory").children;
    for (var i = 0; i < categoryOptions.length; i++) {
        if (categoryOptions[i].text === str) {
            categoryOptions[i].parentNode.removeChild(categoryOptions[i]);
        }
    }
}
//
// Delete Memopal
//
function deleteMemopal(e) {
    if (!confirm("Do you really want to delete this MEMOPAL?")) {
        return;
    }
    var dropdownId = e.currentTarget.parentNode.id;
    var memopalId = dropdownId.slice(0, dropdownId.length - 8);
    var memopal = document.getElementById(memopalId).innerText;
    var params = "memopal=" + memopal;
    var request = new ajaxRequest();
    request.open("POST", "php/deleteMemopal.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = deleteMemopalHandleResponse;
    request.send(params);
}
function deleteMemopalHandleResponse() {
    var str = readyStateChange(this);
    if (str) {
        removeMemopalFromPage(str);
    }
}
function removeMemopalFromPage(str) {
    var nameId = "__" + str.replace(/\s/g, "");
    var dropdown = document.getElementById(nameId + "Dropdown");
    var name = document.getElementById(nameId);
    name.parentNode.removeChild(dropdown);
    name.parentNode.removeChild(name);
    var chooseMemopals = document.getElementsByClassName("chooseMemopal");
    for (var i = 0; i < chooseMemopals.length; i++) {
        var options = chooseMemopals[i].children;
        for (var j = 0; j < options.length; j++) {
            var option = options[j];
            if (option.text == str) {
                chooseMemopals[i].removeChild(option);
                break;
            }
        }
    }
}
//
// Update flashcard
//
function updateFlashcard(e) {
    var form = e.currentTarget.parentNode;
    var meaning = form.meaning.value;
    var grammar = form.grammar.value;
    var memopalSelect = form.memopalSelect;
    var memopal = memopalSelect.options[memopalSelect.selectedIndex].text;
    var place = null;
    if (memopal === "None") {
        memopal = null;
    } else {
        var placeSelect = form.placeSelect;
        place = placeSelect.options[placeSelect.selectedIndex].text;
    }
    var story = form.story.value;
    var wordId = form.id.slice(4, form.id.length - 2);
    var params = "wordID=" + wordId + "&meaning=" + meaning + "&grammar=" + grammar +
                "&memopal=" + memopal + "&place=" + place + "&story=" + story;
    var request = new ajaxRequest();
    request.open("POST", "php/updateFlashcard.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = updateFlashcardHandleResponse;
    request.send(params);
}
function updateFlashcardHandleResponse() {
    var str = readyStateChange(this);
    if (str) {
        alert("You have updated the flashcard");
    }
}
//
// Update memopal
//
function updateMemopal(e) {
    var form = e.currentTarget.parentNode;
    var id = form.id;
    var nameId = id.slice(0, id.length - 8);
    var memopal = document.getElementById(nameId).innerText;
    var places = form.elements;
    var placesArr = [];
    for (var i = 0; i < places.length - 1; i++) {
        placesArr.push(places[i].value);
    }
    var params = "memopal=" + memopal + "&places=" + placesArr;
    var request = new ajaxRequest();
    request.open("POST", "php/updateMemopal.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = updateMemopalHandleResponse;
    request.send(params);
}
function updateMemopalHandleResponse() {
    var str = readyStateChange(this);
    if (str) {
        alert("This Memory Palace has been updated!");
    }
}