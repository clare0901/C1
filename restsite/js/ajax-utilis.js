(function (global) {
	var ajaxutlis = {};


	 function getRequestObject(){
	 	if(window.XMLHttpRequest){
	 		return (new XMLHttpRequest());
	 	}
	 	else if (window.ActiveXObject){
	 		return(new ActiveXObject("Micorsoft.XMLHTTP"));
	 	}
	 	else{
	 		global.alert("Ajax is not supported");
	 		return(null);
	 	}
	 }

	 ajaxutlis.sendGetRequest =
	 	function (requestUrl, responseHandler, isJsonResponse){
	 		var request = getRequestObject();
	 		request.onreadystatechange = 
	 		function(){
	 			handleResponse(request, responseHandler, isJsonResponse);
	 		};
	 		request.open("GET", requestUrl, true);
	 		request.send(null);
	 	};

	function handleResponse(request, responseHandler, isJsonResponse){
		if ((request.readyState == 4) 
			&& (request.status == 200)) {
			
			if(isJsonResponse == undefined){
				isJsonResponse = true;
			}
			if (isJsonResponse) {
				responseHandler(JSON.parse(request.responseText))
			}
			else{
				responseHandler(request.responseText);
			}
		}
	}

	

	global.$ajaxutlis = ajaxutlis; 

})(window);