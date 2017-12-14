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
	var fillHighlight = "#06BC40";

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
				// .on("click", function(d) {
				// 	displayDetails(d3.select("#arc"+d.properties.GEOID).data()[0]);
				// });
				// .on("click", function(d) { highlight_(d.properties.GEOID); });

		svg.append("polygon")
			.attr("id", "tractArrow1")
			.attr("class", "detailAnnotations")
			.attr("fill", "#F8B619")
			.attr("points", "100, 60 100,70 120,60");

		svg.append("polygon")
			.attr("id", "tractArrow2")
			.attr("class", "detailAnnotations")
			.attr("fill", "#600F97")
			.attr("points", "520,400 520,390 480,410");

		svg.append("rect")
			.attr("class", "initialOverlay")
			.attr("width", 650)
			.attr("height", 475)
			.style("fill", "white")
			.style("opacity", 0.8)
			.append("text")
				.text("asdf")
				.style("fill", "black");

		svg.append("text")
			.attr("class", "initialOverlay")
			.text("Click any colored region on the left to begin.")
			.style("fill", "black")
			.attr("x", 325).attr("y", 237)
			.attr("text-anchor", "middle");


	}

	var highlight_ = function(geoid) {
		svg.selectAll(".tract")
			.transition(500)
			.attr("fill", function(d) {
				// console.log(d);
				if(d.properties.GEOID == geoid) return fillHighlight; else return fill;
			});

		f = features.filter(function(d) { return d.properties.GEOID == geoid; })[0];
		console.log(f);
		// svg.select("#selectedCentroid").remove();
		// svg.select("#tractArrow1").remove();
		// svg.select("#tractArrow2").remove();

		// svg.append("circle")
		// 	.attr("id", "selectedCentroid")
		// 	.attr("fill", "blue")
		// 	.attr("cx", f.properties.centroid[0])
		// 	.attr("cy", f.properties.centroid[1])
		// 	.attr("r", 3);

		svg.select("#tractArrow1")
			.transition(500)
			.attr("points", f.properties.centroid[0]+","+f.properties.centroid[1]+" 100,70 120,60");

		svg.select("#tractArrow2")
			.transition(500)
			.attr("points", f.properties.centroid[0]+","+f.properties.centroid[1]+" 520,390 480,410");
		// svg.append("polygon")
		// 	.attr("id", "tractArrow1")
		// 	.attr("fill", "#fbb4ae")
		// 	.attr("points", f.properties.centroid[0]+","+f.properties.centroid[1]+" 100,70 120,60");

		// svg.append("polygon")
		// 	.attr("id", "tractArrow2")
		// 	.attr("fill", "#b3cde3")
		// 	.attr("points", f.properties.centroid[0]+","+f.properties.centroid[1]+" 520,390 480,410");
	}

	var features_ = function(_) {
		var that = this;
		if(!arguments.length) return features;
		features = _;

		features.forEach(function(f) {
			f.properties.centroid = path.centroid(f);
		})
		console.log(features);

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
