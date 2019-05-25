
	var safety_weight;
	var preservation_weight;
	var congestion_weight;
	var economic_weight;
	var connectivity_weight;
	var environment_weight;
	var mult_data;

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
	
	var data = [
	{
		project_id: '5105-45-024',
		safety_score: 30, 
		preservation_score: 5, 
		congestion_score: 20.8, 
		economic_score: 10.4, 
		connectivity_score: 2.3, 
		environment_score: 3
	},	{
		project_id: '5105-00-025',
		safety_score: 20, 
		preservation_score: 5.1, 
		congestion_score: 23.8, 
		economic_score: 13.4, 
		connectivity_score: 2.13, 
		environment_score: 14
	},	{
		project_id: '5105-00-000',
		safety_score: 25, 
		preservation_score: 25.1, 
		congestion_score: 3.8, 
		economic_score: 14, 
		connectivity_score: 5.13, 
		environment_score: 2
	},	{
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
	
	var keys = ["safety_score", "preservation_score", "congestion_score", "economic_score", "connectivity_score", "environment_score"];

	//getting total, and adding property to each data object.
	data = data.map((d) => {
		var total = d.safety_score + d.preservation_score + d.congestion_score + d.economic_score + d.connectivity_score + d.environment_score;
		return {...d, total};
	});

	//function that sorts the bars.
	var dataTotal = data.sort(function(a, b) {
		return d3.ascending(a.total, b.total);
	});
	
	//stacks data sometimes regerred to as "layers"
	var s_data = d3.stack().keys(keys)(dataTotal);
	
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

//function drawChart() {
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

$(function () {

	$('#submit').on('click submit', function(){
		var base = 16.667;

		safety_weight = (parseInt($('#safety_score').val(), 2).isNaN() ? base : parseInt($('#safety_score').val(), 2));
		preservation_weight = (parseInt($('#preservation_score').val(), 2).isNaN() ? base : parseInt($('#preservation_score').val(), 2));
		congestion_weight = (parseInt($('#congestion_score').val(), 2).isNaN() ? base : parseInt($('#congestion_score').val(), 2));
		economic_weight = (parseInt($('#economic_score').val(), 2).isNaN() ? base : parseInt($('#economic_score').val(), 2));
		connectivity_weight = (parseInt($('#connectivity_score').val(), 2).isNaN() ? base : parseInt($('#connectivity_score').val(), 2));
		environment_weight = (parseInt($('#environment_score').val(), 2).isNaN() ? base : parseInt($('#environment_score').val(), 2));

		$('.s_chart').empty();

		mult_data = data.map((d) => {
			var safety_score = d.safety_score * safety_weight; 
			var preservation_score = d.preservation_score * preservation_weight; 
			var congestion_score = d.congestion_score * congestion_weight; 
			var economic_score = d.economic_score * economic_weight; 
			var connectivity_score = d.connectivity_score * connectivity_weight; 
			var environment_score = d.environment_score * environment_weight; 
			var total = d.safety_score + d.preservation_score + d.congestion_score + d.connectivity_score + d.environment_score;

			return {safety_score, preservation_score, congestion_score, economic_score, connectivity_score, environment_score, total}
		});

		mult_data.sort(function(a, b) {
			return d3.ascending(a.total, b.total);
		});		

		d3.stack().keys(keys)(mult_data);

		var y1 = d3.scaleBand()
		.domain(mult_data.map((d) => d.project_id))
		.range([0, height]);

		var x1 = d3.scaleLinear()
		.domain([0, d3.max(mult_data.map((d) => d.total))])
		.range([0, width]);


		chart.append("g")
		.attr("class", "y-axis")
		.call(d3.axisLeft(y));

		//function drawChart() {
		chart.selectAll('.chart')
		.data(mult_data)
		.enter()
		.append('g')
		.attr("fill", (d) => z(d.key))
		.selectAll("rect")
		.data((d) => d)
		.enter()
		.append("rect")
		.attr("y", (d) => y1(d.data.project_id))
		//.attr("x", (d) => x(d[0]))
		.attr('x', (d) => x1(d[0]))
		.attr("width", (d) => x1(d[1]) - x1(d[0]))
		.attr("height", y1.bandwidth() - 5);

	});
});