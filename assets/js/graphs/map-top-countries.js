//     topCountryMap = new dc.rowChart("#map-top-countries");

// get top five groups
// mychart.data(function (group) { 
//    return group.top(5); 
// });

queue() 
    .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector.csv")
    .await(makeGraphs);
    

// The svg FOR THE MAP
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var projection = d3.geoNaturalEarth()
    .scale(width / 1.3 / Math.PI)
    .translate([width / 2, height / 2])

// Load external data and boot
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(data){

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#fff")
})

