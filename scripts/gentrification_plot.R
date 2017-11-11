library(reshape2)
ltdb_damage <- read.csv("arcdemo/data/nola_viz_data.csv")
ltdb_damage[15,]
ltdb_long <- melt(ltdb_damage, id.vars="tract_id")

ltdb_long$year <- sub(".*_", "", ltdb_long$variable)
ltdb_long$variable <- sub("_00", "", sub("_10", "", ltdb_long$variable))

apply(ltdb_long, 1, myfun)


vars = c("med_income_pctile", "med_home_value_pctile", "pct_college_pctile")
tract <- ltdb_long[ltdb_long$tract_id == 22071001100 & ltdb_long$variable %in% vars,]
tract$year <- c(2000, 2010, 2000, 2010, 2000, 2010)
tract$value = as.integer(tract$value)

col <- c("med_income_pctile"="#7fc97f", "med_home_value_pctile"="#beaed4", "pct_college_pctile"="#fdc086")
alpha <- 0.5
ggplot(tract) +
  aes(x=year, y=value, color=variable, label=value) +
  geom_point() +
  geom_line(size=1.5) +
  geom_abline(slope=1.5, intercept=-2966, linetype=2, size=1, color=col["pct_college_pctile"], alpha=alpha) +
  geom_abline(slope=1.5, intercept=-2985, linetype=2, size=1, color=col["med_home_value_pctile"], alpha=alpha) +
  geom_abline(slope=0, intercept=40, linetype=3, size=1, color=col["med_income_pctile"], alpha=alpha) +
  #geom_text(position=position_dodge(1)) +
  theme_minimal() + theme(panel.grid.major = element_blank(), panel.grid.minor = element_blank(), axis.ticks = element_blank()) +
  scale_x_continuous(breaks=c(2000, 2010)) +
  scale_color_manual(values=col, labels=c("med_income_pctile"="Income", "med_home_value_pctile"="Home Value", "pct_college_pctile"="Education")) +
  labs(x="", y="Percentile", color="")

sub("_00", "", ltdb_long$variable)
