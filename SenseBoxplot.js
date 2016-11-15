// //requirejs(["d3.min"]);
// requirejs.config({
// 	shim : {
// 		"extensions/SenseBoxplot/box" : {
// 			"deps" : ["Extensions/SenseBoxplot/d3.min"]
// 		}
// 	}
// });

//define(["jquery", "text!./SenseBoxplot.css", "./d3.min", "text!./data2.csv"], function($, cssContent, d3, datacsv) {'use strict';
define(["jquery", "text!./SenseBoxplot.css", "./d3.min"], function($, cssContent, d3) {'use strict';
	//console.log(d3)
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 4,
					qHeight : 500
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					label: "dims",
					uses : "dimensions",
					min : 2,
					max: 2
				},
				measures : {
					uses : "measures",
					min : 0,
					max: 1
				},
				sorting : {
					uses : "sorting"
				},
				other: {
					label: "Other",
					type: "items",
					items: {
						outliersOption: {
							type : "boolean",
							component : "switch",
							label : "Display outliers?",
							ref : "other.showOutliers",
							options : [{
								value : true,
								label : "Yes"
							},{
								value : false,
								label : "No"
							}]
						}
					}
				},
				settings : {
					uses : "settings"
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		// resize: function() {
  //       },
		paint : function($element,layout) {

			

			var _this = this,
				   id = "sb_" + layout.qInfo.qId;

   			//if extension has already been loaded, empty it, if not attach unique id
            if (document.getElementById(id)) {
                $("#" + id).empty();
            } else {
                $element.append($('<div />').attr("id", id));
            }

   			var destElement = document.getElementById(id);


   			//Bring in Data
   			var qData = layout.qHyperCube.qDataPages[0];
   			console.log('xAxis Title',layout.qHyperCube.qDimensionInfo[0].qFallbackTitle);
   			var xAxisName = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;
   			var yAxisName = layout.qHyperCube.qDimensionInfo[1].qFallbackTitle;
			var qMatrix = qData.qMatrix;

			var source = qMatrix.map(function(d) {
			 	return {
			 		"Dim":d[0].qText,  
			 		"Meas":d[1].qNum,	 
			 		"nodeelem": d[0].qElemNumber //first dimension!
			 	}
			 });

			var min = Infinity,
		    	max = -Infinity;

			//console.log(source)

			var dataArray =  [];

			for (var i = 0; i < source.length; i++ ) { 
				var insideArray = [];
				insideArray.push(source[i].Dim, []);
		 		//console.log(insideArray); 
		 		dataArray.push(insideArray);

		    }

		    var DimsAll = [];
		    for (var i = 0; i < source.length; i++ ) { 
		 		DimsAll.push(source[i].Dim);
		    }
		    var dimsUnique = _.uniq(DimsAll)

		    var filterednames;
		    var dataArray=[];

		    var measureArray = [];

		    dimsUnique.forEach ( function (d) {
		    	var insideArray=[];
		    	//dataArray.push(d)
			    filterednames = source.filter(function(obj) {
									    return (obj.Dim === d);
									});
			    
			    var insideMeas = [];
			    for (var i = 0; i < filterednames.length; i++ ) {
			    	//console.log(filterednames[i].Meas)
			    	insideMeas.push(filterednames[i].Meas)
			    	measureArray.push(filterednames[i].Meas)
			    }

			    //console.log(insideMeas)
			    insideArray.push(d);
			    insideArray.push(insideMeas);
			    dataArray.push(insideArray);
			});

			//console.log(dataArray)
			//console.log(measureArray)

			min = Math.min.apply(Math, measureArray);
			max = Math.max.apply(Math, measureArray);
			//End Data Load
		    

		    ////Bring in Data from CSV to test
			// var mydata = new Array();
	  //       var csvLines = datacsv.split("\r");
	  //       var csvKeys = csvLines[0].split(",");
	  //       csvLines.splice(0,1);
	  //       csvLines.forEach(function(line){
	  //           var row = new Object();
	  //           var e = line.split(",");
	  //           for(var i=0; i<csvKeys.length; i++){
	  //                   var key = String(csvKeys[i]);
	  //                   var val = Number(e[i]);
	  //                   row[key] = val;
	  //           }
	  //           mydata.push(row);
	  //       });
	           //console.log(mydata);


			d3.box = function() {
			  var width = 1,
			      height = 1,
			      duration = 0,
			      domain = null,
			      value = Number,
			      whiskers = boxWhiskers,
			      quartiles = boxQuartiles,
				  showLabels = true, // whether or not to show text labels
				  numBars = 4,
				  curBar = 1,
			      tickFormat = null;

			  // For each small multiple…
			  function box(g) {
			    g.each(function(data, i) {
			      //d = d.map(value).sort(d3.ascending);
				  //var boxIndex = data[0];
				  //var boxIndex = 1;
				  var d = data[1].sort(d3.ascending);
				  //console.log(quartiles(d));
				  //console.log(d);
				  
			      var g = d3.select(this),
			          n = d.length,
			          min = d[0],
			          max = d[n - 1];

			      // Compute quartiles. Must return exactly 3 elements.
			      var quartileData = d.quartiles = quartiles(d);

			      // Compute whiskers. Must return exactly 2 elements, or null.
			      var whiskerIndices = whiskers && whiskers.call(this, d, i),
			          whiskerData = whiskerIndices && whiskerIndices.map(function(i) { return d[i]; });

			      // Compute outliers. If no whiskers are specified, all data are "outliers".
			      // We compute the outliers as indices, so that we can join across transitions!
			      var outlierIndices = whiskerIndices
			          ? d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n))
			          : d3.range(n);

			      // Compute the new x-scale.
			      var x1 = d3.scale.linear()
			          .domain(domain && domain.call(this, d, i) || [min, max])
			          .range([height, 0]);

			      // Retrieve the old x-scale, if this is an update.
			      var x0 = this.__chart__ || d3.scale.linear()
			          .domain([0, Infinity])
					 // .domain([0, max])
			          .range(x1.range());

			      // Stash the new scale.
			      this.__chart__ = x1;

			      // Note: the box, median, and box tick elements are fixed in number,
			      // so we only have to handle enter and update. In contrast, the outliers
			      // and other elements are variable, so we need to exit them! Variable
			      // elements also fade in and out.

			      // Update center line: the vertical line spanning the whiskers.
			      var center = g.selectAll("line.center")
			          .data(whiskerData ? [whiskerData] : []);

				 //vertical line
			      center.enter().insert("line", "rect")
			          .attr("class", "center")
			          .attr("x1", width / 2)
			          .attr("y1", function(d) { return x0(d[0]); })
			          .attr("x2", width / 2)
			          .attr("y2", function(d) { return x0(d[1]); })
			          .style("opacity", 1e-6)
			        .transition()
			          .attr("x",320)
  					  .duration(1000) // this is 1s
  					  .delay(100)
			          .duration(duration)
			          .style("opacity", 1)
			          .attr("y1", function(d) { return x1(d[0]); })
			          .attr("y2", function(d) { return x1(d[1]); });

			      center.transition()
			          .duration(duration)
			          .style("opacity", 1)
			          .attr("y1", function(d) { return x1(d[0]); })
			          .attr("y2", function(d) { return x1(d[1]); });

			      center.exit().transition()
			          .duration(duration)
			          .style("opacity", 1e-6)
			          .attr("y1", function(d) { return x1(d[0]); })
			          .attr("y2", function(d) { return x1(d[1]); })
			          .remove();

			      // Update innerquartile box.
			      var box = g.selectAll("rect.box")
			          .data([quartileData]);

			      box.enter().append("rect")
			          .attr("class", "box")
			          .attr("x", 0)
			          .attr("y", function(d) { return x0(d[2]); })
			          .attr("width", width)
			          .attr("height", function(d) { return x0(d[0]) - x0(d[2]); })
			        .transition()
			          .duration(duration)
			          .attr("y", function(d) { return x1(d[2]); })
			          .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

			      box.transition()
			          .duration(duration)
			          .attr("y", function(d) { return x1(d[2]); })
			          .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

			      // Update median line.
			      var medianLine = g.selectAll("line.median")
			          .data([quartileData[1]]);

			      medianLine.enter().append("line")
			          .attr("class", "median")
			          .attr("x1", 0)
			          .attr("y1", x0)
			          .attr("x2", width)
			          .attr("y2", x0)
			        .transition()
			          .duration(duration)
			          .attr("y1", x1)
			          .attr("y2", x1);

			      medianLine.transition()
			          .duration(duration)
			          .attr("y1", x1)
			          .attr("y2", x1);

			      // Update whiskers.
			      var whisker = g.selectAll("line.whisker")
			          .data(whiskerData || []);

			      whisker.enter().insert("line", "circle, text")
			          .attr("class", "whisker")
			          .attr("x1", 0)
			          .attr("y1", x0)
			          .attr("x2", 0 + width)
			          .attr("y2", x0)
			          .style("opacity", 1e-6)
			        .transition()
			          .duration(duration)
			          .attr("y1", x1)
			          .attr("y2", x1)
			          .style("opacity", 1);

			      whisker.transition()
			          .duration(duration)
			          .attr("y1", x1)
			          .attr("y2", x1)
			          .style("opacity", 1);

			      whisker.exit().transition()
			          .duration(duration)
			          .attr("y1", x1)
			          .attr("y2", x1)
			          .style("opacity", 1e-6)
			          .remove();

			      // Update outliers.
			      if (layout.other.showOutliers == true) {
			      var outlier = g.selectAll("circle.outlier")
			          .data(outlierIndices, Number);

			      outlier.enter().insert("circle", "text")
			          .attr("class", "outlier")
			          .attr("r", 5)
			          .attr("cx", width / 2)
			          .attr("cy", function(i) { return x0(d[i]); })
			          .style("opacity", 1e-6)
			        .transition()
			          .duration(duration)
			          .attr("cy", function(i) { return x1(d[i]); })
			          .style("opacity", 1);

			      outlier.transition()
			          .duration(duration)
			          .attr("cy", function(i) { return x1(d[i]); })
			          .style("opacity", 1);

			      outlier.exit().transition()
			          .duration(duration)
			          .attr("cy", function(i) { return x1(d[i]); })
			          .style("opacity", 1e-6)
			          .remove();

			      }

			      // Compute the tick format.
			      var format = tickFormat || x1.tickFormat(8);

			      // Update box ticks.
			      var boxTick = g.selectAll("text.box")
			          .data(quartileData);
				 if(showLabels == true) {
			      boxTick.enter().append("text")
			          .attr("class", "box")
			          .attr("dy", ".3em")
			          .attr("dx", function(d, i) { return i & 1 ? 6 : -6 })
			          .attr("x", function(d, i) { return i & 1 ?  + width : 0 })
			          .attr("y", x0)
			          .attr("text-anchor", function(d, i) { return i & 1 ? "start" : "end"; })
			          .text(format)
			        .transition()
			          .duration(duration)
			          .attr("y", x1);
				}
					 
			      boxTick.transition()
			          .duration(duration)
			          .text(format)
			          .attr("y", x1);

			      // Update whisker ticks. These are handled separately from the box
			      // ticks because they may or may not exist, and we want don't want
			      // to join box ticks pre-transition with whisker ticks post-.
			      var whiskerTick = g.selectAll("text.whisker")
			          .data(whiskerData || []);
				if(showLabels == true) {
			      whiskerTick.enter().append("text")
			          .attr("class", "whisker")
			          .attr("dy", ".3em")
			          .attr("dx", 6)
			          .attr("x", width)
			          .attr("y", x0)
			          .text(format)
			          .style("opacity", 1e-6)
			        .transition()
			          .duration(duration)
			          .attr("y", x1)
			          .style("opacity", 1);
				}
			      whiskerTick.transition()
			          .duration(duration)
			          .text(format)
			          .attr("y", x1)
			          .style("opacity", 1);

			      whiskerTick.exit().transition()
			          .duration(duration)
			          .attr("y", x1)
			          .style("opacity", 1e-6)
			          .remove();
			    });
			    d3.timer.flush();
			  }

			  box.width = function(x) {
			    if (!arguments.length) return width;
			    width = x;
			    return box;
			  };

			  box.height = function(x) {
			    if (!arguments.length) return height;
			    height = x;
			    return box;
			  };

			  box.tickFormat = function(x) {
			    if (!arguments.length) return tickFormat;
			    tickFormat = x;
			    return box;
			  };

			  box.duration = function(x) {
			    if (!arguments.length) return duration;
			    duration = x;
			    return box;
			  };

			  box.domain = function(x) {
			    if (!arguments.length) return domain;
			    domain = x == null ? x : d3.functor(x);
			    return box;
			  };

			  box.value = function(x) {
			    if (!arguments.length) return value;
			    value = x;
			    return box;
			  };

			  box.whiskers = function(x) {
			    if (!arguments.length) return whiskers;
			    whiskers = x;
			    return box;
			  };
			  
			  box.showLabels = function(x) {
			    if (!arguments.length) return showLabels;
			    showLabels = x;
			    return box;
			  };

			  box.quartiles = function(x) {
			    if (!arguments.length) return quartiles;
			    quartiles = x;
			    return box;
			  };

			  return box;
			};

			function boxWhiskers(d) {
			  return [0, d.length - 1];
			}

			function boxQuartiles(d) {
			  return [
			    d3.quantile(d, .25),
			    d3.quantile(d, .5),
			    d3.quantile(d, .75)
			  ];
			}

			//}




			var labels = true; // show the text labels beside individual boxplots?

			var margin = {top: 30, right: 50, bottom: 90, left: 50};
			var width = $element.width() - margin.left - margin.right;
			var height = $element.height() - margin.top - margin.bottom;
			// console.log('width: '+width)
			// console.log('height: '+height)	

				
			//// parse in the data from CSV
			////console.log(datacsv);
			////d3.csv(datacsv, function(error, csv) {
				////using an array of arrays with
				////data[n][2] 
				////where n = number of columns in the csv file 
				////data[i][0] = name of the ith column
				////data[i][1] = array of values of ith column

				// var data = [];
				// data[0] = [];
				// data[1] = [];
				// data[2] = [];
				// data[3] = [];
				// // add more rows if your csv file has more columns

				// // add here the header of the csv file
				// data[0][0] = "Q1";
				// data[1][0] = "Q2";
				// data[2][0] = "Q3";
				// data[3][0] = "Q4";
				// // add more rows if your csv file has more columns

				// data[0][1] = [];
				// data[1][1] = [];
				// data[2][1] = [];
				// data[3][1] = [];
			  
				// mydata.forEach(function(x) {
				// 	//console.log(x)
				// 	var v1 = Math.floor(x.Q1),
				// 		v2 = Math.floor(x.Q2),
				// 		v3 = Math.floor(x.Q3),
				// 		v4 = Math.floor(x.Q4);
				// 		// add more variables if your csv file has more columns
				// 		console.log('v1: '+v1)
				// 		console.log('v2: '+v2)
				// 		console.log('v3: '+v3)
				// 		console.log('v4: '+v4)
				// 	var rowMax = Math.max(v1, Math.max(v2, Math.max(v3,v4)));
				// 	var rowMin = Math.min(v1, Math.min(v2, Math.min(v3,v4)));



				// 	data[0][1].push(v1);
				// 	data[1][1].push(v2);
				// 	data[2][1].push(v3);
				// 	data[3][1].push(v4);
				// 	 // add more rows if your csv file has more columns

				// 	//console.log(data)

				// 	if (rowMax > max) max = rowMax;
				// 	if (rowMin < min) min = rowMin;	

				// 	console.log('max: '+max)
				// 	console.log('min: '+min)
				// });

				// //var data = dataArray;
			 //    console.log(dataArray)
			 //  	console.log(data);
			 ////End CSV-related data import

				var chart = d3.box()
					.whiskers(iqr(1.5))
					.height(height)	
					.domain([min, max])
					.showLabels(labels);

				var svg = d3.select(destElement).append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.attr("class", "box")    
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
				// the x-axis
				var x = d3.scale.ordinal()	   
					.domain( dataArray.map(function(d) { return d[0] } ) )	    
					.rangeRoundBands([0 , width], 0.7, 0.3); 		

				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom");

				// the y-axis
				var y = d3.scale.linear()
					.domain([min, max])
					.range([height + margin.top, 0 + margin.top]);
				
				var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left");

				// draw the boxplots	
				svg.selectAll(".box")	   
			      .data(dataArray)
				  .enter().append("g")
					.attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
			      .call(chart.width(x.rangeBand())); 
				
				      
				// // add a title
				// svg.append("text")
			 //        .attr("x", (width / 2))             
			 //        .attr("y", 0 + (margin.top / 2))
			 //        .attr("text-anchor", "middle")  
			 //        .style("font-size", "18px") 
			 //        //.style("text-decoration", "underline")  
			 //        .text("Revenue");
			 
				 // draw y axis
				svg.append("g")
			        .attr("class", "y axis")
			        .call(yAxis)
					.append("text") // and text1
					  .attr("transform", "rotate(-90)")
					  .attr("y", -50)
					  .attr("x", -130)
					  .attr("dy", ".71em")
					  .style("text-anchor", "end")
					  .style("font-size", "16px") 
					  .text(yAxisName);		
				
				// draw x axis	
				svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + (height  + margin.top + 10) + ")")
			      .call(xAxis)
				  .append("text")             // text label for the x axis
			        .attr("x", (width / 2) )
			        .attr("y",  30 )
					.attr("dy", ".71em")
			        .style("text-anchor", "middle")
					.style("font-size", "16px") 
			        .text(xAxisName); 


			// Returns a function to compute the interquartile range.
			function iqr(k) {
			  return function(d, i) {
			    var q1 = d.quartiles[0],
			        q3 = d.quartiles[2],
			        iqr = (q3 - q1) * k,
			        i = -1,
			        j = d.length;
			    while (d[++i] < q1 - iqr);
			    while (d[--j] > q3 + iqr);
			    return [i, j];
			  };
			}
			//}
		/* */
		}
		
	};
});
