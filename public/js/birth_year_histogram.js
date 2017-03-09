var plotHistogram = function (data) {
	var formatCount = d3.format(",.0f");

  var svg = d3.select("svg.birth_year_histogram"),
      margin = {top: 50, right: 30, bottom: 50, left: 60},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
  		.domain([d3.min(data), d3.max(data)])
      .rangeRound([0, width]);

  var bins = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(60))
      (data);

  var y = d3.scaleLinear()
      .domain([0, d3.max(bins, function(d) { return d.length; })])
      .range([height, 0]);

  var bar = g.selectAll(".bar")
    .data(bins)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

  bar.append("rect")
      .attr("x", 1)
      .attr("width", x(bins[1].x1) - x(bins[1].x0) - 1)
      .attr("height", function(d) { return height - y(d.length); })
      .style("opacity", "0.7")
      .on('mouseenter', function (d) {
        this.style.opacity = "1.0";
        var text = d3.select(this.parentNode).select("text");
        text.style("opacity", "1.0");
      })
      .on('mouseleave', function (d) {
        this.style.opacity = "0.7";
        var text = d3.select(this.parentNode).select("text");
        text.style("opacity", "0.0");
  	  });

	bar.append("text")
      .attr("dy", "8px")
      .attr("dx", "16px")
      .attr("y", 0)
      .attr("x", (x(bins[1].x1) - x(bins[1].x0)) / 2)
      .attr("text-anchor", "middle")
      .style("opacity", "0.0")
      .text(function(d) {
        if (d.length === 0)
          return "";
        else
          return formatCount(d.length);
      });

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(20, ".0f"));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y));

  g.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -height / 2)
    .attr("dy", "-3em")
    .attr("transform", "rotate(-90)")
    .text("Book Count");

  g.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height)
    .attr("dy", "45px")
    .text("Author Birth Year");

  g.append("text")
    .attr("class", "title")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", 0)
    .text("Book Count per Author Birth Year");
};

d3.csv("/public/raw/pruned_stats.csv", function (err, data) {
  if (err) throw error;
  var years = data.map(function (row) {
  	return parseInt(row["Author Birth Years"]);
  }).filter(function (year) {
  	return !isNaN(year)
  });

  plotHistogram(years);
});
