queue() 
    .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector_CLEAN.csv")
    .await(makeGraphs);

// var yearChart = dc.rowChart("#yearGraph"),
// countryChart = dc.rowChart("#countryGraph"),
visCount = dc.dataCount(".dc-data-count");

function makeGraphs(error, emissionData){ 
    if (error) throw error;
    // console.log(emissionData);
    // console.log(typeof(emissionData));

   var ndx = crossfilter(emissionData);
   var all = ndx.groupAll();

    emissionData.forEach(function(d){
        d.Code = String(d.Code);
        d.Entity = String(d.Entity),
        d.Year = parseInt(d.Year),    
        d.Transport = parseFloat(d.Transport);
        // console.log(d.Transport);
        d.Forestry = parseFloat(d.Forestry);
        // console.log(d.Forestry);
        d.Energy = parseFloat(d.Energy);
        // console.log(d.Energy);
        d.Other_sources = parseInt(d["Other sources"]);
        // console.log(d["Other sources"]);
        d.Agriculture_Land_Use_Forestry = parseInt(d["Agriculture, Land Use & Forestry"]); 
        // console.log(d["Agriculture, Land Use & Forestry"]);
        d.Waste = parseFloat(d.Waste);
        // console.log(d.Waste);
        d.Residential_commercial = parseFloat(d["Residential & commercial"]);
        // console.log(d["Residential & commercial"]);
        d.Industry = parseFloat(d.Industry); 
        // console.log(d.Industry);
        d.total_CO = parseFloat(d["total CO"]);      
        // console.log(d.total_CO);
    });
                   
    
//    var countryDim = ndx.dimension(function (d) { return d["Entity"];});
//    var yearDim = ndx.dimension(function (d) { return d["Year"];});
  
//    var countryGroup = countryDim.group();
//    var yearGroup = yearDim.group();

//    yearChart
//     .height(600)
//     .dimension(yearDim)
//     .group(yearGroup)
//     .elasticX(true);/*allows scale to update with each other*/

//    countryChart
//     .dimension(countryDim)
//     .group(countryGroup)
//     .elasticX(true)
//     .data(function (group){return group.top(10); }); /*top 10 countries function*/

    visCount 
    .dimension(ndx)
    .group(all);

    show_country_selector(ndx); //function takes the ndx crossfilter as its only argument
    show_global_emissions_per_year(ndx);
    // show_country_emissions_top_sectors(ndx);
    dc.renderAll();

};

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
    var yearGlobalEmissionsChart = year_dim.group().reduceSum(dc.pluck('total CO'));
        
    /*for chart scale*/
    var minYear = year_dim.bottom(1)[0].Year;
    var maxYear = year_dim.top(1)[0].Year;

    dc.lineChart("#chart-global-CO2-year")
            .width(1000)
            .height(300)
            .margins({top: 10, right: 50, bottom: 30, left:100})
            .dimension(year_dim)
            .group(yearGlobalEmissionsChart)
            .transitionDuration(500)
            .y(d3.scale.ordinal())
            // .yUnits(dc.units.ordinal)
            .x(d3.scale.linear())//check scale and x axus
            // //.y(d3.scale.linear().domain([0, d3.max(emissionSectorData)]).range([0, h]))//check scale and x axus
            // .elasticX(true); 
            // // .elasticX(true);/*allows scale to update with each other*/
            .xAxisLabel("Total CO2 emissions")
            .yAxisLabel("Years")
            .yAxis().ticks(20);             
}