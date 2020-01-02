// Create a cookie with the specified name and value.
function SetCookie(sName, sValue) {
    document.cookie = sName + "=" + escape(sValue);
    var date = new Date();
    date.setHours(date.getHours() + (32 - date.getHours()));
    document.cookie += "; expires=" + date.toUTCString();
}
// Retrieve the value of the cookie with the specified name.
function GetCookie(sName) {
    // cookies are separated by semicolons
    var aCookie = document.cookie.split("; ");
    for (var i = 0; i < aCookie.length; i++) {
        // a name/value pair (a crumb) is separated by an equal sign
        var aCrumb = aCookie[i].split("=");
        if (sName === aCrumb[0])
            return unescape(aCrumb[1]);
    }
    // a cookie with the requested name does not exist
    return null;
}

$("#no_connection").click(function () {
    var alertId = $(this).attr("id"); //get the id of the notification to be dismissed
    var dismissedNotifications = GetCookie("dismissed-notifications") + ",#" + alertId; //this is the new value of the dismissed notifications cookie with the array of ids
    $(this).slideToggle('slow'); //dimsiss notification
    SetCookie("dismissed-notifications", dismissedNotifications.replace('null,', '')); //update cookie
});