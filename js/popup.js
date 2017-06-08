$(document).ready(function ()
{
	// Extension inits and function to open download link in a new tab
	$('#i13a').hide();
	$('.form-group').hide();
	$(".preloader-wrapper").hide();
	$('body').on('click', '.dl', function ()
	{
		chrome.tabs.create({url: $(this).attr('href')});
		return false;
	});

	// $('#search').click(function(){
	// 	$(".preloader-wrapper").show();
	// 	$("#message").hide();
	// 	var searchQ = $("#search_q").val();
	// 	// alert(searchQ);
	// 	$.get("http://gen.lib.rus.ec/search.php?req=" + searchQ + "&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def", function (idata){

	// 		url = $($.parseHTML(idata)).find('a[id]').attr('href');
	// 		name = $($.parseHTML(idata)).find('a[id]').first().text();
	// 		if(url==undefined)
	// 		{
	// 			$("#message").show();
	// 			$("#message").html("Book not found. <br>Please retry appropriately.");
	// 			$('.preloader-wrapper').hide();

	// 		}
	// 		else
	// 		{
	// 			$('#bname').text(name);
	// 			parse(url);	

	// 		}


	// 	});

	// });
	// Function to parse the libgen url and display the download button
	function parse(url)
	{
		final_url = url.replace("book/index.php", "http://libgen.io/ads.php").trim();
		console.log("Dedicated to my lovely bookworm - CS")
		$.get(final_url, function (finalData)
		{
			furl = $($.parseHTML(finalData)).find("td:contains('DOWNLOAD') > a").attr("href");
			furl = "http://libgen.io/get.php?" + furl.split("?")[1];
			$('#i13a').attr('href', furl);
			$('#i13a').show();
			$('.preloader-wrapper').hide();
			$('#message').hide();
		});
	}
	// queries the active tab and if detected to be amazon finds the isbn/book and searches for it on libgen
	chrome.tabs.query({active: true,currentWindow: true}, function (tabs){

		tabURL = tabs[0].url;
		patt = new RegExp("http.*:\/\/.*amazon.*\/.*");
		var res = patt.test(tabURL);
		if (res)
		{
			// if amazon, shows preloader
			$(".preloader-wrapper").show();
			chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function (response){
				//sends message to current tab, if response undefined shows error
				if (response == undefined)
				{
					$("#message").show();
					$("#message").html("Book not found. <br>Please retry appropriately.");
					$('.preloader-wrapper').hide();
				}
				else
				{
					// response OK, searches libgen for the book.
					$.get("http://gen.lib.rus.ec/search.php?req=" + response.i13 + "&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def", function (idata){
						
						url = $($.parseHTML(idata)).find('a[id]').attr('href');
						// search via isbn unsuccessful, tries with book name now
						if (url == undefined)
						{
							
							$.get("http://gen.lib.rus.ec/search.php?req=" + response.total + "&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def", function (tdata){
								
								url = $($.parseHTML(tdata)).find('a[id]').attr('href');
								// search with book name also unsuccessful, shows error
								if (url == undefined)
								{
									$("#message").show();
									$("#message").html("Book not found. <br>Please retry appropriately.");
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
		// extension wasn't used on Amazon
		else
		{
			$("#message").show();
			$("#message").html("Please use the extension on Amazon.");
		}
	});
});
