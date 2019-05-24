const colors = {
	safety: "#435b90", 
	preservation: "#914e92", 
	congestion: "#e15069", 
	economic: "#2abfc6", 
	connectivity: "#f9a83b", 
	environment: "#00a651", 
	default: "#000000",
	test: "#ef4450"
}

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
		environment_score: 3
},
	{
		project_id: '5105-00-025',
		safety_score: 20, 
		preservation_score: 5.1, 
		congestion_score: 23.8, 
		economic_score: 13.4, 
		connectivity_score: 2.13, 
		environment_score: 14
	},
	{
		project_id: '5105-00-000',
		safety_score: 25, 
		preservation_score: 25.1, 
		congestion_score: 3.8, 
		economic_score: 14, 
		connectivity_score: 5.13, 
		environment_score: 2
	},
	{
		project_id: '0005-00-045',
		safety_score: 10, 
		preservation_score: 5.1, 
		congestion_score: 3.8, 
		economic_score: 13.4, 
		connectivity_score: 1.13, 
		environment_score: 4
	},	{
		project_id: '1805-02-0j8',
		safety_score: 30, 
		preservation_score: 25.1, 
		congestion_score: 13.8, 
		economic_score: 10.4, 
		connectivity_score: 7.8, 
		environment_score: 3
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

var z = d3.scaleOrdinal()
					.domain(keys)
					.range([colors.safety, colors.preservation, colors.congestion, colors.economic, colors.connectivity, colors.environment]);

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
			.attr("height", y.bandwidth() - 5);

// adding label to the right of each bar
chart.selectAll(".chart rect")
		 .append('text')
		 .attr('class', 'label')
		 .text('hello')
		 .style('font-size', '10px');