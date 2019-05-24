const margin = {top: 10, bottom: 10,  right: 30, left: 40};
var width = 500 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

const chart = d3.select('.chart')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	
/** chart boilerplate **/

var keys = ["safety_score", "preservation_score", "congestion_score", "economic_score", "connectivity_score", "environment_score"];

var data = [
	{
		project_id: '5105-024',
		safety_score: 30, 
		preservation_score: 5, 
		congestion_score: 20.8, 
		economic_score: 10.4, 
		connectivity_score: 2.3, 
		environment_score: 10
},
	{
		project_id: '5105-025',
		safety_score: 3, 
		preservation_score: 5.1, 
		congestion_score: 23.8, 
		economic_score: 13.4, 
		connectivity_score: 2.13, 
		environment_score: 14
	}
];

//add totale
data = data.map((d) => {
	var total = d.safety_score + d.preservation_score + d.congestion_score + d.economic_score + d.connectivity_score + d.environment_score;
	return {...d, total}
});

//console.log('updated with total', data)

var stackedData = d3.stack().keys(keys)(data);
//console.log('stackedData', stackedData);

var x = d3.scaleBand()
					.domain(data.map((d) => d.project_id))
					.range([0, width]);
					//.paddingInner(0.05);


					var y = d3.scaleLinear()
					.domain([0, d3.max(data.map((d) => d.total))])
					.range([height, 0]);

var z = d3.scaleOrdinal()
					.domain(keys)
					.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

/** making the chart **/
chart.selectAll('g')
     .data(stackedData)
		 .enter()
		 .append('g')
			.attr("fill", (d) => z(d.key))
    .selectAll("rect")
    .data((d) => d)
		.enter()
		.append("rect")
      .attr("x", (d) => x(d.data.project_id))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
			.attr("width", x.bandwidth() - 30);
		

