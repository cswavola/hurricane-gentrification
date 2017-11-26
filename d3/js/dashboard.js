var gentrificationLines = function() {
	var height = 600;
	var width = 400;
	var margin = {top: 20, right: 20, bottom: 20, left: 40};
	var pointRad = 5;
	var svg = null;
	var g = null;

	var showLegend = false;
	var selector = "#detail";

	var figh = height-margin.top-margin.bottom;
	var figw = width-margin.left-margin.right;

	var colors = {"income": "green", "home_value": "magenta", "college": "orange"};
	var lines = ["income", "home_value", "college"];
	var color = d3.scaleOrdinal()
		.range(["green", "magenta", "orange"])
		.domain(lines);

	// Keep track of which visualization
	// we are on and which was the last
	// index activated. When user scrolls
	// quickly, we want to call all the
	// activate functions that they pass.
	var lastIndex = -1;
	var activeIndex = 0;

	var activateFunctions = [];


	var x = d3.scaleOrdinal()
		.range([margin.left, margin.left+figw])
		.domain([2000, 2010]);
	var y = d3.scaleLinear()
		.range([margin.top+figh, margin.top])
		.domain([0, 100]);

	var xAxis = d3.axisBottom()
		.scale(x);
	var yAxis = d3.axisLeft()
		.scale(y)
		.ticks(5);

	var tract = {};
	var tract_ = function(_) {
		var that = this;
		if(!arguments.length) return tract;
		tract = _;
		return that;
	}


	var showLegend_ = function(_) {
		var that = this;
		if(!arguments.length) return showLegend;
		showLegend = _;
		return that;
	}

	var selector_ = function(_) {
		var that = this;
		if(!arguments.length) return selector;
		selector = _;
		return that;
	}

	var height_ = function(_) {
		var that = this;
		if(!arguments.length) return height;
		height = _;

		figh = height-margin.top-margin.bottom;
		y.range([margin.top+figh, margin.top]);

		return that;
	}


	var width_ = function(_) {
		var that = this;
		if(!arguments.length) return width;
		width = _;

		figw = width-margin.left-margin.right;
		x.range([margin.left, margin.left+figw]);

		return that;
	}


	// var chart = function(selection) {
	// 	selection.each(function(tract) {
	// 		console.log(tract);
	// 		svg = d3.select(this).selectAll("svg")
	// 			.data([tract]);

	// 		var svge = svg.enter().append("svg");
	// 		svg = svg.merge(svge)

	// 		svg
	// 			.attr("width", width)
	// 			.attr("height", height);
	// 		svg.append("g");
	// 		setupVis(tract);
	// 	});
	// };

	var prettyLineText = function(line) {
		var text = "";
		switch(line) {
			case "income":
				text = "Median Household Income";
				break;
			case "home_value":
				text = "Median Home Value";
				break;
			case "college":
				text =  "Percent College Educated";
				break;
		}

		return text;
	}

	var plot_ = function() {
		// console.log(tract);
		d3.select(selector).selectAll("svg").remove();

		svg = d3.select(selector).append("svg")
			.attr("height", height+(showLegend*150))
			.attr("width", width);

		svg.append("line")
			.attr("id", "incThresh")
			.attr("class", "step1")
			.attr("x1", x(2000))
			.attr("y1", y(40))
			.attr("x2", x(2010))
			.attr("y2", y(40))
			.style("stroke-width", 2)
			.style("stroke", color("income"))
			.style("stroke-dasharray", ("3, 3"))
			.style("opacity", 0.5);

		svg.append("circle")
			.attr("id", "inc2000")
			.attr("class", "step2")
			.attr("cx", x(2000))
			.attr("cy", y(tract.med_income_00_pctile))
			.attr("r", pointRad)
			.style("fill", color("income"))
			.style("opacity", 1);

		svg.append("circle")
			.attr("id", "inc2010")
			.attr("class", "step3")
			.attr("cx", x(2010))
			.attr("cy", y(tract.med_income_10_pctile))
			.attr("r", pointRad)
			.style("fill", color("income"))
			.style("opacity", 1);

		svg.append("line")
			.attr("id", "incLine")
			.attr("class", "step3")
			.attr("x1", x(2000))
			.attr("y1", y(tract.med_income_00_pctile))
			.attr("x2", x(2010))
			.attr("y2", y(tract.med_income_10_pctile))
			.style("stroke-width", 3)
			.style("stroke", color("income"))
			.style("opacity", 1);

		svg.append("circle")
			.attr("id", "hv2000")
			.attr("class", "step4")
			.attr("cx", x(2000))
			.attr("cy", y(tract.med_home_value_00_pctile))
			.attr("r", pointRad)
			.style("fill", color("home_value"))
			.style("opacity", 1);

		svg.append("line")
			.attr("id", "hvThresh")
			.attr("class", "step5")
			.attr("x1", x(2000))
			.attr("y1", y(tract.med_home_value_00_pctile))
			.attr("x2", x(2010))
			.attr("y2", y(tract.med_home_value_ref_pctile))
			.style("stroke-width", 3)
			.style("stroke", color("home_value"))
			.style("stroke-dasharray", ("3, 3"))
			.style("opacity", 0.5);

		svg.append("circle")
			.attr("id", "hv2010")
			.attr("class", "step6")
			.attr("cx", x(2010))
			.attr("cy", y(tract.med_home_value_10_pctile))
			.attr("r", pointRad)
			.style("fill", color("home_value"))
			.style("opacity", 1);

		svg.append("line")
			.attr("id", "hvLine")
			.attr("class", "step6")
			.attr("x1", x(2000))
			.attr("y1", y(tract.med_home_value_00_pctile))
			.attr("x2", x(2010))
			.attr("y2", y(tract.med_home_value_10_pctile))
			.style("stroke-width", 3)
			.style("stroke", color("home_value"))
			.style("opacity", 1);


		svg.append("circle")
			.attr("id", "college2000")
			.attr("class", "step7")
			.attr("cx", x(2000))
			.attr("cy", y(tract.pct_college_00_pctile))
			.attr("r", pointRad)
			.style("fill", color("college"))
			.style("opacity", 1);

		svg.append("line")
			.attr("id", "collegeThresh")
			.attr("class", "step8")
			.attr("x1", x(2000))
			.attr("y1", y(tract.pct_college_00_pctile))
			.attr("x2", x(2010))
			.attr("y2", y(tract.pct_college_ref_pctile))
			.style("stroke-width", 3)
			.style("stroke", color("college"))
			.style("stroke-dasharray", ("3, 3"))
			.style("opacity", 0.5);

		svg.append("circle")
			.attr("id", "college2010")
			.attr("class", "step9")
			.attr("cx", x(2010))
			.attr("cy", y(tract.pct_college_10_pctile))
			.attr("r", pointRad)
			.style("fill", color("college"))
			.style("opacity", 1);

		svg.append("line")
			.attr("id", "collegeLine")
			.attr("class", "step9")
			.attr("x1", x(2000))
			.attr("y1", y(tract.pct_college_00_pctile))
			.attr("x2", x(2010))
			.attr("y2", y(tract.pct_college_10_pctile))
			.style("stroke-width", 3)
			.style("stroke", color("college"))
			.style("opacity", 1);

		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0, "+(margin.top+figh)+")")
			.call(xAxis);

		svg.append("text")
			.text("Census Year")
			.style("text-anchor", "middle")
			.style("font-weight", "bold")
			.attr("transform", "translate("+(margin.left+width/2)+", "+(margin.top+figh+margin.bottom*2)+")");


		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate("+(margin.left)+", 0)")
			.call(yAxis);

		svg.append("text")
			.text("Percentile")
			.style("text-anchor", "middle")
			.style("font-weight", "bold")
			.attr("transform", "translate(10, "+(height/2+margin.top)+"), rotate(-90)")
			.attr("trans");

		if(showLegend) {
			var legend = svg.append("g")
				.attr("transform", "translate("+(width/4)+", "+(height+50)+")");

			// legend.append("text").text("TESTING");
			var lBoxSize = 20;
			for(var i = 0; i < lines.length; i++) {
				legend.append("rect")
					.attr("width", lBoxSize)
					.attr("height", lBoxSize)
					.attr("x", 0)
					.attr("y", i*(lBoxSize+5))
					.style("fill", color(lines[i]));
				

				legend.append("text")
					.text(prettyLineText(lines[i]))
					.attr("x", lBoxSize+10)
					.attr("y", i*(lBoxSize+5)+lBoxSize-7)
					.style("fill", color(lines[i]));
			}
		}
	}

	var public = {
		"plot": plot_,
		"tract": tract_,
		"legend": showLegend_,
		"selector": selector_,
		"height": height_,
		"width": width_
	}

	return public;
}

var size = 700;
var thickness = 40;
var margin = 50;
var radius = (size)/2 - margin;
var levels = 3;
var level_gap = 10;
var income_groups = ["low", "medium", "high"];
var damage_levels = [1, 2, 3]
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
	.outerRadius(radius - ((levels-1)*(thickness+level_gap)))
	.innerRadius(radius - ((levels-1)*(thickness+level_gap)) - thickness)

var l1Pie = d3.pie()
	.sort(function(a, b) {
		return d3.ascending(a.income_group, b.income_group) || d3.ascending(a.population_00, b.population_00);
	})
	.padAngle(0.004)
	.startAngle(0.3)
	.endAngle(2*Math.PI-0.3)
	.value(function(d) { return d.population_00; });

var getStartAngle = function(d) {
	return d3.min(d, function(d) { return d.startAngle; });
}

var getEndAngle = function(d) {
	return d3.max(d, function(d) { return d.endAngle; });
}

var prettyIncomeText = function(income_group) {
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

var prettyDamageText = function(damage_level) {
	var text = "";
	switch(damage_level) {
		case 1:
			text = "Most Damage";
			break;
		case 2:
			text = "Moderate Damage";
			break;
		case 3:
			text = "Least Damage"
	}

	return text;
}

var prettyGentrificationText = function(gent_status) {
	var text = "";
	switch(gent_status) {
		case "ineligible":
			text = "Not eligible to gentrify";
			break;
		case "eligible":
			text = "Eligible, but did not gentrify";
			break;
		case "gentrified":
			text = "Gentrified"
	}

	return text;
}


var svg = d3.select("#viz").append("svg")
		.attr("width", size)
		.attr("height", size+50);

svg.append("rect")
	.attr("width", size)
	.attr("height", size)
	.style("fill", "#FFFFFF")

var gtop = svg.append("g")
	.attr("transform", "translate(" + (size / 2) + "," + (size / 2) + ")");


gtop.append("circle")
	.attr("x", 0)
	.attr("y", 0)
	.attr("r", radius-(thickness*(levels+2))+20)
	.style("fill", "#666666")

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

var gentLines = gentrificationLines();
var displayGentLines = function(d) {
	svg.selectAll("path").style("stroke", "none");
	d3.select(this).style("stroke", "black");
	gentLines.tract(d.data).legend(true);
	gentLines.plot();
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
		.style("fill-opacity", function(d) { return opacity(d.data.gent_status); })
		.on("mouseover", updateText)
		.on("mouseout", function(d) { hoverText.style("display", "none"); })
		.on("click", displayGentLines);

	var drawIncomeLabelArc = function(income_group) {
		var startAngle = getStartAngle(l1Pie(l1).filter(function(d) { return d.data.income_group == income_group; }));
		var endAngle = getEndAngle(l1Pie(l1).filter(function(d) { return d.data.income_group == income_group; }));
		
		var labelArc = d3.arc()
			.outerRadius(radius-(10 + thickness*(levels+1)))
			.innerRadius(radius-(10 + thickness*(levels+1)))
			.startAngle(startAngle)
			.endAngle(endAngle);

		gtop.append("path")
			.attr("class", "incomeLabelArc")
			.attr("id", "incomeLabelArc"+income_group)
			.attr("d", labelArc)
			.style("fill", "white");

		gtop.append("text")
				.style("fill", color(income_group))
				.attr("text-anchor", "middle")
			.append("textPath")
				.attr("xlink:href", "#incomeLabelArc"+income_group)
				.attr("startOffset", "25%")
				.text(prettyIncomeText(income_group));
	}

	var incomeLabelArc = income_groups.forEach(function(d) { drawIncomeLabelArc(d); });

	var drawDamageLabelArc = function(damage_level) {
		var startAngle = -0.3;
		var endAngle = 0.3;

		var outerRadius = (radius - ((levels-damage_level)*(thickness+level_gap)));
		var innerRadius = outerRadius-thickness;

		var labelBGArc = d3.arc()
			.outerRadius(outerRadius)
			.innerRadius(innerRadius)
			.startAngle(startAngle)
			.endAngle(endAngle);

		var labelArc = d3.arc()
			.outerRadius(outerRadius-level_gap)
			.innerRadius(innerRadius)
			.startAngle(startAngle)
			.endAngle(endAngle);

		gtop.append("path")
			.attr("class", "damageLabelBGArc")
			.attr("id", "damageLabelBGArc"+damage_level)
			.attr("d", labelBGArc)
			.style("fill", "#555555");

		gtop.append("path")
			.attr("class", "damageLabelArc")
			.attr("id", "damageLabelArc"+damage_level)
			.attr("d", labelArc)
			.style("fill", "none");

		gtop.append("text")
				.attr("text-anchor", "middle")
				.style("font-weight", "bold")
				.style("fill", "#EEEEEE")
			.append("textPath")
				.attr("xlink:href", "#damageLabelArc"+damage_level)
				.attr("startOffset", "22%")
				.attr("alignment-baseline", "text-before-edge")
				.text(prettyDamageText(damage_level));
	}

	var damageLabelArc = damage_levels.forEach(function(d) { drawDamageLabelArc(d); })

	var drawArc = function(damage_level, income_group) {
		var startAngle = getStartAngle(l1Pie(l1).filter(function(d) { return d.data.income_group == income_group; }));
		var l1EndAngle = getEndAngle(l1Pie(l1).filter(function(d) { return d.data.income_group == income_group; }));
		var l1Pop = d3.sum(l1.filter(function(d) { return d.income_group == income_group; }), function(d) { return d.population_00; });

		var lCur = tracts.filter(function(d) { return d.damage_level == damage_level && d.income_group == income_group; });
		var lCurPop = d3.sum(lCur, function(d) { return d.population_00; });
		var lCurScale = lCurPop / l1Pop;
		var endAngle = (l1EndAngle - startAngle)*lCurScale + startAngle



		var lCurArc = d3.arc()
			.outerRadius(radius - ((levels-damage_level)*(thickness+level_gap)))
			.innerRadius(radius - ((levels-damage_level)*(thickness+level_gap)) - thickness)

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
			.style("fill-opacity", function(d) { return opacity(d.data.gent_status); })
			// .style("stroke-opacity", 1)
			.on("mouseover", updateText)
			.on("mouseout", function(d) { hoverText.style("display", "none"); })
			.on("click", displayGentLines);

		// console.log(startAngle);
		// console.log(endAngle);
	}

	var drawRing = function(damage_level) {
		income_groups.forEach(function(d) { drawArc(damage_level, d)});
	}

	var rings = damage_levels
		.filter(function(d) { return d > 1; })
		.forEach(drawRing);

	var legend = svg.append("g")
			.attr("transform", "translate("+(radius-50)+", "+(size-margin)+")");
	// legend.append("text").text("TESTING");
	// legend.append("rect")
	// 	.attr("x", 0)
	// 	.attr("y", 0)
	// 	.attr("width", 10)
	// 	.attr("height", 10)
	// 	.style("fill", "blue");

	var lBoxSize = 25;
	for(var i = 0; i < gent_statuses.length; i++) {
		lBoxY = i*(lBoxSize+5);
		
		for(var j = 0; j < income_groups.length; j++) {
			lBoxX = j*lBoxSize;

			legend.append("rect")
				.attr("x", lBoxX)
				.attr("y", lBoxY)
				.attr("width", lBoxSize)
				.attr("height", lBoxSize)
				.style("fill", color(income_groups[j]))
				.style("opacity", opacity(gent_statuses[i]));
		}

		legend.append("text")
			.text(prettyGentrificationText(gent_statuses[i]))
			.attr("x", lBoxSize*3+5)
			.attr("y", lBoxY+lBoxSize-7);

		// console.log(gent_statuses[i]);
	}
	// gent_statuses.forEach(function(gent) {
	// 	var y = 
	// });


	var overlay = d3.select("body").append("svg")
			.attr("x", 0)
			.attr("y", 0)
			.attr("id", "overlay")
			.attr("height", 750)
			.attr("width", 1100)
			.style("position", "fixed")
			.style("left", 0)
			.on("click", function(d) { d3.select(this).style("display", "none"); });
	overlay
		.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("height", 750)
			.attr("width", 1100)
			.style("fill", "white")
			.style("opacity", 1);

	var exampleTract = tracts.filter(function(d) { return d.gentrified; })[0];

	var example1 = overlay.append("g").attr("id", "example1")
		.attr("transform", "translate(50, 0)");
	var example1chart = gentrificationLines();
	example1chart
		.tract(exampleTract)
		.selector("#example1")
		.width(300).height(300)
		.plot();

	var example1text = example1.append("text")
		.attr("transform", "translate(20, 350)")
		.style("font-size", 11);

	example1text.append("tspan")
		.text("Gentrification is the process of fiscal transformation of a");

	example1text.append("tspan")
		.text("community in an affluent direction. The process itself does not")
		.attr("x", 0)
		.attr("dy", 12);

	example1text.append("tspan")
		.text("depend on a specific event, but to be described as 'gentrified,'")
		.attr("x", 0)
		.attr("dy", 12);

	example1text.append("tspan")
		.text("a community would experience these changes in a relatively brief")
		.attr("x", 0)
		.attr("dy", 12);

	example1text.append("tspan")
		.text("period of time. While gentrification methodologies can also use ")
		.attr("x", 0)
		.attr("dy", 12);

	example1text.append("tspan")
		.text("demographics of household relations and racial diversity as a metric,")
		.attr("x", 0)
		.attr("dy", 12);

	example1text.append("tspan")
		.text("this representation uses solely the financial features to determine")
		.attr("x", 0)
		.attr("dy", 12);

	example1text.append("tspan")
		.text("determine gentrification eligibility and status.")
		.attr("x", 0)
		.attr("dy", 12);

	example1text.append("tspan")
		.text("Above is an example of a census tract within New Orleans")
		.attr("x", 0)
		.attr("dy", 20)
		.style("font-weight", "bold");

	example1text.append("tspan")
		.text("that has gentrified.")
		.attr("x", 0)
		.attr("dy", 12)
		.style("font-weight", "bold");

	var example2 = overlay.append("g")
		.attr("id", "example2")
		.attr("transform", "translate(400, 0)")
	var example2chart = gentrificationLines();
	example2chart
		.tract(exampleTract)
		.selector("#example2")
		.width(300).height(300)
		.plot();

	var example2text = example2.append("text")
		.attr("transform", "translate(20, 350)")
		.style("font-size", 11);

	example2text.append("tspan")
		.text("One common metric used to evaluate gentrification is median");

	example2text.append("tspan")
		.text("income. For a community to be considered 'eligible' to gentrify,")
		.attr("x", 0)
		.attr("dy", 12);

	example2text.append("tspan")
		.text("starting median income must be below the 40th percentile of")
		.attr("x", 0)
		.attr("dy", 12);

	example2text.append("tspan")
		.text("incomes in the city. The ending income of a gentrified community")
		.attr("x", 0)
		.attr("dy", 12);

	example2text.append("tspan")
		.text("may be above this marker, however median income metrics often")
		.attr("x", 0)
		.attr("dy", 12);

	example2text.append("tspan")
		.text("lag relative to other fiscal indicators. Therefore median income")
		.attr("x", 0)
		.attr("dy", 12);

	example2text.append("tspan")
		.text("is only used to verify eligibility.")
		.attr("x", 0)
		.attr("dy", 12);

	example2text.append("tspan")
		.text("Because the tract has a starting (2000) median income below")
		.attr("x", 0)
		.attr("dy", 20)
		.style("font-weight", "bold");

	example2text.append("tspan")
		.text("the 40th percentile, it is eligible to gentrify.")
		.attr("x", 0)
		.attr("dy", 12)
		.style("font-weight", "bold");

	example2.selectAll("line").style("opacity", 0.1);
	example2.selectAll("circle").style("opacity", 0.1);
	example2.select(".step1").style("opacity", 1);
	example2.select(".step2").style("opacity", 1);
	example2.selectAll(".step3").style("opacity", 1);



	var example3 = overlay.append("g")
		.attr("id", "example3")
		.attr("transform", "translate(750, 0)")
	var example3chart = gentrificationLines();
	example3chart
		.tract(exampleTract).selector("#example3").width(300).height(300).plot();
	example3.selectAll(".step1").style("opacity", 0.1);
	example3.selectAll(".step2").style("opacity", 0.1);
	example3.selectAll(".step3").style("opacity", 0.1);

	var example3text = example3.append("text")
		.attr("transform", "translate(20, 350)")
		.style("font-size", 11);

	example3text.append("tspan")
		.text("This analysis uses the home value (pink) and educational");

	example3text.append("tspan")
		.text("attainment (orange) to evaluate the fiscal growth of a locality, as")
		.attr("x", 0)
		.attr("dy", 12);

	example3text.append("tspan")
		.text("these metrics tend to be leading indicators of growth, Instead of")
		.attr("x", 0)
		.attr("dy", 12);

	example3text.append("tspan")
		.text("comparing to a fixed target value, these metrics are compared")
		.attr("x", 0)
		.attr("dy", 12);

	example3text.append("tspan")
		.text("with the rates of growth with the city (adjusted for inflation). The")
		.attr("x", 0)
		.attr("dy", 12);

	example3text.append("tspan")
		.text("dotted lines indicate the target rate of increase for each value.")
		.attr("x", 0)
		.attr("dy", 12);

	example3text.append("tspan")
		.text("While a community can change and metrics of fiscal growth can")
		.attr("x", 0)
		.attr("dy", 12);

	example3text.append("tspan")
		.text("increase, only those that increase more rapidly than the norm can")
		.attr("x", 0)
		.attr("dy", 12);

	example3text.append("tspan")
		.text("be labeled as 'gentrified.' ")
		.attr("x", 0)
		.attr("dy", 12);

	example3text.append("tspan")
		.text("")
		.attr("x", 0)
		.attr("dy", 12);

	example3text.append("tspan")
		.text("Because growth in home value and educational attainment")
		.attr("x", 0)
		.attr("dy", 20)
		.style("font-weight", "bold");

	example3text.append("tspan")
		.text("are both above the norm, we consider the tract gentrified.")
		.attr("x", 0)
		.attr("dy", 12)
		.style("font-weight", "bold");

	overlay.append("text")
		.text("Click anywhere to continue")
		.attr("y", 550)
		.attr("x", 550)
		.attr("text-anchor", "middle")
		.style("font-weight", "bold")
		.style("font-size", 20);

});