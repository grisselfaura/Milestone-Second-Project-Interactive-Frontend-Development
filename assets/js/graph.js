queue() /*code similar to graph mini project */
    .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector.csv")
    .await(makeGraphs);
    
function makeGraphs(error, emissionSector){
    var ndx = crossfilter(emissionSector);

    var country_dim = ndx.dimension(dc.pluck('Entity'));
    var total_emissions_per_country = country_dim.group().reduceSum(dc.pluck('Transport(tonnes)'));

    var group = dim.group();

    dc.pieChart('#emissions-per-sector')
                .height(330)
                .radius(90)
                .transitionDuration(1500)
                .dimension(country_dim)
                .group(total_emissions_per_country);

    dc.renderAll();
}