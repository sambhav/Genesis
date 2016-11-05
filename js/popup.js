$(document).ready(function ()
{
	$('#i13a').hide();
	$('.form-group').hide();
	$(".preloader-wrapper").hide();
	$('body').on('click', '.btn', function ()
	{
		chrome.tabs.create({url: $(this).attr('href')});
		return false;
	});

	function parse(url)
	{
		final_url = url.replace("book/index.php", "http://libgen.io/ads.php").trim();
		console.log("Dedicated to my lovely bookworm - CS")
		$.get(final_url, function (finalData)
		{
			furl = $($.parseHTML(finalData)).find("td:contains('DOWNLOAD') > a").attr('href').replace("/get.php", "http://libgen.io/get.php");
			$('#i13a').attr('href', furl);
			$('#i13a').show();
			$('.preloader-wrapper').hide();
			$('#message').hide();

		});
	}

	chrome.tabs.query({active: true,currentWindow: true}, function (tabs){

		tabURL = tabs[0].url;
		patt = new RegExp("http*:\/\/.*amazon.*\/.*");
		var res = patt.test(tabURL);
		if (res)
		{
			$(".preloader-wrapper").show();
			chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function (response){

				if (response == undefined)
				{
					$("#message").show();
					$("#message").text("Book not found. Please retry again on a correct page.");
					$('.preloader-wrapper').hide();
				}
				else
				{
					$.get("http://gen.lib.rus.ec/search.php?req=" + response.i13 + "&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def", function (idata){
						
						url = $($.parseHTML(idata)).find('a[id]').attr('href');
						
						if (url == undefined)
						{
							
							$.get("http://gen.lib.rus.ec/search.php?req=" + response.total + "&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def", function (tdata){
								
								url = $($.parseHTML(tdata)).find('a[id]').attr('href');
								if (url == undefined)
								{
									$("#message").show();
									$("#message").text("Book not found. Please retry again on a correct page.");
									$('.preloader-wrapper').hide();
								}
								else
								{
									parse(url);
								}

							});

						}

						else
						{
							parse(url);
						}

					});
				}
			});
		}
	});
});