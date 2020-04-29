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
        // d.Year = parseDate(d.Year).getFullYear(); //CHECK IF THIS AFFECT TIME SCALES
            // console.log(d.Year);     
        d.Transport = Number(d.Transport); //Number(" ")returns 0
        // console.log(d.Transport);
        d.Forestry = Number(d.Forestry); // other alternative to get rid of empty values d.Transport = d.Transport ? parseFloat(d.Transport) : 0
        // console.log(d.Forestry);
        d.Energy = Number(d.Energy);// other alternative to get rid of empty values parseFloat(d.Transport)|| 0;
        // console.log(d.Energy);
        d.Other_sources = Number(d.Other_sources);
        // console.log(d.Other_sources);
        d.Agriculture_Land_Use_Forestry = Number(d.Agriculture_Land_Use_Forestry); 
        // console.log(d.Agriculture_Land_Use_&_Forestry);
        d.Waste = Number(d.Waste);
        // console.log(d.Waste);
        d.Residential_commercial = Number(d.Residential_commercial);
        // console.log(d["Residential & commercial"]);
        d.Industry = Number(d.Industry); 
        // console.log(d.Industry);
        d.total_CO = Number(d.total_CO);      
        // console.log(d.total_CO);
    });

    visCount 
    .dimension(ndx)
    .group(all);

    show_country_selector(ndx); //function takes the ndx crossfilter as its only argument
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
        .title(kv => kv.key);/*hiding the count number*/ 

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
   
    var yearGlobalEmissionsChart = year_dim.group().reduceSum(dc.pluck('total_CO'));
    // console.log(yearGlobalEmissionsChart.all());

    /*for chart scale*/
    var minYear = year_dim.bottom(1)[0].Year;
    var maxYear = year_dim.top(1)[0].Year;

    dc.lineChart("#chart-global-CO2-year")
            .width(500)
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
    // console.log(year_dim);

    /*for chart scale*/
    var minYear = year_dim.bottom(1)[0].Year;
    var maxYear = year_dim.top(1)[0].Year;
    
    var coByYearTransport = year_dim.group().reduceSum(function(d) {return d.Transport;}); /*same result*/
    // var coByYearTransport = year_dim.group().reduceSum(dc.pluck('Transport'));/*PLEASE ADAPT*/
    // console.log(coByYearTransport.all());/*testing in inspect*/
    var coByYearForestry = year_dim.group().reduceSum(function(d) {return d.Forestry;});/*negative values are not plotted in the graph as the for the purpose of the data they can not be treated as positive. Future works needs to be done to display this in the x negative */
    // console.log(coByYearForestry.all());/*testing in inspect*/
    var coByYearEnergy = year_dim.group().reduceSum(dc.pluck('Energy'));/*PLEASE ADAPT*/
    // console.log(coByYearEnergy.all());/*testing in inspect*/
    var coByYearOtherSources = year_dim.group().reduceSum(dc.pluck('Other_sources'));/*PLEASE ADAPT*/
    var coByYearAgricultureLandUseForestry = year_dim.group().reduceSum(dc.pluck('Agriculture_Land_Use_Forestry'));/*PLEASE ADAPT*/
    var coByYearWaste = year_dim.group().reduceSum(dc.pluck('Waste'));/*PLEASE ADAPT*/    
    var coByYearResidentialCommercial = year_dim.group().reduceSum(dc.pluck('Residential_commercial'));/*PLEASE ADAPT*/   
    var coByYearIndustry = year_dim.group().reduceSum(dc.pluck('Industry'));/*PLEASE ADAPT*/       

    dc.barChart("#stacked-chart")
                .width(500)
                .height(300)
                .margins({top: 10, right: 100, bottom: 30, left:100})
                .dimension(year_dim)
                .group(coByYearTransport, "Transport") // first item goes as .group
                .stack(coByYearForestry, "Forestry") // the rest go in as .stack (to stack on-top)
                .stack(coByYearEnergy, "Energy") // .stack on previous
                .stack(coByYearOtherSources, "Other Sources") // .stack on previous
                .stack(coByYearAgricultureLandUseForestry, "Agriculture Land Use and Forestry") // .stack on previous
                .stack(coByYearWaste, "Waste") // .stack on previous
                .stack(coByYearResidentialCommercial, "Residential and Commercial") // .stack on previous
                .stack(coByYearIndustry, "Industry") // .stack on previous
                // .renderLabel(true) // number label on top but messy
                // .on('renderlet', function(chart) {
                //     chart.selectAll('rect').on("click", function(d) {
                //         console.log("click!", d);
                //     });
                // })
                .title(function (d) { // show only value and not date
                    return d.value;
                })
                .transitionDuration(500)
                .xUnits(function(){return 20;})
                // .xUnits(function(minYear, maxYear){return Math.abs(maxYear - minYear);})
                .elasticY(true)/*allows scale to update with each other*/
                .yAxisPadding(50)
                // .centerBar(true)
                .x(d3.time.scale().domain([minYear, maxYear]))
                .legend(dc.legend().x(130).y(0).itemHeight(10).gap(5).horizontal(true).autoItemWidth(true).itemWidth(0))
                .brushOn(false)
                .xAxisLabel("Years")
                .yAxisLabel("CO2 emissions by sectors")
                .renderHorizontalGridLines(true);               
}