var plotBirthYearLogHistogram = function (data) {
  var formatCount = d3.format(",.0f");

  var svg = d3.select("svg.birth_year_log_histogram"),
      margin = {top: 50, right: 30, bottom: 50, left: 60},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
  		.domain([d3.min(data), d3.max(data)])
      .rangeRound([0, width]);

  var bins = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(180))
      (data);

  var y = d3.scaleLog()
      .domain([1, d3.max(bins, function(d) { return d.length; })])
      .range([height, 0]);

  var bar = g.selectAll(".bar")
    .data(bins)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(Math.max(d.length, 1)) + ")"; });

  bar.append("rect")
      .attr("x", 0)
      .attr("width", x(bins[1].x1) - x(bins[1].x0))
      .attr("height", function(d) { return height - y(Math.max(d.length, 1)); })
      .style("opacity", "1.0")
      .on('mouseenter', function (d) {
        this.style.opacity = "0.7";
        text.style("opacity", "1.0");
      })
      .on('mouseleave', function (d) {
        this.style.opacity = "1.0";
        text.style("opacity", "0.0");
  	  });
  
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(20, ".0f"));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, ",.0f"));
  
  g.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -height / 2)
    .attr("dy", "-3em")
    .attr("transform", "rotate(-90)")
    .text("Book Count (Log Scale)");
  
  g.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height)
    .attr("dy", "3em")
    .text("Author Birth Year");
  
  g.append("text")
    .attr("class", "title")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", 0)
    .text("Log Scale Book Count per Author Birth Year");
};

d3.csv("/public/raw/pruned_stats.csv", function (err, data) {
  if (err) throw error;
  var years = data.map(function (row) {
  	return parseInt(row["Author Birth Years"]);
  }).filter(function (year) {
  	return !isNaN(year)
  });
  
  plotBirthYearLogHistogram(years);
});