queue() 
    .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector_CLEAN.csv")
    .await(makeGraphs);

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
                
    show_CO_average_per_country(ndx);
    
    dc.renderAll();
    
};

function show_CO_average_per_country(ndx) {
var country_dim = ndx.dimension(dc.pluck('Entity'));// country
// var averagePerCountry = country_dim.group().reduceSum(dc.pluck('total CO'));
var averagePerCountry = country_dim.group().reduce(
    function add_item(p, v) {
        p.count++;
        p.total += v.total_CO; // p.total += v["total CO"]; this doesnt work
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
averagePerCountry.order(v => v.average);// sort values from top to bottom

// console.log(typeof(averagePerCountry));// object
// console.log(averagePerCountry.all());// shows object values
// console.log(averagePerCountry.top(5)); // shows object first 5 chronological values


dc.pieChart("#pie-chart")
    .height(480)
    .width(480)
    .radius(150)
    .innerRadius(60)
    .transitionDuration(500)
    // .slicesCap(4)// number of slices the pie chart will generate
    .cap(5)// return group.top(5)
    .dimension('Entity')
    .group(averagePerCountry) 
    .valueAccessor(function (d) { return d.value.average})
    // .colors(d3.scale.ordinal().range(// colors if wanted?
    // [ '#1f78b4', '#b2df8a', '#cab2d6'..., '#bc80bd']);
    .legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
    // workaround for #703: not enough data is accessible through .label() to display percentages
    .data(function (group) { // get top five groups
        return group.top(5);})
    .on('pretransition', function(pieChart) {
        pieChart.selectAll('text.pie-slice').text(function(d) {
            return d.data.key ;
        })
    });

    // get top five groups
    // mychart.data(function (group) { 
    //    return group.top(5); 
    // });
}
