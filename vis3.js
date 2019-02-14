//iterate through the data and add count to unique days of the week
var crimePerWeekday = function(data)
{
  let count = d3.map();
  //loop through the data and look at the day of the week
  data.forEach(function(d)
    {
      var day = d["Incident Day of Week"];
      //add to map or increment count
      if(count.has(day))
      {
        count.set(day,count.get(day)+1);
      }
      else {
        count.set(day, 1);
      }
    });
  return count;
};

var drawBarChart = function(count)
{
  let days = ["Sunday","Monday", "Tuesday","Wednesday","Thursday","Friday", "Saturday"];
  //select the space to draw
  let svg = d3.select("body").select("svg");
  //set the range
  let countMin = 0;
  let countMax = 2001;
  let margin = {
    top:    15,
    right:  100, // leave space for y-axis and label
    bottom: 40, // leave space for x-axis and label
    left:   10
  };
  //calculate how much space we have to plot
  let bounds = svg.node().getBoundingClientRect();
  let plotWidth = bounds.width - margin.right - margin.left;
  let plotHeight = bounds.height - margin.top - margin.bottom;
  //set the spacing rules for the y axis
  let countScale = d3.scaleLinear()
  .domain([countMin, countMax]) // min to max count
  .range([plotHeight, 0]) // height of the space
  .nice(); //rounds so you don't end up with half a pixel
  //set the spacing rules for the x axis
  let dayScale = d3.scaleBand()
  .domain(days) // all days
  .rangeRound([0, plotWidth]) //round so you don't end up with half a pixel
  .paddingInner(0.1); // space between bars

  //select the plot area
  let plot = svg.select("g#plot");

  //set the plot area
  if (plot.size() < 1) {
    // this is the first time we called this function
    // we need to steup the plot area
    plot = svg.append("g").attr("id", "plot");

    // notice in the "elements" view we now have a g element!

    // shift the plot area over by our margins to leave room
    // for the x- and y-axis
    plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  let xAxis = d3.axisBottom(dayScale);
  let yAxis = d3.axisRight(countScale);
  // check if we have already drawn our axes
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
      .text("Day of the Week");
    // do the same for our y axis
    let yGroup = plot.append("g").attr("id", "y-axis");
    yGroup.call(yAxis);
    yGroup.attr("transform", "translate(" + plotWidth + ",0)");
    let yLabel = plot.append("text")
      .attr("transform",
            "translate(" + (plotWidth + margin.right-30)+ " ," +
                           (plotHeight/2) + ") rotate(90)")
      .style("text-anchor", "middle")
      .text("Number of Crimes");
  }
  else {
    // we need to do this so our chart updates
    // as we type new letters in our box
    plot.select("g#y-axis").call(yAxis);
  }

  //draw bars
  let bars = plot.selectAll("rect")
   .data(count.entries(), function(d) { return d.key; });

  bars.enter().append("rect")
     // we will style using css
     .attr("class", "bar")
     // the width of our bar is determined by our band scale
     .attr("width", dayScale.bandwidth())
     // we must now map our letter to an x pixel position
     .attr("x", function(d) {
       return dayScale(d.key);
     })
     // and do something similar for our y pixel position
     .attr("y", function(d) {
       return countScale(d.value);
     })
     // here it gets weird again, how do we set the bar height?
     .attr("height", function(d) {
       return plotHeight - countScale(d.value);
     })
     .each(function(d, i, nodes) {
       console.log("Added bar for:", d.key);
     });

}
