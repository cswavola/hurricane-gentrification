var lines = gentrificationLines();

d3.csv("data/nola_viz_data.csv", rowConverter, function(error, tracts) {
	tract = tracts.filter(function(d) { return d.gent_eligible && !d.gentrified; })[1]
	lines
		.tract(tract)
		.selector("#viz")
		.legend(true)
		.annotate(true)
		// .scroller(true)
		.plot();
});