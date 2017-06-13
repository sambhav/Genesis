$(document).ready(function() {
    // Finding isbn and book name + author name
    var hostname = location.hostname.toLowerCase();
    const AMAZON = "amazon";
    const FLIPKART = "flipkart";
    const SNAPDEAL = "snapdeal";
    const INVALID = "invalid"; 
    
    var i13 , total , author, name;
    if(hostname.indexOf(AMAZON) !== -1){ // Proceed as follows if amazon
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
    }else if(hostname.indexOf(FLIPKART) !== -1){
        let infoList = $("._3WHvuP > ul").find("li");
        let len = infoList.length;

        name = location.pathname.split("/")[1].split("-").join(" ");
        author = $(".PWqzqY").get(0).innerText;
        total = name + " " + author;
        for(let i = 0 ; i < len ; i++)
        {
            let str = infoList[i].innerText; 
            if(str.indexOf("ISBN") !== -1) 
            {
                i13 = str.split(":")[1].split(",")[0].trim();
                break;
            } 
        }
    }else if(hostname.indexOf(SNAPDEAL) !== -1){
        let infoList = $(".h-content");
        let len = infoList.length;
        name = $(".pdp-e-i-head").get(0).innerText;
        author = "";
        let authorFound = false, isbnFound = false;
        for(let i = 0 ; i < len ; i++)
        { 
            let str = infoList[i].innerText; 
            if(str.indexOf("Author") !== -1){
                author = str.split(":")[1].trim();
                authorFound = true;
            }
            if(str.indexOf("ISBN13") !== -1) 
            { 
                i13 = str.split(":")[1].trim();
                isbnFound = true; 
            }
            if(authorFound && isbnFound) 
            {
                break;
            }
        }
        total = name + " " + author;
    }

    // Listener to send the value to the extension when extension popup clicked
    chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(hostname.indexOf(AMAZON) !== -1 || hostname.indexOf(FLIPKART) !== -1 || hostname.indexOf(SNAPDEAL) !== -1){
            sendResponse({i13:i13,total:total});
        }else{
            sendResponse({i13:INVALID , total: INVALID});
        }
    });
});
