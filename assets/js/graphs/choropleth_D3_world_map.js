/*Script using D3 to generate a world map choropleth. Code aid was taken from these tutorials:
    http://bl.ocks.org/palewire/d2906de347a160f38bc0b7ca57721328    
    https://www.d3-graph-gallery.com/graph/choropleth_hover_effect.html
    https://jkeohan.wordpress.com/2015/03/09/using-d3-tooltips/ to indicate tooltip location
    
*/
   
     // Define body
    var body = d3.select("body");

    // The svg
    var svg = d3.select("svg"),
        width = +svg.attr("width"), 
        height = +svg.attr("height");
    
    // responsive https://help.visokio.com/support/solutions/articles/42000012405-how-to-create-a-custom-view-choropleth-map-example-using-d3
    //     var svg = d3.select("svg");
    //     var width = +parseInt(svg.style("width"), 10);
    //     var height = +parseInt(svg.style("height"), 10);
    //     var maxSize = Math.min(width, height);
    //     var scale = maxSize/ORIGINAL_MAP_SIZE;  // ORIGINAL_MAP_SIZE is the maximum size (width or height) of the original map.

    // Define the div for the tooltip
    var tooltip = d3.select("body").append("div")   
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Map and projection 
    var projection = d3.geoNaturalEarth() //Converting from geographic coordinates (longitude,latitude) to pixel coordinates is accomplished via a map projection. 
        .scale(width / 2 / Math.PI) // Scale things down so see world map
        .translate([width / 2, height / 2]) // Translate to center of screen
    var path = d3.geoPath() // Path generator that will convert GeoJSON to SVG paths
        .projection(projection); // Tell path generator to use NaturalEarth projection
        
    // Data and color scale
    var data = d3.map(); // CO emission Dataset
        //console.log(data)
    var colorScheme = d3.schemePuOr[11]; 
    var colorScale = d3.scaleThreshold() 
        .domain([-1000000, -100000, -10000, 10000, 100000, 1000000, 10000000, 100000000, 200000000, 500000000, 1000000000]) 
        .range(colorScheme);
    
    // Legend
    var g = svg.append("g")
        .attr("class", "legendThreshold")
        .attr("transform", "translate(50,80)"); // will move it to a different position relative to the other objects
    g.append("text")
        .attr("class", "caption")
        .attr("x", 0)
        .attr("y", -10)
        .text("CO-2 levels");
    var labels = ['-1000 000', '-100 000','-10 000', '10 000', '100 000', '1000 000', '10 000 000', '100 000 000', '200 000 000', '500 000 000', '> 1000 000 000']; // minus to plus
    var legend = d3.legendColor()
        .labels(function (d) { return labels[d.i]; })
        .shapePadding(4)
        .scale(colorScale);
    svg.select(".legendThreshold")
        .call(legend);

    // Load external (country coordinates + data) and boot, asynchronous tasks
    d3.queue() // Used to run asynchronous tasks simultaneously and once the tasks are completed, perform operations on the results of the tasks.
        .defer(d3.json, "data/world_countries.json") // Call defer function and pass data file
        .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector_CLEAN.csv", function(d) {if(d.Year == 2010)  // Call defer function and pass data file
        {return (data.set(d.Code, +d.total_CO));}}) // 
        .await(ready); // Used to perform operations from any results of the tasks, after all the tasks are finished. 

    function ready(error, topo, CO_data) {
        if (error) throw error;
        // console.log(topo);
        // console.log(CO_data);

    // Three function that change the tooltip when user hover / move / leave a cell
        let mouseOver = function(d) { 
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .5)
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "black")
        }

        let mousemove = function(d) {
            d3.selectAll(".Country")
                tooltip.style("opacity", 1)
                    .html( d.properties.name + "<br>" + d.total_CO ) // Custom tooltip content with html      
                    .style("left", (d3.event.pageX) + "px") // Recover the mouse position and use it to control the tooltip position
                    .style("top", (d3.event.pageY - 10) + "px");    
        }         

        let mouseLeave = function(d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .8)
            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "transparent")
        }

        // Draw the map
        svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(topo.features)
            .enter().append("path")
                // draw each country
                .attr("d", d3.geoPath()
                .projection(projection)
                )
                .attr("fill", function (d){
                    // Pull data for this country
                    d.total_CO = data.get(d.id) || 0;
                    // Set the color
                    return colorScale(d.total_CO);
                })
                .style("stroke", "transparent")
                .attr("class", function(d){ return "Country" } )
                .style("opacity", .8)
                .on("mouseover", mouseOver)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseLeave)
        
                

    }    
