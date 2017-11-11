library(data.table)
library(stringr)
library(ggplot2)

inflation <- 1.266

ltdb_2010_samp <- fread("data/LTDB_Std_2010_Sample_NOLA.csv")
ltdb_2000_samp <- fread("data/LTDB_Std_2000_Sample_NOLA.csv")
ltdb_2000_full <- fread("data/LTDB_Std_2000_fullcount_NOLA.csv")

ltdb_2010_samp[, "TRTID10":=as.double(paste(
  statea,
  str_pad(countya, width=3, side="left", pad="0"),
  str_pad(tracta, width=6, side="left", pad="0"),
  sep=""
))]

ltdb_2000_full[, "PNHWHT00":=round(100*NHWHT00/POP00, 2)]
ltdb_2000_samp[, "PCOL00":=round(100*COL00/POP00SF3, 2)]

setkey(ltdb_2010_samp, TRTID10)
setkey(ltdb_2000_samp, TRTID10)
setkey(ltdb_2000_full, TRTID10)

ltdb_full <- ltdb_2000_samp[ltdb_2000_full][ltdb_2010_samp][, .(
  "tract_id" = TRTID10,
  "population_00" = POP00,
  "population_10" = pop12,
  "med_income_00" = HINC00,
  "med_income_10" = hinc12,
  "med_home_value_00" = MHMVAL00,
  "med_home_value_10" = mhmval12,
  "pct_college_00" = PCOL00,
  "pct_college_10" = pcol12,
  "pct_white_00" = PNHWHT00,
  "pct_white_10" = pnhwht12
)][med_income_10 != -999]

ltdb_full[, `:=`(
  "population_change" = population_10 - population_00,
  "med_income_change" = med_income_10 - med_income_00,
  "med_home_value_change" = med_home_value_10 - (inflation*med_home_value_00),
  "pct_college_change" = pct_college_10 - pct_college_00,
  "pct_white_change" = pct_white_10 - pct_white_00
)]

percentile <- function(values) {
  return(
    round(100 * (rank(values, ties.method="min") - 1) / (length(values) - 1))
  )
}

ltdb_full$population_00_pctile <- percentile(ltdb_full$population_00)
ltdb_full$population_10_pctile <- percentile(ltdb_full$population_10)
ltdb_full$population_change_pctile <- percentile(ltdb_full$population_change)
ltdb_full$med_income_00_pctile <- percentile(ltdb_full$med_income_00)
ltdb_full$med_income_10_pctile <- percentile(ltdb_full$med_income_10)
ltdb_full$med_income_change_pctile <- percentile(ltdb_full$med_income_change)
ltdb_full$med_home_value_00_pctile <- percentile(ltdb_full$med_home_value_00)
ltdb_full$med_home_value_10_pctile <- percentile(ltdb_full$med_home_value_10)
ltdb_full$med_home_value_change_pctile <- percentile(ltdb_full$med_home_value_change)
ltdb_full$pct_college_00_pctile <- percentile(ltdb_full$pct_college_00)
ltdb_full$pct_college_10_pctile <- percentile(ltdb_full$pct_college_10)
ltdb_full$pct_college_change_pctile <- percentile(ltdb_full$pct_college_change)
ltdb_full$pct_white_00_pctile <- percentile(ltdb_full$pct_white_00)
ltdb_full$pct_white_10_pctile <- percentile(ltdb_full$pct_white_10)
ltdb_full$pct_white_change_pctile <- percentile(ltdb_full$pct_white_change)

ltdb_full[, gent_eligible := (
  population_00 >= 500 &
  population_10 >= 500 &
  med_income_00_pctile <= 40 &
  med_home_value_00_pctile <= 40
)]

ltdb_full[, gentrified := (
  gent_eligible &
  med_home_value_change_pctile > 50 &
  pct_college_change_pctile > 50
)]

ltdb_full[, "gent_status" := factor(ifelse(gentrified, "gentrified", ifelse(gent_eligible, "eligible", "ineligible")), levels=c("gentrified", "eligible", "ineligible"))]

ggplot(data=ltdb_full, aes(x=med_income_00, y=med_home_value_00, color=gent_status)) +
  geom_point(alpha=0.5)


ltdb_full <- fread("data/nola_viz_data.csv")

tract_damage$geoid = as.double(tract_damage$geoid)
ltdb_damage <- merge(x=ltdb_full, y=tract_damage, by.x="tract_id", by.y="geoid", all.x=FALSE, all.y=FALSE)
ltdb_damage$V1 <- NULL

write.csv(ltdb_damage, "arcdemo/data/nola_viz_data.csv")
