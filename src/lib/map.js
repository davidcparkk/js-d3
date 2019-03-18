const svg = d3.select("body").append("svg");
			const pathGenerator = d3.geoPath().projection(d3.geoNaturalEarth1());
			
			d3.queue()
				.defer(d3.json, "https://unpkg.com/world-atlas@1/world/110m.json")
				.await(makeMap)

			function makeMap(error,data) {
				if (error) {
					console.log("Error loading file: " + error);
					throw error	
				}

				let inputValue = null;
				const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

				svg.append('path')
				.attr('class', 'sphere')
				.attr('d', pathGenerator({type: 'Sphere'}));

				svg.selectAll("path")
					.data(topojson.feature(data,data.objects.countries).features)
					.enter().append("path")
					.attr('class','country')
					.attr("d", pathGenerator)

				const loans = svg.append('g');

				loans.selectAll('path')
				.data(kiva_json.features)
				.enter()
				.append('path')
				.attr("fill", initialDate)
				.attr('stroke', '#ccc')
				.attr("r", function(d){
					return d.properties.loan_amount * 4;
				})
					.style("fill", "rgb(217,91,67)")
					.style("opacity", 0.85)
				.attr('d', pathGenerator)
				.attr( 'class', 'incident')
				.on("mouseover", function(d){
					d3.select("#country-name").text("Country: " + d.properties.country);
					d3.select("h2").text("Sector: " + d.properties.sector);
					d3.select("h3").text("Loan Amount: $" + parseInt(d.properties.loan_amount));
					d3.select(this).attr('class', 'incident hover');
				})
				.on("mouseout", function(d){
					d3.select("#country-name").text("");
					d3.select("h2").text("");
					d3.select("h3").text("");
					d3.select(this).attr("class", "incident");
				});

				d3.select("#timelapse")
					.on("input", function() {
						update(+this.value);
				});

				function update(value) {
						document.getElementById("month").innerHTML=month[value];
						inputValue = month[value];
						d3.selectAll(".incident")
								.attr("fill", dateMatch);
				}

				function dateMatch(data, value) {
						const d = new Date(data.properties.date);
						const m = month[d.getMonth()];
						if (inputValue == m) {
								this.parentElement.appendChild(this);
								return "#ff483b";
						} else {
								return "#ffe596";
						};
				}

				function initialDate(data,i){
						const d = new Date(data.properties.date);
						const m = month[d.getMonth()];
						if (m == "January") {
								this.parentElement.appendChild(this);
								return "#ff483b";
						} else {
								return "#ffe596";
						};
				}
			}