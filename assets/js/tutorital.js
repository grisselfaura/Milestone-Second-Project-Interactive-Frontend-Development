queue() 
    .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector.csv")
    .await(makeGraphs);

var yearChart = dc.rowChart("#yearGraph"),
    countryChart = dc.rowChart("#countryGraph"),
    visCount = dc.dataCount(".dc-data-count"),
    visTable = dc.dataTable(".dc-data-table");

function makeGraphs(error, emissionData){ 
    if (error) throw error;

   var ndx = crossfilter(emissionData);
   var all = ndx.groupAll();

   var countryDim = ndx.dimension(function (d) { return d["Entity"];});
   var yearDim = ndx.dimension(function (d) { return d["Year"];});
   

   var countryGroup = countryDim.group();
   var yearGroup = yearDim.group();

   yearChart
    .height(600)
    .dimension(yearDim)
    .group(yearGroup)
    .elasticX(true);/*allows scale to update with each other*/

   countryChart
    .dimension(countryDim)
    .group(countryGroup)
    .elasticX(true)
    .data(function (group){return group.top(10); }); /*top 10 countries function*/

    visCount 
        .dimension(ndx)
        .group(all);

    visTable 
        .dimension(yearDim)
        .group(countryGroup)
        .columns(["Entity"],["Year"]);

   dc.renderAll();


//    var filteredEmissionData = []; /*var filteredEmissionData = new Array;*/
//    emissionData.forEach((d) => {
        
//         emissionData.Code = String(d.Code);
//         emissionData.Entity = String(d.Entity);
//         emissionData.Year =  parseFloat(d.Year);
//         console.log(d.Code)
    
//         if (emissionData.Code !== "") {    
//         filteredEmissionData.push(emissionData);
//         };
        
//    })


   // console.log(filteredEmissionData);
};
