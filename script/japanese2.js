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
    document.getElementById("vocabularyDiv").innerHTML += htmlString;
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
        memopalsString += '<a href="#" id="__' + id + '" class="mpList">' + name + '</a>' +
                            '<div id="__' + id + 'Dropdown" class="hideDropdown">';
        for (var j = 1; j < arr[i].length; j++) {
            var place = arr[i][j];
            if (j < 10) {
                memopalsString += '<label>&nbsp;&nbsp;' + j + '</label>';
            } else {
                memopalsString += '<label>' + j + '</label>';
            }
            memopalsString += '<input class="mpListFormInput __' + id + '" type="text" value="' + place + '"><br>';
        }
        memopalsString += '<input type="button" value="Update"></div>';
    }
    document.getElementById("memopalsDropdown").innerHTML += memopalsString;
    // add eventListeners for Memory Palace navigation tab
    document.getElementById("createInputs").addEventListener("click", createAddMemopalInputs);
    document.getElementById("createMemopal").addEventListener("click", toggleAddMemopal);
    var mpList = document.getElementsByClassName("mpList");
    for (var k = 0; k < mpList.length; k++) {
        mpList[k].addEventListener("click", toggleMemopalPlaces);
    }
    displayMemopalsInAddWord();
}
function displayMemopalsInAddWord() {
    var chooseMemopal = document.getElementById("chooseMemopal");
    var memopals = document.getElementsByClassName("mpList");
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
    var memopals = document.getElementsByClassName("mpList");
    for (var i = 0; i < arr.length; i++) {
        var li = document.createElement("li");
        li.className = "liCont";
        var a = document.createElement("a");
        a.href = "#";
        a.innerText = arr[i].word;
        var div = document.createElement("div");
        div.id = "word" + arr[i].wordID + "__";
        div.className = "hideDropdown";
        var labelMeaning = document.createElement("label");
        labelMeaning.for = "meaning";
        labelMeaning.innerText = "Meaning:";
        var inputMeaning = document.createElement("input");
        inputMeaning.type = "text";
        inputMeaning.name = "meaning";
        inputMeaning.value = arr[i].meaning;
        var br1 = document.createElement("br");
        var labelGrammar = document.createElement("label");
        labelGrammar.for = "grammar";
        labelGrammar.innerText = "Grammar:";
        var inputGrammar = document.createElement("input");
        inputGrammar.type = "text";
        inputGrammar.name = "grammar";
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
        select2.className = "secondSelectCategoryCont";
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
        labelStory.for = "story";
        labelStory.innerText = "Story";
        var br4 = document.createElement("br");
        var textarea = document.createElement("textarea");
        textarea.name = "story";
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
        div.appendChild(labelMeaning);
        div.appendChild(inputMeaning);
        div.appendChild(br1);
        div.appendChild(labelGrammar);
        div.appendChild(inputGrammar);
        div.appendChild(br2);
        div.appendChild(span);
        div.appendChild(select1);
        div.appendChild(br3);
        div.appendChild(select2);
        div.appendChild(labelStory);
        div.appendChild(br4);
        div.appendChild(textarea);
        div.appendChild(br5);
        div.appendChild(button);
        li.appendChild(a);
        li.appendChild(div);
        var idCategory = arr[i].category.replace(/\s/g, "");
        var categoryDropdown = document.getElementById(idCategory + "Dropdown");
        categoryDropdown.className = "showCategoryCont";
        categoryDropdown.children[0].appendChild(li);
        a.addEventListener("click", toggleFlashcard);
        select1.addEventListener("change", displayPlacesOnChange);
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
    var name = document.getElementById("createMemopalName").value;
    if (!name) {
        alert("Type in name for new Memory Palace");
        return;
    }
    var places = document.getElementsByClassName("createMemopalInput");
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
    var name = document.getElementById("createMemopalName").value;
    var nameId = name.replace(/\s/g, "");
    var places = document.getElementsByClassName("createMemopalInput");
    var tempCont = document.createDocumentFragment();
    var a = document.createElement("a");
    a.setAttribute("href", "#");
    a.setAttribute("id", "__" + nameId);
    a.setAttribute("class", "mpList");
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
        input.className = "mpListFormInput __" + nameId;
        input.setAttribute("type", "text");
        input.setAttribute("value", places[i].value);
        br = document.createElement("br");
        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(br);
    }
    var button = document.createElement("input");
    button.setAttribute("id", "mpListUpdate");
    button.setAttribute("type", "button");
    button.setAttribute("value", "Update");
    div.appendChild(button);
    tempCont.appendChild(a);
    tempCont.appendChild(div);
    document.getElementById("memopalsDropdown").appendChild(tempCont);
    document.getElementById("__" + nameId).addEventListener("click", toggleMemopalPlaces);
    // Remove text in inputs
    document.getElementById("createMemopalName").value = "";
    for (var j = 0; j < places.length; j++) {
        places[j].value = "";
    }
    // Add Memory Palace as option in Add Word
    var chooseMemopal = document.getElementById("chooseMemopal");
    var option = document.createElement("option");
    option.text = name;
    chooseMemopal.appendChild(option);
}


