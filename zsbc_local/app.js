// define json object
var root = {
	"name": "TOTAL",
	"color": "#FFF",
	"children": [
		{
			"name": "Safety",
			"color": '#435b90',
			// "size": "31.42",
			"children": [
				{
					"name": "Crash Rate",
					"color": '#678CDB',
					"children": [
						{ "name": "Estimated Impact on Fatal and Serious Injury Crash Rate", "color": '#A9B9DB', "size": 3.928 },
						{ "name": "Estimated Total Crash Rate", "size": 3.928 },
					]
				},
				{
					"name": "Crash Count",
					"color": '#A9B9DB',
					"children": [
						{ "name": "Estimated Impact on Fatal and Serious Injury Crashes", "size": 3.928 },
						{ "name": "Estimated Total Crashes", "size": 3.928 },
					]
				},
				{
					"name": "Safety Categorization",
					"color": "#ceecf0",
					"children": [
						{ "name": "Hurricane Evacuation Route", "size": 3.928, "color": '#2B3B5C' },
						{ "name": "Safety Project Classification", "size": 3.928, "color": '#2B3B5C'}
					]
				},
				{ "name": "Societal Project Classification", "size": 7.855, "color": '#2B3B5C' }
			]
		},
		{
			"name": "Preservation",
			"color": '#914e92',
			"children": [
				{
					"name": "Bridge Condition",
					"color": '#DC76DE',
					"children": [
						{ "name": "Deck Area Receiving Preventative Maintenance", "size": 5.2125 },
						{ "name": "Reduction in Structrually Deficient Deck Area", "size": 5.2125 }
					]
				},
				{
					"name": "Pavement Condition",
					"color": '#DDB8DE',
					"children": [
						{ "name": "Lane Miles Receiving Maintenance (By Distress Score)", "size": 2.606 },
						{ "name": "Reduction in Poor Lane Miles(By Distress Score)", "size": 2.606 },
						{ "name": "Lane Miles Receiving Preventative Maintenance (By Ride Score)", "size": 2.606 },
						{ "name": "Reduction in Poor Lane Miles (By Ride Score)", "size": 2.606 }
					]
				},
			]
		},
		{
			"name": "Congestion",
			"color": '#e15069',
			"children": [
				{
					"name": "Congestion Reduction",
					"color": '#E697A4',
					"children": [
						{ "name": "Benefit Congestion Index - Auto", "size": 9.610 },
						{ "name": "Benefit Congestion Index - Truck", "size": 9.610 }
						// { "name": "Normalized Congestion Index - Auto", "size": 4.805 },
						// { "name": "Normalized Congestion Index - Truck", "size": 4.805 }
					]
				}
			]
		},
		{
			"name": "Connectivity",
			"color": '#f9a83b',
			"children": [
				{
					"name": "Enhanced Connectivity",
					"color": '#FBC987',
					"children": [
						{ "name": "Truck System Route", "size": 3.372 },
						{ "name": "Access and Reliability", "size": 3.372 },
						{ "name": "Intermodal Connector", "size": 3.372 },
						{ "name": "Lane Miles of New Connectivity", "size": 3.372 }
					]
				}
			]
		},
		{
			"name": "Economic",
			"color": '#2abfc6',
			"children": [
				{
					"name": "Economic Importance",
					"color": '#6ACBD0',
					"children": [
						{ "name": "National Highway System Route (NHS)", "size": 2.455 },
						{ "name": "National Highway Freight Network (NHFN)", "size": 2.455 }
					]
				},
				{
					"name": "System Usage",
					"color": '#1F8E94',
					"children": [
						{ "name": "Base ADT", "size": 1.637 },
						{ "name": "Base ADTT", "size": 1.637 },
						{ "name": "Energy Sector Route", "size": 1.637 }
					]
				},
			]
		},
		{
			"name": "Environment",
			"color": '#00a651',
			"size": 5.21,
			"children": [
				{ "name": "Environmental" }
			]
		}
	]
}

// set width, height, and radius
var width = 425,
	height = 425,
	radius = (Math.min(width, height) / 2); // lowest number divided by 2. Then subtract 10

var x = d3.scaleLinear() // continuous scale. preserves proportional differences 
	.range([0, 2 * Math.PI]); // setting range from 0 to 2 * circumference of a circle 

var y = d3.scaleSqrt() // continuous power scale 
	.range([0, radius]); // setting range from 0 to radius 

var partition = d3.partition(); // subdivides layers 

// define arcs
var arc = d3.arc()
	.startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
	.endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
	.innerRadius(function (d) { return Math.max(0, y(d.y0)); })
	.outerRadius(function (d) { return Math.max(0, y(d.y1)); });

// define tooltip
var tooltip = d3.select('body') // select element in the DOM with id 'chart'
	.append('div').classed('tooltip', true); // append a div element to the element we've selected
tooltip.append('div') // add divs to the tooltip defined above
	.attr('class', 'label'); // add class 'label' on the selection
tooltip.append('div') // add divs to the tooltip defined above
	.attr('class', 'count'); // add class 'count' on the selection
tooltip.append('div') // add divs to the tooltip defined above
	.attr('class', 'percent'); // add class 'percent' on the selection

// prep the data
var root = d3.hierarchy(root);

// calculate total
var total = 100;


root.sum(function (d) {
	if (typeof d.size !== 'undefined'){
		return parseFloat(d.size.toFixed(2));
	}
	return d.size; 
});

// define SVG element
var svg = d3.select("#chart").append("svg")
	.attr("width", width) // set width
	.attr("height", height) // set height
	.append("g") // append g element
	.attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

var group = svg.select



// redraw(root);
var path = svg.selectAll("path")
	.data(partition(root).descendants()) // path for each descendant
	.enter()
		.append("path")
		.attr("d", arc) // draw arcs
		.attr("class", "path")
		.style("fill", function (d) { return (d.children ? d : d.parent).data.color; })

		.on("click", click)
//	adds tool tip on mouse over
	.on('mouseover', function (d) {
		var percent = d.value / total; // calculate percent
		tooltip.select('.label').html("<h4>" + d.data.name + "<h4>"); // set current label           
		tooltip.select('.count').html("Percent: " + d.value.toFixed(4) + "%"); // set current count            
		tooltip.select('.percent').html("Weight: " + percent.toFixed(4)); // set percent calculated above          
		tooltip.style('display', 'block'); // set display
	})
	.on('mouseout', function () { // when mouse leaves div                        
		tooltip.style('display', 'none'); // hide tooltip for that element
	})
	.on('mousemove', function (d) { // when mouse moves                  
		tooltip.style('top', (d3.event.layerY + 10) + 'px'); // always 10px below the cursor
		tooltip.style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
	});

d3.select(self.frameElement).style("height", height + "px");

// legend HTML
var legendContainer = d3.select("#legend").append("div").classed("legends clearfix", true);

var legend = legendContainer.selectAll(".legend")
	.data(root.children)
	.enter()
	.append('div') // replace placeholders with g elements
	.attr('class', 'legend'); // each g is given a legend class

rect = legend.append('div').classed('rect', true) // append rectangle squares to legend
	.style('background-color', function (d) { return d.data.color; })
	.style('border', function (d) { return '1px solid'; });

// adding text to legend
legend.append('span')
	.text(function (d) { return d.data.name; })

svg.append("text")
	.attr("class", "total")
	.attr("text-anchor", "middle")
	.attr('font-size', '4em')
	.attr('y', 20)
	.text(parseFloat(total.toFixed(2)) + "%");

// redraw on disabled category
function redraw(d) {
	console.log("function redraw");

	svg.transition()
		.duration(750)
		.tween("scale", function () {
			var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
				yd = d3.interpolate(y.domain(), [d.y0, 1]),
				yr = d3.interpolate(y.range(), [d.y0 ? (radius / 2) : 0, radius]);
			return function (t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
		})
		.selectAll("path")
		.attrTween("d", function (d) { return function () { return arc(d); }; });

	//d3.select(".total").text(d.value.toFixed(0) + "%");
}

// zoom on click
function click(d) {
	console.log("function click");
	console.log("d.y0 = " + d.y0);

	svg.transition()
		.duration(650) // duration of transition
		.tween("scale", function () {
			var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
				yd = d3.interpolate(y.domain(), [d.y0, 1]),
				yr = d3.interpolate(y.range(), [d.y0 ? (80) : 0, radius]);
			return function (t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
		})
		.selectAll("path")
		.attrTween("d", function (d) { return function () { return arc(d); }; });
	d3.select(".total").text(d.value.toFixed(0) === "100" ? "100%" : d.value.toFixed(2) + "%");
}


