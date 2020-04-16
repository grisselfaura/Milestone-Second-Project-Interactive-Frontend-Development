var ccgMap = dc.geoChoroplethChart('.map-wrap');
// var sexPieChart  = dc.pieChart('.pie-chart');

d3.csv, "data/global-carbon-dioxide-emissions-by-sector_CLEAN.csv" {
   
    function makeGraphs(error, emissionData){ 
    if (error) throw error;
    console.log(emissionData);
    
    // console.log(typeof(emissionData));

    var ndx = crossfilter(emissionData);
    console.log(emissionData);
    var all = ndx.groupAll();
    var parseDate = d3.time.format("%Y").parse;

    // Loop through data and parse/convert appropriate formats
        emissionData.forEach(function(d){
            d.Code = String(d.Code);
            d.Entity = String(d.Entity),
            // d.Year = parseDate(d.Year);
            d.Year = parseDate(d.Year).getFullYear(); //CHECK IF THIS AFFECT TIME SCALES
            // console.log(d.Year);     
            d.Transport = Number(d.Transport); //Number(" ")returns 0
            // console.log(d.Transport);
            d.Forestry = Number(d.Forestry); // other alternative to get rid of empty values d.Transport = d.Transport ? parseFloat(d.Transport) : 0
            // console.log(d.Forestry);
            d.Energy = Number(d.Energy);
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

    // ADD FUNCTION FOR GROUPING
    // var country = ndx.dimension(function (d) { return d["Entity"];});// country
    var TOTALCO = ndx.dimension(function (d) {if(d.Year == 2010) { return d["total_CO"];}});// country
    var TOTALCOpercountry = TOTALCO.group();


    d3.json, "data/world_countries.json", function (map) { // WORLDMAP
        console.log(topo); // WORLDMAP data
         ccgMap.width(800)
            .height(800)
            .dimension(TOTALCO)
            .group(TOTALCOpercountry) 
            .colors(d3.scale.quantize().range(["#7cbd30", "#0066cc", "#ee2e11"]))
            .colorDomain([0, 200])
            .colorCalculator(function (d) { return d ? ccgMap.colors()(d) : '#ccc'; })
            .overlayGeoJson(topo.features, "Country", function(d){ return d.properties.name; });

        dc.renderAll();
    });
    });

} 




// function show_CO_average_per_country(ndx, topo) {
// var country_dim = ndx.dimension(dc.pluck('Entity'));// country
// // var averagePerCountry = country_dim.group().reduceSum(dc.pluck('total CO'));
// var averagePerCountry = country_dim.group().reduce(
//     function add_item(p, v) {
//         p.count++;
//         p.total += v.total_CO; // p.total += v["total CO"]; this doesnt work
//         p.average = p.total / p.count;
//         return p;
//     },
//     function remove_item(p, v) {
//         p.count--;
//         if (p.count == 0) {
//             p.total = 0;
//             p.average = 0;
//         } else {
//             p.total -= v.total_CO;
//             p.average = p.total / p.count;
//         }
//         return p;
//     },
//     function initialise() {
//         return {
//             count: 0, 
//             total: 0,
//             average: 0,  
//         };
//     },
// );
// averagePerCountry.order(v => v.average);// sort values from top to bottom

// // console.log(typeof(averagePerCountry));// object
// // console.log(averagePerCountry.top(1));// object
// // let largest = Object.keys(averagePerCountry).reduce(function(a, b){ return averagePerCountry[a] < averagePerCountry[b] ? a : b });
// // let smallest = Object.keys(averagePerCountry).reduce(function(a, b){ return averagePerCountry[a] < averagePerCountry[b] ? a : b });
// // console.log(averagePerCountry.bottom(0));

// dc.pieChart("#pie-chart")
//     .height(480)
//     .width(480)
//     .radius(150)
//     .innerRadius(60)
//     .transitionDuration(500)
//     // .slicesCap(4)// number of slices the pie chart will generate
//     .cap(5)// return group.top(5)
//     .dimension('Entity')
//     .group(averagePerCountry) 
//     .valueAccessor(function (d) { return d.value.average})
//     // .colors(d3.scale.ordinal().range(// colors if wanted?
//     // [ '#1f78b4', '#b2df8a', '#cab2d6'..., '#bc80bd']);
//     .legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
//     // workaround for #703: not enough data is accessible through .label() to display percentages
//     .data(function (group) { // get top five groups
//         return group.top(5);})
//     .on('pretransition', function(pieChart) {
//         pieChart.selectAll('text.pie-slice').text(function(d) {
//             return d.data.key ;
//         })
// });



//     Map and projection
//     //Converting from geographic coordinates (longitude,latitude) to pixel coordinates is accomplished via a map projection. 
//     var path = d3.geoPath();
//     var projection = d3.geoNaturalEarth()
//         .scale(width / 2 / Math.PI)
//         .translate([width / 2, height / 2])
//     var path = d3.geoPath()
//         .projection(projection);

// 
// };
// }
    
    
//      // Define body
//     var body = d3.select("body");

//     // The svg
//     var svg = d3.select("svg"),
//         width = +svg.attr("width"),
//         height = +svg.attr("height");

//     // Define the div for the tooltip
//     var tooltip = body.append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0);

//     
        
//     // Data and color scale
//     var data = d3.map(); // CO emission Dataset
//     //console.log(data)
//     var colorScheme = d3.schemePuOr[11]; // modify from original
//     // colorScheme.unshift("#eee") // check how to check the palete of colors so do start at white
//     var colorScale = d3.scaleThreshold()
//         .domain([-1000000, -100000, -10000, 10000, 100000, 1000000, 10000000, 100000000, 2000000000, 500000000, 1000000000]) //  modify from original
//         .range(colorScheme);
//         // .range(["rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]); 8 186 042 640
//         // Legend
//     var g = svg.append("g")
//         .attr("class", "legendThreshold")
//         .attr("transform", "translate(20,20)");
//     g.append("text")
//         .attr("class", "caption")
//         .attr("x", 0)
//         .attr("y", -6)
//         .text("CO-2 levels");
//     var labels = ['-1000 000', '-100 000','-10 000', '10 000', '100 000', '1000 000', '10 000 000', '100 000 000', '200 000 000', '500 000 000', '> 1000 000 000']; //
//     var legend = d3.legendColor()
//         .labels(function (d) { return labels[d.i]; })
//         .shapePadding(4)
//         .scale(colorScale);
//     svg.select(".legendThreshold")
//         .call(legend);


// function ready(error, topo, CO_data) {
//     if (error) throw error;
//     // console.log(topo);
//     // console.log(CO_data);

//     let mouseOver = function(d) {
//         d3.selectAll(".Country")
//             .transition()
//             .duration(200)
//             .style("opacity", .5)
//         d3.select(this)
//             .transition()
//             .duration(200)
//             .style("opacity", 1)
//             .style("stroke", "black")
//     }

//     let mousemove = function(d) {
//         d3.selectAll(".Country")
//             tooltip.style("opacity", 1)
//                 .html( d.properties.name + "<br>"+  d.total_CO )   
//                 // .text(d => d.properties.average_price_per_poundtotal_CO);                
//                 .style("left", (d3.mouse(this)[0]+70) + "px")
//                 .style("top", (d3.mouse(this)[1]) + "px")
//     }

//     let mouseLeave = function(d) {
//         d3.selectAll(".Country")
//             .transition()
//             .duration(200)
//             .style("opacity", .8)
//         d3.select(this)
//             .transition()
//             .duration(200)
//             .style("stroke", "transparent")
//     }

//     // Draw the map
//     svg.append("g")
//         .attr("class", "countries")
//         .selectAll("path")
//         .data(topo.features)
//         .enter().append("path")
//             // draw each country
//             .attr("d", d3.geoPath()
//             .projection(projection)
//             )
//             .attr("fill", function (d){
//                 // Pull data for this country
//                 d.total_CO = data.get(d.id) || 0;
//                 // Set the color
//                 return colorScale(d.total_CO);
//             })
//             .style("stroke", "transparent")
//             .attr("class", function(d){ return "Country" } )
//             .style("opacity", .8)
//             .on("mouseover", mouseOver)
//             .on("mousemove", mousemove)
//             .on("mouseleave", mouseLeave)

// }    
