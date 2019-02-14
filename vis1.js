var drawChart = function(data)
{
  let svg = d3.select("body").select("svg");
  let districts = ["Bayview", "Central", "Ingleside", "Mission", "Northern", "Park", "Richmond", "Southern", "Taraval", "Tenderloin"];
  let crimes = ["Assault", "Burglary", "Disorderly Conduct", "Drug Offense", "Fraud","Lost Property","Malicious Mischief","Missing Person","Motor Vehicle Theft","Non-Criminal","Offences Against The Family And Children","Other Miscellaneous","Recovered Vehicle","Robbery","Suspicious Occ","Traffic Violation Arrest","Warrant"];

  let bounds = svg.node().getBoundingClientRect();
  console.log(bounds);
  let margin = {
    top:    15,
    right:  250, // leave space for y-axis
    bottom: 40, // leave space for x-axis
    left:   10
  };
  let plotWidth = bounds.width - margin.right - margin.left;
  let plotHeight = bounds.height - margin.top - margin.bottom;
  //set the scales
  let x = d3.scaleBand();
  x.domain(districts);
  x.range([0, plotWidth]);
  let y = d3.scaleBand();
  y.domain(crimes);
  y.range([plotHeight, 0]);

  let plot = svg.select("g#plot");
  if (plot.size() < 1) {
    // this is the first time we called this function
    // we need to steup the plot area
    plot = svg.append("g").attr("id", "plot");
    // shift the plot area over by our margins to leave room
    // for the x- and y-axis
    plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  let xAxis = d3.axisBottom(x);
  xAxis.tickSize(0);
  let yAxis = d3.axisRight(y);
  yAxis.tickSize(0);

  if (plot.select("g#y-axis").size() < 1) {
    let xGroup = plot.append("g").attr("id", "x-axis");
    // the drawing is triggered by call()
    xGroup.call(xAxis);
    // notice it is at the top of our svg
    // we need to translate/shift it down to the bottom
    xGroup.attr("transform", "translate(0," + plotHeight + ")");
    let xLabel = plot.append("text")
      .attr("transform",
            "translate(" + ( plotWidth )/2 + " ," +
                           ( margin.bottom - 10 + plotHeight) + ")")
      .style("text-anchor", "middle")
      .text("Police District");
    // do the same for our y axix
    let yGroup = plot.append("g").attr("id", "y-axis");
    yGroup.call(yAxis);
    yGroup.attr("transform", "translate(" + plotWidth + ",0)");
    let yLabel = plot.append("text")
      .attr("transform",
            "translate(" + (plotWidth + margin.right-30)+ " ," +
                           (plotHeight/2) + ") rotate(90)")
      .style("text-anchor", "middle")
      .text("Type of Crime");
    }


}
