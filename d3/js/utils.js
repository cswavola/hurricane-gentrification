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

	d.nextStart = 0;
	d.nextEnd = 0;

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