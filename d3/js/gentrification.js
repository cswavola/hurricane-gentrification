// var lineViz = function() {
// 	var height = 600;
// 	var width = 400;
// 	var margin = {top: 20, right: 20, bottom: 20, left: 40};
// 	var pointRad = 5;
// 	var svg = null;
// 	var g = null;

// 	var figh = height-margin.top-margin.bottom;
// 	var figw = width-margin.left-margin.right;

// 	var colors = {"income": "green", "home_value": "blue", "college": "orange"};

// 	// Keep track of which visualization
// 	// we are on and which was the last
// 	// index activated. When user scrolls
// 	// quickly, we want to call all the
// 	// activate functions that they pass.
// 	var lastIndex = -1;
// 	var activeIndex = 0;

// 	var activateFunctions = [];

// 	var svg = d3.select("#lineviz").append("svg")
// 		.attr("height", height)
// 		.attr("width", width);

// 	var x = d3.scaleOrdinal()
// 		.range([margin.left, margin.left+figw])
// 		.domain([2000, 2010]);
// 	var y = d3.scaleLinear()
// 		.range([margin.top+figh, margin.top])
// 		.domain([0, 100]);

// 	var xAxis = d3.axisBottom()
// 		.scale(x);
// 	var yAxis = d3.axisLeft()
// 		.scale(y)
// 		.ticks(5);

// 	var chart = function(selection) {
// 		selection.each(function(tract) {
// 			console.log(tract);
// 			svg = d3.select(this).selectAll("svg")
// 				.data([tract]);

// 			var svge = svg.enter().append("svg");
// 			svg = svg.merge(svge)

// 			svg
// 				.attr("width", width)
// 				.attr("height", height);
// 			svg.append("g");

// 			// g = svg.select("g")
// 			// 	.attr("transform", "translate("+margin.left+","+margin.top+")");

// 			// g.append("circle");
// 			setupVis(tract);
// 			setupSections();
// 			// var svg = selection.append("svg")
// 			// 	.attr("height", height)
// 			// 	.attr("width", width);
// 		});
// 	};

// 	var setupVis = function(tract) {
// 		svg.append("line")
// 			.attr("id", "incThresh")
// 			.attr("class", "step1")
// 			.attr("x1", x(2000))
// 			.attr("y1", y(40))
// 			.attr("x2", x(2010))
// 			.attr("y2", y(40))
// 			.style("stroke-width", 2)
// 			.style("stroke", colors.income)
// 			.style("stroke-dasharray", ("3, 3"))
// 			.style("opacity", 0);

// 		svg.append("circle")
// 			.attr("id", "inc2000")
// 			.attr("class", "step2")
// 			.attr("cx", x(2000))
// 			.attr("cy", y(tract.med_income_00_pctile))
// 			.attr("r", pointRad)
// 			.style("fill", colors.income)
// 			.style("opacity", 0);

// 		svg.append("circle")
// 			.attr("id", "inc2010")
// 			.attr("class", "step3")
// 			.attr("cx", x(2010))
// 			.attr("cy", y(tract.med_income_10_pctile))
// 			.attr("r", pointRad)
// 			.style("fill", colors.income)
// 			.style("opacity", 0);

// 		svg.append("line")
// 			.attr("id", "incLine")
// 			.attr("class", "step3")
// 			.attr("x1", x(2000))
// 			.attr("y1", y(tract.med_income_00_pctile))
// 			.attr("x2", x(2010))
// 			.attr("y2", y(tract.med_income_10_pctile))
// 			.style("stroke-width", 3)
// 			.style("stroke", colors.income)
// 			.style("opacity", 0);

// 		svg.append("circle")
// 			.attr("id", "hv2000")
// 			.attr("class", "step4")
// 			.attr("cx", x(2000))
// 			.attr("cy", y(tract.med_home_value_00_pctile))
// 			.attr("r", pointRad)
// 			.style("fill", colors.home_value)
// 			.style("opacity", 0);

// 		console.log(tract.med_home_value_ref_pctile);
// 		console.log(tract.pct_college_ref_pctile);

// 		svg.append("line")
// 			.attr("id", "hvThresh")
// 			.attr("class", "step5")
// 			.attr("x1", x(2000))
// 			.attr("y1", y(tract.med_home_value_00_pctile))
// 			.attr("x2", x(2010))
// 			//.attr("y2", y(tract.med_home_value_10_pctile-10))
// 			.attr("y2", y(tract.med_home_value_ref_pctile))
// 			.style("stroke-width", 3)
// 			.style("stroke", colors.home_value)
// 			.style("stroke-dasharray", ("3, 3"))
// 			.style("opacity", 0);

// 		svg.append("circle")
// 			.attr("id", "hv2010")
// 			.attr("class", "step6")
// 			.attr("cx", x(2010))
// 			.attr("cy", y(tract.med_home_value_10_pctile))
// 			.attr("r", pointRad)
// 			.style("fill", colors.home_value)
// 			.style("opacity", 0);

// 		svg.append("line")
// 			.attr("id", "hvLine")
// 			.attr("class", "step6")
// 			.attr("x1", x(2000))
// 			.attr("y1", y(tract.med_home_value_00_pctile))
// 			.attr("x2", x(2010))
// 			.attr("y2", y(tract.med_home_value_10_pctile))
// 			.style("stroke-width", 3)
// 			.style("stroke", colors.home_value)
// 			.style("opacity", 0);


// 		svg.append("circle")
// 			.attr("id", "college2000")
// 			.attr("class", "step7")
// 			.attr("cx", x(2000))
// 			.attr("cy", y(tract.pct_college_00_pctile))
// 			.attr("r", pointRad)
// 			.style("fill", colors.college)
// 			.style("opacity", 0);

// 		svg.append("line")
// 			.attr("id", "collegeThresh")
// 			.attr("class", "step8")
// 			.attr("x1", x(2000))
// 			.attr("y1", y(tract.pct_college_00_pctile))
// 			.attr("x2", x(2010))
// 			//.attr("y2", y(tract.pct_college_10_pctile-10))
// 			.attr("y2", y(tract.pct_college_ref_pctile))
// 			.style("stroke-width", 3)
// 			.style("stroke", colors.college)
// 			.style("stroke-dasharray", ("3, 3"))
// 			.style("opacity", 0);

// 		svg.append("circle")
// 			.attr("id", "college2010")
// 			.attr("class", "step9")
// 			.attr("cx", x(2010))
// 			.attr("cy", y(tract.pct_college_10_pctile))
// 			.attr("r", pointRad)
// 			.style("fill", colors.college)
// 			.style("opacity", 0);

// 		svg.append("line")
// 			.attr("id", "collegeLine")
// 			.attr("class", "step9")
// 			.attr("x1", x(2000))
// 			.attr("y1", y(tract.pct_college_00_pctile))
// 			.attr("x2", x(2010))
// 			.attr("y2", y(tract.pct_college_10_pctile))
// 			.style("stroke-width", 3)
// 			.style("stroke", colors.college)
// 			.style("opacity", 0);



// 		svg.append("g")
// 			.attr("class", "axis")
// 			.attr("transform", "translate(0, "+(margin.top+figh)+")")
// 			.call(xAxis);


// 		svg.append("g")
// 			.attr("class", "axis")
// 			.attr("transform", "translate("+(margin.left)+", 0)")
// 			.call(yAxis);
// 	}

// 	var setupSections = function() {
// 		activateFunctions[0] = showStart;
// 		activateFunctions[1] = showIncThresh;
// 		activateFunctions[2] = showInc2000;
// 		activateFunctions[3] = showInc2010;
// 		activateFunctions[4] = showHV2000;
// 		activateFunctions[5] = showHVThresh;
// 		activateFunctions[6] = showHV2010;
// 		activateFunctions[7] = showCollege2000;
// 		activateFunctions[8] = showCollegeThresh;
// 		activateFunctions[9] = showCollege2010;
// 	};

// 	function showStart() {
// 		svg.selectAll(".step1")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0);
// 	}

// 	function showIncThresh() {
// 		svg.selectAll(".step1")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 1);

// 		svg.selectAll(".step2")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0);
// 	}

// 	function showInc2000() {
// 		svg.selectAll(".step2")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 1);

// 		svg.selectAll(".step3")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0);
// 	}

// 	function showInc2010() {
// 		svg.selectAll(".step1")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 1);
// 		svg.selectAll(".step2")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 1);
// 		svg.selectAll(".step3")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 1);

// 		svg.selectAll(".step4")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0);
// 	}

// 	function showHV2000() {
// 		svg.selectAll(".step1")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0.1);
// 		svg.selectAll(".step2")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0.1);
// 		svg.selectAll(".step3")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0.1);

// 		svg.selectAll(".step4")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 1);

// 		svg.selectAll(".step5")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0);
// 	}

// 	function showHVThresh() {
// 		svg.selectAll(".step5")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 1);

// 		svg.selectAll(".step6")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0);
// 	}

// 	function showHV2010() {
// 		svg.selectAll(".step4")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 1);
// 		svg.selectAll(".step5")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 1);
// 		svg.selectAll(".step6")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 1);

// 		svg.selectAll(".step7")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0);
// 	}

// 	function showCollege2000() {
// 		svg.selectAll(".step4")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0.1);
// 		svg.selectAll(".step5")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0.1);
// 		svg.selectAll(".step6")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0.1);

// 		svg.selectAll(".step7")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 1);

// 		svg.selectAll(".step8")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0);
// 	}

// 	function showCollegeThresh() {
// 		svg.selectAll(".step8")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 1);

// 		svg.selectAll(".step9")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 0);
// 	}

// 	function showCollege2010() {
// 		svg.selectAll(".step9")
// 			.transition()
// 			.duration(500)
// 			.style("opacity", 1);
// 	}

// 	chart.activate = function (index) {
// 	    activeIndex = index;
// 	    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
// 	    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
// 	    scrolledSections.forEach(function (i) {
// 	      activateFunctions[i]();
// 	    });
// 	    lastIndex = activeIndex;
// 	};

// 	return chart;
// };

function display(data) {
	//var tract = data.filter(function(d) { return d.gentrified; })[0];
	var tract = data.filter(function(d) { return d.gentrified; })[0];
	var lines = gentrificationLines();
	lines
		.tract(tract)
		.selector("#lineviz")
		.legend(true)
		.scroller(true)
		.plot()
	// var plot = lineViz();
	// d3.select("#lineviz")
	// 	.datum(tract)
	// 	.call(plot);

	var scroll = scroller()
		.container(d3.select("#master"));
	scroll(d3.selectAll(".step"));
	scroll.on("active", function(index) {
		d3.selectAll(".step")
			.style("opacity", function(d, i) { return i === index ? 1 : 0.1; });

		lines.activate(index);
	})
}

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

	d.pct_college_ref_pctile = parseInt(d.pct_college_ref_pctile)
	d.med_home_value_ref_pctile = parseInt(d.med_home_value_ref_pctile)

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

d3.csv("data/nola_viz_data.csv", rowConverter, display);