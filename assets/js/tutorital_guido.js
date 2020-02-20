queue() 
    .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector.csv")
    .await(makeGraphs);
    
function makeGraphs(error, emissionData){ 
    if (error) throw error;

   var ndx = crossfilter(emissionData);

   var filteredEmissionData = []; /*var filteredEmissionData = new Array;*/
   emissionData.forEach((d) => {
        
        emissionData.Code = String(d.Code);
        emissionData.Entity = String(d.Entity);
        emissionData.Year =  parseFloat(d.Year);
        console.log(d.Code)
    
        if (emissionData.Code !== "") {    
        filteredEmissionData.push(emissionData);
        };
        
   })


    console.log(filteredEmissionData);
}
