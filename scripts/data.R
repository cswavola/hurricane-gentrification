library(tidycensus)
library(tidyverse)
library(data.table)
library(censusr)

census_api_key("72feca66c05bda4c6d3427afb7d56c051b4402e7")

vars00_sf1 <- load_variables(2000, "sf1", cache=TRUE)
vars00_sf3 <- load_variables(2000, "sf3", cache=TRUE)
vars10_sf1 <- load_variables(2010, "sf1", cache=TRUE)
vars10_acs5 <- load_variables(2010, "acs5", cache=TRUE)


rent_2000_vars   <- c("H067004", "H067005", "H067006", "H067007", "H067008", "H067009", 
                      "H067013", "H067014", "H067015", "H067016", "H067017", "H067018", 
                      "H067022", "H067023", "H067024", "H067025", "H067026", "H067027", 
                      "H067031", "H067032", "H067033", "H067034", "H067035", "H067036")
income_2000_vars <- c("P076002", "P076003", "P076004", "P076005", "P076006", "P076007", 
                      "P076008", "P076009", "P076010", "P076011", "P076012", "P076013", 
                      "P076014", "P076015", "P076016", "P076017")
race_2000_vars   <- c("P003003", "P003004", "P003005", "P003006", "P003007", "P003008")

rent_2000   <- get_decennial(geography="tract", state="LA", county="Orleans Parish", 
                             variables=rent_2000_vars, year=2000)
income_2000 <- get_decennial(geography="tract", state="LA", county="Orleans Parish", 
                             variables=income_2000_vars, year=2000)
race_2000   <- get_decennial(geography="tract", state="LA", county="Orleans Parish", 
                             variables=race_2000_vars, year=2000)


rent_2010_vars   <- c("B25068_004E", "B25068_005E", "B25068_006E", "B25068_007E", 
                      "B25068_008E", "B25068_009E", "B25068_013E", "B25068_014E", 
                      "B25068_015E", "B25068_016E", "B25068_017E", "B25068_018E", 
                      "B25068_022E", "B25068_023E", "B25068_024E", "B25068_025E", 
                      "B25068_026E", "B25068_027E", "B25068_031E", "B25068_032E", 
                      "B25068_033E", "B25068_034E", "B25068_035E", "B25068_036E")
income_2010_vars <- c("B19101_002E", "B19101_003E", "B19101_004E", "B19101_005E", 
                      "B19101_006E", "B19101_007E", "B19101_008E", "B19101_009E", 
                      "B19101_010E", "B19101_011E", "B19101_012E", "B19101_013E", 
                      "B19101_014E", "B19101_015E", "B19101_016E", "B19101_017E")
race_2010_vars   <- c("B02001_002E", "B02001_003E", "B02001_004E", 
                      "B02001_005E", "B02001_006E", "B02001_007E")

rent_2010   <- get_acs(geography="tract", state="LA", county="Orleans Parish", 
                             variables=rent_2010_vars, year=2010)
income_2010 <- get_acs(geography="tract", state="LA", county="Orleans Parish", 
                             variables=income_2010_vars, year=2010)
race_2010   <- get_acs(geography="tract", state="LA", county="Orleans Parish", 
                             variables=race_2010_vars, year=2010)


damage <- fread("data/Post-Katrina_Damage_Assessment.csv")[Percentage > -1.0]
rows <- nrow(damage)

for(i in 0:100) {
  start <- (1000*i)+1
  end <- 1000*(i+1)
  if(end > rows) {
    end <- rows
  }
  write.csv(
    damage[start:end, .(Address, "New Orleans", "LA")], 
    paste("data/damage_address_", i, ".csv", sep="")
  )
}





for(i in 100:1000) {
  start <- (100*i)+1
  end <- 100*(i+1)
  cnt <- sum(!is.na(damage[start:end]$geoid))
  if(cnt == 0) {
    print(start)
  }
}