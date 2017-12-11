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

	var hoverText = null;
	var showLegend = true;
	var scroller = false;


	// Keep track of which visualization
	// we are on and which was the last
	// index activated. When user scrolls
	// quickly, we want to call all the
	// activate functions that they pass.
	var lastIndex = -1;
	var activeIndex = 0;

	var activateFunctions = [];

	var selector = "#viz";

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
		// return d3.ascending(a.income_group, b.income_group) || d3.descending(gent_statuses.indexOf(a.gent_status), gent_statuses.indexOf(b.gent_status)) || d3.ascending(a.population_00, b.population_00);
		return d3.ascending(a.income_group, b.income_group) || d3.descending(gent_statuses.indexOf(a.gent_status), gent_statuses.indexOf(b.gent_status)) || d3.ascending(a.abandoned, b.abandoned) || d3.ascending(a.population_00, b.population_00);
	}

	var l1Pie = d3.pie()
		.sort(segmentSort)
		.padAngle(0.004)
		.startAngle(0.3)
		.endAngle(2*Math.PI-0.3)
		.value(function(d) { return d.population_00; });


	var selector_ = function(_) {
		var that = this;
		if(!arguments.length) return selector;
		selector = _;
		return that;
	}

	var scroller_ = function(_) {
		var that = this;
		if(!arguments.length) return scroller;
		scroller = _;
		return that;
	}

	var size_ = function(_) {
		var that = this;
		if(!arguments.length) return size;
		size = _;
		return that;
	}

	var legend_ = function(_) {
		var that = this;
		if(!arguments.length) return showLegend;
		showLegend = _;
		return that;
	}

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

	var incomeLevelText = function(level) {
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

	var damageLevelText = function(level) {
		var text = "";
		switch(level) {
			case 3:
				text = "Low";
				break;
			case 2:
				text = "Medium";
				break;
			case 1:
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


	



	var plot_ = function(tracts) {
		var svg = d3.select(selector).append("svg")
				.attr("width", size)
				.attr("height", size+50);

		svg.append("rect")
			.attr("width", size)
			.attr("height", size)
			.style("fill", "#FFFFFF")

		var gtop = svg.append("g")
			.attr("transform", "translate(" + (size / 2) + "," + (size / 2) + ")");


		gtop.append("circle")
			.attr("class", "eye")
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

		var updateText = function(d) {
			hoverText.style("display", "block");
			// tractSpan.text(d.data.tract_id);
			// popSpan.text(d.data.population_00);
			incomeSpan.text(incomeLevelText(Math.floor(d.data.income_group)));
			damageSpan.text(damageLevelText(Math.floor(d.data.damage_level)));
			gentSpan.text(d.data.gent_status);
		}

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

		// var pattern = gtop.append("defs")
		// 	.append("pattern")
		// 		.attr("id", "diagonalHatch")
		// 		.attr("patternUnits", "userSpaceOnUse")
		// 		.attr("width", 4)
		// 		.attr("height", 4)
		// 	.append("path")
		// 		.attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
		// 	    .attr('stroke', '#000000')
			    // .attr('stroke-width', 1);
			// .append("rect");
			// 	.attr({ width:"4", height:"8", transform:"translate(0,0)", fill:"#88AAEE" });

		var l1 = tracts.filter(function(d) { return d.damage_level == 1; });

		// var g1 = gtop.selectAll(".arc1")
		// 		.data(l1Pie(l1))
		// 	.enter().append("g")
		// 		.attr("class", function(d) { return "arc damage1 income"+d.data.income_group; });

		// g1.append("path")
		// 	.attr("d", l1Arc);
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
				.attr("class", "arcLabel income"+income_group)
				.attr("id", "incomeLabelArc"+income_group)
				.attr("d", labelArc)
				.style("fill", "white");

			gtop.append("text")
					.attr("class", "arcLabel income"+income_group)
					.style("fill", color(income_group))
					.attr("text-anchor", "middle")
				.append("textPath")
					.attr("class", "arcLabel income"+income_group)
					.attr("xlink:href", "#incomeLabelArc"+income_group)
					.attr("startOffset", "25%")
					.text(prettyIncomeText(income_group));


			var highlightArc = d3.arc()
				.outerRadius(radius-((thickness+level_gap)*(levels)-level_gap+3))
				.innerRadius(radius-((thickness+level_gap)*(levels)))
				.startAngle(startAngle)
				.endAngle(endAngle);

			gtop.append("path")
				.attr("class", "arcLabel income"+income_group)
				.attr("id", "incomeLabelArc"+income_group)
				.attr("d", highlightArc)
				.style("fill", color(income_group));
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
				.attr("class", "arcLabel damage"+damage_level)
				.attr("id", "damageLabelBGArc"+damage_level)
				.attr("d", labelBGArc)
				.style("fill", "#555555");

			gtop.append("path")
				.attr("class", "arcLabel damage"+damage_level)
				.attr("id", "damageLabelArc"+damage_level)
				.attr("d", labelArc)
				.style("fill", "none");

			gtop.append("text")
					.attr("class", "arcLabel damage"+damage_level)
					.attr("text-anchor", "middle")
					.style("font-weight", "bold")
					.style("fill", "#EEEEEE")
				.append("textPath")
					.attr("class", "arcLabel damage"+damage_level)
					.attr("xlink:href", "#damageLabelArc"+damage_level)
					.attr("startOffset", "22%")
					.attr("alignment-baseline", "text-before-edge")
					.text(prettyDamageText(damage_level));
		}


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
					.attr("class", "arc damage"+damage_level+" income"+income_group);

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
			// .filter(function(d) { return d > 1; })
			.forEach(drawRing);

		d3.selectAll(".arc")
			.style("fill", function(d) {
				if(d.data.abandoned) {
					return "#777777";
				} else {
					return color(d.data.income_group);
				}
				return color(d.data.income_group);
				// return "url(#diagonalHatch)";
			})
			.style("fill-opacity", function(d) {
				if(d.data.abandoned) {
					return 1;
				} else {
					return opacity(d.data.gent_status);
				}
			})
			.style("stroke-opacity", 1)
			.on("mouseover", function(d) {
				updateText(d);
				if(!scroller) {
					d3.select(this).style("cursor", "pointer");
				}
				console.log(d.data.abandoned);
			})
			.on("mouseout", function(d) {
				hoverText.style("display", "none");
				d3.select(this).style("cursor", "default");
			});

		if(showLegend) {
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

			lBoxY = lBoxTopPad+income_groups.length*(lBoxSize+5);
			lBoxX = 0;
			legend.append("rect")
				.attr("x", lBoxX)
				.attr("y", lBoxY)
				.attr("width", lBoxSize*3)
				.attr("height", lBoxSize)
				.style("fill", "#777777");
			legend.append("text")
				.text("Abandoned")
				.attr("x", lBoxSize*3+5)
				.attr("y", lBoxY+lBoxSize-7);

			// lBoxY = lBoxTopPad+i*(lBoxSize+5);
				
			// 	for(var j = 0; j < income_groups.length; j++) {
			// 		lBoxX = j*lBoxSize;

			// 		legend.append("rect")
			// 			.attr("x", lBoxX)
			// 			.attr("y", lBoxY)
			// 			.attr("width", lBoxSize)
			// 			.attr("height", lBoxSize)
			// 			.style("fill", color(income_groups[j]))
			// 			.style("opacity", opacity(gent_statuses[i]));
			// 	}

			// 	legend.append("text")
			// 		.text(prettyGentrificationText(gent_statuses[i]))
			// 		.attr("x", lBoxSize*3+5)
			// 		.attr("y", lBoxY+lBoxSize-7);

			// 	// console.log(gent_statuses[i]);
		}

		
		var damageLabelArc = damage_levels.forEach(function(d) { drawDamageLabelArc(d); })

		if(scroller) {
			d3.selectAll(".arc")
				.style("display", "none");
			toggle_(".arc", action="hide", duration=0);
			d3.selectAll(".arc")
				.style("display", "inline");

			d3.selectAll(".arcLabel, .eye")
				.style("opacity", 0);

			setupSections();
		}
	}

	var setupSections = function() {
		activateFunctions[0] = showStart;
		activateFunctions[1] = showEye;
		activateFunctions[2] = showIncome1Damage1;
		activateFunctions[3] = showIncome1Remaining;
		activateFunctions[4] = showIncome2Income3;
		activateFunctions[5] = showSummary;
	}

	function showStart() {
		d3.selectAll(".arcLabel, .eye")
			.transition(500)
			.style("opacity", 0);
	}

	function showEye() {
		toggle_(".income1.damage1,.income1.arcLabel,.damage1.arcLabel", action="hide");
		// 	.style("display", "none");

		d3.selectAll(".eye, .arcLabel")
			.transition(500)
			.style("opacity", 1);
	}

	function showIncome1Damage1() {
		toggle_(".income1.damage2,.income1.damage3", "hide");
		toggle_(".income1.damage1", "show");
	}

	function showIncome1Remaining() {
		toggle_(".income2,.income3", "hide");
		toggle_(".income1.damage2,.income1.damage3", "show");
	}

	function showIncome2Income3() {
		toggle_(".income2,.income3", "show");
	}

	function showSummary() {

	}

	var activate_ = function (index) {
		console.log(activateFunctions);
	    activeIndex = index;
	    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
	    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
	    scrolledSections.forEach(function (i) {
	      activateFunctions[i]();
	    });
	    lastIndex = activeIndex;
	};

	var callback_ = function(cbfunc) {
		d3.selectAll(".arc")
			.on("click", cbfunc);
	}



	/* TWEEN TEST */
	function arcTween(action) {
		return function(d) {
			// d.data.oldStart = d.startAngle;
			// d.data.oldEnd = d.endAngle;
			if(action == "toggle" || (action == "show" && d.data.nextStart != 0 && d.data.nextEnd != 0) || (action == "hide" && d.data.nextStart == 0 && d.data.nextEnd == 0)) {
				var newStart = d.data.nextStart;
				var newEnd = d.data.nextEnd;
				d.data.nextStart = d.startAngle;
				d.data.nextEnd = d.endAngle;

				var interpolateStart = d3.interpolate(d.startAngle, newStart);
				var interpolateEnd = d3.interpolate(d.endAngle, newEnd);

				return function(t) {
					d.startAngle = interpolateStart(t);
					d.endAngle = interpolateEnd(t);
					console.log(l1Arc(d));

					// return l1Arc(d);
					var newArc = d3.arc()
						.outerRadius(radius - ((levels-d.data.damage_level)*(thickness+level_gap)))
						.innerRadius(radius - ((levels-d.data.damage_level)*(thickness+level_gap)) - thickness)

					return newArc(d);
				};
			}
		};
	}

	function toggle_(selector, action="toggle", duration=750) {
		console.log("Hiding");
		d3.selectAll(selector).selectAll("path")
			.transition()
			.duration(duration)
			.attrTween("d", arcTween(action));
			// .attr("opacity", 0);
	}


	public = {
		"plot": plot_,
		"callback": callback_,
		"selector": selector_,
		"size": size_,
		"legend": legend_,
		"activate": activate_,
		"scroller": scroller_,
		"toggle": toggle_
	}

	return public;
}