$(document).ready(function() {
i13 = $("li:contains('ISBN-13')").text().replace("ISBN-13:","").trim();

name = $("#productTitle").text().trim();
if(name == "")
{
	name = $("#ebooksProductTitle").text().trim();
}
author =  $(".author > a").text().trim();
if (author == "")
{
	author = $(".contributorNameID").text();
}
total = name + " " + author;
total = total.trim();
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    sendResponse({i13:i13,total:total});
  });
});