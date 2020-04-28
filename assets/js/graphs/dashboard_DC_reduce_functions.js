d3.queue() // CHECK IF THIS SOLVE RENDERING ISSUE???
// queue() 
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
         
    show_CO_percentage_per_sector_2010(ndx, "Transport", "#percent-CO-transport" );
    show_CO_percentage_per_sector_2010(ndx, "Forestry", "#percent-CO-forestry");
    show_CO_percentage_per_sector_2010(ndx, "Energy", "#percent-CO-energy");
    show_CO_percentage_per_sector_2010(ndx, "Other_sources", "#percent-CO-other_sources");
    show_CO_percentage_per_sector_2010(ndx, "Agriculture_Land_Use_Forestry", "#percent-CO-agriculture_land_use_forestry");
    show_CO_percentage_per_sector_2010(ndx, "Waste", "#percent-CO-waste");
    show_CO_percentage_per_sector_2010(ndx, "Residential_commercial", "#percent-CO-residential_commercial");
    show_CO_percentage_per_sector_2010(ndx, "Industry", "#percent-CO-industry");

    show_CO_average_per_country(ndx);
    
    dc.renderAll();
    
};

// help from API https://github.com/square/crossfilter/wiki/API-Reference#dimension_group reduction function
function show_CO_percentage_per_sector_2010(ndx, attr, element) {
    // var year_dim = ndx.dimension(dc.pluck('Year'));
    var year_dim = ndx.dimension(function(d) {return d.Year;});
    // console.log(year_dim);
        // create functions to compute a value for any attribute  
        function reduceAddAvg(attr) {
            return function(p,v) {
                if (v.Year === 2010) {
                    p.sum_attr += v[attr];
                    p.sum_total_CO += v.total_CO; // p.total += v["total CO"]; this doesnt work
                    p.percentage_attr = (p.sum_attr/p.sum_total_CO);
                    // p.total += v.value_field; 
                }
                return p;
            };
        }
       function reduceRemoveAvg(attr) {
            return function(p,v) {
                if (v.Year === 2010) {    
                    p.sum_attr -= v[attr];
                    if (p.sum_attr == 0) {
                        p.sum_total_CO -= v.total_CO; // p.sum_total_COl += v["total CO"]; this doesnt work
                        p.percentage_attr = 0;
                    } else {
                        p.sum_total_CO -= v.total_CO;
                        p.percentage_attr = (p.sum_attr/p.sum_total_CO);
                    }
                }
                return p;
            };
        }
        function reduceInitAvg() {
            return {sum_attr:0, sum_total_CO:0, percentage_attr:0};
        }    
        var coPercentage = year_dim.group().reduce(reduceAddAvg(attr), reduceRemoveAvg(attr), reduceInitAvg);
        console.log(coPercentage.all());

        dc.numberDisplay(element)
            .formatNumber(d3.format(".2%"))
            .valueAccessor(function (d) { return d.value.percentage_attr})
            .group(coPercentage)    
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
// console.log(averagePerCountry.top(1));// object
// console.log(averagePerCountry.bottom(0));

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
        return group.top(8);})
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
