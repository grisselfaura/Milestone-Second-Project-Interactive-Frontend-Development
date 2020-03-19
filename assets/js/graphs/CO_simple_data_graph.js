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
   var parseDate = d3.time.format("%Y").parse;

   // Loop through data and parse/convert appropriate formats
    emissionData.forEach(function(d){
        d.Code = String(d.Code);
        d.Entity = String(d.Entity),
        d.Year = parseDate(d.Year),    
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
//     .elasticX(true)/*allows scale to update with each other*/
//     .x(d3.time.scale());

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
    // show_global_emissions_map(ndx);
    show_country_emissions_stacked(ndx);
    // show_country_emissions_top_sectors(ndx);
    dc.renderAll();
    
};

function show_country_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('Entity'));
    var group = dim.group();
    
    select = dc.selectMenu("#country-selector")
        .dimension(dim)
        .group(group) 
        .title(kv => kv.key);/*not showing the count numner*/ 

    dc.renderAll();   
    
    //Select the first country from the list by default 
    select.replaceFilter([["Afghanistan"]]).redrawGroup();

        //     dc.selectMenu("#country-selector")
        //         .dimension(dim)
        //         .group(group) 
        //         .title(kv => kv.key);/*not showing the count numner*/ 
        // }
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
            .elasticY(true)/*allows scale to update with each other*/
            .yAxisPadding(100)
            .x(d3.time.scale().domain([minYear, maxYear]))
            //go back to this in case of error.x(d3.scale.linear().domain([minYear, maxYear]))
            // .x(d3.scale.linear().domain([new Date(1990, 0, 1), new Date(2010, 11, 31)]))
            // .y(d3.scale.linear().domain([0, d3.max(emissionData)]).range([0, h]))//check scale and x axus
            .xAxisLabel("Years")
            .yAxisLabel("Total CO2 emissions")
            .renderHorizontalGridLines(true)
}                

function show_country_emissions_stacked(ndx) {
    var year_dim = ndx.dimension(dc.pluck('Year'));
    
    /*for chart scale*/
    var minYear = year_dim.bottom(1)[0].Year;
    var maxYear = year_dim.top(1)[0].Year;

    var coByYearTransport = year_dim.group().reduceSum(dc.pluck('Transport'));/*PLEASE ADAPT*/
    var coByYearForestry = year_dim.group().reduceSum(dc.pluck('Forestry'));/*PLEASE ADAPT*/
    var coByYearEnergy = year_dim.group().reduceSum(dc.pluck('Energy'));/*PLEASE ADAPT*/
    var coByYearOtherSources = year_dim.group().reduceSum(dc.pluck('Other sources'));/*PLEASE ADAPT*/
    var coByYearAgricultureLandUseForestry = year_dim.group().reduceSum(dc.pluck('Agriculture, Land Use & Forestry'));/*PLEASE ADAPT*/
    var coByYearWaste = year_dim.group().reduceSum(dc.pluck('Waste'));/*PLEASE ADAPT*/    
    var coByYearResidentialCommercial = year_dim.group().reduceSum(dc.pluck('Residential & commercial'));/*PLEASE ADAPT*/   
    var coByYearIndustry = year_dim.group().reduceSum(dc.pluck('Industry'));/*PLEASE ADAPT*/       
        
    dc.barChart("#stacked-chart")
                .width(500)
                .height(500)
                .dimension(year_dim)
                .group(coByYearTransport) // first item goes as .group
                .stack(coByYearForestry) // the rest go in as .stack (to stack on-top)
                .stack(coByYearEnergy) // .stack on previous
                .stack(coByYearOtherSources) // .stack on previous
                .stack(coByYearAgricultureLandUseForestry) // .stack on previous
                .stack(coByYearWaste) // .stack on previous
                .stack(coByYearResidentialCommercial) // .stack on previous
                .stack(coByYearIndustry) // .stack on previous
                .valueAccessor(function (d) { // if number of items is greater than 0, add to the stack
                    if (d.value.total > 0) {
                        return d.value.match;
                    } else { // otherwise, don't add it to the stack
                        return 0;
                    }
                })
                .elasticY(true)/*allows scale to update with each other*/
                .x(d3.time.scale().domain([minYear, maxYear]))
                // .x(d3.scale.ordinal())
                // .xUnits(dc.units.ordinal)
                .legend(dc.legend().x(420).y(0).itemHeight(15).gap(5));
                // .margins().right = 100;

}