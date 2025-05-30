(async () => {
    const filePath = './cod.txt'; // Relative path to the text file

    try {
        // Step 1: Make the network request to fetch the file
        const response = await fetch(filePath);

        // Step 2: Check if the request was successful (HTTP status code 200-299)
        if (!response.ok) {
		throw new Error(`Failed to load '${filePath}': HTTP status ${response.status} ${response.statusText}`);
        }
        cod = await response.text();

        // Step 4: Now 'codTextContent' contains the entire string from your cod.txt file
        console.log("Successfully loaded cod.txt content:");

	} catch (error) {
	    console.error("An error occurred while fetching cod.txt:", error);
	}


	year_pattern = /\d{4}:/;
	year_range_regex = /\d+-\d+/;
	
	proto_list = cod.split(/(\n-\t)|(\d{4}:)|(\no\t)|(\n)/);
	proto_list = proto_list.filter(Boolean);
	cod_list = []
	year_counter = "";
	display = "";
	title_flag = false;
	
	
	for (let x in proto_list) {
		if (year_pattern.test(proto_list[x])) {
	    	display = proto_list[x].slice(0,-1);
	        year_counter = [proto_list[x].slice(0,-1)];
	        indent = 0;
	    } else if (title_flag == true) {
	    	if (proto_list[x] != "\n-\t") {
	        	let temp_list = proto_list[x].match(year_range_regex);
	        	if (temp_list != null) {
	            	year_counter = temp_list[0];
	                year_counter = year_counter.split("-")
	                for (i in year_counter) {
	                	year_counter[i] = Number(year_counter[i]);
	                }
	                if (year_counter[0]<year_counter[1]) {
	                	let temp_list2 = [];
	                	for (let i = year_counter[0]; i<= year_counter[1]; i++) {
	                    	temp_list2.push(i);
	                    }
	                    year_counter = temp_list2;
	                }
	            }
	    		display = proto_list[x].replace(/:/g, '');
	        }
	
	        title_flag = false;
	    } else if (proto_list[x] == "\n-\t") {
	    	indent = 0;
	    } else if (proto_list[x] == "\no\t") {
	        indent = 1;
	    } else if (proto_list[x].startsWith("\n")) {
	    	title_flag = true;
	    } else {
	    	cod_list.push({
	        	"text": proto_list[x],
	            "year": year_counter,
	            "display": display,
	            "indent": indent,
	            "tags": [],
	        });
	    }
	}
	
	render_timeline([],[]);
})();

timeline_div = document.getElementById("main")
	
timeline_html = '';
current_display_title = '';

function keyword_match(string, keyword) {
	keyword = keyword.toLowerCase();
    keyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    string = string.toLowerCase();
    let word_regex = RegExp(`\\b${keyword}\\b`);
    return word_regex.test(string);
}

function render_timeline(years,keywords) {
// Years and Keywords should be in a list.
  keywords = keywords.map(str => str.toLowerCase());
  for (let x in cod_list) {
      if (years.length != 0 && !years.some(item => cod_list[x]["year"].includes(item))) {
	continue;
      }
      if (keywords.length != 0 && !keywords.some(keyword => keyword_match(cod_list[x]["text"], keyword))) {
	continue;
      }
      if (cod_list[x]["display"] != current_display_title) {
	  timeline_html += `<p>${cod_list[x]["display"]}:</p>`
	  current_display_title = cod_list[x]["display"];
      }
      if (year_pattern.test(cod_list[x]["text"])) {
	  timeline_html  += `<p>${cod_list[x]["text"]}</p>`;
	  indent = 0;
      } else {
	  timeline_html += `<ul style="margin-left:${cod_list[x]["indent"]*5}%"><li><p>${cod_list[x]["text"]}</p></li></ul>`;
      }
  }
  
  document.getElementById("main").innerHTML = timeline_html;
}
