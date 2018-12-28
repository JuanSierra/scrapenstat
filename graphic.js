var stats;
window.addEventListener("resize", createGraph);

$.getJSON('stats.json', function(data) {
  stats = data.stats;
  extractCategories();
  createGraph();
  
});

function createConventions(data){
  var name = null;
  $("#convs").empty();
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  for(var c in data){
    name = data[c].name;
    $("#convs").append($("<li>").text(name));
    $("#convs li:last-child").prepend($("<span>").css("color", color(c)).html("&#9632;"));
  }
}

function extractCategories(){
  var uniqueArray = function(arrArg) {
    return arrArg.filter(function(elem, pos,arr) {
      return arr.indexOf(elem) == pos;
    });
  };

  var categories = uniqueArray(stats.map(function(item){
    return item.categories;
  }).flat());
 
  var category = null;
  var opt = null;
  for(var c in categories){
    category = categories[c];
    opt = new Option(category, category);
    $("#categories").append(opt);
  }
}

function createGraph(){
    var category = $("#categories").val();
    $("#chart").addClass("loading loading-lg");
    //deep copy
    var data = JSON.parse(JSON.stringify(stats));
    data = data.filter(function(item){
      return item.categories.indexOf(category) != -1;
    });
 
    createConventions(data);

  // Use the extracted size to set the size of an SVG element.

    var width =  $("#chart")[0].clientWidth;
    var height = $("#chart")[0].clientHeight;
    var margin = 50;
    var duration = 250;
    
    var lineOpacity = "0.75";
    var lineOpacityHover = "0.85";
    var otherLinesOpacityHover = "0.1";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";
    
    var circleOpacity = "0.85";
    var circleOpacityOnLineHover = "0.25";
    var circleRadius = 3;
    var circleRadiusHover = 6;
    
    var xTicks = Math.floor(data[0].values.length/2);
    var yTicks = Math.floor(Math.max(...data.map(x=>x.values).flat().map(x=>x.hits))/5);
  
    var myNode = document.getElementById("chart");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

    /* Format Data */
    var parseDate = d3.timeParse("%b");
    data.forEach(function(d) { 
      d.values.forEach(function(d) {
        d.date = parseDate(d.date);
        d.hits = +d.hits;
      });
    });
    
    /* Scale */
    var xScale = d3.scaleTime()
      .domain(d3.extent(data[0].values, d2 => d2.date))
      .range([0, width-margin]);

    var yScale = d3.scaleLinear()
      .domain([0, Math.max(...data.map(x=>x.values).flat().map(x=>x.hits))])
      .range([height-margin, 0]);
    
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    /* Add SVG */
    var svg = d3.select("#chart").append("svg")
      .attr("width", (width+margin)+"px")
      .attr("height", (height+margin)+"px")
      .append('g')
      .attr("transform", `translate(${margin}, ${margin})`);
    
    /* Add line into SVG */
    var line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.hits));
    
    let lines = svg.append('g')
      .attr('class', 'lines');
    
    lines.selectAll('.line-group')
      .data(data).enter()
      .append('g')
      .attr('class', 'line-group')  
      .on("mouseover", function(d, i) {
          svg.append("text")
            .attr("class", "title-text")
            .style("fill", color(i))     
            .text(d.name)
            .attr("text-anchor", "middle")
            .attr("x", (width-margin)/2)
            .attr("y", 5);
        })
      .on("mouseout", function(d) {
          svg.select(".title-text").remove();
        })
      .append('path')
      .attr('class', 'line')  
      .attr('d', d => line(d.values))
      .style('stroke', (d, i) => color(i))
      .style('opacity', lineOpacity)
      .on("mouseover", function(d) {
          d3.selectAll('.line')
                        .style('opacity', otherLinesOpacityHover);
          d3.selectAll('.circle')
                        .style('opacity', circleOpacityOnLineHover);
          d3.select(this)
            .style('opacity', lineOpacityHover)
            .style("stroke-width", lineStrokeHover)
            .style("cursor", "pointer");
        })
      .on("mouseout", function(d) {
          d3.selectAll(".line")
                        .style('opacity', lineOpacity);
          d3.selectAll('.circle')
                        .style('opacity', circleOpacity);
          d3.select(this)
            .style("stroke-width", lineStroke)
            .style("cursor", "none");
        });
    
    /* Add circles in the line */
    lines.selectAll("circle-group")
      .data(data).enter()
      .append("g")
      .style("fill", (d, i) => color(i))
      .selectAll("circle")
      .data(d => d.values).enter()
      .append("g")
      .attr("class", "circle")  
      .on("mouseover", function(d2) {
          d3.select(this)     
            .style("cursor", "pointer")
            .append("text")
            .attr("class", "text")
            .text(`${d2.hits}`)
            .attr("x", d => xScale(d.date) + 5)
            .attr("y", d => yScale(d.hits) - 10);
        })
      .on("mouseout", function(d) {
          d3.select(this)
            .style("cursor", "none")  
            .transition()
            .duration(duration)
            .selectAll(".text").remove();
        })
      .append("circle")
      .attr("cx", d2 => xScale(d2.date))
      .attr("cy", d2 => yScale(d2.hits))
      .attr("r", circleRadius)
      .style('opacity', circleOpacity)
      .on("mouseover", function(d) {
            d3.select(this)
              .transition()
              .duration(duration)
              .attr("r", circleRadiusHover);
          })
        .on("mouseout", function(d) {
            d3.select(this) 
              .transition()
              .duration(duration)
              .attr("r", circleRadius);  
          });
    
    /* Add Axis into SVG */
    var xAxis = d3.axisBottom(xScale).ticks(xTicks).tickFormat(d3.timeFormat("%b"));
    var yAxis = d3.axisLeft(yScale).ticks(yTicks);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height-margin})`)
      .call(xAxis);
    
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append('text')
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#d3d3d3")
      .text("      Hits");

      $("#chart").removeClass("loading loading-lg");
  }