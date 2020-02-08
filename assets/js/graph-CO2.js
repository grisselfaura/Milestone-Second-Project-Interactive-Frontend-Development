// var yearGlobalChart   = new dc.pieChart("chart-global-CO2-year"),
//     countryChart  = new dc.barChart("#chart-country-CO2-year"),
//     topCountryMap = new dc.rowChart("#map-top-countries");

queue() 
    .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector.csv")
    .await(makeGraphs);
    
function makeGraphs(error, emissionSectorData){ /*replace*/ 
    var ndx = crossfilter(emissionSectorData); /*replace*/ 

    emissionSectorData.forEach(function(d){
        //console.log(d.Entity);
        d.year = parseInt(d.Year);
        //console.log(d.Year);
        d.Transport = parseInt(d.Transport);
        d.Forestry = parseInt(d.Forestry);
        d.Energy = parseInt(d.Energy);
        d.Other_sources = parseInt(d["Other sources"]);
        //console.log(d["Other sources"]);
        d.Agriculture_Land_Use_Forestry = parseInt(d["Agriculture, Land Use and Forestry"]); 
        //console.log(d["Agriculture, Land Use and Forestry"]);
        d.Waste = parseInt(d.Waste);
        d.Residential_commercial = parseInt(d["Residential and commercial"]);
        //console.log(d["Residential and commercial"]);
        d.Industry = parseInt(d.Industry);
        d.Agriculture = parseInt(d.Agriculture);
    });
    
    show_global_emissions_per_year(ndx);
    show_country_selector(ndx); //function takes the ndx crossfilter as its only argument
    show_country_emissions_top_sectors(ndx);
    
    dc.renderAll();
}

    
function show_country_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('Entity'));
    var group = dim.group();
    
    dc.selectMenu("#country-selector")
        .dimension(dim)
        .group(group) 
        .title(kv => kv.key);/*not showing the count numner*/
}

function show_global_emissions_per_year(ndx) {
    var year_dim = ndx.dimension(dc.pluck('Year'));
    var yearGlobalEmissionsChart = year_dim.group().reduceSum(dc.pluck('Transport'));
    //var yearGlobalEmissionsChart = year_dim.group().reduceSum(dc.pluck('totalSectorSum'));
    
    /*Sum of data using columnwise*/
    var totalSectorSum = [d3.sum(emissionSectorData.map(function(d){ return d.Transport})),
       d3.sum(emissionSectorData.map(function(d){ return d.Forestry})),
       d3.sum(emissionSectorData.map(function(d){ return d.Energy}))];
    console.log(totalSectorsSum);
   
    //var allSectorSum = mycrossfilter.dimension(function(data) { 
   // return ~~((Date.now() - new Date(data.DOB)) / (31557600000)) 
    //});


    /*for chart scale*/
    var minYear = year_dim.bottom(1)[0].Year;
    var maxYear = year_dim.top(1)[0].Year;
    // console.log(minYear);
    // console.log(maxYear);

    dc.lineChart("#chart-global-CO2-year")
            .width(1000)
            .height(300)
            .margins({top: 10, right: 50, bottom: 30, left:100})
            .dimension(year_dim)
            .group(yearGlobalEmissionsChart)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .y(d3.scale.linear())//check scale and x axus
            //.y(d3.scale.linear().domain([0, d3.max(emissionSectorData)]).range([0, h]))//check scale and x axus
            //.elasticX(true) 
            .elasticY(true)
            .xAxisLabel("Years")
            .yAxisLabel("Total CO2 emissions")
            .yAxis().ticks(20);             
}

function show_global_emissions_per_sector(ndx) {
    var year_dim = ndx.dimension(dc.pluck('Year'));
    var sectorGlobalEmissionsChart = year_dim.group().reduceSum(dc.pluck('Transport'));
    
}

function show_country_emissions_top_sectors(ndx) {
    var Entity_dim = ndx.dimension(dc.pluck('Entity'));/*replace by */ 
    var total_emissions_per_sector = Entity_dim.group().reduceSum(dc.pluck('Transport'));/*replace by country and sector*/ 



    dc.pieChart("#emissions-per-sector") /*replace by name of div this needs TO BE CHANGED TO SHOW TOP5 INDUSTIRES PER COUNTRY*/ 
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(Entity_dim) /*replace */ 
        .group(total_emissions_per_sector); /*replace by:  total_emissions_per_sector */ 
}

// get top five groups
// mychart.data(function (group) { 
//    return group.top(5); 
// });

// REMOVE EMPTY VALUES
// chart.filterHandler(function (dimension, filters) {
//    if (filters.length === 0) {
//        return filters;
// });

// Remove empty bins
// function remove_empty_bins(source_group) {
//     return {
//         all:function () {
//             return source_group.all().filter(function(d) {
//                 //return Math.abs(d.value) > 0.00001; // if using floating-point numbers
//                 return d.value !== 0; // if integers only
//             });
//         }
//     };
// }
