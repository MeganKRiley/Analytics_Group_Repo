# Monarch Butterfly Migrations

## Topic 
**Utilizing tagging data to map the activity of monarch butterflies through their migration and then analyzing the trends in the tagging and collection process.**

The Monarch Watch organization distributes more than a quarter of a million unique tags each year to volunteers in North America (East of the Rocky Mountains).  Volunteers place the tags on butterflies during the summer months in an effort to track their migration. Throughout their fall migration volunteers also submit butterfly sighting reports. These reports include the unique tag number associated with the butterfly, the date and location of the sightings, as well as any relevant notes the volunteer wishes to add. The sighting reports help us understand migration routes, timing and pacing, mortality, and changes in geographic distribution. At the end of the migration to Mexico, volunteers collect tags off of butterflies so we know where each one ended up, as well as to create a clean dataset for the upcoming tagging year. While the data for their migration south is considered complete, a separate sightings report is created to track their trip back north. This sightings report doesn't include any unique tag information, but does still show us how the butterfly population as a whole completes the last portion of the migration process. 

## Hypothesis
Based on historical monarch butterfly data, the amount of butterflies in a given location during a specific month can be predicted.

## Approach for Analysis

Collecting and cleaning the data from CSVs, merging the datasets, then using pandas to fine tune our data. The data would then be processed with a regression model in Python to identify correlation between population counts and time of year. Then, extracting the processed data as a JSON, we can then load the data into JS Leaflet which will aid in a visual for our results. Lastly, we will use ML to project our future predictions. Our idea is to have a website to interact with our findings.


![monarchs](https://user-images.githubusercontent.com/90050622/153723671-f168629a-0aeb-4a95-a125-49a4b56076de.jpg)


### Data exploratory and preparation work for data analysis:

1. Web research on monarch butterfly migrations and discovery work locating relevant monarch datasets publicly available on the web:

* North_Project_MonarchsAndMilkweed_1996-2020: https://portal.edirepository.org/nis/mapbrowse?packageid=edi.949.1
* Source for data on recoveries of tagged monarchs: https://monarchwatch.org/tagging/index.html#recoveries
* Tag recoveries from central Mexico: https://docs.google.com/spreadsheets/d/1UdJfooBJrm0Y1zlpwIhGz7ToZfP9h8OeucJbXrWwZEY/edit?usp=sharing
* Tag recoveries from the U.S., Canada, & northen Mexico (2021 season): https://docs.google.com/spreadsheets/d/12h0oQrTA9Zbm4nEkUFJJzWk5_FN2se4VAzI0Ww5d1E8/edit#gid=1710298744
* Tag recoveries from the U.S., Canada, & northen Mexico (2020 season): https://docs.google.com/spreadsheets/d/1nCK0z3Ab9QOly9sWN9AbItGYBs576CNXpyKs5puLdjY/edit#gid=1710298744
* Tag recoveries from the U.S., Canada, & northen Mexico (2019 season): https://docs.google.com/spreadsheets/d/1GKkZIEXjI5BjOOvNo40hsCJoWNJq2pucj01GpQVFynM/edit#gid=1710298744
* Tag recoveries from the U.S., Canada, & northen Mexico (2018 season): https://docs.google.com/spreadsheets/d/1tRDhq0zfOhlErRK7oeqpb-AHFsARuN15JwdT9qWvlHc/edit#gid=992068986
* Tag recoveries from the U.S. (2017 season): https://docs.google.com/spreadsheets/d/1ySyeKlpQTTwD1pPEO0XmouL7uudckaxaZnBBhilukCA/edit#gid=1287716066
* MWatch_occurrences_1996_2000: https://bison.usgs.gov/ipt/resource?r=monarchwatch
* Source for current and future Journey North Data: https://journeynorth.org/sightings/

2. Downloaded, read the sourced .CSVs into panda dataframes using Python and performed initial exploratory analysis on datasets:

* df.info()
* df.describe()
* df.columns.tolist()
* df.shape
* for col in df:
  print(df[col].unique())
* for col in watch2017_df:
  print(df[col].value_counts())
* for column in watch2017_df.columns:
   print(f"Column {column} has {df[column].isnull().sum()} null values")
* print(f"Duplicate entries: {df.duplicated().sum()}")

3. Cleaned, transformed, and output large Journey North .CSV file into repackaged .CSVs and geoJSON for machine learning and geoJSON conversion:

* Loaded and split monarch observation data in the North_Project_MonarchsAndMilkweed_1996-2020.csv file out into Python panda dataframes by observation/sighting type and using df.to_csv output each set to a .CSV file by observation/sighting type: Monarch Adult Sighted, Monarch Adult (FIRST sighted), Monarch Egg (FIRST sighted), Monarch (OTHER Observations), Monarch Larva (FIRST sighted), Monarch PEAK Migration,
 Milkweed (FIRST sighted), Monarch Fall Roost, Monarch Egg Sighted, Monarch Larva Sighted, Monarch, Captive-Reared' 'Milkweed Sighted
* Dropped columns for geoJSON using df.drop
* Summarized the counts by date, type, latitude and longitude using df.groupby and renamed the count column using df.rename
* Added year column to the dataframes using pd.DateTimeIndex on the date
* Split data in each observation/sighting type dataframe out by year into year dataframes using newly created year column and df filtering and then dropped the year column from the dataframe using df.drop
* Added month column to the dataframes using pd.DateTimeIndex on the date
* Split data in each observation/sighting type year dataframe into month dataframes using dataframe filtering and then dropped the month column from the dataframe using df.drop
* Output each observation/sighting type year month dataframe to geoJSON with json.dump using a function df_to_geojson to 'geoJSONify" the data in the dataframe 


4. Cleaned, transformed, and output large Monarch Watch Occurrences .CSV file into repackaged .CSVs and geoJSON for machine learning and geoJSON conversion:

* Loaded monarch tagging data in the MWatch_occurrences_1996_2000.csv file out into Python panda dataframe
* Added type column to dataframe for geoJSON consistency
* Split data in dataframe out by year into year dataframes using existing year column and df filtering then using df.to_csv output each set to a .CSV file
* Dropped columns for geoJSON using df.drop
* Summarized the counts by date, type, country, stateProvince, latitude and longitude using df.groupby and renamed the count column using df.rename
* Added month column to the dataframes using pd.DateTimeIndex on the date
* Dropped the year column from the dataframe using df.drop
* Split data in each year dataframe into month dataframes using dataframe filtering and then dropped the month column from the dataframe using df.drop
* Output each year month dataframe to geoJSON with json.dump using a function df_to_geojson to 'geoJSONify" the data in the dataframe 

5. Cleaned, transformed, and output Mexico Monarch Watch Recovery data for machine learning and geoJSON conversion

* Loaded monarch tag recovery data in the Monarch Watch Tag Recoveries - Central Mexico - mexico-recoveries file into Python panda dataframe
* Gathered latitude and longitude data for each of the 15 Central Mexico sites and in some cases converted to decimal latitudes and longitudes
* Split data into dataframes by site and cleaned and standardized the data
* Dropped columns for geoJSON using df.drop
* Added type column to dataframe for geoJSON consistency
* Summarized the counts by date, type, season, location, latitude and longitude using df.groupby and renamed the count column using df.rename
* Split data in dataframe out by year into year dataframes using existing report season year column and df filtering
* Output each report season year dataframe to geoJSON with json.dump using a function df_to_geojson to 'geoJSONify" the data in the dataframe 

6. Cleaned, transformed, and output Domestic Monarch Watch Recovery data for machine learning and geoJSON conversion

* Loaded monarch tag recovery data in the ft-Monarch Watch 2017 Season Domestic Recoveries - ft-Monarch Watch 2017 Season Domestic Recoveries.csv file into Python panda dataframe
* drop null rows where needed 
* dropped columns for geoJSONs
* output files as optimized geoJSON unsummerized and summerized

7. Mapped and designed layers for data using JavaScript, Mapbox, Leaflet, and tested the performance and usability of the geJSON files in Mapbox map/Leaflet layers

8. Worked with a Leaflet markercluster plug-in to improve the performance and usability of the geJSON files in Mapbox map/Leaflet layers

### Software: Python 3.6.1, Visual Studio Code, 1.38.1, Mapbox, Leaflet, Leaflet markercluster plug-in

### References:

* pandas.DataFrame.to_json: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_json.html
* leafletjs quick start guide: https://leafletjs.com/examples/quick-start/
* mapbox styles: https://docs.mapbox.com/api/maps/styles/
* leafletjs: https://leafletjs.com/reference.html
* leafletjs download page: https://leafletjs.com/download.html
* Mozilla Developer's page: https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
* mapbox glossary: https://docs.mapbox.com/help/glossary/
* mapbox glossary static tiles api: https://docs.mapbox.com/help/glossary/static-tiles-api/
* mapbox static tiles api documentation: https://docs.mapbox.com/api/maps/#static-tiles
* mapbox styles:https://docs.mapbox.com/api/maps/#styles
* leaflet documentation on methods using the map objecct and tile layers: https://leafletjs.com/reference-1.6.0.html#map-example
* creative commons: https://creativecommons.org/
* bindPopup() method: https://leafletjs.com/reference-1.6.0.html#popup