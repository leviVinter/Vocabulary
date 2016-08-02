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