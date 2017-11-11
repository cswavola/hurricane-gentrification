var size = 600;
var thickness = 30;
var radius = size/2;
var levels = 3;
var level_gap = 2;
var income_groups = ["low", "medium", "high"];
var damage_levels = [1, 2, 3]

var x = d3.scaleLinear()
	.range([0, 2*Math.PI]);

var y = d3.scaleSqrt()
	.range([0, radius]);

var color = d3.scaleOrdinal()
	.range(["red", "purple", "blue"])
	.domain(["low", "medium", "high"]);

var l1Arc = d3.arc()
	.outerRadius(radius - (levels*(thickness+level_gap)))
	.innerRadius(radius - (levels*(thickness+level_gap)) - thickness)

var l1Pie = d3.pie()
	.sort(function(a, b) {
		return d3.ascending(a.income_group, b.income_group) || d3.ascending(a.population_00, b.population_00);
	})
	.padAngle(0.004)
	.value(function(d) { return d.population_00; });

var l2LowArc = d3.arc()
	.outerRadius(radius - ((levels-1)*(thickness+level_gap)))
	.innerRadius(radius - ((levels-1)*(thickness+level_gap)) - thickness)

var l2MedArc = d3.arc()
	.outerRadius(radius - ((levels-1)*(thickness+level_gap)))
	.innerRadius(radius - ((levels-1)*(thickness+level_gap)) - thickness)


var getStartAngle = function(d) {
	return d3.min(d, function(d) { return d.startAngle; });
}

var getEndAngle = function(d) {
	return d3.max(d, function(d) { return d.endAngle; });
}


var svg = d3.select("#viz").append("svg")
		.attr("width", size)
		.attr("height", size)
	.append("g")
		.attr("transform", "translate(" + (size / 2) + "," + (size / 2) + ")");

var rowConverter = function(d) {
	d.gent_eligible = d.gent_eligible === "TRUE";
	d.gentrified = d.gentrified === "TRUE";

	d.med_home_value_00 = parseFloat(d.med_home_value_00);
	d.med_home_value_00_pctile = parseInt(d.med_home_value_00_pctile);
	d.med_home_value_10 = parseFloat(d.med_home_value_10);
	d.med_home_value_10_pctile = parseInt(d.med_home_value_10_pctile);
	d.med_home_value_change = parseFloat(d.med_home_value_change);
	d.med_home_value_change_pctile = parseInt(d.med_home_value_change_pctile);

	d.med_income_00 = parseFloat(d.med_income_00);
	d.med_income_00_pctile = parseInt(d.med_income_00_pctile);
	d.med_income_10 = parseFloat(d.med_income_10);
	d.med_income_10_pctile = parseInt(d.med_income_10_pctile);
	d.med_income_change = parseFloat(d.med_income_change);
	d.med_income_change_pctile = parseInt(d.med_income_change_pctile);

	d.pct_college_00 = parseFloat(d.pct_college_00);
	d.pct_college_00_pctile = parseInt(d.pct_college_00_pctile);
	d.pct_college_10 = parseFloat(d.pct_college_10);
	d.pct_college_10_pctile = parseInt(d.pct_college_10_pctile);
	d.pct_college_change = parseFloat(d.pct_college_change);
	d.pct_college_change_pctile = parseInt(d.pct_college_change_pctile);

	d.pct_white_00 = parseFloat(d.pct_white_00);
	d.pct_white_00_pctile = parseInt(d.pct_white_00_pctile);
	d.pct_white_10 = parseFloat(d.pct_white_10);
	d.pct_white_10_pctile = parseInt(d.pct_white_10_pctile);
	d.pct_white_change = parseFloat(d.pct_white_change);
	d.pct_white_change_pctile = parseInt(d.pct_white_change_pctile);

	d.population_00 = parseFloat(d.population_00);
	d.population_00_pctile = parseInt(d.population_00_pctile);
	d.population_10 = parseFloat(d.population_10);
	d.population_10_pctile = parseInt(d.population_10_pctile);
	d.population_change = parseFloat(d.population_change);
	d.population_change_pctile = parseInt(d.population_change_pctile);

	d.pct_damage = parseFloat(d.pct_damage);

	if(d.med_income_00_pctile <= 33) {
		d.income_group = "low";
	} else if(d.med_income_00_pctile <= 66) {
		d.income_group = "medium";
	} else {
		d.income_group = "high";
	}

	if(d.pct_damage <= 10) {
		d.damage_level = 3;
	} else if(d.pct_damage <= 35) {
		d.damage_level = 2;
	} else {
		d.damage_level = 1;
	}

	return d;
}

d3.csv("../data/nola_viz_data.csv", rowConverter, function(tracts) {
	var l1 = tracts.filter(function(d) { return d.damage_level == 1; });
	// var lowStartAngle = getStartAngle(l1Pie(l1).filter(function(d) { return d.data.income_group == "low"; }));
	// var lowEndAngle = getEndAngle(l1Pie(l1).filter(function(d) { return d.data.income_group == "low"; }));
	// var medStartAngle = getStartAngle(l1Pie(l1).filter(function(d) { return d.data.income_group == "medium"; }));
	// var medEndAngle = getEndAngle(l1Pie(l1).filter(function(d) { return d.data.income_group == "medium"; }));
	// var l1LowPop =  d3.sum(l1.filter(function(d) { return d.income_group == "low"; }), function(d) { return d.population_00; });
	// var l1MedPop =  d3.sum(l1.filter(function(d) { return d.income_group == "medium"; }), function(d) { return d.population_00; });
	// var l1HighPop =  d3.sum(l1.filter(function(d) { return d.income_group == "high"; }), function(d) { return d.population_00; });

	// var l1Pops = income_groups.forEach(function(d) { return d; });
	// console.log(l1Pops);


	// var l2Low = tracts.filter(function(d) { return d.damage_level == 2 && d.income_group == "low"; });
	// var l2LowPop = d3.sum(l2Low, function(d) { return d.population_00; });
	// var l2LowScale = l2LowPop / l1LowPop;

	// var l2Med = tracts.filter(function(d) { return d.damage_level == 2 && d.income_group == "medium"; });
	// var l2MedPop = d3.sum(l2Med, function(d) { return d.population_00; });
	// var l2MedScale = l2MedPop / l1MedPop;
	// console.log(l2MedScale);





	// var drawArc = function(damage_level, income_group) {

	// }



	var g1 = svg.selectAll(".arc1")
			.data(l1Pie(l1))
		.enter().append("g")
			.attr("class", "arc1");

	g1.append("path")
		.attr("d", l1Arc)
		.style("fill", function(d) { return color(d.data.income_group); });

	// var l2LowPie = d3.pie()
	// 	.sort(function(a, b) {
	// 		return d3.ascending(a.income_group, b.income_group) || d3.ascending(a.population_00, b.population_00);
	// 	})
	// 	.startAngle(lowStartAngle)
	// 	.endAngle((lowEndAngle - lowStartAngle)*l2LowScale + lowStartAngle)
	// 	.padAngle(0.004)
	// 	.value(function(d) { return d.population_00; });


	// var g2low = svg.selectAll(".arc2low")
	// 		.data(l2LowPie(l2Low))
	// 	.enter().append("g")
	// 		.attr("class", "arc2low");

	// g2low.append("path")
	// 	.attr("d", l2LowArc)
	// 	.style("fill", function(d) { return color(d.data.income_group); });

	// console.log(medStartAngle);
	// console.log((medEndAngle - medStartAngle)*l2MedScale + medStartAngle);

	// var l2MedPie = d3.pie()
	// 	.sort(function(a, b) {
	// 		return d3.ascending(a.income_group, b.income_group) || d3.ascending(a.population_00, b.population_00);
	// 	})
	// 	.startAngle(medStartAngle)
	// 	.endAngle((medEndAngle - medStartAngle)*l2MedScale + medStartAngle)
	// 	.padAngle(0.004)
	// 	.value(function(d) { return d.population_00; });


	// var g2med = svg.selectAll(".arc2med")
	// 		.data(l2MedPie(l2Med))
	// 	.enter().append("g")
	// 		.attr("class", "arc2med");

	// g2med.append("path")
	// 	.attr("d", l2MedArc)
	// 	.style("fill", function(d) { return color(d.data.income_group); });


});