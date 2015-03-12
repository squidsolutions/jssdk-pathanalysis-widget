this["squid_api"] = this["squid_api"] || {};
this["squid_api"]["template"] = this["squid_api"]["template"] || {};

this["squid_api"]["template"]["squid_api_pathanalysis_widget"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class='sq-loading' style='position:absolute; width:100%; top:40%;'>\n<div class=\"spinner\">\n  <div class=\"rect5\"></div>\n  <div class=\"rect4\"></div>\n  <div class=\"rect3\"></div>\n  <div class=\"rect2\"></div>\n  <div class=\"rect1\"></div>\n  <div class=\"rect2\"></div>\n  <div class=\"rect3\"></div>\n  <div class=\"rect4\"></div>\n  <div class=\"rect5\"></div>\n</div>\n</div>\n<div id=\"squid_api_pathanalysis_widget\">\n  <div class=\"pathanalysis_header\">\n    <div class=\"row\">\n      <div class=\"col-md-2\">\n        <div id=\"origin\">\n        </div>\n      </div>\n      <div id=\"switcher\" class=\"col-md-5\">\n      </div>\n      <div class=\"col-md-2\">\n      </div>\n    </div>\n  </div>\n	<div class=\"pathanalysis_diagram\">\n\n	</div>\n  <div class=\"pathanalysis_columns\">\n    <div class=\"col-md-1 column-header\">\n        <div class=\"col-md-6 percentage\">\n        Visit <br /> &nbsp;&nbsp;%\n        </div>\n        <div class=\"col-md-6 steptime\">\n        Average &nbsp;&nbsp;&nbsp;&nbsp;Path &nbsp;Steptime\n        </div>\n      </div>\n  </div>\n</div>";
  });
(function (root, factory) {
    root.squid_api.view.PathAnalysisView = factory(root.Backbone, root.squid_api, squid_api.template.squid_api_pathanalysis_widget);

}(this, function (Backbone, squid_api, template) {

    var View = Backbone.View.extend({
        template : null,
        d3Formatter : null,
        jsonData : {},

        initialize: function(options) {
            var me = this;
            var svg;

            // setup options
            if (options.template) {
                this.template = options.template;
            } else {
                this.template = template;
            }
            if (options.total) {
                this.total = options.total;
            }
            if (options.format) {
                this.format = options.format;
            } else {
                // default number formatter
                if (this.d3Formatter) {
                    this.format = function(f){
                        if (isNaN(f)) {
                            return f;
                        } else {
                            return me.d3Formatter(f);
                        }
                    };
                } else {
                    this.format = function(f){
                        return f;
                    };
                }
            }

            this.model.on("change", this.update, this);
            this.total.on("change", this.update, this);

            // Detect window resize
            $(window).on("resize", _.bind(this.resize(),this));

            this.render();
        },

        resize : function() {
            var resizing = true;
            return function() {
                if (this.resizing) {
                    window.clearTimeout(resizing);
                }
                this.resizing = window.setTimeout(_.bind(this.renderDiagram(true),this), 100);
            };
        },

        remove: function() {
            this.undelegateEvents();
            this.$el.empty();
            this.stopListening();
            $(window).off("resize");
            return this;
        },

        setModel: function(model) {
            this.model = model;
            this.initialize();
        },

        update: function() {
          if (!this.model.isDone() || !this.total.isDone()) {
                // running
                this.$el.find(".sq-content").show();
                if (this.model.get("status") == "RUNNING") {
                    this.$el.find(".sq-loading").show();
                }
                this.$el.find(".sq-error").hide();
            } else if (this.model.get("error")) {
                // error
                this.$el.find(".sq-error").show();
                this.$el.find(".sq-sankey").hide();
                this.$el.find(".sq-loading").hide();
            } else {
              this.$el.find(".sq-loading").hide();
              this.renderDiagram();
            }
        },

        getData: function() {
            // Store Data From Analaysis
            var results = this.model.get("results");
            if (results) {
                var columns = results.cols;
                var rows = results.rows;

                var stepsInserted = 4;

                // Obtain Total Count From Total Analysis
                var totalCount = this.total.get("analyses")[0].get("results").rows[0].v[0];

                var objects = [];

                for (i=0; i<rows.length; i++) {
                    // Store Row Item
                    var rowItem = rows[i].v;

                    // Check if time values exist + calculate total time of paths
                    var noTimeCount = 0;
                    var timeSum = 0;
                    var labelItem;
                    for (ix=stepsInserted; ix<stepsInserted * 2; ix++) {
                        if (ix < (stepsInserted * 2)) {
                            if (rowItem[ix].length === 0) {
                                noTimeCount++;
                            } else {
                                timeSum = timeSum + parseFloat(rowItem[ix]);
                            }
                        }
                    }

                    var noTimesAvailable = false;
                    if (noTimeCount === stepsInserted) {
                        noTimesAvailable = true;
                    }
                    
                    var dataValues = {};
                    dataValues.data = [];
                    
                    var obj;
                    // If only 1 step without value, put 100%
                    if (noTimesAvailable) {
                        obj = {};
                        obj.realPercentage = 100;
                        obj.displayPercentage = 100;
                        obj.stepname = rowItem[0];
                        obj.time = 0;
                        dataValues.data.push(obj);
                    } else {
                        var percentages = 0;
                        for (ix=stepsInserted; ix<stepsInserted * 2; ix++) {
                            obj = {};
                            if (rowItem[ix].length !== 0 || rowItem[ix - stepsInserted].length !== 0 && rowItem[ix].length === 0) {
                                obj.time = 0;
                                if (rowItem[ix].length !== 0) {
                                    obj.time = parseFloat(rowItem[ix]);
                                }
                                obj.realPercentage = parseFloat(obj.time / timeSum * 100);
                                if (rowItem[ix - stepsInserted].length !== 0) {
                                    obj.stepname = rowItem[ix - stepsInserted];
                                } else {
                                    obj.stepname = "Unknown";
                                }
                                // if less than 1% for a path, make it 1%
                                if (obj.realPercentage < 1) {
                                    obj.displayPercentage = 1;
                                } else {
                                    obj.displayPercentage = obj.realPercentage;
                                }
                                percentages = percentages + obj.displayPercentage;

                                dataValues.data.push(obj);
                            }
                        }
                        // To Fix Display percentages not equalling 100 
                        if (percentages !== 100) {
                            var newArray = [];
                            var missingPercentage = 100 - percentages;
                            var highestValue = 0;
                            var arrayManip = dataValues.data;

                            // Get Highest Value
                            for (ix=0; ix<arrayManip.length; ix++) {
                                if (arrayManip[ix].displayPercentage > highestValue) {
                                    highestValue = arrayManip[ix].displayPercentage;
                                }
                            }

                            // Add percentage value to highest
                            for (ix=0; ix<arrayManip.length; ix++) {
                                var manipObj = arrayManip[ix];
                                if (arrayManip[ix].displayPercentage === highestValue) {
                                    manipObj.displayPercentage = manipObj.displayPercentage + missingPercentage;
                                }
                                newArray.push(manipObj);
                            }
                            // dataValues.data.push(obj);
                        }
                    }
                    
                    dataValues.average = timeSum;
                    dataValues.percentage = rowItem[stepsInserted * 2] / totalCount * 100;

                    objects.push(dataValues);
                }

                // Sort data from highest to lowest percentage value
                var dataSorted = this.sortByPercentage(objects);

                // Take the first five records
                var data = dataSorted.slice(0, 5);

                return data;
            }
        },

        sortByPercentage: function(values) {
            values.sort(function(a,b){
                return (b.percentage - a.percentage);
            });
            return values;
        },

        renderDiagram: function(resize) {
            var me = this;
            var data = this.getData();
            var documentHeight = $(document).height() - 240;
            var width = this.$el.find(".pathanalysis_diagram").width();
            var viewPortHeight;
            if ($("#main-content .wrapper").length > 0) {
                viewPortHeight = $("#main-content .wrapper").height() - 30;
            } else {
                viewPortHeight = 450;
            }
            
            var headerWidth = this.$el.find(".pathanalysis_header").width();
            
            d3.select("#squid_api_pathanalysis_widget .pathanalysis_diagram svg").remove();

            var margin = { top: 0, left: 23, right: 100, bottom: 0 };

            var w = width - margin.left - margin.right;
            

            // Format Data for Display
            var formattedArray = [];
            var collectionArray = [];

            for (i=0; i<data.length; i++) {
                var pathData = data[i].data;
                var path={};
                path.average = data[i].average;
                path.percentage = data[i].percentage;
                path.values = [];
                for (ix=0; ix<pathData.length; ix++) {
                    var arr = [];
                    var obj = {};
                    if (pathData[ix].percentage !== 0) {
                        obj.name = pathData[ix].stepname;
                        obj.value = pathData[ix].time;
                        obj.percentage = pathData[ix].realPercentage;
                        obj.y = pathData[ix].displayPercentage;
                        arr.push(obj);
                        path.values.push(arr);
                    }
                }
                formattedArray.push(path);
            }

            //Set up stack method
            var stack = d3.layout.stack();

            //Data, stacked
            formattedArray.forEach(function (dataset) {stack(dataset.values); });

            //Set up scales
            var xScale = d3.scale.linear()
                .domain([0, d3.max(formattedArray, function (dataset) {      
                    return d3.max(dataset.values, function (d) {
                        return d3.max(d, function (d) {
                            return d.y0 + d.y;
                        });
                    });
                })])
            .range([0, w]);

            //Create SVG element
            if (this.$el.find("#squid_api_pathanalysis_widget .pathanalysis_diagram").length > 0) {
                this.svg = d3.select("#squid_api_pathanalysis_widget .pathanalysis_diagram")
                .append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", viewPortHeight)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var tip = d3.tip()
                    .attr('class', 'd3-tip animate')
                    .offset([-10, 0])
                    .html(function(d) {
                        return "<span class='name'>Name: " + d.name.length === 0 ? "Unknown" : d.name + " </span><br /> <span class='time'>Time (MS) " + d.value + "</span><br /><span class='percentage'> Percentage: " + Math.round(d.y) + "</span>";
                    });

                this.svg.call(tip);

                var groupOfGroups = this.svg.selectAll("g.toplevel")
                    .data(formattedArray)
                    .enter();

                var topLevelGroup = groupOfGroups
                    .append("g")
                    .attr("class", "toplevel")
                    .attr("transform", function(d, i ) {return "translate(0, " + (i * 75) + ")"; });   
        
                // Append add icon for each path
                var addIconGroup = topLevelGroup
                    .append("g")
                    .attr("class", "addbutton")
                    .on("click", this.waterFall);

                var addIconRectangle = addIconGroup
                    .append("rect")
                    .attr({
                        "transform": function(d, i) { return "translate(-20,0)"; },
                        "width" : "45",
                        "height" : "50",
                        "fill" : "#fff",
                        "rx" : "10",
                        "ry" : "10",
                    });
                
                var addIconText = addIconGroup
                    .append("text")
                    .attr("x", -14)
                    .attr("y", 28)
                    .text(function() {
                        return '+';
                    })
                    .attr("fill", "#767676")
                    .on("mouseover", function(d, i) {
                        d3.select(this).transition()
                            .ease('cubic-out')
                            .duration('200')
                            .attr('font-size', 17)
                            .style("font-weight", function(d) { return "bold"; });
                    })
                    .on('mouseout', function(d,i) {
                        d3.select(this).transition()
                        .ease('cubic-out')
                        .duration('200')
                        .attr('font-size', 14)
                        .style("font-weight", function(d) { return "normal"; });
                    });

                // Add a group for each row of data
                var groups = topLevelGroup.selectAll("g.dataset")
                    .data(function(d) {return d.values; })
                    .enter()
                    .append("g")
                    .attr("class", "dataset");

                // Add a rect for each data value
                var rects = groups.selectAll("rect")
                    .data(function (d) {
                        return d;
                    })
                    .enter()
                    .append("rect")
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .attr("x", function (d) {
                        return 0;
                    })
                    .attr("y", function(d, i) {
                        return 0;
                    })
                    .attr("height", 50)
                    .attr("rx", function(d, i) {
                        return 0;
                    })
                    .attr("ry", function(d, i) {
                        return 0;
                    })
                    .style("fill", function (d, i) {
                        if (squid_api.view.metadata[d.name]) {
                            return squid_api.view.metadata[d.name].color;
                        } else {
                            return "rgb(46,110,165)";
                        }
                    });
                
                if (! resize) {
                    var transition = rects
                        .transition()
                        .attr('x', function(d) { 
                            return xScale(d.y0);
                        })
                        .delay(function(d, i) {
                            return i * 20;
                        })
                        .duration(1000)
                        .ease('exp')
                        .attr("width", function (d) {
                            return xScale(d.y);
                        });
                } else {
                    var xPosition = rects
                        .attr('x', function(d) { 
                            return xScale(d.y0);
                        })
                        .attr("width", function (d) {
                            return xScale(d.y);
                        });
                }
                

                // Add text for each data value
                var texts = groups.selectAll("text")
                    .data(function (d) {
                        return d;
                    })
                    .enter()
                    .append("text")
                    .text(function(d) {
                        var name;
                        if (d.name.length > 0) {
                            name = d.name;
                        } else {
                            name = "Unknown";
                        }
                        return name;
                    })
                    .attr("x", function (d) {
                        return xScale(d.y0) + (xScale(d.y)) / 2.2;
                    })
                    .attr("y", function (d) {
                        return 30;
                    })
                    .attr("fill", "white");

                // Add Column Data
                var columnDataGroup = topLevelGroup.append("g")
                    .attr("class", "data-column");
                
                // Add Column Data 1 (Visit %)
                var visitPercentage = columnDataGroup
                    .append("text")
                    .text(function(d) {
                        return Math.round(d.percentage) + "%";
                    })
                    .attr("x", (width - margin.right) - 5)
                    .attr("y", 30)
                    .attr("fill", "#767676");

                // Add Column Data 1 (Average Path Steptime)
                var averagePathStepTime = columnDataGroup
                    .append("text")
                    .text(function(d) {
                        if (d.average !== 0) {
                            return Math.round(d.average * 100) / 100;
                        }
                    })
                    .attr("x", (width - margin.right) + 25)
                    .attr("y", 30)
                    .attr("fill", "#767676");
            }
        },

        waterFall: function(node) {
            var siblings = this.parentNode.children;
            var nodesToAnimate = [];

            // Store Siblings
            for (i=0; i<siblings.length; i++) {
                if (siblings[i].classList.contains("dataset")) {
                    nodesToAnimate.push(siblings[i]);
                }
                if (siblings[i].classList.contains("data-column")) {
                    nodesToAnimate.push(siblings[i]);
                }
            }

            // Get Children
            var children = [];
            for (i=0; i<nodesToAnimate.length; i++) {  
                children.push(nodesToAnimate[i].children);
            }

            /* Count number of children so we know how far to move the
                nodes benieth
            */ 

            // Get All Nodes after one being clicked
            var nodeAfter = $(siblings[0]).parent(".toplevel").nextAll();
            if (children.length > 2) {
                if (this.hasAttribute("expanded")) {
                    d3.select(this).attr("expanded", null);

                    for (i=0; i<nodeAfter.length; i++) {
                        var previousYValue = parseInt(d3.select(nodeAfter[i]).attr("previousYValue"));
                        var newYValue = previousYValue;
                        if (children.length !== 1) {
                            newYValue = previousYValue + (children.length * 50);
                        }
                        d3.select(nodeAfter[i])
                            .transition()
                            .attr('transform', "translate(0," + previousYValue + ")")
                            .duration(1000)
                            .ease('elastic');
                    }

                    // Animate Row
                    for (ix=0; ix<children.length; ix++) {
                        var yValue = 50 * ix;
                        // Check whether we have Rect then text or text/text nodes
                        if ($(children[ix][0])[0].tagName === "text" && $(children[ix][1])[0].tagName === "text") {
                            d3.select(children[ix][0])
                                    .transition()
                                    .attr("y", 30)
                                    .duration(1000)
                                    .ease('elastic');
                            d3.select(children[ix][1])
                                    .transition()
                                    .attr("y", 30)
                                    .duration(1000)
                                    .ease('elastic');
                        } else {
                            d3.select(children[ix][0])
                                .transition()
                                .attr("y", 0)
                                .duration(1000)
                                .ease('elastic');
                            d3.select(children[ix][1])
                                .transition()
                                .attr("y", 30)
                                .duration(1000)
                                .ease('elastic');
                        }
                    }
                } else {
                    d3.select(this).attr("expanded", true);

                    for (i=0; i<nodeAfter.length; i++) {
                        var previousYValue1 = d3.transform(d3.select(nodeAfter[i]).attr("transform")).translate[1];
                        var newYValue1 = previousYValue1;
                        if (children.length !== 1) {
                            newYValue1 = previousYValue1 + (children.length * 50);
                        }
                        d3.select(nodeAfter[i])
                            .attr("previousYValue", previousYValue1)
                            .transition()
                            .attr('transform', "translate(0," + newYValue1 + ")")
                            .duration(1000)
                            .ease('elastic');
                    }

                    // Animate Row
                    for (ix=0; ix<children.length; ix++) {
                        var yValue1 = 50 * ix;
                        // Check whether we have Rect then text or text/text nodes
                        if ($(children[ix][0])[0].tagName === "text" && $(children[ix][1])[0].tagName === "text") {
                            d3.select(children[ix][0])
                                .transition()
                                .attr("y", yValue1 - 20)
                                .duration(1000)
                                .ease('elastic');
                            d3.select(children[ix][1])
                                .transition()
                                .attr("y", yValue1 - 20)
                                .duration(1000)
                                .ease('elastic');
                        } else {
                            d3.select(children[ix][0])
                                .transition()
                                .attr("y", yValue1)
                                .duration(1000)
                                .ease('elastic');
                            d3.select(children[ix][1])
                                .transition()
                                .attr("y", yValue1 + 30)
                                .duration(1000)
                                .ease('elastic');
                        }
                    }
                }
            }
        },

        render: function() {
            var html = this.template();
            this.$el.html(html);
            this.$el.show();

            // Starting Columns Height
            this.$el.find(".pathanalysis_columns").height($(document).height() - 267);

            return this;
        }
    });

    return View;
}));