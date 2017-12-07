var nola_map = function() {
	var width = 600;
	var height = 450;
	var svg = null;
	var selector = "#map";
	var geoid = null;
	var path = d3.geoPath()
	var features = null;
	var stroke = "white";
	var fill = "#CCCCCC";
	var fillHighlight = "red";

	var plot_ = function() {
		svg = d3.select(selector).append("svg")
			.attr("width", width)
			.attr("height", height);

		svg.selectAll("path")
				.data(features)
			.enter().append("path")
				.attr("class", "tract")
				.attr("d", path)
				.attr("stroke", stroke)
				.attr("stroke-width", 2)
				.attr("fill", fill);
	}

	var highlight_ = function(geoid) {
		svg.selectAll(".tract").attr("fill", function(d) {
			// console.log(d);
			if(d.properties.GEOID == geoid) return fillHighlight; else return fill;
		});
	}

	var features_ = function(_) {
		var that = this;
		if(!arguments.length) return features;
		features = _;
		return that;
	}

	var public = {
		"plot": plot_,
		"highlight": highlight_,
		"features": features_
	}

	return public;
}

// var map = nola_map()
// d3.json("data/nola_shape_projected.json", function(error, nola) {
// 	if(error) throw error;
// 	console.log(nola.features);
// 	map.features(nola.features);
// 	map.plot();
// });
// console.log(map.features());
// map.highlight("22071007606");
