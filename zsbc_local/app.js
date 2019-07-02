var p_score = {
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
					"color": '#374B75',
					"children": [
						{ "name": "Estimated Impact on Fatal and Serious Injury Crash Rate", "color": '#A9B9DB', "size": 3.928, "color":"#598ABD" },
						{ "name": "Estimated Total Crash Rate", "size": 3.928, "color": "#B6E0FF"},
					]
				},
				{
					"name": "Crash Count",
					"color": "#678CDB",
					"children": [
						{ "name": "Estimated Impact on Fatal and Serious Injury Crashes", "size": 3.928, "color": "#59C8ED" },
						{ "name": "Estimated Total Crashes", "size": 3.928, "color": "#91CFFA" },
					]
				},
				{
					"name": "Safety Categorization",
					"color": "25324F",
					"children": [
						{ "name": "Hurricane Evacuation Route", "size": 3.928, "color": '#2B3B5C' },
						{ "name": "Safety Project Classification", "size": 3.928, "color": '#2B3B5C'}
					]
				},
				{ "name": "Societal Project Classification", "size": 7.855, "color": '#598ABD' }
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
						{ "name": "Benefit Congestion Index - Auto", "size": 9.610, "color": "#E697A4" },
						{ "name": "Benefit Congestion Index - Truck", "size": 9.610, "color": "#AD3E51" }
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

var width = 425,
	height = 425,
	radius = (Math.min(width, height)/2);

var x = d3.scaleLinear().range([0, 2 * Math.PI]);

var y = d3.scaleSqrt().range([0, radius]);

var partition = d3.partition();

var arc = d3.arc()
		 .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
		 .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
		 .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
		 .outerRadius(function(d) { return Math.max(0, y(d.y1)); });

var root = d3.hierarchy(p_score);

root.sum(function (d) {
	if (typeof d.size !== 'undefined'){
		return parseFloat(d.size.toFixed(2));
	}
	return d.size; 
});

root.data.children.forEach((d) => {	d.enabled = true;});

var svg = d3.select('.chart').append("svg")
	.attr("width", width)
	.attr("height", height)
	.append("g")
	.attr("id", "wrapper")
	.attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

//creating the tooltip body
var tooltip = d3.select('body')
	.append('div').classed('tooltip', true);
tooltip.append('div')
	.attr('class', 'label');
tooltip.append('div')
	.attr('class', 'count');
tooltip.append('div')
	.attr('class', 'percent');

var arc_path = svg.selectAll('.arc')
	.data(partition(root).descendants())
	.enter().append("path")
	.attr("class", "arc")
	.attr("d", arc) // draw arcs
	.attr("id", (d, i) => {return i + "_arc"})
	.style("cursor", "pointer")
	.style("fill",  (d) => {
			return d.data.color ? d.data.color : d.parent.data.color;
	})
	.on("click", click)
	.each(function(d,i) {
		var firstArcSection = /(^.+?)L/;
		var p = d3.select(this).attr("d");

		if (p.indexOf('L') > -1) {
			var newArc = firstArcSection.exec(p)[1];
			newArc = newArc.replace(/,/g , " ");
			svg.append("path")
			.attr("class", "h_arc")
			.style('fill', 'none')
			.style('stroke', 'none')
			.attr("d", newArc)
			.attr('id', i + '_hidden_arc');
		}
	})
	.on('mouseover', function(d) {
		var total = d.parent ? d.parent.value : d.value;
		var percent = Math.round(1000 * d.value / total) / 10; // calculate percent
		tooltip.select('.label').html(d.data.name); // set current label           
		tooltip.select('.count').html(d.value); // set current count            
		tooltip.select('.percent').html(percent + '% of direct parent'); // set percent calculated above          
		tooltip.style('display', 'block'); // set display   
	})
	.on('mouseout', function() { // when mouse leaves div                        
		tooltip.style('display', 'none'); // hide tooltip for that element
	})
	.on('mousemove', function(d) { // when mouse moves                  
		tooltip.style('top', (d3.event.layerY + 10) + 'px'); // always 10px below the cursor
		tooltip.style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
	});
	

	var text = svg.selectAll('.arcText')
		.data(partition(root).descendants())
		.enter()
		.append("text")
		.attr('class', 'arcText')
		.attr('dy', '1.5em')
		.style('font-size', '.8em')
		.append('textPath')
			.attr("startOffset", "50%")
			.style("text-anchor", "middle")
			.style("cursor", "pointer")
			.attr('xlink:href', (d, i) => {return '#' + i + '_hidden_arc'})
			.text((d)=>{return d.data.name})
			.on('mouseover', function(d) {
				var total = d.parent ? d.parent.value : d.value;
				var percent = Math.round(1000 * d.value / total) / 10; // calculate percent
				tooltip.select('.label').html(d.data.name); // set current label           
				tooltip.select('.count').html(d.value); // set current count            
				tooltip.select('.percent').html(percent + '% of direct parent'); // set percent calculated above          
				tooltip.style('display', 'block'); // set display   
			})
			.on('mouseout', function() { // when mouse leaves div                        
				tooltip.style('display', 'none'); // hide tooltip for that element
			})
			.on('mousemove', function(d) { // when mouse moves                  
				tooltip.style('top', (d3.event.layerY + 10) + 'px'); // always 10px below the cursor
				tooltip.style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
			})
			.on("click", click);

// middle-placed total
var total = 100;

svg.append("text")
	.attr("class", "total")
	.attr("text-anchor", "middle")
	.attr('font-size', '4em')
	.attr('y', 20)
	.text(total + "%");

/////////////////////////////////////////////////////////////////////////
///////////////////////////functions/////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

function click(d) {

	//hides current text
	//text.transition().duration(100).attr("opacity", 0);
	
	//beings animation for arcs
	svg.transition()
		.duration(650) // duration of transition
		.tween("scale", () => {
			var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
					yd = d3.interpolate(y.domain(), [d.y0, 1]),
					yr = d3.interpolate(y.range(), [d.y0 ? (80) : 0, radius]);
			return (t) => { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
		})
		.selectAll("path")
		.attrTween("d", (d) => {
			return () => {
				//arc_path();
				//text();
				return arc(d); 
			}; 
		});
		//text.transition().duration(100).attr("opacity", 1);
	d3.select(".total").text(d.value.toFixed(0) === "100" ? "100%" : d.value.toFixed(2) + "%");
};

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
		.selectAll("g")
		.attrTween("d", function (d) { return function () { return arc(d); }; });

		d3.select(".total").text(d.value.toFixed(0) === "100" ? "100%" : d.value.toFixed(2) + "%");
}

function computeTextRotation(d) {
  return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
}