this["squid_api"] = this["squid_api"] || {};
this["squid_api"]["template"] = this["squid_api"]["template"] || {};

this["squid_api"]["template"]["squid_api_pathanalysis_widget"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class='sq-loading' style='position:absolute; width:100%; top:40%;'>\n<div class=\"spinner\">\n  <div class=\"rect5\"></div>\n  <div class=\"rect4\"></div>\n  <div class=\"rect3\"></div>\n  <div class=\"rect2\"></div>\n  <div class=\"rect1\"></div>\n  <div class=\"rect2\"></div>\n  <div class=\"rect3\"></div>\n  <div class=\"rect4\"></div>\n  <div class=\"rect5\"></div>\n</div>\n</div>\n<div id=\"squid_api_pathanalysis_widget\">\n  <div class=\"pathanalysis_header\">\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <div id=\"orderby\" />\n        <div id=\"stepselector\" />\n      </div>\n    </div>\n  </div>\n	<div class=\"pathanalysis_diagram\">\n\n	</div>\n  <div class=\"pathanalysis_columns\">\n\n  </div>\n</div>";
  });

this["squid_api"]["template"]["squid_api_pathanalysis_widget_columns"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <div class=\"col-md-3 additional-metric\">\n            <span>";
  if (helper = helpers.additionalMetric) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.additionalMetric); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " %</span>\n        </div>\n        <div class=\"col-md-3 percentage\">\n            <span>Visit % </span>\n        </div>\n        <div class=\"col-md-6 steptime\">\n            <span>Time Duration</span>\n        </div>\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n        <div class=\"col-md-4 percentage\">\n            <span>Visit % </span>\n        </div>\n        <div class=\"col-md-8 steptime\">\n            <span>Time Duration</span>\n        </div>\n    ";
  }

  buffer += "<div class=\"column-header\">\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.additionalMetric), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n\n";
  return buffer;
  });

this["squid_api"]["template"]["squid_api_pathanalysis_widget_tooltip"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n          <th class=\"line\" style=\"border-left: solid 3px ";
  if (helper = helpers.color) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.color); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ";\"></th>\n          <th class=\"step\"> No Steps After</th>\n        ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <th class=\"line\" style=\"border-left: dotted 3px ";
  if (helper = helpers.color) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.color); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "; position: relative; top: 15px;\"></th>\n            <th class=\"step\"> Steps After Exist</th>\n        ";
  return buffer;
  }

  buffer += "<div class=\"squid-api-pathanalysis-widget-tooltip\">\n	<table>\n  		<tr>\n    		<th class=\"color\" style=\"background-color: ";
  if (helper = helpers.color) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.color); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></th>\n    		<th class=\"name\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</th>\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.lastNoValue), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.lastValue), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  		</tr>\n  		<tr>\n  			<th class=\"clock\"><i class=\"fa fa-clock-o\"></i></th>\n    		<th class=\"value\">";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</th>\n  		</tr>\n      <tr>\n        <th class=\"step-number\">step: <span style=\"font-size: 18px;\">";
  if (helper = helpers.number) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.number); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</th>\n      </tr>\n	</table>\n</div>";
  return buffer;
  });
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
        stepSelectorView : null,
        additionalMetricPresent : false,
        metadata : null,

        initialize: function(options) {
            var me = this;
            this.status = squid_api.model.status;
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
            if (options.stepSelectorView) {
                this.stepSelectorView = options.stepSelectorView;
            }
            if (options.mainModel) {
                this.mainModel = options.mainModel;
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
            if (options.afterRender) {
                this.afterRender = options.afterRender;
            }
            if (options.metadata) {
                this.metadata = options.metadata;
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

            if (this.metricAnalysis) {
                this.listenTo(this.metricAnalysis, 'change', this.update);
            }

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
            // Update Steps if changed
            if (this.mainModel.get("pathAnalysisStepCount") && this.mainModel.get("pathAnalysisStepCount") !== this.steps) {
                this.steps = this.mainModel.get("pathAnalysisStepCount");
            }

            if (this.mainModel.get("selectedMetric") !== "count") {
                this.additionalMetricPresent = true;
            } else {
                this.additionalMetricPresent = false;
            }

            if (!this.model.isDone() || !this.total.isDone() || (this.metricAnalysis && !this.metricAnalysis.isDone())) {
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
                if (this.status.get("status") === "DONE") {
                    this.renderDiagram();
                }
            }
        },

        columnUpdate: function() {
            var selectedMetric = this.mainModel.get("selectedMetric");
            var data;

            // iterate through all domains dimensions
            var domain = squid_api.utils.find(squid_api.model.project.get("domains"), "oid", squid_api.model.config.get("domain"), "Domain");

            if (domain) {
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
            }
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
                    if (this.total.get("analyses")[0].get("results").rows[0]) {
                        totalCount = this.total.get("analyses")[0].get("results").rows[0].v[0];
                    }
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
                            if (! rowItem[ix]) {
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
                        obj.stepname = rowItem[0].trim();
                        obj.lastNoValue = true;
                        obj.time = 0;
                        dataValues.data.push(obj);
                    } else {
                        var percentages = 0;
                        for (ix=stepsInserted; ix<stepsInserted * 2; ix++) {
                            obj = {};
                            if (rowItem[ix] || rowItem[ix - stepsInserted] && ! rowItem[ix]) {
                                obj.time = 0;
                                if (rowItem[ix]) {
                                    obj.time = parseFloat(rowItem[ix]);
                                }
                                obj.realPercentage = parseFloat(obj.time / timeSum * 100);
                                if (rowItem[ix - stepsInserted]) {
                                    obj.stepname = rowItem[ix - stepsInserted].trim();
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

                                if (! rowItem[ix] && rowItem[ix - stepsInserted]) {
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
                            obj.number = ix;
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
                        .attr('class', 'd3-tip animate pathanalysis-tip')
                        .offset([-10, 0])
                        .html(function(d) {
                            var jsonData = {};

                            // Node Name
                            if (d.name.length === 0) {
                                jsonData.name = "Unknown";
                            } else {
                                jsonData.name = d.name;
                            }

                            if (me.metadata[d.name]) {
                                jsonData.color = me.metadata[d.name].color;
                            } else {
                                jsonData.color = "#000";
                            }

                            if (d.lastNoValue === true) {
                                jsonData.lastNoValue = true;
                            } else if (d.lastValue === true) {
                                jsonData.lastValue = true;
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

                            // Obtain Step Number
                            jsonData.number = (d.number) + 1;

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
                        .filter(function(d, i) {
                            if (d.values.length > 1) {
                                return i + 1;
                            }
                        })
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
                            if (me.metadata[d.name]) {
                                return me.metadata[d.name].color;
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
                                return "m" + (xScale(d.y0) + xScale(d.y) + 5) +"," + 0 + "c0,0 0,0 0,50";
                            } else if (d.lastValue) {
                                return "m" + (xScale(d.y0) + xScale(d.y) + 5) +"," + 0 + "c0,0 0,0 0,50";
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
                                if (me.metadata[d.name]) {
                                    return me.metadata[d.name].color;
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
                                if (me.metadata[d.name]) {
                                    var color = me.metadata[d.name].color;

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
                                if (me.metadata[d.name]) {
                                    var color = me.metadata[d.name].color;

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
            // If G Node has more than One Value (With the second one being the text column values, so this is added on)
            if (children.length > 2) {
                var svgHeight = parseInt(d3.select("#squid_api_pathanalysis_widget svg").attr("height"));
                var widgetsWrapperHeight = $("#squid-widgets-wrapper").height();
                var columnsHeight = $("#squid_api_pathanalysis_widget .pathanalysis_columns").height();
                var originalColumnsHeight = $("#squid_api_pathanalysis_widget .pathanalysis_columns").attr("originalHeight");
                var entitiesHeight = 0;

                if (! node.hasAttribute("expanded")) {

                // Expand Path to Waterfall

                    // Change Icon Text
                    d3.select(node).select('text')
                        .text(function(d){
                             return "-";
                        });

                    // Modify Node Class / Attributes
                    d3.select(node).attr("expanded", true);
                    d3.select(node.parentNode).attr("class", "expanded");

                    // Move Nodes After the one Clicked Further down the page
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
                    /*
                        Node Length of 5 = Node Items with a SVG Path attribute
                        Node Length of 2 = Text Column Attributes on the Right of Page
                        Node Length of 3 = Text Columns Attributes on the Right of Page when we use an additional metric
                        Node Length of (other quantity) = All other node types
                    */
                    for (ix=0; ix<children.length; ix++) {
                        var yValue1 = 50 * ix;
                        if (children[ix].length === 5) {
                            entitiesHeight = entitiesHeight + 50;
                            d3.select(children[ix][0].parentNode)
                                .transition()
                                .attr('transform', "translate(0 " + yValue1 + ")")
                                .duration(500)
                                .ease('esp');

                            d3.select(children[ix][4])
                                .transition()
                                .attr("y", 64)
                                .duration(500)
                                .ease('esp')
                                .style({"display": "inherit"});

                         } else if (children[ix].length !== 2 && children[ix].length !== 3) {
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
                } else {

                // Collapse Path from waterfall

                    d3.select(node).select('text')
                        .text(function(d){
                             return "+";
                        });
                    d3.select(node).attr("expanded", null);
                    d3.select(node.parentNode).attr("class", null);

                    // Move Nodes After the one Clicked Back up into position
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

                    for (ix=0; ix<children.length; ix++) {
                        var yValue = 50 * ix;
                        /*
                            Node Length of 5 = Node Items with a SVG Path attribute
                            Node Length of 2 = Text Column Attributes on the Right of Page
                            Node Length of 3 = Text Columns Attributes on the Right of Page when we use an additional metric
                            Node Length of (other quantity) = All other node types
                        */
                        if (children[ix].length === 5) {
                            entitiesHeight = entitiesHeight + 50;
                            d3.select(children[ix][0].parentNode)
                                .transition()
                                .attr('transform', "translate(0 " + 0 + ")")
                                .duration(500)
                                .ease('esp');
                            d3.select(children[ix][4])
                                .transition()
                                .attr("y", 30)
                                .duration(500)
                                .ease('esp')
                                .style({"display": "none"});
                        } else if (children[ix].length !== 2 && children[ix].length !== 3) {
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

                    // Page Height Logic For WaterFall Expand
                    d3.select("#squid_api_pathanalysis_widget svg").attr("height", svgHeight - entitiesHeight - 50);
                    $("#squid-widgets-wrapper").height(widgetsWrapperHeight - entitiesHeight - 50);
                    $("#squid_api_pathanalysis_widget .pathanalysis_columns").height(columnsHeight - entitiesHeight - 50);
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
            if (this.stepSelectorView){
                this.stepSelectorView.setElement(this.$el.find("#stepselector"));
                this.stepSelectorView.setCurrentStep(this.steps);
                this.stepSelectorView.setMaxSteps(this.mainModel.get("pathAnalysisStepCountMax"));
                this.stepSelectorView.render();
            }

            // Starting Columns Height
            this.$el.find(".pathanalysis_columns").height($(window).height() - 248);

            this.columnUpdate();

            if (this.afterRender) {
                // call the afterRender function
                this.afterRender();
            }

            return this;
        }
    });

    return View;
}));
