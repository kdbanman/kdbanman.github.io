var plotBytesByBirthYear = function (data) {
  var years = data.map(function (datum) { return datum.year; });
  var sizes = data.map(function (datum) { return datum.size; });

	var formatCount = d3.format(",.0f");
  var binSizeMB = function (bin) { return d3.sum(bin.map(function (d) { return d.size; })) / 1000; };

  var svg = d3.select("svg.bytes_by_birth_year"),
      margin = {top: 50, right: 30, bottom: 50, left: 60},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
  		.domain([d3.min(years), d3.max(years)])
      .rangeRound([0, width]);

  var bins = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(60))
      .value(function (d) { return d.year; })
      (data);

  var y = d3.scaleLinear()
      .domain([0, d3.max(bins, binSizeMB)])
      .range([height, 0]);

  var bar = g.selectAll(".bar")
    .data(bins)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(bin) { return "translate(" + x(bin.x0) + "," + y(binSizeMB(bin)) + ")"; });

  bar.append("rect")
      .attr("x", 1)
      .attr("width", x(bins[1].x1) - x(bins[1].x0) - 1)
      .attr("height", function(bin) { return height - y(binSizeMB(bin)); })
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
      .text(function(bin) {
        if (binSizeMB(bin) === 0)
          return "";
        else
          return "" + binSizeMB(bin);
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
    .text("MB of Text");

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
    .text("Total MB of Text per Author Birth Year");
};

d3.csv("/public/raw/pruned_stats.csv", function (err, rows) {
  if (err) throw error;
  var data = rows.map(function (row) {
  	return {
      year: parseInt(row["Author Birth Years"]),
      size: parseInt(row["Size (KB)"])
    };
  }).filter(function (d) {
    return d.year >= 1500;
  });

  plotBytesByBirthYear(data);
});
