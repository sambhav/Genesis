$(document).ready(function() {
    // Finding isbn and book name + author name
    
    i13 = $("li:contains('ISBN-13')").first().text().replace("ISBN-13:","").trim();
    
    name = $("#productTitle").first().text().trim();
    // Alternates when viewing kindle books
    if(name == "")
    {
        name = $("#ebooksProductTitle").first().text().trim();
    }
    
    author =  $(".author > a").first().text().trim();
    
    // Alternates when viewing kindle books
    if (author == "")
    {
        author = $(".contributorNameID").first().text();
    }
    // Concatinating for final search
    total = name + " " + author;
    total = total.trim();
    // Listener to send the value to the extension when extension popup clicked
    chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        sendResponse({i13:i13,total:total});
    });
});