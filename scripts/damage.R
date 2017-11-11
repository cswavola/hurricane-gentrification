library(data.table)
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

damage[95101:95200, geoid:=append_geoid(damage[95101:95200, .("street"=Address, "city"="New Orleans", "state"="LA")], geoid_type="tr")$geoid]
damage[97401:97500, geoid:=append_geoid(damage[97401:97500, .("street"=Address, "city"="New Orleans", "state"="LA")], geoid_type="tr")$geoid]
damage[98301:98400, geoid:=append_geoid(damage[98301:98400, .("street"=Address, "city"="New Orleans", "state"="LA")], geoid_type="tr")$geoid]
damage[99001:99100, geoid:=append_geoid(damage[99001:99100, .("street"=Address, "city"="New Orleans", "state"="LA")], geoid_type="tr")$geoid]
damage[99501:99600, geoid:=append_geoid(damage[99501:99600, .("street"=Address, "city"="New Orleans", "state"="LA")], geoid_type="tr")$geoid]
damage[99901:100000, geoid:=append_geoid(damage[99901:100000, .("street"=Address, "city"="New Orleans", "state"="LA")], geoid_type="tr")$geoid]
damage[100101:100100, geoid:=append_geoid(damage[99901:100000, .("street"=Address, "city"="New Orleans", "state"="LA")], geoid_type="tr")$geoid]

sum(is.na(damage$geoid))
write.csv(damage, "data/damage.csv")

tract_damage <- damage[, .(
  "pct_damage"=mean(Percentage), 
  "max_flood_depth"=max(FloodDepth), 
  "max_flood_duration"=max(FloodDuration)), by=geoid]

for(i in 88434:100193) {
  if(is.na(damage[i]$geoid)) {
    print(i)
    damage[i, geoid:=append_geoid(damage[i, .("street"=Address, "city"="New Orleans", "state"="LA")], geoid_type="tr")$geoid]
  }
}