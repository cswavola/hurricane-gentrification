var radial = radialChart();

d3.csv("data/nola_viz_data.csv", rowConverter, function(error, tracts, nola) {
// d3.csv("data/nola_viz_data.csv", rowConverter, function(tracts) {
	radial.plot(tracts);
});