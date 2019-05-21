const margin = {top: 10, bottom: 10,  right: 30, left: 80};
var width = 500 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var chart = d3.select('.s_chart')
							.attr('width', width + margin.left + margin.right)
							.attr('height', height + margin.top + margin.bottom)
							.append('g')
							.attr('class', 'chart')
							.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var keys = ["safety_score", "preservation_score", "congestion_score", "economic_score", "connectivity_score", "environment_score"];

var data = [
	{
		project_id: '5105-45-024',
		safety_score: 30, 
		preservation_score: 5, 
		congestion_score: 20.8, 
		economic_score: 10.4, 
		connectivity_score: 2.3, 
		environment_score: 1
},
	{
		project_id: '5105-00-025',
		safety_score: 3, 
		preservation_score: 5.1, 
		congestion_score: 23.8, 
		economic_score: 13.4, 
		connectivity_score: 2.13, 
		environment_score: 14
	}
];

//getting total, and adding property to each data object.
data = data.map((d) => {
	var total = d.safety_score + d.preservation_score + d.congestion_score + d.economic_score + d.connectivity_score + d.environment_score;
	return {...d, total}
});

//stacks data sometimes regerred to as "layers"
var s_data = d3.stack().keys(keys)(data);

var y = d3.scaleBand()
					.domain(data.map((d) => d.project_id))
					.range([0, height]);
					//.paddingInner(0.05);
var z = d3.scaleOrdinal()
					.domain(keys)
					.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var x = d3.scaleLinear()
					.domain([0, d3.max(data.map((d) => d.total))])
					.range([0, width]);



chart.append("g")
			.attr("class", "y-axis")
			.call(d3.axisLeft(y));

// /** making the chart **/
chart.selectAll('.chart')
     .data(s_data)
		 .enter()
		 .append('g')
			.attr("fill", (d) => z(d.key))
    .selectAll("rect")
    .data((d) => d)
		.enter()
		.append("rect")
      .attr("y", (d) => y(d.data.project_id))
			//.attr("x", (d) => x(d[0]))
			.attr('x', (d) => x(d[0]))
      .attr("width", (d) => x(d[1]) - x(d[0]))
			.attr("height", y.bandwidth() - 30);

chart.selectAll(".chart rect")
		 .append('text')
		 .attr('class', 'label')
		 .text('hello');