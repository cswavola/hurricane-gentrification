function display(data) {
	console.log(data);
	//var tract = data.filter(function(d) { return d.gentrified; })[0];
	// var tract = data.filter(function(d) { return d.gentrified; })[0];
	var radial = radialChart()
		.selector("#scrollChart");
	radial.plot(data);
	// radial.
	// lines
	// 	.tract(tract)
	// 	.selector("#scrollChart")
	// 	.legend(true)
	// 	.scroller(true)
	// 	.plot()
	// // var plot = lineViz();
	// // d3.select("#lineviz")
	// // 	.datum(tract)
	// // 	.call(plot);

	// var scroll = scroller()
	// 	.container(d3.select("#master"));
	// scroll(d3.selectAll(".step"));
	// scroll.on("active", function(index) {
	// 	d3.selectAll(".step")
	// 		.style("opacity", function(d, i) { return i === index ? 1 : 0.1; });

	// 	lines.activate(index);
	// })
}

d3.csv("data/nola_viz_data.csv", rowConverter, display);