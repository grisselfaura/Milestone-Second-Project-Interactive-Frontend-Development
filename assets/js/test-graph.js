queue() /*code similar to graph mini project 
    .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector.csv")*/
    .defer(d3.csv, "data/Salaries.csv")
    .await(makeGraphs);
    
function makeGraphs(error, salaryData){/*salarrydatareplace*/ 
    var ndx = crossfilter(salaryData);

    salaryData.forEach(function(d){
        d.salary = parseInt(d.salary);
         console.log(d.salary)
        d.yrs_since_phd = parseInt(d["yrs.since.phd"])  //also to parse my yrs_since_phd from string to int.REMOVE DOTS TO AVOID PROBLEMS
        d.yrs_service = parseInt(d["yrs.service"])
    });

    var rank_dim = ndx.dimension(dc.pluck('rank'));/*replace by country*/ 
    var total_salary_per_rank = rank_dim.group().reduceSum(dc.pluck('salary'));/*replace by country and sector*/ 

    // dc.pieChart("#pie-salaries-test") /*replace by name of div*/ 
    //     .height(330)
    //     .radius(90)
    //     .transitionDuration(1500)
    //     .dimension(rank_dim) /*replace by country*/ 
    //     .group(total_salary_per_rank); /*replace by:  total_emissions_per_country */ 
    
    dc.lineChart("#chart-test")
            .width(1000)
            .height(300)
            .margins({top: 10, right: 50, bottom: 30, left:100})
            .dimension(rank_dim)
            .group(total_salary_per_rank)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            //.y(d3.scale.linear().domain([0, d3.max(emissionSectorData)]).range([0, h]))//check scale and x axus
            .elasticY(true) 
            .xAxisLabel("rank")
            .yAxisLabel("Total salary")
            .yAxis().ticks(20);
    
    
        dc.renderAll();
}