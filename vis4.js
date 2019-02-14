//iterate through the data and add count to unique days of the week
var counter = 0;
var crime = function(data)
{
  let count = d3.map();
  //loop through the data and look at the day of the week
  data.forEach(function(d)
    {
      var cat = d["Incident Category"];
      //add to map or increment count
      if(count.has(cat))
      {
        count.set(cat,count.get(cat)+1);
        counter++;
      }
      else {
        count.set(cat, 1);
        counter++;
      }
    });
  return count;
};

var drawChart = function(count)
{
  console.log(counter);
  var keys = count.keys()
  var data = [];
  var filteredKeys = [];
  keys.forEach(function(key){
    var value = count.get(key);
    if(value >=400)
    {
      data.push(value);
      filteredKeys.push(key);
    }

  });
  console.log(data);
  console.log(filteredKeys);
  //select the space to draw
  let svg = d3.select("body").select("svg");
  let margin = {
    top:    15,
    right:  80, // leave space for y-axis
    bottom: 40, // leave space for x-axis
    left:   10
  };
  //calculate how much space we have to plot
  let bounds = svg.node().getBoundingClientRect();
  let width = bounds.width - margin.right - margin.left;
  let height = bounds.height;
  let radius = (bounds.height - margin.bottom)/2;
  g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  color = d3.schemePaired;

  var pie = d3.pie();
  var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);
    var arcs = g.selectAll("arc")
                              .data(pie(data))
                              .enter()
                              .append("g")
                              .attr("class", "arc");
  arcs.append("path")
        .attr("fill", function(d, i) {
            return color[i];
        })
        .attr("d", arc);
  //add a legend
  var legendG = svg.selectAll(".legend")
  .data(filteredKeys)
  .enter().append("g")
  .attr("transform", function(d,i){
    return "translate(" + (width - 110) + "," + (i * 15 + 20) + ")"; // place each legend on the right and bump each one down 15 pixels
  })
  .attr("class", "legend");

legendG.append("rect") // make a matching color rect
  .attr("width", 10)
  .attr("height", 10)
  .attr("fill", function(d, i) {
    return color[i];
  });

legendG.append("text") // add the text
  .text(function(d){
    console.log(d);
    return d;
  })
  .style("font-size", 12)
  .attr("y", 10)
  .attr("x", 11);
}
