library(tigris)
library(maptools)
library(ggplot2)
library(plyr)
nola_tracts = tracts(state=22, county=71)
plot(nola_tracts)

nola_damage <- read.csv("arcdemo/data/nola_viz_data.csv")

nola_tracts@data$id <- rownames(nola_tracts@data)
nola_tracts_points <- fortify(nola_tracts, region="id")
nola <- join(nola_tracts_points, nola_tracts@data, by="id")
nola$tract_id <- nola$GEOID
nola <- join(nola, nola_damage, by="tract_id")

col <- c("ineligible"="#4daf4a", "eligible"="#377eb8", "gentrified"="#e41a1c")
lev <- c("ineligible", "eligible", "gentrified")

ggplot(nola[!is.na(nola$gent_status),]) +
  aes(long, lat, group=group, fill=factor(gent_status, levels=lev), alpha=pct_damage) +
  geom_polygon(color="white", size=0.4) +
  theme_minimal() + theme(panel.grid.major = element_blank(), panel.grid.minor = element_blank(), axis.text.x = element_blank(), axis.text.y = element_blank(), axis.ticks = element_blank()) +
  labs(x="", y="", alpha="Damage Level", fill="Gentrification Status") +
  scale_fill_manual(values=col)


ggplot(nola) +
  aes(long, lat, group=group, fill=(tract_id==22071003100)) +
  geom_polygon(color="white", size=0.4) +
  theme_minimal() + theme(panel.grid.major = element_blank(), panel.grid.minor = element_blank(), axis.text.x = element_blank(), axis.text.y = element_blank(), axis.ticks = element_blank()) +
  labs(x="", y="", alpha="Damage Level", fill="Gentrification Status") +
  scale_fill_manual(values=col)

ggplot(nola[!is.na(nola$gent_status),]) +
  aes(long, lat, group=group, fill=(tract_id==22071003100)) +
  geom_polygon(color="black") +
  theme_minimal() + theme(panel.grid.major = element_blank(), panel.grid.minor = element_blank(), axis.text.x = element_blank(), axis.text.y = element_blank(), axis.ticks = element_blank()) +
  labs(x="", y="", alpha="Damage Level", fill="Gentrification Status") +
  scale_fill_manual(values=c("white", "red"))
  
