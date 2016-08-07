//
// Startup functions
//
function addAllEventListeners() {
    document.getElementById("addWord").addEventListener("click", toggleNavDropdown);
    document.getElementById("addCategory").addEventListener("click", toggleNavDropdown);
    document.getElementById("memopals").addEventListener("click", toggleNavDropdown);
    document.getElementById("submitCategory").addEventListener("click", submitCategory);
    document.getElementById("submitWord").addEventListener("click", createWord);
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
    document.getElementById("mainSectionDiv").innerHTML += htmlString;
    var category = document.getElementsByClassName("category");

    for(var j = 0; j < category.length; j++) {
        category[j].addEventListener("click", toggleCategoryCont);
    }
    document.getElementById("chooseCategory").innerHTML += optionString;
}
function displayMemopals(arr) {
    var memopalsString = "";
    for (var i = 0; i < arr.length; i++) {
        var name = arr[i][0];
        var id = name.replace(/\s/g, "");
        memopalsString += '<a href="#" id="__' + id + '" class="memopalList">' + name + '</a>' +
                            '<div id="__' + id + 'Dropdown" class="hideDropdown">';
        for (var j = 1; j < arr[i].length; j++) {
            var place = arr[i][j];
            if (j < 10) {
                memopalsString += '<label>&nbsp;&nbsp;' + j + '</label>';
            } else {
                memopalsString += '<label>' + j + '</label>';
            }
            memopalsString += '<input class="memopalListFormInput __' + id + '" type="text" value="' + place + '"><br>';
        }
        memopalsString += '<input type="button" value="Update"></div>';
    }
    document.getElementById("memopalsDropdown").innerHTML += memopalsString;
    // add eventListeners for Memory Palace navigation tab
    document.getElementById("addMemopalCreateInputs").addEventListener("click", createAddMemopalInputs);
    document.getElementById("addMemopal").addEventListener("click", toggleAddMemopal);
    var memopalList = document.getElementsByClassName("memopalList");
    for (var k = 0; k < memopalList.length; k++) {
        memopalList[k].addEventListener("click", toggleMemopalPlaces);
    }
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
        categoryDropdown.children[0].appendChild(li);
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
        if (!categoryCont.children[0].children[0] && categoryCont.className == "hideDropdown")
          return;
        createCategoryCont(arr);
    }
}
//
// Create Category
//
function submitCategory() {
    var params = "newCategory=" + document.getElementById("categoryName").value;
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
        if (places[i].value == "") {
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
    var tempCont = document.createDocumentFragment();
    var a = document.createElement("a");
    a.setAttribute("href", "#");
    a.setAttribute("id", "__" + nameId);
    a.setAttribute("class", "memopalList");
    a.innerHTML = name;
    var div = document.createElement("div");
    div.setAttribute("id", "__" + nameId + "Dropdown");
    div.setAttribute("class", "hideDropdown");
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
        input.setAttribute("type", "text");
        input.setAttribute("value", places[i].value);
        br = document.createElement("br");
        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(br);
    }
    var button = document.createElement("input");
    button.setAttribute("id", "memopalListUpdate");
    button.setAttribute("type", "button");
    button.setAttribute("value", "Update");
    div.appendChild(button);
    tempCont.appendChild(a);
    tempCont.appendChild(div);
    document.getElementById("memopalsDropdown").appendChild(tempCont);
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
    /*if (!confirm("Do you really want to delete this word?")) {
        return;
    }*/
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
        alert(str);
        return;
        deleteWordFromCategoryCont(str);
    }
}