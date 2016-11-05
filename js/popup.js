$(document).ready(function(){
	$('#i13a').hide();
	$('.form-group').hide();
	 $('body').on('click', '.btn', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });

	function parse(url){
		final_url = url.replace("book/index.php","http://libgen.io/ads.php").trim();
		$.get(final_url,function(finalData){
			furl = $($.parseHTML(finalData)).find("td:contains('DOWNLOAD') > a").attr('href').replace("/get.php","http://libgen.io/get.php");
			$('#i13a').attr('href',furl);
			$('#i13a').show();
			$('#message').hide();
		});
	}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    $.get("http://gen.lib.rus.ec/search.php?req="+response.i13+"&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def",
    	function(idata)
    	{
    		url = $($.parseHTML(idata)).find('a[id]').attr('href');
    		if(url==undefined)
    			{
					$.get("http://gen.lib.rus.ec/search.php?req="+response.total+"&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def",
						function(tdata)
						{
							url = $($.parseHTML(tdata)).find('a[id]').attr('href');
							if(url==undefined)
								$("#message").text("Book Not Found");
							else
    							parse(url);

						});

    			}
    		else
    			{
    				parse(url);

    			}
    	}	

    	);
  });
});
});