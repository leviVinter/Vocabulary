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
function toggleDropDown(e) {
    e.preventDefault();
    var targetBlock = document.getElementById(e.currentTarget.id + "Block");
    if (activeBlock) {
        if (targetBlock.id != activeBlock && targetBlock.parentNode.id != activeBlock) {
            // Hide other dropdown
            var a = document.getElementById(activeBlock);
            a.className = "hideDropDown";
            if (a.parentNode.className == "showDropDown") {
                // Also hide Add New Memory Palace's parent
                a.parentNode.className = "hideDropDown";
                if (targetBlock == a.parentNode) {
                    // Avoid re-showing parent
                    return;
                }
            }
        }
    }
    if (targetBlock.className === "hideDropDown") {
        targetBlock.className = "showDropDown";
        activeBlock = targetBlock.id;
    } else {
        targetBlock.className = "hideDropDown";
    }
    // Close Memory Palace list
    var mpList = document.getElementsByClassName("mpList activeMpList");
    var mpListForm = document.getElementsByClassName("activeMpListForm");
    while (mpList.length > 0) {
        mpList[0].className = "mpList";
        mpListForm[0].className = "hideDropDown";
    }   
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
function toggleCategoryCont(e) {
    e.preventDefault();
    var targetDropdown = document.getElementById(e.currentTarget.parentNode.id + "Dropdown");
    if (!targetDropdown.children[0].children[0] && targetDropdown.className == "hideDropdown") {
        var id = e.currentTarget.children[0].innerHTML;
        var params = "category=" + id;
        var request = new ajaxRequest();
        request.open("POST", "getWords.php", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.onreadystatechange = categoryContHandleResponse;
        request.send(params);
    } else {
        if (targetDropdown.className == "hideDropdown") {
            targetDropdown.className = "categoryCont";
        } else {
            targetDropdown.className = "hideDropdown";
            var li = targetDropdown.children[0].children;
            for (var i = 0; i < li.length; i++) {
                li[i].className = "liCont";
                li[i].children[0].className = "hideDropdown";
            }
        }
    }
}
function getCategoryCont(arr) {
    var n = arr.length;
    var li = "";
    var memopals = document.getElementsByClassName("mpList");
    for (var i = 1; i < n; i++) {
        li +=
            '<li class="liCont">' + 
                '<a href="#">' + arr[i].word + '</a>' +
                '<div id="word' + arr[i].wordID + '__" class="hideDropdown">' +
                    '<label for="meaning">Meaning:</label>' +
                    '<input type="text" name="meaning" value="' + arr[i].meaning + '"><br>' +
                    '<label for="grammar">Grammar:</label>' +
                    '<input type="text" name="grammar" value="' + arr[i].grammar + '"><br>' +
                    '<span>Memory Palace</span>' +
                        '<select onchange=display>';
        // Check which memory palace belongs to the word. If none then None is selected
        if(!arr[i].memopal) {
                li += '<option selected>None</option>';
            } else {
                li += '<option>None</option>';
            }
        for (var j = 0; j < memopals.length; j++) {
            if (arr[i].memopal == memopals[j].innerText) {
                li += '<option selected>' + memopals[j].innerText + '</option>';
            } else {
                li += '<option>' + memopals[j].innerText + '</option>';
            }
        }
        li +=           '</select><br>' +
                        '<select class="secondSelectCategoryCont">';
        // Check which place belongs to the word
        if(!arr[i].memopal) {
            li += '<option selected>None</option>';
        } else {
            var id = arr[i].memopal.replace(/\s/g, "");
            var places = document.getElementsByClassName("__" + id);
            for (var k = 0; k < places.length; k++) {
                if (arr[i].place == places[k].value) {
                    li += '<option selected>' + places[k].value + '</option>';
                } else {
                    li += '<option>' + places[k].value + '</option>';
                }
            }
        }
        li +=           '</select>' +
                    '<label for="story">Story</label><br>' +
                    '<textarea name="story">' + arr[i].story + '</textarea>' +
                    '<br>' +
                    '<input name="word' + arr[i].wordID + '__" type="button" class="submit" value="Save Changes">' +
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