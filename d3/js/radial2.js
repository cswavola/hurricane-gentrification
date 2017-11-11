var size = 600;
var thickness = 40;
var radius = size/2;
var levels = 2;
var level_gap = 10;
var income_groups = ["low", "medium", "high"];
var damage_levels = [2, 3]
var gent_statuses = ["ineligible", "eligible", "gentrified"];

var x = d3.scaleLinear()
	.range([0, 2*Math.PI]);

var y = d3.scaleSqrt()
	.range([0, radius]);

var color = d3.scaleOrdinal()
	.range(["red", "purple", "blue"])
	.domain(income_groups);

var opacity = d3.scaleOrdinal()
	.range([0.2, 0.4, 1.0])
	.domain(gent_statuses);

var l1Arc = d3.arc()
	.outerRadius(radius - (levels*(thickness+level_gap)))
	.innerRadius(radius - (levels*(thickness+level_gap)) - thickness)

var l1Pie = d3.pie()
	.sort(function(a, b) {
		return d3.ascending(a.income_group, b.income_group) || d3.ascending(a.population_00, b.population_00);
	})
	.padAngle(0.004)
	.value(function(d) { return d.population_00; });

var getStartAngle = function(d) {
	return d3.min(d, function(d) { return d.startAngle; });
}

var getEndAngle = function(d) {
	return d3.max(d, function(d) { return d.endAngle; });
}

var prettyText = function(income_group) {
	var text = "";
	switch(income_group) {
		case "low":
			text = "Low Income Tracts";
			break;
		case "medium":
			text = "Middle Income Tracts";
			break;
		case "high":
			text =  "High Income Tracts";
			break;
	}

	return text;
}


var svg = d3.select("#viz").append("svg")
		.attr("width", size)
		.attr("height", size);

svg.append("rect")
	.attr("width", size)
	.attr("height", size)
	.style("fill", "#FFFFFF")

var gtop = svg.append("g")
	.attr("transform", "translate(" + (size / 2) + "," + (size / 2) + ")");


gtop.append("circle")
	.attr("x", 0)
	.attr("y", 0)
	.attr("r", radius-(thickness*(levels+2.5)))
	.style("fill", "#666666")
	.on("click", function(d) { d3.select("#detail").style("display", "none"); })

var hoverText = gtop
	.append("text")
		.attr("id", "summaryText")
		.attr("x", -90)
		.attr("y", -40)
		.style("fill", "white");

var tractSpan = hoverText.append("tspan")
	.text("Tract: ")
	.append("tspan");

var popSpan = hoverText.append("tspan")
	.text("Population: ")
	.attr("x", -90)
	.attr("dy", 20)
	.append("tspan");

var incomeSpan = hoverText.append("tspan")
	.text("Median Income: ")
	.attr("x", -90)
	.attr("dy", 20)
	.append("tspan");

var damageSpan = hoverText.append("tspan")
	.text("Damage Level: ")
	.attr("x", -90)
	.attr("dy", 20)
	.append("tspan");

var gentSpan = hoverText.append("tspan")
	.text("Gentrification Status: ")
	.attr("x", -90)
	.attr("dy", 20)
	.append("tspan");

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

	d.population_00 = parseInt(d.population_00);
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

var updateText = function(d) {
	hoverText.style("display", "block");
	tractSpan.text(d.data.tract_id);
	popSpan.text(d.data.population_00);
	incomeSpan.text(Math.floor(d.data.med_income_00));
	damageSpan.text(Math.floor(d.data.pct_damage) + "%");
	gentSpan.text(d.data.gent_status);
}

d3.csv("data/nola_viz_data.csv", rowConverter, function(tracts) {
	var l1 = tracts.filter(function(d) { return d.damage_level == 1; });

	var g1 = gtop.selectAll(".arc1")
			.data(l1Pie(l1))
		.enter().append("g")
			.attr("class", "arc1");

	g1.append("path")
		.attr("d", l1Arc)
		.style("fill", function(d) { return color(d.data.income_group); })
		.style("opacity", function(d) { return opacity(d.data.gent_status); })
		.on("mouseover", updateText)
		.on("mouseout", function(d) { hoverText.style("display", "none"); })
		.on("click", function(d) { d3.select("#detail").style("display", "block"); });

	var drawLabelArc = function(income_group) {
		var startAngle = getStartAngle(l1Pie(l1).filter(function(d) { return d.data.income_group == income_group; }));
		var endAngle = getEndAngle(l1Pie(l1).filter(function(d) { return d.data.income_group == income_group; }));
		
		var labelArc = d3.arc()
			.outerRadius(radius-(5 + thickness*(levels+2)))
			.innerRadius(radius-(5 + thickness*(levels+2)))
			.startAngle(startAngle)
			.endAngle(endAngle);

		gtop.append("path")
			.attr("class", "labelArc")
			.attr("id", "labelArc"+income_group)
			.attr("d", labelArc)
			.style("fill", "white");

		gtop.append("text")
				.style("fill", color(income_group))
				.attr("text-anchor", "middle")
			.append("textPath")
				.attr("xlink:href", "#labelArc"+income_group)
				.attr("startOffset", "25%")
				.text(prettyText(income_group));
	}

	var labelArc = income_groups.forEach(function(d) { drawLabelArc(d); });

	var drawArc = function(damage_level, income_group) {
		var startAngle = getStartAngle(l1Pie(l1).filter(function(d) { return d.data.income_group == income_group; }));
		var l1EndAngle = getEndAngle(l1Pie(l1).filter(function(d) { return d.data.income_group == income_group; }));
		var l1Pop = d3.sum(l1.filter(function(d) { return d.income_group == income_group; }), function(d) { return d.population_00; });

		var lCur = tracts.filter(function(d) { return d.damage_level == damage_level && d.income_group == income_group; });
		var lCurPop = d3.sum(lCur, function(d) { return d.population_00; });
		var lCurScale = lCurPop / l1Pop;
		var endAngle = (l1EndAngle - startAngle)*lCurScale + startAngle



		var lCurArc = d3.arc()
			.outerRadius(radius - ((levels-(damage_level-1))*(thickness+level_gap)))
			.innerRadius(radius - ((levels-(damage_level-1))*(thickness+level_gap)) - thickness)

		var lCurPie = d3.pie()
			.sort(function(a, b) {
				return d3.ascending(a.income_group, b.income_group) || d3.ascending(a.population_00, b.population_00);
			})
			.startAngle(startAngle)
			.endAngle(endAngle)
			.padAngle(0.004)
			.value(function(d) { return d.population_00; });

		var gCur = gtop.selectAll(".arc"+damage_level+income_group)
				.data(lCurPie(lCur))
			.enter().append("g")
				.attr("class", "arc"+damage_level+income_group);

		gCur.append("path")
			.attr("d", lCurArc)
			.style("fill", function(d) { return color(d.data.income_group); })
			.style("opacity", function(d) { return opacity(d.data.gent_status); })
			.on("mouseover", updateText)
			.on("mouseout", function(d) { hoverText.style("display", "none"); })
			.on("click", function(d) { d3.select("#detail").style("display", "block"); });

		console.log(startAngle);
		console.log(endAngle);
	}

	var drawRing = function(damage_level) {
		income_groups.forEach(function(d) { drawArc(damage_level, d)});
	}

	var rings = damage_levels.forEach(drawRing);


});