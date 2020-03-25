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

    // show_CO_percentage_per_sector_2010(ndx, "Transport", "#percent-CO-transport");//(MOVE TO a separate file)
    // show_CO_percentage_per_sector_2010(ndx, "Forestry", "#percent-CO-forestry");//(MOVE TO a separate file)
    // show_CO_percentage_per_sector_2010(ndx, "Energy", "#percent-CO-energy");//(MOVE TO a separate file)
    // show_CO_average_per_country(ndx);//(on a separate file)

    show_country_selector(ndx); //function takes the ndx crossfilter as its only argument
    
    show_global_emissions_per_year(ndx);
    show_country_emissions_stacked(ndx);
    // show_global_emissions_map(ndx);
    
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

//  test this
//   .controlsUseVisibility(true)
//                 .promptText('Day');
}


function show_global_emissions_per_year(ndx) {
    var year_dim = ndx.dimension(dc.pluck('Year'));
   
    var yearGlobalEmissionsChart = year_dim.group().reduceSum(dc.pluck('total CO'));
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
    
    // var coByYearTransport = year_dim.group().reduceSum(function(d) {return d.Transport;}); /*same result*/
    var coByYearTransport = year_dim.group().reduceSum(dc.pluck('Transport'));/*PLEASE ADAPT*/
    // console.log(coByYearTransport);/*testing in inspect*/
    var coByYearForestry = year_dim.group().reduceSum(dc.pluck('Forestry'));/*PLEASE ADAPT*/
    var coByYearEnergy = year_dim.group().reduceSum(dc.pluck('Energy'));/*PLEASE ADAPT*/
    var coByYearOtherSources = year_dim.group().reduceSum(dc.pluck('Other sources'));/*PLEASE ADAPT*/
    var coByYearAgricultureLandUseForestry = year_dim.group().reduceSum(dc.pluck('Agriculture, Land Use & Forestry'));/*PLEASE ADAPT*/
    var coByYearWaste = year_dim.group().reduceSum(dc.pluck('Waste'));/*PLEASE ADAPT*/    
    var coByYearResidentialCommercial = year_dim.group().reduceSum(dc.pluck('Residential & commercial'));/*PLEASE ADAPT*/   
    var coByYearIndustry = year_dim.group().reduceSum(dc.pluck('Industry'));/*PLEASE ADAPT*/       
        
    dc.barChart("#stacked-chart")
                .width(600)
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
                // .valueAccessor(function (d) { // if number of items is greater than 0, add to the stack
                //     if (d.value.total > 0) {
                //         return d.value.match;
                //     } else { // otherwise, don't add it to the stack
                //         return 0;
                //     }
                // })
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

function show_CO_percentage_per_sector_2010(ndx, elementId) {//(on a separate file)
    // var year_dim = ndx.dimension(dc.pluck('Year'));       
    // var coPercentageTransport = year_dim.group("2010").reduceSum(function(d) {return ((d.Transport / d.total_CO) * 100 );}); 
    // console.log(coPercentageTransport);

    var coPercentageTransport2010 = ndx.groupAll().reduce(
        function add_item(p, v) {
            if (v.Year === 2010) {
                p.countTransport++;
                p.countTotal_CO++;
                p.percentage = ((p.countTransport/p.countTotal_CO) * 100);
                // p.totalTransport += v.Transport; 
                // p.totalEmissions += v.total_CO; // p.total += v["total CO"]; this doesnt work
                // p.sumIndex += (v.Transport + v.Forestry + v.Energy + v.Other_sources + v.Agriculture_Land_Use_Forestry + v.Waste + v.Residential_commercial + v.Industry) 
                // p.avgIndex = p.sumIndex / p.count;
                // p.percentage = (p.totalTransport/p.totalEmissions) * 100;
            }
            return p;
        },
        function remove_item(p, v) {
            if (v.Year === 2010) {
                p.countTransport--;
                p.countTotal_CO--;
                p.percentage = ((p.countTransport/p.countTotal_CO) * 100);
                // p.count--;
                // p.totalTransport -= v.Transport; 
                // p.totalEmissions -= v.total_CO; // p.total += v["total CO"]; this doesnt work
                // p.sumIndex -= (v.Transport + v.Forestry + v.Energy + v.Other_sources + v.Agriculture_Land_Use_Forestry + v.Waste + v.Residential_commercial + v.Industry) 
                // p.avgIndex = p.sumIndex / p.count;
                // p.percentage = (p.totalTransport/p.totalEmissions) * 100;
                
            }
            return p;
        },
        function initialise() {
            return {
                countTransport: 0,
                countTotal_CO: 0,
                percentage: 0, 
                // count: 0, 
                // totalTransport: 0,
                // totalEmissions: 0,
                // sumIndex: 0,  
                // avgIndex: 0,
                // percentage: 0,
            };
        },
    );
            console.log(typeof(coPercentageTransport2010));// object
            console.log(coPercentageTransport2010.All());// shows object values

    dc.numberDisplay(elementId)
        .formatNumber(d3.format(".2%"))
        .valueAccessor(function (d) {
            if (d.Transport == 0) {
                return 0;
            } else {
                return (d.countTransport / d.countTotal_CO); /* modify this accordingly */
            }
        })
        .group(coPercentageTransport2010)    
}


// function show_CO_average_per_country(ndx) {
//     var country_dim = ndx.dimension(dc.pluck('Entity'));// country
//     // var averagePerCountry = country_dim.group().reduceSum(dc.pluck('total CO'));
//     var averagePerCountry = country_dim.group().reduce(
//         function add_item(p, v) {
//             p.count++;
//             p.total += v.total_CO; // p.total += v["total CO"]; this doesnt work
//             p.average = p.total / p.count;
//             return p;
//         },
//         function remove_item(p, v) {
//             p.count--;
//             if (p.count == 0) {
//                 p.total = 0;
//                 p.average = 0;
//             } else {
//                 p.total -= v.total_CO;
//                 p.average = p.total / p.count;
//             }
//             return p;
//         },
//         function initialise() {
//             return {
//                 count: 0, 
//                 total: 0,
//                 average: 0,  
//             };
//         },
//     );
//     averagePerCountry.order(v => v.average);// sort values from top to bottom
    
//     console.log(typeof(averagePerCountry));// object
//     console.log(averagePerCountry.all());// shows object values
//     console.log(averagePerCountry.top(5)); // shows object first 5 chronological values

//     dc.pieChart("#pie-chart")
//         .height(480)
//         .width(480)
//         .radius(150)
//         .innerRadius(60)
//         .transitionDuration(500)
//         // .slicesCap(4)// number of slices the pie chart will generate
//         .cap(5)// return group.top(5)
//         .dimension('Entity')
//         .group(averagePerCountry) 
//         .valueAccessor(function (d) { return d.value.average})
//         // .colors(d3.scale.ordinal().range(// colors if wanted?
//         // [ '#1f78b4', '#b2df8a', '#cab2d6'..., '#bc80bd']);
//         .legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
//         // workaround for #703: not enough data is accessible through .label() to display percentages
//         .data(function (group) { // get top five groups
//            return group.top(5);})
//         .on('pretransition', function(pieChart) {
//             pieChart.selectAll('text.pie-slice').text(function(d) {
//                 return d.data.key ;
//             })
//         });

//         // get top five groups
//         // mychart.data(function (group) { 
//         //    return group.top(5); 
//         // });
// }

