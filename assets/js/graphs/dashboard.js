/* Queue() used to run asynchronous tasks simultaneously and once the tasks are completed, perform operations on the results of the tasks.
 Load external data and boot, asynchronous tasks.
*/
Promise.all([
    d3.csv("data/global-carbon-dioxide-emissions-by-sector_CLEAN.csv"),
    d3.json("data/world_countries.json")
]).then(makeGraphs).catch((err) => console.error("Something went wrong while loading the data! Exception: ", err));

/**
 * Callback used to execute the code that will be used once the data is loaded.
 * @param {*} error 
 * @param {*} emissionData 
 */
function makeGraphs(response) {  // Create a function called makeGraphs where the data will be downloaded
    var [emissionData, topoData] = response;
    
    var parseDate = d3.timeParse("%Y"); // Create a new format for the date
    
    // Loop through data and parse/convert appropriate formats
    emissionData.forEach(function (d) {
        d.Code = String(d.Code);
        d.Entity = String(d.Entity);
        d.Year = parseDate(d.Year);
        d.Transport = Number(d.Transport); // Using Number() to get to get rid of empty values. Also possible parseFloat(d.Transport)|| 0; or d.Transport = d.Transport ? parseFloat(d.Transport) : 0
        d.Forestry = Number(d.Forestry);
        d.Energy = Number(d.Energy);
        d.Other_sources = Number(d.Other_sources);
        d.Agriculture_Land_Use_Forestry = Number(d.Agriculture_Land_Use_Forestry);
        d.Waste = Number(d.Waste);
        d.Residential_commercial = Number(d.Residential_commercial);
        d.Industry = Number(d.Industry);
        d.total_CO = Number(d.total_CO);
    });

    var ndx = crossfilter(emissionData); // Assign the data to a crossfilter to allow interaction
    var all = ndx.groupAll(); // Define group all for counting

    showCOPercentagePerSector2010(ndx, "Transport", "#percent-CO-transport"); // Function takes the (ndx) crossfilter as its only argument
    showCOPercentagePerSector2010(ndx, "Forestry", "#percent-CO-forestry");
    showCOPercentagePerSector2010(ndx, "Energy", "#percent-CO-energy");
    showCOPercentagePerSector2010(ndx, "Other_sources", "#percent-CO-other_sources");
    showCOPercentagePerSector2010(ndx, "Agriculture_Land_Use_Forestry", "#percent-CO-agriculture_land_use_forestry");
    showCOPercentagePerSector2010(ndx, "Waste", "#percent-CO-waste");
    showCOPercentagePerSector2010(ndx, "Residential_commercial", "#percent-CO-residential_commercial");
    showCOPercentagePerSector2010(ndx, "Industry", "#percent-CO-industry");
    showCOAveragePerCountry(ndx);
    showWorldMap(ndx, topoData);

    // Create a new crossfilter object to keep pieChart filtering independant.
    var ndx2 = crossfilter(emissionData); // Assign the data to a crossfilter to allow interaction
    dc.dataCount(".dc-data-count")
        .dimension(ndx2)
        .group(ndx2.groupAll());

    showGlobalEmissionsPerYear(ndx2);
    showCountryEmissionsStacked(ndx2);
    // Notice that this method is calling the dc.renderAll() method.
    showCountrySelector(ndx2); // Function takes the (ndx) crossfilter as its only argument
};

/**
 * Function used to compute the percentage value of each individual sector CO value over the total CO values for the year 2010/
 * @param {*} ndx Crossfilter instance
 * @param {*} attr Sector
 * @param {*} element Percentage value number
 */
function showCOPercentagePerSector2010(ndx, attr, element) {
    // Define a dimension
    var year_dim = ndx.dimension(d => d.Year);

    // Create functions to compute a value for any attribute.  
    function reduceAddAvg(attr) {
        return function (p, v) {
            if (v.Year.getFullYear() === 2010) { // Filter by specific year
                p.sum_attr += v[attr];
                p.sum_total_CO += v.total_CO;
                p.percentage_attr = (p.sum_attr / p.sum_total_CO);
            }
            return p;
        };
    }
    function reduceRemoveAvg(attr) {
        return function (p, v) {
            if (v.Year.getFullYear() === 2010) { // use getFullYear to match condition with time format
                p.sum_attr -= v[attr];
                if (p.sum_attr == 0) {
                    p.sum_total_CO -= v.total_CO;
                    p.percentage_attr = 0;
                } else {
                    p.sum_total_CO -= v.total_CO;
                    p.percentage_attr = (p.sum_attr / p.sum_total_CO);
                }
            }
            return p;
        };
    }
    function reduceInitAvg() {
        return { sum_attr: 0, sum_total_CO: 0, percentage_attr: 0 };
    }

    // Map/reduce to reduce function (percentages)  
    var coPercentage = year_dim.group().reduce(reduceAddAvg(attr), reduceRemoveAvg(attr), reduceInitAvg);
    dc.numberDisplay(element)
        .useViewBoxResizing(true) // allows chart to be responsive (might need to add CSS 'width')
        .formatNumber(d3.format(".2%"))
        .valueAccessor((d) => d.value.percentage_attr)
        .group(coPercentage)
}

/**
 * Function used to compute for each country (entity) the average value for all the sectors =  total CO value (during 1990-2010)
 * @param {*} entityDim 
 */
function retrieveAvgPerEntity(entityDim) {
    return entityDim.group().reduce(
        function add_item(p, v) {
            p.count++;
            p.total += v.total_CO;
            p.average = p.total / p.count;
            return p;
        },
        function remove_item(p, v) {
            p.count--;
            if (p.count == 0) {
                p.total = 0;
                p.average = 0;
            } else {
                p.total -= v.total_CO;
                p.average = p.total / p.count;
            }
            return p;
        },
        function initialise() {
            return {
                count: 0,
                total: 0,
                average: 0,
            };
        },
    );
}

/**
 * Function used to generate a world color map displaying the computed above average value. 
 * @param {*} ndx Crossfilter instance
 * @param {*} topoData Countries data for generating world map
 */
function showWorldMap(ndx, topoData) {
    var usChart = new dc.GeoChoroplethChart("#world-map");
    var numberFormat = d3.format(".2f");  // Create a new format for the date
    var scaleFormat = d3.format(",.2r"); // Create a new scale format for the legend

    // Define a dimension
    var entities = ndx.dimension((d) => d['Entity']); // Define a dimension
    var averagePerCountry = retrieveAvgPerEntity(entities); // Map to reduce function (average)

    usChart
        .height(500)
        .useViewBoxResizing(true) // allows chart to be responsive (might need to add CSS 'width')
        .transitionDuration(1000) 
        .dimension(entities)
        .group(averagePerCountry)
        .colors(d3.scaleQuantize().range(["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"]))
        .colorDomain([-1000000, 1000000000])
        .colorCalculator((d) => { return d ? usChart.colors()(d) : '#ccc'; })
        .overlayGeoJson(topoData.features, "countries", (d) => d.properties.name)
        .projection(d3.geoNaturalEarth())
        .valueAccessor((kv) => { 
            console.log(kv);
            if (typeof kv.value === "undefined") {
                return "Undefined value!"
            } 
            else {
                return kv.value.average ; 
            }
        })
        .title(function (d) {
            return d.key + ": " + numberFormat(d.value) + " Avg CO2 levels" ; 
        });

    usChart.legendables = () => {
        var range = usChart.colors().range()
        var domain = usChart.colorDomain()
        var step = (domain[1] - domain[0]) / range.length
        var val = domain[1] 
        return range.map(function (d, i) {
            var legendable = {name: scaleFormat(val) + " -  " + scaleFormat(val-step), chart: usChart};
            legendable.color = usChart.colorCalculator()(val);
            val -= step
            return legendable;
        });
    };  
    
    usChart.legend(dc.legend().x(10).y(150).itemHeight(13).gap(5));
}

/**
 * Create a function called showCOAveragePerCountry where the computed average data will be loaded to generate a pie chart showing top 8 countries with highest CO values
 * @param {*} ndx Crossfilter instance.
 */
function showCOAveragePerCountry(ndx) {
    // Define a dimension
    var countryDim = ndx.dimension(dc.pluck('Entity'));
    // Map/reduce to reduce to function (average) 
    var averagePerCountry = retrieveAvgPerEntity(countryDim);
    averagePerCountry.order(v => v.average); // Sorts values from top to bottom
    dc.pieChart("#pie-chart")
        .height(400)
        .useViewBoxResizing(true) // allows chart to be responsive (might need to add CSS 'width')
        .radius(180)
        .innerRadius(60)
        .cap(5)
        .dimension('Entity')
        .group(averagePerCountry)
        .valueAccessor(d => d.value.average)
        .data((group) => group.top(8)) // Shows top eight groups
        .on('pretransition', (pieChart) => {
            pieChart.selectAll('text.pie-slice').text((d) => d.data.key)
        })
        .filter = () => {}; // Disble chart filtering to avoid interactivity.
}

/**
 * Function used to generate acountry selector which will be link to a series of graphs. 
 * @param {*} ndx 
 */
function showCountrySelector(ndx) {
    // Define a dimension
    var dim = ndx.dimension(dc.pluck('Entity'));
    var group = dim.group();
    
    select = dc.selectMenu("#country-selector") // Create a variable
        .dimension(dim)
        .group(group)
        .title(kv => kv.key); // Hides the count number 

    dc.renderAll();

    //Select the first country from the list by default 
    select.replaceFilter([["Afghanistan"]]).redrawGroup();
}

/**
 * Function used to generate a line chart to show fluctuation of total CO2 values in a range of time (1990-2010).
 * @param {*} ndx Crossfilter instance.
 */
function showGlobalEmissionsPerYear(ndx) {
    // Define a dimension
    var year_dim = ndx.dimension(dc.pluck('Year'));
    
    // Map/reduce to group sum
    var yearGlobalEmissionsChart = year_dim.group().reduceSum(dc.pluck('total_CO'));
        
        // For chart scale
    var minYear = year_dim.bottom(1)[0].Year;
    var maxYear = year_dim.top(1)[0].Year;

    dc.lineChart("#chart-global-CO2-year")
        // .width(500) // use carefully with .useViewBoxResizing
        .height(400)
        .useViewBoxResizing(true) // allows chart to be responsive (might need to add CSS 'width')
        .margins({top: 10, right: 30, bottom: 30, left:100})
        .dimension(year_dim)
        .group(yearGlobalEmissionsChart)
        .transitionDuration(500)
        .elasticY(true) // Allows scale to update with each other
        .yAxisPadding(100)
        .x(d3.scaleTime().domain([minYear, maxYear]))
        .xAxisLabel("Years")
        .yAxisLabel("Total CO2 emissions")
        .renderHorizontalGridLines(true)
}                

/**
 * Function used to generate a stack chart to show distribution of generated CO values per sector in a range of time (1990-2010). 
 * @param {*} ndx Crossfilter instance.
 */
function showCountryEmissionsStacked(ndx) {
    // Define a dimension
    var year_dim = ndx.dimension(dc.pluck('Year'));
    
    // For chart scale
    var minYear = year_dim.bottom(1)[0].Year;
    var maxYear = year_dim.top(1)[0].Year;
    
    // Map/reduce to group sum
    var coByYearTransport = year_dim.group().reduceSum(function(d) {return d.Transport;}); // old function syntax example works with d3 v5 library
    var coByYearForestry = year_dim.group().reduceSum(function(d) {return d.Forestry;});
    var coByYearEnergy = year_dim.group().reduceSum(dc.pluck('Energy'));
    var coByYearOtherSources = year_dim.group().reduceSum(dc.pluck('Other_sources'));
    var coByYearAgricultureLandUseForestry = year_dim.group().reduceSum(dc.pluck('Agriculture_Land_Use_Forestry'));
    var coByYearWaste = year_dim.group().reduceSum(dc.pluck('Waste'));
    var coByYearResidentialCommercial = year_dim.group().reduceSum(dc.pluck('Residential_commercial'));
    var coByYearIndustry = year_dim.group().reduceSum(dc.pluck('Industry'));       

    dc.barChart("#stacked-chart")
        .height(400)
        .useViewBoxResizing(true) // allows chart to be responsive (might need to add CSS 'width')
        .margins({top: 10, right: 30, bottom: 30, left:100})
        .dimension(year_dim)
        .group(coByYearTransport, "Transport") // First item goes as .group
        .stack(coByYearForestry, "Forestry") // The others go in as .stack (to stack on-top)
        .stack(coByYearEnergy, "Energy")
        .stack(coByYearOtherSources, "Other Sources") 
        .stack(coByYearAgricultureLandUseForestry, "Agriculture Land Use and Forestry") 
        .stack(coByYearWaste, "Waste") 
        .stack(coByYearResidentialCommercial, "Residential and Commercial") 
        .stack(coByYearIndustry, "Industry") 
        .title(function (d) { // Shows only data value and not the date
            return d.value;
        })
        .transitionDuration(500)
        .xUnits((d) => 20) //new calling function syntax
        .elasticY(true) // Allows scale to update with each other
        .yAxisPadding(50)
        .x(d3.scaleTime().domain([minYear, maxYear])) // Chart scale
        .legend(dc.legend().x(150).y(0).itemHeight(10).gap(5).horizontal(true).legendWidth(450).autoItemWidth(true).itemWidth(0))
        .brushOn(false)
        .xAxisLabel("Years")
        .yAxisLabel("CO2 emissions by sectors")
        .renderHorizontalGridLines(true);               
}
