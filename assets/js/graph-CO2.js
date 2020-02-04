// var yearGlobalChart   = new dc.pieChart("chart-global-CO2-year"),
//     countryChart  = new dc.barChart("#chart-country-CO2-year"),
//     topCountryMap = new dc.rowChart("#map-top-countries");

queue() 
    .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector.csv")
    .await(makeGraphs);
    
function makeGraphs(error, emissionSectorData){ /*replace*/ 
    var ndx = crossfilter(emissionSectorData); /*replace*/ 

    emissionSectorData.forEach(function(d){
        d.year = parseInt(d.Year);
        console.log(d.Year);
        d.Transport = parseInt(d.Transport);
        d.Forestry = parseInt(d.Forestry);
        d.Other_sources = parseInt(d["Other sources"]);
        console.log(d["Other sources"]);
        d.yrs_since_phd = parseInt(d["yrs.since.phd"]); 
        d.Industry = parseInt(d.Industry);
        d.Agriculture = parseInt(d.Agriculture);
    });
    

    show_country_selector(ndx); //function takes the ndx crossfilter as its only argument
   
function show_country_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('Entity'));
    var group = dim.group();

 
    
    dc.selectMenu("#country-selector")
        .dimension(dim)
        .group(group) 
        .title(kv => kv.key);/*not showing the count numner*/
}

    var Entity_dim = ndx.dimension(dc.pluck('Entity'));/*replace by */ 
    var total_emissions_per_sector = Entity_dim.group().reduceSum(dc.pluck('Transport'));/*replace by country and sector*/ 

    dc.pieChart("#emissions-per-sector") /*replace by name of div*/ 
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(Entity_dim) /*replace */ 
        .group(total_emissions_per_sector); /*replace by:  total_emissions_per_sector */ 
    dc.renderAll();
}

// emissionSectorData.forEach(function(d){
//         d.year = parseInt(d.year);
//         d.Transport = parseInt(d.Transport);
//         d.Forestry = parseInt(d.Forestry(tonnes));
//         d.Energy  = parseInt(d.Energy(tonnes));
//         d.Other = parseInt(d.Othersources(tonnes));
//         d.Agriculture,_Land_Use_&_Forestry = parseInt(d.["Agriculture, Land Use & Forestry(tonnes)"]);
//         d.Residential_&_commercial = parseInt(d.Residential & commercial(tonnes));
//         d.Industry = parseInt(d.Industry(tonnes));
//         d.Agriculture = parseInt(d.Agriculture(tonnes));
        
//         d.yrs_since_phd = parseInt(d["yrs.since.phd"])  //also to parse my yrs_since_phd from string to int.REMOVE DOTS TO AVOID PROBLEMS
        
//     });
