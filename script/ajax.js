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
function readyStateChange(that) {
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
    var response = JSON.parse(that.responseText);
    return response;
}