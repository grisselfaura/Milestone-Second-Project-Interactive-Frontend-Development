d3.csv("../data/global-carbon-dioxide-emissions-by-sector.csv").then(makeGraphs);

const CODE_KEY = 'Code';
const ENTITY = 'Entity';
const AGRICULTUR_LAND_USE_AND_FORESTY = 'Agriculture - Land Use & Forestry';
const RESIDENTIAL = 'Residential & commercial (tonnes)';
const TRANSPORT = 'Transport';
const FORESTRY = 'Forestry';
const ENERGY = 'Energy';
const OTHER_RESOURCES = 'Other sources';
const WASTE = 'Waste (tonnes)';
const RESIDENTIAL_AND_COMMERCIAL = 'Residential & commercial (tonnes)';
const INDUSTRY = 'Industry (tonnes)';
const AGRICULTURE = 'Agriculture (tonnes)';

function makeGraphs(data) {
  var filteredData = [];
  data.forEach((d) => {
    if (d[CODE_KEY] !== "") {
      filteredData.push({
        'country': d[ENTITY],
        'transport': Number(d[TRANSPORT]),
        'forestry': Number(d[FORESTRY]),
        'energy': Number(d[ENERGY]),
        'otherResources': Number(d[OTHER_RESOURCES]),
        'landUseAndForestry': Number(d[AGRICULTUR_LAND_USE_AND_FORESTY]),
        'waste': Number(d[WASTE]),
        'residentialAndCommercial': Number(d[RESIDENTIAL_AND_COMMERCIAL]),
        'industry': Number(d[INDUSTRY]),
        'agriculture': Number(d[AGRICULTURE])
      });
    }
  });

  filteredData = groupByCountryAndReduce(filteredData);
  const globalEmissions = crossfilter(filteredData);
  const emissionDim = globalEmissions.dimension(d => d.country);

  const countryList = filteredData.map(d => d.country);
  // Populate the select input with the list of countries
  var $selectInput = $("#select-country");

  countryList.forEach(countryName => {
      $selectInput.append($("<option />").val(countryName).text(countryName));
  });

  // Select the first country from the list by default
  var selectedCountry = countryList[0];

  $('select').on('change', function() {
    selectedCountry = this.value;
    emissionDim.filterAll();
    const group = filterAndCreateGroup(emissionDim, selectedCountry);
    renderChart(globalEmissions, group, '#global-carbon-dioxide-emision-by-sector');
  });
 
  const group = filterAndCreateGroup(emissionDim, selectedCountry);
  renderChart(globalEmissions, group, '#global-carbon-dioxide-emision-by-sector');
}

function renderChart(emissionDim, group, elementId, selectedCountry) {
  const pie = dc.pieChart(elementId)
    .height(300)
    .width(550)
    .innerRadius(50)
    .radius(125)
    .transitionDuration(1000)
    .dimension(emissionDim)
    .group(group)
    .useViewBoxResizing(true)
    .legend(dc.legend().x(430).y(10).itemHeight(12).gap(5));

  pie.render();
}

function filterAndCreateGroup(emissionDim, selectedCountry) {
  emissionDim.filter(selectedCountry);
  const topOne = emissionDim.top(1);
  console.log(topOne[0]);
  return groupCountryByEmission(topOne[0]);
}

function groupBy(data, dim) {
  return data.reduce(function (acc, obj) {
    let key = obj[dim]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {});
}

function groupByCountryAndReduce(data) {
  const resultList = [];
  const map = groupBy(data, 'country');
  Object.keys(map).forEach((key, index, array) => {
    const list = map[key];
    const result = list.reduce((acc, currentValue) => {
      Object.keys(currentValue).forEach(key => {
        const val = currentValue[key];
        if (!acc[key]) {
          acc[key] = val;
        }
        else {
          if (!isNaN(val)) {
            acc[key] += val;
          }
        }
      });
      
      return acc;
    }, []);
    resultList.push(result);
  });
  return resultList;
}

function groupCountryByEmission(data) {
  return {
    all: function() {
      return Object.keys(data).reduce((acc, currentValue) => {
        if (currentValue !== 'country') {
          acc.push({'key': currentValue, 'value': data[currentValue]});
        }
        return acc;
      }, []);
    }
  };
}