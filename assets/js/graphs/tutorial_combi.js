queue() 
    .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector.csv")
    // .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector_CLEAN.csv")
    .await(makeGraphs);

var yearChart = dc.rowChart("#yearGraph"),
countryChart = dc.rowChart("#countryGraph"),
visCount = dc.dataCount(".dc-data-count");

var filteredEmissionData = []; /*var filteredEmissionData = new Object;*/  

function makeGraphs(error, emissionData){ 
    if (error) throw error;
    console.log(emissionData);
    console.log(typeof(emissionData));

   var ndx = crossfilter(emissionData);
   var all = ndx.groupAll();

    emissionData.forEach(function(d){
       
    d.Code = String(d.Code);
    d.Entity = String(d.Entity),
    d.Year = parseInt(d.Year),    
    d.Transport = parseFloat(d.Transport);
    d.Forestry = parseFloat(d.Forestry);
    d.Energy = parseFloat(d.Energy);
    d.Other_sources = parseInt(d["Other sources"]);
    d.Agriculture_Land_Use_Forestry = parseInt(d["Agriculture, Land Use and Forestry"]); 
    d.Waste = parseFloat(d.Waste);
    d.Residential_commercial = parseFloat(d["Residential and commercial"]);
    d.Industry = parseFloat(d.Industry);
    });

    

    

        // if (emissionData.Code !== "") {
        // filteredEmissionData.push(emissionData.Entity);    
        // console.log(filteredEmissionData)
        // };
    
        // for (key in emissionData) { // REMOVE NAN VALUES
        //     if (isNaN(emissionData[key])) {
        //          emissionData[key] = 0
        //     }
        // }

                    
    

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
