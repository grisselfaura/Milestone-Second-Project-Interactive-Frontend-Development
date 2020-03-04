queue() 
    .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector.csv")
    .await(makeGraphs);

    var yearChart = dc.rowChart("#yearGraph"),
    countryChart = dc.rowChart("#countryGraph"),
    visCount = dc.dataCount(".dc-data-count");

function makeGraphs(error, emissionData){ 
    if (error) throw error;

   var ndx = crossfilter(emissionData);
   var all = ndx.groupAll();

// var filteredEmissionData = []; /*var filteredEmissionData = new Array;*/  
//    emissionData.forEach(function(d){
        
//         filteredEmissionData.Code = String(d.Code);
//         console.log(d.Code)
//         filteredEmissionData.Entity = d.Entity;
//         filteredEmissionData.Year =  parseFloat(d.Year);
//         filteredEmissionData.Transport = parseFloat(d.Transport);
//         filteredEmissionData.Forestry = parseFloat(d.Forestry);
//         filteredEmissionData.Energy = parseFloat(d.Energy);
//         filteredEmissionData.Other_sources = parseFloat(d["Other sources"]);
//         filteredEmissionData.Agriculture_Land_Use_Forestry = parseFloat(d["Agriculture, Land Use and Forestry"]); 
//         filteredEmissionData.Waste = parseFloat(d.Waste);
//         filteredEmissionData.Residential_commercial = parseFloat(d["Residential and commercial"]);
//         filteredEmissionData.Industry = parseFloat(d.Industry);
//         filteredEmissionData.Agriculture = parseFloat(d.Agriculture);

        // for (key in filteredEmissionData) { // REMOVE NAN VALUES
        //     if (isNaN(filteredEmissionData[key])) {
        //          filteredEmissionData[key] = 0
        //     }
        // }

    //     filteredEmissionData.push(emissionData);
    // });

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

    // visTable 
    //     .dimension(yearDim)
    //     .group(countryGroup)
    //     .columns(["Entity"],["Year"]);

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
