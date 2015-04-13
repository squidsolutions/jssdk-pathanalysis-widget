(function (root, factory) {
    root.squid_api.view.PathAnalysisView = factory(root.Backbone, root.squid_api, squid_api.template.squid_api_pathanalysis_widget, squid_api.template.squid_api_pathanalysis_widget_columns, squid_api.template.squid_api_pathanalysis_widget_tooltip);

}(this, function (Backbone, squid_api, template, columnsTemplate, tooltipTemplate) {

    var View = Backbone.View.extend({
        template : null,
        columnsTemplate: null,
        tooltipTemplate: null,
        d3Formatter : null,
        jsonData : {},
        animating: false,
        modelOID : null,
        orderByView : null,
        stepSwitcherView : null,
        additionalMetricPresent : false,

        initialize: function(options) {
            var me = this;
            var svg;

            // setup options
            if (options.template) {
                this.template = options.template;
            } else {
                this.template = template;
            }
            if (options.columnsTemplate) {
                this.columnsTemplate = options.columnsTemplate;
            } else {
                this.columnsTemplate = squid_api.template.squid_api_pathanalysis_widget_columns;
            }
            if (options.tooltipTemplate) {
                this.tooltipTemplate = options.tooltipTemplate;
            } else {
                this.tooltipTemplate = squid_api.template.squid_api_pathanalysis_widget_tooltip;
            }
            if (options.orderByView) {
                this.orderByView = options.orderByView;
            }
            if (options.mainModel) {
                this.mainModel = options.mainModel;
            }
            if (options.stepSwitcherView) {
                this.stepSwitcherView = options.stepSwitcherView;
            }
            if (options.total) {
                this.total = options.total;
            }
            if (options.metricAnalysis) {
                this.metricAnalysis = options.metricAnalysis;
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

            this.listenTo(this.model, 'change', this.update);
            this.listenTo(this.total, 'change', this.update);
            this.listenTo(this.metricAnalysis, 'change', this.update);

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
            if (this.mainModel.get("selectedMetric") !== "count") {
                this.additionalMetricPresent = true;
            } else {
                this.additionalMetricPresent = false;
            }
            if (!this.model.isDone() || !this.total.isDone() || !this.metricAnalysis.isDone()) {
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

        columnUpdate: function() {
            var selectedMetric = this.mainModel.get("selectedMetric");
            var data;

            // iterate through all domains dimensions
            var domain = squid_api.utils.find(squid_api.model.project.get("domains"), "oid", squid_api.model.config.get("domain"), "Domain");
            var domainMetrics = domain.metrics;

            for (i=0; i<domainMetrics.length; i++) {
                if (domainMetrics[i].id.metricId === selectedMetric) {
                    selectedMetric = domainMetrics[i].name;
                }
            }

            if (this.additionalMetricPresent) {
                data = {"additionalMetric" : selectedMetric};
            }

            var html = this.columnsTemplate(data);
            this.$el.find(".pathanalysis_columns").html(html);
        },

        getData: function() {
            // Store Data From Analaysis
            var results = this.model.get("results");
            if (results) {
                var columns = results.cols;
                var rows = results.rows;

                var stepsInserted = this.steps;
                var metricCount = 0;

                // Obtain Total Count From Total Analysis
                if (this.total.get("analyses")) {
                    totalCount = this.total.get("analyses")[0].get("results").rows[0].v[0];
                }
                if (this.additionalMetricPresent) {
                    metricCount = this.metricAnalysis.get("results").rows[0].v[0];
                }
                
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
                                } else if (ix === (stepsInserted * 2) - 1) {
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

                    if (this.additionalMetricPresent) {
                        dataValues.metricPercentage = rowItem[(stepsInserted * 2) + 1] / metricCount * 100;
                    }

                    objects.push(dataValues);
                }

                // Sort data from highest to lowest percentage value
                var dataSorted = this.sortByPercentage(objects);

                // Take the first five records
                var data = dataSorted.slice(0, 7);

                return data;
            }
        },

        sortByPercentage: function(values) {
            if (! this.additionalMetricPresent) {
                values.sort(function(a,b){
                    return (b.percentage - a.percentage);
                });
            } else {
                values.sort(function(a,b){
                    return (b.metricPercentage - a.metricPercentage);
                });
            }
            
            return values;
        },

        renderDiagram: function(resize) {
            var me = this;
            var data = this.getData();
            var documentHeight = $(window).height() - 276;
            var width = this.$el.find(".pathanalysis_diagram").width();
            var headerWidth = this.$el.find(".pathanalysis_header").width();
            var originalColumnsHeight = $(window).height() - 248;
            this.$el.find(".pathanalysis_columns").height(originalColumnsHeight);
            this.$el.find(".pathanalysis_columns").attr("originalHeight", originalColumnsHeight);
            
            d3.select("#squid_api_pathanalysis_widget .pathanalysis_diagram svg").remove();

            var margin = { top: 0, left: 23, right: 175, bottom: 0 };
            
            this.columnUpdate();

            if (this.additionalMetricPresent) {
                margin.right = 215;
                this.$el.find(".pathanalysis_columns").addClass("additionalMetric");
            } else {
                this.$el.find(".pathanalysis_columns").removeClass("additionalMetric");
            }

            var w = width - margin.left - margin.right;
            

            // Format Data for Display
            var formattedArray = [];
            var collectionArray = [];
            if (data) {
                for (i=0; i<data.length; i++) {
                    var pathData = data[i].data;
                    var path={};
                    path.average = data[i].average;
                    path.percentage = data[i].percentage;
                    if (data[i].metricPercentage) {
                       path.metricPercentage = data[i].metricPercentage; 
                    }
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
                            var jsonData = {};

                            // Node Name
                            if (d.name.length === 0) {
                                jsonData.name = "Unknown";
                            } else {
                                jsonData.name = d.name;
                            }

                            if (squid_api.view.metadata[d.name]) {
                                jsonData.color = squid_api.view.metadata[d.name].color;
                            } else {
                                jsonData.color = "#000";
                            }

                            // Node Value
                            if (d.value === 0) {
                                jsonData.value = "N/A";
                            } else if (d.value < 60 && d.value >= 1) {
                                jsonData.value = d.value.toFixed(0) + "s";
                            } else if (d.value < 1) {
                                jsonData.value = d.value.toFixed(2) + "s";
                            } else {
                                var minutes = Math.floor(d.value / 60);
                                jsonData.value = Math.floor(d.value / 60) + "m" + Math.floor(d.value - minutes * 60) + "s";
                            }
                            
                            return me.tooltipTemplate(jsonData);
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
                        .on("click", function() {
                            if (! me.animating) {
                                me.waterFall(this);
                                me.animating = true;
                                setTimeout(function() {
                                    me.animating = false;
                                }, 500);
                            }
                        });

                    var addIconRectangle = addIconGroup
                        .append("rect")
                        .attr({
                            "transform": function(d, i) { return "translate(-20,0)"; },
                            "width" : "30",
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

                    var perceptiveLuminance = function(color1, color2, color3) {
                        return 1 - (0.299 * color1 + 0.587 * color2 + 0.114 * color3) / 255;
                    };

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
                        .attr("stroke", "white")
                        .attr("stroke-width", 0.7)
                        .attr("y", function(d, i) {
                            return 0;
                        })
                        .attr("height", 50)
                        .style("fill", function (d, i) {
                            if (squid_api.view.metadata[d.name]) {
                                return squid_api.view.metadata[d.name].color;
                            } else {
                                return "#000";
                            }
                        });
                    
                    // Add Column Data
                    var columnDataGroup = topLevelGroup.append("g")
                        .attr("class", "data-column");

                    var noCount = false;

                    if (this.mainModel.get("selectedMetric") !== "count") {
                        noCount = true;
                        // Add Column Data 1 (Visit %)
                        var metricPercentage = columnDataGroup
                            .append("text")
                            .text(function(d) {
                                if (d.metricPercentage < 1) {
                                    return (d.metricPercentage).toFixed(2) + "%";
                                } else {
                                    return Math.round(d.metricPercentage) + "%";
                                }
                            })
                            .attr("x", (width - margin.right) + 10)
                            .attr("y", 30)
                            .attr("fill", "#767676");
                    } else {
                        noCount = false;
                    }

                    // Add Column Data 1 (Visit %)
                    var visitPercentage = columnDataGroup
                        .append("text")
                        .text(function(d) {
                            if (d.percentage < 1) {
                                return (d.percentage).toFixed(2) + "%";
                            } else {
                                return Math.round(d.percentage) + "%";
                            }
                        })
                        .attr("x", function() {
                            if (noCount) {
                                return (width - margin.right) + 60;
                            } else {
                                return (width - margin.right) + 20;
                            }
                        })
                        .attr("y", 30)
                        .attr("fill", "#767676");

                    // Add Column Data 1 (Average Path Steptime)
                    var averagePathStepTime = columnDataGroup
                        .append("text")
                        .text(function(d) {
                            if (d.average !== 0) {
                                if (d.average < 60) {
                                    var value = Math.floor(d.average);
                                    if (value < 1) {
                                        value = d.average.toFixed(2);
                                        return value + "s";
                                    } else {
                                        value = Math.floor(d.average);
                                        return value + "s";
                                    }
                                } else {
                                    var minutes = Math.floor(d.average / 60);
                                    var seconds = Math.floor(d.average - minutes * 60);
                                    return minutes + "m " + seconds + "s";
                                }
                            }
                        })
                        .attr("x", function() {
                            if (noCount) {
                                return (width - margin.right) + 115;
                            } else {
                                return (width - margin.right) + 80;
                            }
                        })
                        .attr("y", 30)
                        .attr("fill", "#767676");

                    var paths = groups.selectAll("path")
                        .data(function (d) {
                            return d;
                        })
                        .enter()
                        .append("path")
                        .filter(function(d) {
                            if (d.lastNoValue === true) {
                                return d.lastNoValue;
                            } else if (d.lastValue === true) { 
                                return d.lastValue;
                            }  else {
                                this.remove();
                            }
                        })
                        .attr("d", function(d) {
                            if (d.lastNoValue) {
                                return "m" + (xScale(d.y0) + xScale(d.y) + 5) +"," + 0 + "c0,0 0,0 0,50c0";
                            } else if (d.lastValue) {
                                return "m" + (xScale(d.y0) + xScale(d.y) + 5) +"," + 0 + "c0,0 0,0 0,50c0";
                            }
                        })
                        .attr("stroke-width", 2.5)
                        .attr("stroke-dasharray", function(d) {
                            if (d.lastValue) {
                                return "8, 6, 8, 6";
                            }
                        })
                        .style({"display": "none"});

                        var xPosition = stepElements
                            .attr('x', function(d) { 
                                return xScale(d.y0);
                            })
                            .attr("width", function (d) {
                                return xScale(d.y);
                            });
                        var pathsResize = paths
                            .style({"display": "inherit"});
                        var pathNoTransition = paths
                            .attr("stroke", function (d,i) {
                                if (squid_api.view.metadata[d.name]) {
                                    return squid_api.view.metadata[d.name].color;
                                }
                                else {
                                    return "#000";
                                }
                            });

                        // Add text for each data value
                        var texts = groups.selectAll("text")
                        .data(function (d) {
                            return d;
                        })
                        .enter();

                        // Item Text
                        texts.append("text")
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
                                // Logic to place text in a logical position based on "client rect"
                                var value;
                                var svgSize = d3.select(".pathanalysis_diagram svg").attr("width") - 350;
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
                                if (squid_api.view.metadata[d.name]) {
                                    var color = squid_api.view.metadata[d.name].color;
                                    
                                    // obtain each RGB colour seperately
                                    color = color.substring(4, color.length-1)
                                            .replace(/ /g, '')
                                            .split(',');

                                    // perceptive luminance algorithm
                                    var percentiveLuminanceValue = perceptiveLuminance(color[0], color[1], color[2]);
                                    if (percentiveLuminanceValue < 0.5) {
                                        return "#333";
                                    } else {
                                        return "white";
                                    }
                                } else {
                                    return "white";
                                }
                            });
                        
                        texts.append("text")
                            .text(function(d) {
                                var nodeSizing = this.parentNode.childNodes[0].getBoundingClientRect();

                                // Store Children Items of Node Values
                                var childNodes = this.parentNode.childNodes;
                                var smallTextNode;

                                // Obtain textual Node which is used to calculate the width
                                for (i=0; i<childNodes.length; i++) {
                                    if (childNodes[i].classList.contains("small")) {
                                        smallTextNode = childNodes[i];
                                    }
                                }

                                // Print ... based on size difference
                                if (smallTextNode) {
                                    if (nodeSizing.width < 20) {
                                        return "..";
                                    } else {
                                        return "...";
                                    }
                                } else {
                                    return "";
                                }
                            })
                            .attr("x", function (d) {
                                // Logic to place text in a logical position based on "client rect"
                                var value;
                                var svgSize = d3.select(".pathanalysis_diagram svg").attr("width") - 350;
                                var nodeSizing = this.parentNode.childNodes[0].getBoundingClientRect();
                                if (this.getBBox().width < 100) {
                                    return xScale(d.y0) + (nodeSizing.width / 2) - (this.getBBox().width / 2);
                                } 
                            })
                            .attr("y", function (d) {
                                return 30;
                            })
                            .attr("fill", function (d) {
                                if (squid_api.view.metadata[d.name]) {
                                    var color = squid_api.view.metadata[d.name].color;
                                    
                                    // obtain each RGB colour seperately
                                    color = color.substring(4, color.length-1)
                                            .replace(/ /g, '')
                                            .split(',');

                                    // perceptive luminance algorithm
                                    var percentiveLuminanceValue = perceptiveLuminance(color[0], color[1], color[2]);
                                    if (percentiveLuminanceValue < 0.5) {
                                        return "#333";
                                    } else {
                                        return "white";
                                    }
                                } else {
                                    return "white";
                                }
                            });
                        
                        // Text value only shown in waterwall
                        texts.append("text")
                            .text(function(d) {
                                if (d.percentage > 3) {
                                    if (d.value < 60) {
                                        if (d.value === 0) {
                                            return "";
                                        } else {
                                            var value = d.value;
                                            if (value < 60 && value > 2) {
                                                value = d.value.toFixed(0) + "s";
                                            } else {
                                                value = "";
                                            }
                                            return value;
                                        }
                                    } else {
                                        var minutes = Math.floor(d.value / 60);
                                        var seconds = Math.floor(d.value - minutes * 60);
                                        return minutes + "m " + seconds + "s";
                                    }
                                }
                            })
                            .attr("x", function (d) {
                                // Logic to place text in a logical position based on "client rect"
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
                            .attr("y", function (d) {
                                return 65;
                            })
                            .attr("class", function (d) {
                                return "time-value";
                            })
                            .attr("fill", function (d) {
                                return "#767676";
                            })
                            .style({"display": "none"});
                }
            }
            
        },

        waterFall: function(node) {
            var siblings = node.parentNode.childNodes;
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
                children.push(nodesToAnimate[i].childNodes);
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
                if (node.hasAttribute("expanded")) {
                    // If it is expanded
                    d3.select(node).select('text')
                        .text(function(d){
                             return "+";
                        });
                    d3.select(node).attr("expanded", null);
                    d3.select(node.parentNode).attr("class", null);
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
                        } else if($(children[ix][0])[0].tagName === "rect" && $(children[ix][1])[0].tagName === "path" && $(children[ix][2])[0].tagName === "text" && $(children[ix][3])[0].tagName === "text") {
                            entitiesHeight = entitiesHeight + 50;
                            d3.select(children[ix][0].parentNode)
                                .transition()
                                .attr('transform', "translate(0 " + 0 + ")")
                                .duration(500)
                                .ease('esp');
                            d3.select(children[ix][3])
                                .transition()
                                .attr("y", 75)
                                .duration(500)
                                .ease('esp')
                                .style({"display": "none"});
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
                            d3.select(children[ix][2])
                                .transition()
                                .attr("y", 30)
                                .duration(500)
                                .ease('esp')
                                .style({"display": "inherit"});
                            d3.select(children[ix][3])
                                .transition()
                                .attr("y", 65)
                                .duration(500)
                                .ease('esp')
                                .style({"display": "none"});
                        }
                    }
                    // Page Height Logic on node collapose
                    d3.select("#squid_api_pathanalysis_widget svg").attr("height", svgHeight - entitiesHeight - 50);
                    $("#squid-widgets-wrapper").height(widgetsWrapperHeight - entitiesHeight - 50);
                    $("#squid_api_pathanalysis_widget .pathanalysis_columns").height(columnsHeight - entitiesHeight - 50);
                } else {
                    // Expand Node Clicked
                    d3.select(node).select('text')
                        .text(function(d){
                             return "-";
                        });
                    // Add expanded classes / attributes
                    d3.select(node).attr("expanded", true);
                    d3.select(node.parentNode).attr("class", "expanded");

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
                            // Logic for order rect / path / text
                        } else if($(children[ix][0])[0].tagName === "rect" && $(children[ix][1])[0].tagName === "path" && $(children[ix][2])[0].tagName === "text" && $(children[ix][3])[0].tagName === "text") {
                            entitiesHeight = entitiesHeight + 50;
                            d3.select(children[ix][0].parentNode)
                                .transition()
                                .attr('transform', "translate(0 " + yValue1 + ")")
                                .duration(500)
                                .ease('esp');
                            d3.select(children[ix][3])
                                .transition()
                                .attr("y", 64)
                                .duration(500)
                                .ease('esp')
                                .style({"display": "inherit"});
                        } else {
                            // order for all other tag orders
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
                            d3.select(children[ix][2])
                                .transition()
                                .attr("y", yValue1 + 64)
                                .duration(500)
                                .ease('esp')
                                .style({"display": "none"});
                            d3.select(children[ix][3])
                                .transition()
                                .attr("y", yValue1 + 64)
                                .duration(500)
                                .ease('esp')
                                .style({"display": "inherit"});
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

            // Render the dimension selector here
            if (this.orderByView){
                this.orderByView.setElement(this.$el.find("#orderby"));
                this.orderByView.render();
            }
            // Render the dimension selector here
            if (this.stepSwitcherView){
                this.stepSwitcherView.setElement(this.$el.find("#stepswitcher"));
                this.stepSwitcherView.render();
            }

            // Starting Columns Height
            this.$el.find(".pathanalysis_columns").height($(window).height() - 248);

            this.columnUpdate();

            return this;
        }
    });

    return View;
}));
