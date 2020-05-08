queue() 
    .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector_CLEAN.csv")
    .await(makeGraphs);

visCount = dc.dataCount(".dc-data-count"); // following dc tutorial

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

    visCount 
    .dimension(ndx)
    .group(all);

    show_country_selector(ndx); // Function takes the (ndx) crossfilter as its only argument
    show_global_emissions_per_year(ndx);
    show_country_emissions_stacked(ndx);
    
    dc.renderAll();  
};

function show_country_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('Entity'));
    var group = dim.group();
    
    select = dc.selectMenu("#country-selector")
        .dimension(dim)
        .group(group) 
        .title(kv => kv.key); // Hides the count number 

    dc.renderAll();   
    
    //Select the first country from the list by default 
    select.replaceFilter([["Afghanistan"]]).redrawGroup();
}

function show_global_emissions_per_year(ndx) {
    
    var year_dim = ndx.dimension(dc.pluck('Year'));
   
    var yearGlobalEmissionsChart = year_dim.group().reduceSum(dc.pluck('total_CO'));
    // console.log(yearGlobalEmissionsChart.all());

    // For chart scale
    var minYear = year_dim.bottom(1)[0].Year;
    var maxYear = year_dim.top(1)[0].Year;

    dc.lineChart("#chart-global-CO2-year")
            .width(500)
            .height(300)
            .margins({top: 10, right: 30, bottom: 30, left:100})
            .dimension(year_dim)
            .group(yearGlobalEmissionsChart)
            .transitionDuration(500)
            .elasticY(true) // Allows scale to update with each other
            .yAxisPadding(100)
            .x(d3.time.scale().domain([minYear, maxYear]))
            .xAxisLabel("Years")
            .yAxisLabel("Total CO2 emissions")
            .renderHorizontalGridLines(true)
}                

function show_country_emissions_stacked(ndx) {

    var year_dim = ndx.dimension(dc.pluck('Year'));
    // console.log(year_dim);

    // For chart scale
    var minYear = year_dim.bottom(1)[0].Year;
    var maxYear = year_dim.top(1)[0].Year;
    
    var coByYearTransport = year_dim.group().reduceSum(function(d) {return d.Transport;}); 
    var coByYearForestry = year_dim.group().reduceSum(function(d) {return d.Forestry;});
    var coByYearEnergy = year_dim.group().reduceSum(dc.pluck('Energy'));
    var coByYearOtherSources = year_dim.group().reduceSum(dc.pluck('Other_sources'));
    var coByYearAgricultureLandUseForestry = year_dim.group().reduceSum(dc.pluck('Agriculture_Land_Use_Forestry'));
    var coByYearWaste = year_dim.group().reduceSum(dc.pluck('Waste'));
    var coByYearResidentialCommercial = year_dim.group().reduceSum(dc.pluck('Residential_commercial'));
    var coByYearIndustry = year_dim.group().reduceSum(dc.pluck('Industry'));       

    dc.barChart("#stacked-chart")
                .width(600)
                .height(300)
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
                .xUnits(function(){return 20;})
                .elasticY(true) // Allows scale to update with each other
                .yAxisPadding(50)
                .x(d3.time.scale().domain([minYear, maxYear])) // Chart scale
                .legend(dc.legend().x(150).y(0).itemHeight(10).gap(5).horizontal(true).legendWidth(450).autoItemWidth(true).itemWidth(0))
                .brushOn(false)
                .xAxisLabel("Years")
                .yAxisLabel("CO2 emissions by sectors")
                .renderHorizontalGridLines(true);               
}