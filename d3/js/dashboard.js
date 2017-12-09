var radialChart = function() {
	var size = 700;
	var thickness = 40;
	var margin = 50;
	var radius = (size)/2 - margin;
	var levels = 3;
	var level_gap = 10;
	var income_groups = [1, 2, 3];
	var damage_levels = [1, 2, 3];
	var gent_statuses = ["ineligible", "eligible", "gentrified"];

	var x = d3.scaleLinear()
		.range([0, 2*Math.PI]);

	var y = d3.scaleSqrt()
		.range([0, radius]);

	var color = d3.scaleOrdinal()
		.range(["red", "purple", "blue"])
		// .range(["#F8B619","#06BC40","#600F97"])
		.domain(income_groups);

	var opacity = d3.scaleOrdinal()
		.range([0.2, 0.5, 1.0])
		.domain(gent_statuses);

	var l1Arc = d3.arc()
		.outerRadius(radius - ((levels-1)*(thickness+level_gap)))
		.innerRadius(radius - ((levels-1)*(thickness+level_gap)) - thickness)

	var segmentSort = function(a, b) {
		return d3.ascending(a.income_group, b.income_group) || d3.descending(gent_statuses.indexOf(a.gent_status), gent_statuses.indexOf(b.gent_status)) || d3.ascending(a.population_00, b.population_00);
		// return d3.ascending(a.income_group, b.income_group) || d3.descending(gent_statuses.indexOf(a.gent_status), gent_statuses.indexOf(b.gent_status)) || d3.ascending(a.abandoned, b.abandoned) || d3.ascending(a.population_00, b.population_00);
	}

	var l1Pie = d3.pie()
		.sort(segmentSort)
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
			case 1:
				text = "Low Income Tracts";
				break;
			case 2:
				text = "Middle Income Tracts";
				break;
			case 3:
				text =  "High Income Tracts";
				break;
		}

		return text;
	}

	var levelText = function(level) {
		var text = "";
		switch(level) {
			case 1:
				text = "Low";
				break;
			case 2:
				text = "Medium";
				break;
			case 3:
				text = "High";
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
				text = "Ineligible to gentrify";
				break;
			case "eligible":
				text = "Eligible, did not gentrify";
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

	// var tractSpan = hoverText.append("tspan")
	// 	.text("Tract: ")
	// 	.append("tspan");

	// var popSpan = hoverText.append("tspan")
	// 	.text("Population: ")
	// 	.attr("x", -90)
	// 	.attr("dy", 20)
	// 	.append("tspan");

	var incomeSpan = hoverText.append("tspan")
		.text("Income Level: ")
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

	var updateText = function(d) {
		hoverText.style("display", "block");
		// tractSpan.text(d.data.tract_id);
		// popSpan.text(d.data.population_00);
		incomeSpan.text(levelText(Math.floor(d.data.income_group)));
		damageSpan.text(levelText(Math.floor(d.data.damage_level)));
		gentSpan.text(d.data.gent_status);
	}

	var plot_ = function(tracts) {
		var pattern = gtop.append("defs")
			.append("pattern")
				.attr("id", "diagonalHatch")
				.attr("patternUnits", "userSpaceOnUse")
				.attr("width", 4)
				.attr("height", 4)
			.append("path")
				.attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
			    .attr('stroke', '#000000')
			    .attr('stroke-width', 1);
			// .append("rect");
			// 	.attr({ width:"4", height:"8", transform:"translate(0,0)", fill:"#88AAEE" });

		var l1 = tracts.filter(function(d) { return d.damage_level == 1; });

		var g1 = gtop.selectAll(".arc1")
				.data(l1Pie(l1))
			.enter().append("g")
				.attr("class", "arc1 arc");

		g1.append("path")
			.attr("d", l1Arc);
			// .on("mouseover", updateText)
			// .on("mouseout", function(d) { hoverText.style("display", "none"); })
			// .on("click", displayGentLines);

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
				.sort(segmentSort)
				.startAngle(startAngle)
				.endAngle(endAngle)
				.padAngle(0.004)
				.value(function(d) { return d.population_00; });

			var gCur = gtop.selectAll(".arc"+damage_level+income_group)
					.data(lCurPie(lCur))
				.enter().append("g")
					.attr("class", "arc arc"+damage_level+income_group);

			gCur.append("path")
				.attr("d", lCurArc);
				// .style("stroke-opacity", 1);
				// .on("mouseover", updateText)
				// .on("mouseout", function(d) { hoverText.style("display", "none"); })
				// .on("click", displayGentLines);

			// console.log(startAngle);
			// console.log(endAngle);
		}

		var drawRing = function(damage_level) {
			income_groups.forEach(function(d) { drawArc(damage_level, d)});
		}

		var rings = damage_levels
			.filter(function(d) { return d > 1; })
			.forEach(drawRing);

		d3.selectAll(".arc")
			.style("fill", function(d) {
				// if(d.data.abandoned) {
				// 	return "black";
				// } else {
				// 	return color(d.data.income_group);
				// }
				return color(d.data.income_group);
				// return "url(#diagonalHatch)";
			})
			.style("fill-opacity", function(d) { return opacity(d.data.gent_status); })
			.style("stroke-opacity", 1)
			.on("mouseover", function(d) {
				updateText(d);
				d3.select(this).style("cursor", "pointer");
				console.log(d.data.abandoned);
			})
			.on("mouseout", function(d) {
				hoverText.style("display", "none");
				d3.select(this).style("cursor", "default");
			})
			.on("click", displayDetails);


		var legend = svg.append("g")
				// .attr("transform", "translate(0,"+(size-3*margin)+")");
				.attr("transform", "translate(10, 550)");

		legend.append("text")
			.text("Chart Key")
			.style("font-weight", "bold");

		var lBoxSize = 25;
		var lBoxTopPad = 5
		for(var i = 0; i < gent_statuses.length; i++) {
			lBoxY = lBoxTopPad+i*(lBoxSize+5);
			
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
	}

	var callback_ = function(cbfunc) {
		d3.selectAll(".arc")
			.on("click", cbfunc);
	}

	public = {
		"plot": plot_,
		"callback": callback_
	}

	return public;
}

var gentrificationStatusText = function(gent_status) {
	var text = "";
	switch(gent_status) {
		case "gentrified":
			text = "gentrified";
			break;
		case "eligible":
			text = "eligible to gentrify, but did not do so";
			break;
		case "ineligible":
			text = "ineligible to gentrify";
			break;
	}

	return text;
}

var moneyFormat = function(num) {
	return Number(num).toLocaleString("en-US", options={style: "currency", currency: "USD"});
}

var percentFormat = function(num) {
	return Number(num/100).toLocaleString("en-US", options={style: "percent"});
}

var displayDetails = function(d) {
	hideGentChart();
	d3.select("#viz").selectAll("path").style("stroke", "none");
	d3.select(this).select("path").style("stroke", "black");

	d3.select("#tractID").select("span").html(d.data.tract_id);
	d3.select("#status").select("span").html(gentrificationStatusText(d.data.gent_status));

	d3.select("#gentrification")
		.style("display", "none");

	d3.selectAll(".initialOverlay")
		.style("display", "none");

	var gentLines = gentrificationLines();
	gentLines.height(380);
	gentLines.selector("#gentrification");
	gentLines.tract(d.data).legend(true);
	gentLines.plot();

	d3.selectAll(".detailAnnotations")
		.style("opacity", 1);

	map.highlight(d.data.tract_id);

	d3.select("#population_00")
		.html(d.data.population_00);
	d3.select("#population_10")
		.html(d.data.population_10);
	d3.select("#med_income_00")
		.html(moneyFormat(d.data.med_income_00));
	d3.select("#med_income_10")
		.html(moneyFormat(d.data.med_income_10));
	d3.select("#med_home_value_00")
		.html(moneyFormat(d.data.med_home_value_00));
	d3.select("#med_home_value_10")
		.html(moneyFormat(d.data.med_home_value_10));
	d3.select("#pct_college_00")
		.html(percentFormat(d.data.pct_college_00));
	d3.select("#pct_college_10")
		.html(percentFormat(d.data.pct_college_10));
	d3.select("#pct_white_00")
		.html(percentFormat(d.data.pct_white_00));
	d3.select("#pct_white_10")
		.html(percentFormat(d.data.pct_white_10));


	d3.select("#detail")
		.style("display", "block");
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

	d.population_00 = parseInt(d.population_00);
	d.population_00_pctile = parseInt(d.population_00_pctile);
	d.population_10 = parseFloat(d.population_10);
	d.population_10_pctile = parseInt(d.population_10_pctile);
	d.population_change = parseFloat(d.population_change);
	d.population_change_pctile = parseInt(d.population_change_pctile);

	d.pct_damage = parseFloat(d.pct_damage);

	if(d.population_10/d.population_00 <= 0.5) {
		d.abandoned = true;
	} else {
		d.abandoned = false;
	}

	if(d.med_income_00_pctile <= 33) {
		d.income_group = 1;
	} else if(d.med_income_00_pctile <= 66) {
		d.income_group = 2;
	} else {
		d.income_group = 3;
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

// d3.json("data/nola_shape_projected.json",

var hideGentChart = function() {
	d3.select("#gentrification")
		.style("display", "none")
		.select("#closeButton").remove();
	d3.select("#topLeft")
		.transition(500)
			.style("width", "220px")
			.style("height", "120px");
}

var radial = radialChart();
var map = nola_map();

d3.queue()
.defer(d3.csv, "data/nola_viz_data.csv", rowConverter)
.defer(d3.json, "data/nola_shape_projected.json")
.await(function(error, tracts, nola) {
// d3.csv("data/nola_viz_data.csv", rowConverter, function(tracts) {
	radial.plot(tracts);
	radial.callback(displayDetails);
	map.features(nola.features.filter(function(d) { return d.properties.ALAND != "0"; }));
	map.plot();

	d3.select("#why")
		.on("click", function() {
			d3.select("#topLeft")
				.transition(500)
				.style("width", "650px")
				.style("height", "475px")
				.on("end", function() {
					d3.select("#gentrification")
						.style("display", "block")
						.select("svg").append("text")
							.attr("id", "closeButton")
							.attr("x", 565)
							.attr("y", 377)
							.style("fill", "black")
							.text("[x] close")
								.on("click", hideGentChart)
								.on("mouseover", function(d) {
									d3.select(this).style("cursor", "pointer");
								});
				});
		});
	
	// gent_statuses.forEach(function(gent) {
	// 	var y = 
	// });


	

	var exampleTract = tracts.filter(function(d) { return d.gentrified; })[0];

	var example1chart = gentrificationLines();
	example1chart
		.tract(exampleTract)
		.selector("#example1")
		.width(300).height(300)
		.plot();

	var example2chart = gentrificationLines();
	example2chart
		.tract(exampleTract)
		.selector("#example2")
		.width(300).height(300)
		.plot();

	var example2 = d3.select("#example2");
	example2.selectAll("line").style("opacity", 0.1);
	example2.selectAll("circle").style("opacity", 0.1);
	example2.select(".step1").style("opacity", 1);
	example2.select(".step2").style("opacity", 1);
	example2.selectAll(".step3").style("opacity", 1);
	example2.selectAll(".step4").style("opacity", 1);



	var example3chart = gentrificationLines();
	example3chart
		.tract(exampleTract).selector("#example3").width(300).height(300).plot();

	var example3 = d3.select("#example3");
	example3.selectAll(".step1").style("opacity", 0.1);
	example3.selectAll(".step2").style("opacity", 0.1);
	example3.selectAll(".step3").style("opacity", 0.1);

	d3.select("#overlay").on("click", function(d) {
		var sel = d3.select(this);
		sel.transition()
			.duration(500).style("opacity", 0)
			.on("end", function(d) {
				sel.style("display", "none");
				d3.select("#viz").style("display", "block");
			});
	});

	var detail = d3.select("#detail");
	console.log(window.innerWidth);
});