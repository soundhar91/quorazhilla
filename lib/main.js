/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */



var widgets = require("widget");
var data = require("self").data;
var tabs = require("tabs");
var tmr = require("timer");
var notifications = require("notifications");
var old_value = -1;

function notify_count_quora(count)
{
    notifications.notify({
    		title: "Quorazilla",
			text: "You have "+(count)+ " new notifications",
			data: "sample",
			onClick: function (data) 
			{
				tabs.open("www.quora.com");
			}
			});
}
function api_update(view)
{
//console.log("updating value");
 var Request = require("request").Request;
	var quijote = Request({
  	url: "http://api.quora.com/api/logged_in_user?fields=inbox,notifs",
  	onComplete: function (response)
	{
		if((response.text) == "while(1);")
		{
			return ;
		}
		if(response.status != 200 )
		  return ;
		var jsonobj = ((response.text).substring(9));
		//console.log(jsonobj);
		if(jsonobj != "")
		{
			console.log(jsonobj);
			var parsed= JSON.parse(jsonobj);
			var number = (parsed.notifs.unseen_aggregated_count ? parsed.notifs.unseen_aggregated_count : "-1");
			//console.log("notification"+number);
			if(view != 1)
			{
				if(old_value < number)
				{
					notify_count_quora((number-old_value));
					old_value = number;
				}
			}
			else
			{
                //console.log("automatic call\n");
				notify_count_quora(number);
			}
		}
  	}});
   quijote.get();
}
var widget = widgets.Widget({
  id: "Quorafox",
  label: "Quorafox",
  contentURL: data.url("icon.jpg"),
  onMouseover: function update()
  {
	api_update(1);
  }
  
});
	 
tmr.setInterval(function() { api_update(0); },60000);