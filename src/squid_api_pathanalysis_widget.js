(function (root, factory) {
    root.squid_api.view.PathAnalysisView = factory(root.Backbone, root.squid_api, squid_api.template.squid_api_pathanalysis_widget);

}(this, function (Backbone, squid_api, template) {

    var View = Backbone.View.extend({
        template : null,
        d3Formatter : null,
        jsonData : {},
        modelOID : null,

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
            if (options.steps) {
                this.steps = options.steps;
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
                this.resizing = window.setTimeout(this.renderDiagram(true),this, 100);
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
                // Set Model ID to avoid data refresh
                if (! this.modelOID) {
                    this.modelOID = this.model.get("oid");
                    this.renderDiagram();
                } else if (this.modelOID) {
                    if (this.modelOID !== this.model.get("oid")) {
                        this.renderDiagram();
                        this.modelOID = this.model.get("oid");
                    }
                }
            }
        },

        getData: function() {
            // Store Data From Analaysis
            var results = this.model.get("results");
            if (results) {
                var columns = results.cols;
                var rows = results.rows;

                var stepsInserted = this.steps;

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
                        obj.lastValue = true;
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

                                if (rowItem[ix].length === 0 && rowItem[ix - stepsInserted] !== 0) {
                                    obj.lastNoValue = true;
                                } else if (ix === (stepsInserted * 2) - (noTimeCount) - 1) {
                                    obj.lastValue = true; 
                                }

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
            var documentHeight = $(window).height() - 275;
            var width = this.$el.find(".pathanalysis_diagram").width();
            var headerWidth = this.$el.find(".pathanalysis_header").width();
            var originalColumnsHeight = $(window).height() - 298;
            $("#squid-widgets-wrapper").height($(window).height() - 93);
            this.$el.find(".pathanalysis_columns").height(originalColumnsHeight);
            this.$el.find(".pathanalysis_columns").attr("originalHeight", originalColumnsHeight);
            
            d3.select("#squid_api_pathanalysis_widget .pathanalysis_diagram svg").remove();

            var margin = { top: 0, left: 23, right: 175, bottom: 0 };

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
                        if (pathData[ix].lastNoValue) {
                            obj.lastNoValue = pathData[ix].lastNoValue;
                        } else {
                            obj.lastNoValue = false;
                        }
                        if (pathData[ix].lastValue) {
                            obj.lastValue = pathData[ix].lastValue;
                        } else {
                            obj.lastValue = false;
                        }
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
                .attr("height", documentHeight)
                .attr("originalHeight", documentHeight)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var tip = d3.tip()
                    .attr('class', 'd3-tip animate')
                    .offset([-10, 0])
                    .html(function(d) {
                        if (d.value < 60) {
                            if (d.value === 0) {
                                return "<span class='name'>Name: " + d.name.length === 0 ? "Unknown" : d.name + " </span><br /><br /> <span class='time'>Time: N/A </span><br /><br /><span class='percentage'>Step % (path) : " + Math.round(d.percentage) + "%</span>";
                            }
                            return "<span class='name'>Name: " + d.name.length === 0 ? "Unknown" : d.name + " </span><br /><br /> <span class='time'>Time: " + Math.round(d.value) + "s</span><br /><br /><span class='percentage'>Step % (path) : " + Math.round(d.percentage) + "%</span>";
                        } else {
                            var minutes = Math.floor(d.value / 60);
                            var seconds = Math.floor(d.value - minutes * 60);
                            return "<span class='name'>Name: " + d.name.length === 0 ? "Unknown" : d.name + " </span><br /><br /> <span class='time'>Time: " + minutes + "m " + seconds + "s" + "</span><br /><br /><span class='percentage'>Step % (path) : " + Math.round(d.percentage) + "%</span>";
                        }
                    });

                this.svg.call(tip);

                var groupOfGroups = this.svg.selectAll("g.toplevel")
                    .data(formattedArray)
                    .enter();

                var topLevelGroup = groupOfGroups
                    .append("g")
                    .attr("class", "toplevel")
                    .attr("firstYPosition", function(d, i ) {return (i * 75); })
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
                var stepElements = groups.selectAll("rect")
                    .data(function (d, i) {
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
                    .attr("fill-opacity", function(d, i) {
                        if (d.lastNoValue) {
                            return 0.2;
                        } else if (d.lastValue) {
                            return 1;
                        }
                    })
                    .attr("height", 50)
                    .style("fill", function (d, i) {
                        if (squid_api.view.metadata[d.name]) {
                            return squid_api.view.metadata[d.name].color;
                        } else {
                            return "rgb(46,110,165)";
                        }
                    });
                
                if (! resize) {
                    var transition = stepElements
                        .transition()
                        .attr('x', function(d) { 
                            return xScale(d.y0);
                        })
                        .delay(function(d, i) {
                            return i * 20;
                        })
                        .duration(500)
                        .ease('exp')
                        .attr("width", function (d) {
                            return xScale(d.y);
                        });
                } else {
                    var xPosition = stepElements
                        .attr('x', function(d) { 
                            return xScale(d.y0);
                        })
                        .attr("width", function (d) {
                            return xScale(d.y);
                        });
                }

                // Add text for each data value
                setTimeout(function() {
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
                        var value;
                        var svgSize = d3.select(".pathanalysis_diagram svg").attr("width") - 250;
                        var nodeSizing = this.parentNode.childNodes[0].getBoundingClientRect();
                        if (this.getBBox().width > nodeSizing.width) {
                            if (xScale(d.y0) + (xScale(d.y)) > svgSize) {
                                return xScale(d.y0) - this.getBBox().width - 10;
                            } else {
                                return xScale(d.y0) + nodeSizing.width + 10;
                            }
                        } else {
                            return xScale(d.y0) + (nodeSizing.width / 2) - (this.getBBox().width / 2);
                        }
                    })
                    .attr("class", function (d) {
                        var nodeSizing = this.parentNode.childNodes[0].getBoundingClientRect();
                        if (this.getBBox().width > nodeSizing.width) {
                            return "small";
                        }
                    })
                    .attr("y", function (d) {
                        return 30;
                    })
                    .attr("fill", function (d) {
                        return "white";
                    });
                }, 500); 
                
                // Add Column Data
                var columnDataGroup = topLevelGroup.append("g")
                    .attr("class", "data-column");
                
                // Add Column Data 1 (Visit %)
                var visitPercentage = columnDataGroup
                    .append("text")
                    .text(function(d) {
                        return Math.round(d.percentage) + "%";
                    })
                    .attr("x", (width - margin.right) + 20)
                    .attr("y", 30)
                    .attr("fill", "#767676");

                // Add Column Data 1 (Average Path Steptime)
                var averagePathStepTime = columnDataGroup
                    .append("text")
                    .text(function(d) {
                        if (d.average !== 0) {
                            if (d.average < 60) {
                                return  Math.floor(d.average / 60);
                            } else {
                                var minutes = Math.floor(d.average / 60);
                                var seconds = Math.floor(d.average - minutes * 60);
                                return minutes + "m " + seconds + "s";
                            }
                            return Math.round(d.average) + "s";
                        }
                    })
                    .attr("x", (width - margin.right) + 77)
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

            // Get All Nodes after one being clicked
            var nodeAfter = $(siblings[0]).parent().nextAll();
            if (children.length > 2) {
                // If node has more than 2 nodes
                var svgHeight = parseInt(d3.select("#squid_api_pathanalysis_widget svg").attr("height"));
                var widgetsWrapperHeight = $("#squid-widgets-wrapper").height();
                var columnsHeight = $("#squid_api_pathanalysis_widget .pathanalysis_columns").height();
                var originalColumnsHeight = $("#squid_api_pathanalysis_widget .pathanalysis_columns").attr("originalHeight");
                var entitiesHeight = 0;
                if (this.hasAttribute("expanded")) {
                    // If it is expanded
                    d3.select(this).select('text')
                        .text(function(d){
                             return "+";
                        });
                    d3.select(this).attr("expanded", null);
                    d3.select(this.parentNode).attr("class", null);
                    // Place nodes after back into position in regards to previous node
                    for (i=0; i<nodeAfter.length; i++) {
                        var previousYValue = parseInt(d3.select(nodeAfter[i]).attr("previousYValue"));
                        var currentNodeTranslate = d3.transform(d3.select(nodeAfter[i]).attr("transform")).translate[1];
                            var newYValue = currentNodeTranslate - (children.length * 50);
                            d3.select(nodeAfter[i])
                                .transition()
                                .attr('transform', "translate(0," + newYValue + ")")
                                .duration(500)
                                .ease('esp');
                    }
                    entitiesHeight = 0;
                    // Place expanded nodes back into straight line position
                    for (ix=0; ix<children.length; ix++) {
                        var yValue = 50 * ix;
                        // Only animate node sets of rect & text, not text & text
                        if ($(children[ix][0])[0].tagName === "text" && $(children[ix][1])[0].tagName === "text") {
                        } else {
                            
                            entitiesHeight = entitiesHeight + 50;
                            d3.select(children[ix][0])
                                .transition()
                                .attr("y", 0)
                                .duration(500)
                                .ease('esp');
                            d3.select(children[ix][1])
                                .transition()
                                .attr("y", 30)
                                .duration(500)
                                .ease('esp');
                        }
                    }
                    // Page Height Logic on node collapose
                    d3.select("#squid_api_pathanalysis_widget svg").attr("height", svgHeight - entitiesHeight - 50);
                    $("#squid-widgets-wrapper").height(widgetsWrapperHeight - entitiesHeight - 50);
                    $("#squid_api_pathanalysis_widget .pathanalysis_columns").height(columnsHeight - entitiesHeight - 50);
                } else {
                    // Expand Node Clicked
                    d3.select(this).select('text')
                        .text(function(d){
                             return " -";
                        });
                    // Add expanded classes / attributes
                    d3.select(this).attr("expanded", true);
                    d3.select(this.parentNode).attr("class", "expanded");

                    // Collapose Nodes After
                    for (i=0; i<nodeAfter.length; i++) {
                        var previousYValue1 = d3.transform(d3.select(nodeAfter[i]).attr("transform")).translate[1];
                        var newYValue1 = previousYValue1 + (children.length * 50);
                        d3.select(nodeAfter[i])
                            .transition()
                            .attr('transform', "translate(0," + newYValue1 + ")")
                            .duration(500)
                            .ease('esp');
                    }
                    entitiesHeight = 0;
                    // Animate Row
                    for (ix=0; ix<children.length; ix++) {
                        var yValue1 = 50 * ix;
                        // Check whether we have Rect then text or text/text nodes
                        if ($(children[ix][0])[0].tagName === "text" && $(children[ix][1])[0].tagName === "text") {
                            // Logic for Text Column Nodes
                        } else {
                            // Expand nodes, each one add 50 pixels
                            entitiesHeight = entitiesHeight + 50;
                            d3.select(children[ix][0])
                                .transition()
                                .attr("y", yValue1)
                                .duration(500)
                                .ease('esp');
                            d3.select(children[ix][1])
                                .transition()
                                .attr("y", yValue1 + 30)
                                .duration(500)
                                .ease('esp');
                        }
                    }
                    // Expanding dom manipulation
                    d3.select("#squid_api_pathanalysis_widget svg").attr("height", svgHeight + entitiesHeight + 50);
                    $("#squid-widgets-wrapper").height(widgetsWrapperHeight + entitiesHeight + 50);
                    $("#squid_api_pathanalysis_widget .pathanalysis_columns").height(columnsHeight + entitiesHeight + 50);
                }
            }
        },

        render: function() {
            var html = this.template();
            this.$el.html(html);
            this.$el.show();

            // Starting Columns Height
            this.$el.find(".pathanalysis_columns").height($(window).height() - 278);

            return this;
        }
    });

    return View;
}));