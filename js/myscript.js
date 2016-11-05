$(document).ready(function() {

    i13 = $("li:contains('ISBN-13')").first().text().replace("ISBN-13:","").trim();
    
    name = $("#productTitle").first().text().trim();
    if(name == "")
    {
        name = $("#ebooksProductTitle").first().text().trim();
    }
    
    author =  $(".author > a").first().text().trim();
    
    if (author == "")
    {
        author = $(".contributorNameID").first().text();
    }
    total = name + " " + author;
    total = total.trim();
    chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        sendResponse({i13:i13,total:total});
    });
});