var width = 600;
var height = 450;
var path = d3.geoPath();

var svg = d3.select("#map").append("svg")
	.attr("width", width)
	.attr("height", height);

d3.json("data/nola_shape_projected.json", function(error, nola) {
	if(error) throw error;

	console.log(nola.features);

	// svg.append("path")
	// 	.datum({type: "FeatureCollection", features: nola.features})
	// 	.attr("d", path)
	// 	.attr("stroke", "black")
	// 	.attr("fill", function(d) { console.log(d); if(d.properties.GEOID == "22071007606") return "red"; else return "white"; });
	svg.selectAll("path")
			.data(nola.features)
		.enter().append("path")
			.attr("d", path)
			.attr("stroke", "black")
			.attr("stroke-width", 2)
			.attr("fill", function(d) { if(d.properties.GEOID == "22071007606") return "red"; else return "white"});
	// svg.append("path")
	// 	.attr("stroke", "black")
	// 	.attr("stroke-width", 0.5)
	// 	.attr("d", path(topojson.mesh(nola, nola.features)));
});