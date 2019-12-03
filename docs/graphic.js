var stats;function createConventions(t){var e=null;$("#convs").empty();var a=d3.scaleOrdinal(d3.schemeCategory10);for(var s in t)e=t[s].name,$("#convs").append($("<li>").text(e)),$("#convs li:last-child").prepend($("<span>").css("color",a(s)).html("&#9632;"))}function extractCategories(){var t=stats.map(function(t){return t.categories}).flat().filter(function(t,e,a){return a.indexOf(t)==e}),e=null,a=null;for(var s in t)e=t[s],a=new Option(e,e),$("#categories").append(a)}function createGraph(){var t=$("#categories").val();$("#chart").addClass("loading loading-lg");var e=JSON.parse(JSON.stringify(stats));createConventions(e=e.filter(function(e){return-1!=e.categories.indexOf(t)}));var a=$("#chart")[0].clientWidth,s=$("#chart")[0].clientHeight,r=Math.floor(e[0].values.length/2),n=Math.floor(Math.max(...e.map(t=>t.values).flat().map(t=>t.hits))/5);console.log("debugging "+n);for(var l=document.getElementById("chart");l.firstChild;)l.removeChild(l.firstChild);var i=d3.timeParse("%b");e.forEach(function(t){t.values.forEach(function(t){t.date=i(t.date),t.hits=+t.hits})});var o=d3.scaleTime().domain(d3.extent(e[0].values,t=>t.date)).range([0,a-50]),c=d3.scaleLinear().domain([0,Math.max(...e.map(t=>t.values).flat().map(t=>t.hits))]).range([s-50,0]),d=d3.scaleOrdinal(d3.schemeCategory10),p=d3.select("#chart").append("svg").attr("width",a+50+"px").attr("height",s+50+"px").append("g").attr("transform","translate(50, 50)"),u=d3.line().x(t=>o(t.date)).y(t=>c(t.hits));let h=p.append("g").attr("class","lines");h.selectAll(".line-group").data(e).enter().append("g").attr("class","line-group").on("mouseover",function(t,e){p.append("text").attr("class","title-text").style("fill",d(e)).text(t.name).attr("text-anchor","middle").attr("x",(a-50)/2).attr("y",5)}).on("mouseout",function(t){p.select(".title-text").remove()}).append("path").attr("class","line").attr("d",t=>u(t.values)).style("stroke",(t,e)=>d(e)).style("opacity","0.75").on("mouseover",function(t){d3.selectAll(".line").style("opacity","0.1"),d3.selectAll(".circle").style("opacity","0.25"),d3.select(this).style("opacity","0.85").style("stroke-width","2.5px").style("cursor","pointer")}).on("mouseout",function(t){d3.selectAll(".line").style("opacity","0.75"),d3.selectAll(".circle").style("opacity","0.85"),d3.select(this).style("stroke-width","1.5px").style("cursor","none")}),h.selectAll("circle-group").data(e).enter().append("g").style("fill",(t,e)=>d(e)).selectAll("circle").data(t=>t.values).enter().append("g").attr("class","circle").on("mouseover",function(t){d3.select(this).style("cursor","pointer").append("text").attr("class","text").text(`${t.hits}`).attr("x",t=>o(t.date)+5).attr("y",t=>c(t.hits)-10)}).on("mouseout",function(t){d3.select(this).style("cursor","none").transition().duration(250).selectAll(".text").remove()}).append("circle").attr("cx",t=>o(t.date)).attr("cy",t=>c(t.hits)).attr("r",3).style("opacity","0.85").on("mouseover",function(t){d3.select(this).transition().duration(250).attr("r",6)}).on("mouseout",function(t){d3.select(this).transition().duration(250).attr("r",3)});var f=d3.axisBottom(o).ticks(r).tickFormat(d3.timeFormat("%b")),m=d3.axisLeft(c).ticks(n);p.append("g").attr("class","x axis").attr("transform",`translate(0, ${s-50})`).call(f),p.append("g").attr("class","y axis").call(m).append("text").attr("y",15).attr("transform","rotate(-90)").attr("fill","#d3d3d3").text("      Hits"),$("#chart").removeClass("loading loading-lg")}window.addEventListener("resize",createGraph),$.getJSON("stats.json",function(t){stats=t.stats,extractCategories(),createGraph()});