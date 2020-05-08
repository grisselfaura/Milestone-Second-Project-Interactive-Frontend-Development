d3.queue() 
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
        d.Year = parseDate(d.Year).getFullYear(); // Using Full year for better date format display
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
         
    show_CO_percentage_per_sector_2010(ndx, "Transport", "#percent-CO-transport"); // Function takes the (ndx) crossfilter as its only argument
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

/*Script for using reduction function. Code from DC.js :
    https://github.com/square/crossfilter/wiki/API-Reference#dimension_group%20reduction%20function
*/

function show_CO_percentage_per_sector_2010(ndx, attr, element) {
   
    var year_dim = ndx.dimension(function(d) {return d.Year;});
        
    // Create functions to compute a value for any attribute. In this case we want to get percentage of individual sector value over the total  
        function reduceAddAvg(attr) {
            return function(p,v) {
                if (v.Year === 2010) { // Filter by specific year
                    p.sum_attr += v[attr];
                    p.sum_total_CO += v.total_CO; 
                    p.percentage_attr = (p.sum_attr/p.sum_total_CO);
                }
                return p;
            };
        }
        function reduceRemoveAvg(attr) {
            return function(p,v) {
                if (v.Year === 2010) {    
                    p.sum_attr -= v[attr];
                    if (p.sum_attr == 0) {
                        p.sum_total_CO -= v.total_CO; 
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
} 

function show_CO_average_per_country(ndx) {

    var country_dim = ndx.dimension(dc.pluck('Entity')); 

    var averagePerCountry = country_dim.group().reduce(
    
        function add_item(p, v) {
            p.count++;
            p.total += v.total_CO; 
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

    averagePerCountry.order(v => v.average); // Sorts values from top to bottom

        dc.pieChart("#pie-chart")
            .width(500)
            .height(450)
            .radius(180)
            .innerRadius(60)
            .cap(5) 
            .dimension('Entity')
            .group(averagePerCountry) 
            .valueAccessor(function (d) { return d.value.average})
            .legend(dc.legend().x(420).y(0).itemHeight(13).gap(5).horizontal(false).legendWidth(200).autoItemWidth(true).itemWidth(0))
            .data(function (group) { // Shows top eight groups
                return group.top(8);})
            .on('pretransition', function(pieChart) {
                pieChart.selectAll('text.pie-slice').text(function(d) {
                    return d.data.key ;
                })
            });
}
