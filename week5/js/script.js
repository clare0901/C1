// console.log(document.getElementById("title"));

// console.log(document instanceof HTMLDocument);
document.addEventListener("DOMContentLoaded",
	function (event) {


		document.querySelector("button")
		.addEventListener("click", function() {
			

			$ajaxutlis
			.sendGetRequest("/data/name.json", 
				function (res) {
					var message = res.firstname + " "+ res.lastname
					if(res.likeschinesefood){
						message +="likeschinesefood";
					}
					else{
						message+="doesnt like chinese food";
					}
					message+="and uses";
					message+=res.age;
					message+="displays for coding";

					document.querySelector("#content")
					.innerHTML = "<h2>"+ message + "</h2>"


				});

			
		});
	}
);

	