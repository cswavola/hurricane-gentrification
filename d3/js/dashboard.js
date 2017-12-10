var displayDetails = function(d) {
	hideGentChart();
	d3.select("#viz").selectAll("path").style("stroke", "none");
	d3.select(this).select("path").style("stroke", "black");

	d3.select("#tractID").select("span").html(d.data.tract_id);
	d3.select("#status").select("span").html(gentrificationStatusText(d.data.gent_status));

	d3.select("#gentrification")
		.style("display", "none");

	d3.selectAll(".initialOverlay")
		.style("display", "none");

	var gentLines = gentrificationLines();
	gentLines.height(380);
	gentLines.selector("#gentrification");
	gentLines.tract(d.data).legend(true);
	gentLines.plot();

	d3.selectAll(".detailAnnotations")
		.style("opacity", 1);

	map.highlight(d.data.tract_id);

	d3.select("#population_00")
		.html(d.data.population_00);
	d3.select("#population_10")
		.html(d.data.population_10);
	d3.select("#med_income_00")
		.html(moneyFormat(d.data.med_income_00));
	d3.select("#med_income_10")
		.html(moneyFormat(d.data.med_income_10));
	d3.select("#med_home_value_00")
		.html(moneyFormat(d.data.med_home_value_00));
	d3.select("#med_home_value_10")
		.html(moneyFormat(d.data.med_home_value_10));
	d3.select("#pct_college_00")
		.html(percentFormat(d.data.pct_college_00));
	d3.select("#pct_college_10")
		.html(percentFormat(d.data.pct_college_10));
	d3.select("#pct_white_00")
		.html(percentFormat(d.data.pct_white_00));
	d3.select("#pct_white_10")
		.html(percentFormat(d.data.pct_white_10));


	d3.select("#detail")
		.style("display", "block");
}



// d3.json("data/nola_shape_projected.json",

var hideGentChart = function() {
	d3.select("#gentrification")
		.style("display", "none")
		.select("#closeButton").remove();
	d3.select("#topLeft")
		.transition(500)
			.style("width", "220px")
			.style("height", "120px");
}

var radial = radialChart();
var map = nola_map();

d3.queue()
.defer(d3.csv, "data/nola_viz_data.csv", rowConverter)
.defer(d3.json, "data/nola_shape_projected.json")
.await(function(error, tracts, nola) {
// d3.csv("data/nola_viz_data.csv", rowConverter, function(tracts) {
	radial.plot(tracts);
	radial.callback(displayDetails);
	map.features(nola.features.filter(function(d) { return d.properties.ALAND != "0"; }));
	map.plot();

	d3.select("#why")
		.on("click", function() {
			d3.select("#topLeft")
				.transition(500)
				.style("width", "650px")
				.style("height", "475px")
				.on("end", function() {
					d3.select("#gentrification")
						.style("display", "block")
						.select("svg").append("text")
							.attr("id", "closeButton")
							.attr("x", 565)
							.attr("y", 377)
							.style("fill", "black")
							.text("[x] close")
								.on("click", hideGentChart)
								.on("mouseover", function(d) {
									d3.select(this).style("cursor", "pointer");
								});
				});
		});
	
	// gent_statuses.forEach(function(gent) {
	// 	var y = 
	// });


	var exampleTract = tracts.filter(function(d) { return d.gentrified; })[0];

	var example1chart = gentrificationLines();
	example1chart
		.tract(exampleTract)
		.selector("#example1")
		.width(300).height(300)
		.plot();

	var example2chart = gentrificationLines();
	example2chart
		.tract(exampleTract)
		.selector("#example2")
		.width(300).height(300)
		.plot();

	var example2 = d3.select("#example2");
	example2.selectAll("line").style("opacity", 0.1);
	example2.selectAll("circle").style("opacity", 0.1);
	example2.select(".step1").style("opacity", 1);
	example2.select(".step2").style("opacity", 1);
	example2.selectAll(".step3").style("opacity", 1);
	example2.selectAll(".step4").style("opacity", 1);



	var example3chart = gentrificationLines();
	example3chart
		.tract(exampleTract).selector("#example3").width(300).height(300).plot();

	var example3 = d3.select("#example3");
	example3.selectAll(".step1").style("opacity", 0.1);
	example3.selectAll(".step2").style("opacity", 0.1);
	example3.selectAll(".step3").style("opacity", 0.1);

	d3.select("#overlay").on("click", function(d) {
		var sel = d3.select(this);
		sel.transition()
			.duration(500).style("opacity", 0)
			.on("end", function(d) {
				sel.style("display", "none");
				d3.select("#viz").style("display", "block");
			});
	});

	var detail = d3.select("#detail");
	console.log(window.innerWidth);
});