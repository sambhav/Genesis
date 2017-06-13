$(document).ready(function() {
    // Finding isbn and book name + author name
    var hostname = location.hostname.toLowerCase();
    const AMAZON = { hostname : "amazon" , hostcode : "A" };
    const FLIPKART = { hostname : "flipkart" , hostcode : "F" };
    const SNAPDEAL = { hostname : "snapdeal" , hostcode : "S" };
    const NOT_VALID = { hostname : "invalid" , hostcode : "N" }; // For hosts that are not allowed.
    const INVALID = "INVALID"; 
    
    var hostcode = NOT_VALID.hostcode;
    if(hostname.indexOf(AMAZON.hostname) != -1){
        hostcode = AMAZON.hostcode;
    }else if(hostname.indexOf(FLIPKART.hostname) != -1){
        hostcode = FLIPKART.hostcode;
    }else if(hostname.indexOf(SNAPDEAL.hostname) != -1){
        hostcode = SNAPDEAL.hostcode;
    }
    
    if(hostcode != NOT_VALID.hostcode){ //Don't parse if website is other than those of specified.
        var i13 , total , author, name;
        if(hostcode == AMAZON.hostcode){ // Proceed as follows if amazon
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
        }else if(hostcode == FLIPKART.hostcode){
            let infoList = document.getElementsByClassName("_2-riNZ");
            let len = infoList.length;

            name = location.pathname.split('/')[1].split('-').join(' ');
            author = document.getElementsByClassName('PWqzqY')[0].innerText;
            total = name + " " + author;
            for(let i = 0 ; i < len ; i++)
            {
                let str = infoList[i].innerText; 
                if(str.indexOf("ISBN") != -1) 
                {
                    i13 = str.split(':')[1].split(',')[0].trim();
                    break;
                } 
            }
        }else if(hostcode == SNAPDEAL.hostcode){
            let infoList = $(".h-content");
            let len = infoList.length;
            name = document.getElementsByClassName("pdp-e-i-head")[0].innerText;
            author = "";
            let authorFound = false, isbnFound = false;
            for(let i = 0 ; i < len ; i++)
            { 
                let str = infoList[i].innerText; 
                if(str.indexOf('Author') != -1){
                    author = str.split(':')[1].trim();
                    authorFound = true;
                }
                if(str.indexOf("ISBN13") != -1) 
                { 
                    i13 = str.split(':')[1].trim();
                    isbnFound = true; 
                }
                if(authorFound && isbnFound) break;
            }
            total = name + " " + author;
        }
        // Listener to send the value to the extension when extension popup clicked
        chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if(hostcode != NOT_VALID.hostcode)
                sendResponse({i13:i13,total:total});
            else
                sendResponse({i13:INVALID , total: INVALID});
        });
    }
});
