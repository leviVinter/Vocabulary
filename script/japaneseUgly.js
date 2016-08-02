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