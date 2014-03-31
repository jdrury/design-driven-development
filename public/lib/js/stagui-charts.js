(function ($, document, window) {

    if (!window.stagui) {
        console.error("stagui }> . Missing Core");
        return false;
    }

    var stagui = window.stagui;

    stagui.Charts = {
        init: function () {
            this.colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
            this.renderCharts();
        },

        renderCharts: function () {
            var self = this;

            // Flot
            this.renderFlotLines();
            this.renderFlotMixed();
            this.renderFlotRealtime();
            this.renderFlotPie();
            this.renderFlotDonut();
            this.renderFlotBars();

            // D3
            this.renderD3Lines();
            this.renderD3Splines();
            this.renderD3Bars();
            this.renderD3Mixed();
            this.renderD3ScatterPlot();
            this.renderD3Pie();
            this.renderD3Donut();
            this.renderD3Area();

            // Knob
            this.renderKnobDials();

            // Sparklines
            this.renderSparklines();
        },

        // Redraw Flot Chart on Events
        redrawFlotChart: function (plot) {

            var self = this;

            function resize() {
                plot.resize();
                plot.setupGrid();
                plot.draw();
            }

            stagui.Events.onResize(function () {
                resize();
            });

            stagui.Events.toggleLeftPanel(function () {
                resize();
            });

            stagui.Events.toggleRightPanel(function () {
                resize();
            });
        },

        // Tooltips
        renderFlotTooltip: function (text, top, left) {
            var tooltip = '<div id="flot-tooltip" class="tooltip fade right in"><div class="tooltip-inner"></div><div class="tooltip-arrow"></div></div>';
            $("body").append(tooltip);
            var $tooltip = $("#flot-tooltip");
            $tooltip.css({
                top: top - 10,
                left: left + 10
            });
            $tooltip.find(".tooltip-inner").html(text);
        },

        // Flot Lines
        renderFlotLines: function () {

            var self = this;
            var $el = $("#flot-chart-lines");
            var colors = self.colors;

            if ($el.length > 0) {

                var sin = [];
                var cos = [];

                for (var i = 0; i < 14; i += 0.5) {
                    sin.push([i, Math.sin(i)]);
                    cos.push([i, Math.cos(i)]);
                }

                var opts = {
                    series: {
                        lines: {
                            show: true
                        },
                        points: {
                            show: true
                        },
                        shadowSize: 0
                    },
                    grid: {
                        borderWidth: 0,
                        hoverable: true
                    },
                    colors: colors,
                    yaxis: {
                        font: {
                            color: '#000'
                        }
                    },
                    xaxis: {
                        font: {
                            color: '#000'
                        }
                    },
                    legend: {
                        labelBoxBorderColor: 'transparent',
                        position: "se",
                        backgroundOpacity: 0.6
                    }
                };

                var plot = $.plot($el, [
                    { data: sin, label: "Sin(x)"},
                    { data: cos, label: "Cos(x)"}
                ], opts);

                $el.bind("plothover", function (event, pos, item) {
                    if (item) {
                        var x = item.datapoint[0].toFixed(2);
                        var y = item.datapoint[1].toFixed(2);
                        $("#flot-tooltip").remove();
                        self.renderFlotTooltip(item.series.label + " of " + x + " = " + y, item.pageY, item.pageX);
                    } else {
                        $("#flot-tooltip").remove();
                    }
                });

                self.redrawFlotChart(plot);
            }
        },

        // Flot Mixed
        renderFlotMixed: function () {
            var self = this;
            var $el = $("#flot-chart-mixed");
            var colors = self.colors;

            if ($el.length > 0) {

                var d1 = [];
                for (var i = 0; i < 14; i += 0.5) {
                    d1.push([i, Math.sin(i)]);
                }

                var d2 = [
                    [0, 3],
                    [4, 8],
                    [8, 5],
                    [9, 13]
                ];

                var d3 = [];
                for (var i = 0; i < 14; i += 0.5) {
                    d3.push([i, Math.cos(i)]);
                }

                var d4 = [];
                for (var i = 0; i < 14; i += 0.1) {
                    d4.push([i, Math.sqrt(i * 10)]);
                }

                var d5 = [];
                for (var i = 0; i < 14; i += 0.5) {
                    d5.push([i, Math.sqrt(i)]);
                }

                var d6 = [];
                for (var i = 0; i < 14; i += 0.5 + Math.random()) {
                    d6.push([i, Math.sqrt(2 * i + Math.sin(i) + 5)]);
                }

                var opts = {
                    grid: {
                        borderWidth: 0,
                        hoverable: true
                    },
                    shadowSize: 0,
                    yaxis: {
                        font: {
                            color: '#000'
                        }
                    },
                    xaxis: {
                        font: {
                            color: '#000'
                        }
                    },
                    colors: colors,
                    legend: {
                        labelBoxBorderColor: 'transparent',
                        position: "se",
                        backgroundOpacity: 0.6
                    }
                };

                var plot = $.plot($el, [
                    {
                        data: d1,
                        label: "Omnes",
                        lines: {
                            show: true,
                            fill: true
                        }
                    },
                    {
                        data: d2,
                        label: "Lingua",
                        bars: { show: true }
                    },
                    {
                        data: d3,
                        label: "Institutis",
                        points: { show: true }
                    },
                    {
                        data: d4,
                        label: "Legibus",
                        lines: { show: true }
                    },
                    {
                        data: d5,
                        label: "Inter",
                        lines: { show: true },
                        points: { show: true }
                    },
                    {
                        data: d6,
                        label: "Differunt",
                        lines: { show: true, steps: true }
                    }
                ], opts);

                $el.bind("plothover", function (event, pos, item) {
                    if (item) {
                        var x = item.datapoint[0].toFixed(2);
                        var y = item.datapoint[1].toFixed(2);
                        $("#flot-tooltip").remove();
                        self.renderFlotTooltip(item.series.label + " of " + x + " = " + y, item.pageY, item.pageX);
                    } else {
                        $("#flot-tooltip").remove();
                    }
                });

                self.redrawFlotChart(plot);
            }
        },

        // Flot Realtime
        renderFlotRealtime: function () {
            var self = this;
            var $el = $("#flot-chart-realtime");

            if ($el.length > 0) {
                var data = [];
                var totalPoints = 300;

                function getRandomData() {

                    if (data.length > 0)
                        data = data.slice(1);

                    while (data.length < totalPoints) {
                        var prev = data.length > 0 ? data[data.length - 1] : 50;
                        var y = prev + Math.random() * 10 - 5;

                        if (y < 0) {
                            y = 0;
                        } else if (y > 60) {
                            y = 60;
                        }

                        data.push(y);
                    }

                    var res = [];
                    for (var i = 0; i < data.length; ++i) {
                        res.push([i, data[i]])
                    }
                    return res;
                }

                var opts = {
                    series: {
                        lines: {
                            show: true,
                            fill: true
                        },
                        shadowSize: 0
                    },
                    yaxis: {
                        font: {
                            color: '#000'
                        }
                    },
                    xaxis: {
                        font: {
                            color: '#000'
                        }
                    },
                    colors: [self.colors[0]],
                    xaxis: {
                        show: false
                    },
                    grid: {
                        borderWidth: 0
                    }
                };
                var plot = $.plot($el, [ getRandomData() ], opts);

                var drawChart = function () {
                    plot.setData([getRandomData()]);
                    plot.draw();
                    requestAnimationFrame(drawChart);
                };

                drawChart();
                self.redrawFlotChart(plot);
            }

        },

        // Flot Pie
        renderFlotPie: function () {
            var self = this;
            var $el = $("#flot-chart-pie");

            if ($el.length > 0) {
                var data = [];
                var series = Math.floor(Math.random()) + 3;
                var colors = self.colors;

                for (var i = 0; i < series; i++) {
                    data[i] = {
                        label: "Series" + (i + 1),
                        data: Math.floor(Math.random() * 100) + 1
                    }
                }

                function labelFormatter(label, series) {
                    return "<div class='pieLabel'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
                }

                var opts = {
                    series: {
                        pie: {
                            show: true,
                            radius: 1,
                            label: {
                                show: true,
                                radius: 3 / 4,
                                formatter: labelFormatter,
                                background: {
                                    opacity: 0.9
                                }
                            }
                        }
                    },
                    colors: colors,
                    legend: {
                        labelBoxBorderColor: 'transparent',
                        position: "se",
                        backgroundOpacity: 0.6
                    }
                };

                var plot = $.plot($el, data, opts);
                self.redrawFlotChart(plot);
            }
        },

        // Flot Donut
        renderFlotDonut: function () {
            var self = this;
            var $el = $("#flot-chart-donut");

            if ($el.length > 0) {
                var data = [];
                var series = Math.floor(Math.random()) + 3;
                var colors = self.colors;

                for (var i = 0; i < series; i++) {
                    data[i] = {
                        label: "Series" + (i + 1),
                        data: Math.floor(Math.random() * 100) + 1
                    }
                }

                function labelFormatter(label, series) {
                    return "<div class='pieLabel'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
                }

                var opts = {
                    series: {
                        pie: {
                            show: true,
                            radius: 1,
                            innerRadius: 0.4,
                            label: {
                                show: true,
                                radius: 3 / 4,
                                formatter: labelFormatter,
                                background: {
                                    opacity: 0.9
                                }
                            }
                        }
                    },
                    colors: colors,
                    legend: {
                        labelBoxBorderColor: 'transparent',
                        position: "se",
                        backgroundOpacity: 0.6
                    }
                };

                var plot = $.plot($el, data, opts);
                self.redrawFlotChart(plot);
            }
        },

        // Flot Bars
        renderFlotBars: function () {
            var self = this;
            var $el = $("#flot-chart-bars");

            if ($el.length > 0) {
                var data = [];
                var colors = self.colors;

                for (var i = 0; i <= 10; i += 1) {
                    data.push([i, parseInt(Math.random() * 30)]);
                }

                var opts = {
                    series: {
                        bars: {
                            show: true,
                            barWidth: 0.5
                        }
                    },
                    colors: colors,
                    grid: {
                        borderWidth: 0,
                        hoverable: true
                    },
                    legend: {
                        labelBoxBorderColor: 'transparent',
                        position: "se",
                        backgroundOpacity: 0.6
                    }
                };

                $el.bind("plothover", function (event, pos, item) {
                    if (item) {
                        var x = item.datapoint[0].toFixed(2);
                        var y = item.datapoint[1].toFixed(2);
                        $("#flot-tooltip").remove();
                        self.renderFlotTooltip(item.series.label + " of " + x + " = " + y, item.pageY, item.pageX);
                    } else {
                        $("#flot-tooltip").remove();
                    }
                });

                var plot = $.plot($el, [
                    {
                        data: data,
                        label: "Lorem"
                    }
                ], opts);
                self.redrawFlotChart(plot);

            }
        },

        // D3 Lines
        renderD3Lines: function () {
            var self = this;
            var $el = $("#d3-chart-lines");

            if ($el.length > 0) {

                var chart = c3.generate({
                    size: {
                        height: 300
                    },
                    bindto: "#d3-chart-lines",
                    data: {
                        columns: [
                            ['Omnes', 30, 200, 100, 400, 150, 250, 150],
                            ['Lingua', 130, 100, 140, 200, 300, 50, 250]
                        ]
                    }
                });
            }
        },

        // D3 Splines
        renderD3Splines: function () {
            var self = this;
            var $el = $("#d3-chart-splines");

            if ($el.length > 0) {

                var chart = c3.generate({
                    size: {
                        height: 300
                    },
                    bindto: "#d3-chart-splines",
                    data: {
                        columns: [
                            ['Omnes', 30, 200, 100, 400, 150, 250, 150],
                            ['Lingua', 130, 100, 140, 200, 300, 50, 250]
                        ]
                    }
                });
                chart.toSpline();
            }
        },

        // D3 Bars
        renderD3Bars: function () {
            var self = this;
            var $el = $("#d3-chart-bars");

            if ($el.length > 0) {

                var chart = c3.generate({
                    size: {
                        height: 300
                    },
                    bindto: "#d3-chart-bars",
                    data: {
                        columns: [
                            ['Lingua', 30, 200, 100, 400, 150, 250, 150],
                            ['Omnes', 130, 100, 140, 200, 300, 50, 250]
                        ]
                    },
                    axis: {
                        x: {
                            type: "categorized"
                        }
                    }
                });

                chart.toBar();
            }
        },

        // D3 Scatter Plot
        renderD3ScatterPlot: function () {
            var self = this;
            var $el = $("#d3-chart-scatter-plot");

            if ($el.length > 0) {

                var chart = c3.generate({
                    size: {
                        height: 300
                    },
                    bindto: "#d3-chart-scatter-plot",
                    data: {
                        xs: {
                            setosa: 'Setosa_x',
                            versicolor: 'Versicolor_x',
                            virginica: 'Virginica_x'
                        },
                        columns: [
                            ["Setosa_x", 3.5, 3.0, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3.0, 3.0, 4.0, 4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3.0, 3.4, 3.5, 3.4, 3.2, 3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3.0, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3.0, 3.8, 3.2, 3.7, 3.3],
                            ["Versicolor_x", 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2.0, 3.0, 2.2, 2.9, 2.9, 3.1, 3.0, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3.0, 2.8, 3.0, 2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3.0, 3.4, 3.1, 2.3, 3.0, 2.5, 2.6, 3.0, 2.6, 2.3, 2.7, 3.0, 2.9, 2.9, 2.5, 2.8],
                            ["Virginica_x", 3.3, 2.7, 3.0, 2.9, 3.0, 3.0, 2.5, 2.9, 2.5, 3.6, 3.2, 2.7, 3.0, 2.5, 2.8, 3.2, 3.0, 3.8, 2.6, 2.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2, 2.8, 3.0, 2.8, 3.0, 2.8, 3.8, 2.8, 2.8, 2.6, 3.0, 3.4, 3.1, 3.0, 3.1, 3.1, 3.1, 2.7, 3.2, 3.3, 3.0, 2.5, 3.0, 3.4, 3.0],
                            ["Setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
                            ["Versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
                            ["Virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
                        ],
                        type: 'scatter'
                    }
                });

            }
        },

        // D3 Mixed
        renderD3Mixed: function () {
            var self = this;
            var $el = $("#d3-chart-mixed");

            if ($el.length > 0) {

                var chart = c3.generate({
                    size: {
                        height: 300
                    },
                    bindto: "#d3-chart-mixed",
                    data: {
                        columns: [
                            ['Vel', 30, 20, 50, 40, 60, 50],
                            ['Iudice', 200, 130, 90, 240, 130, 220],
                            ['Vincam', 300, 200, 160, 400, 250, 250],
                            ['Sunt', 200, 130, 90, 240, 130, 220],
                            ['Officia', 130, 120, 150, 140, 160, 150]
                        ],
                        types: {
                            Vel: 'bar',
                            Iudice: 'bar',
                            Vincam: 'spline',
                            Sunt: 'spline',
                            Officia: 'bar'
                        },
                        groups: [
                            ['data1', 'data2']
                        ]
                    },
                    axis: {
                        x: {
                            type: "categorized"
                        }
                    }
                });
            }
        },

        // D3 Pie
        renderD3Pie: function () {
            var self = this;
            var $el = $("#d3-chart-pie");

            if ($el.length > 0) {

                var chart = c3.generate({
                    size: {
                        height: 300
                    },
                    bindto: "#d3-chart-pie",
                    data: {
                        columns: [
                            ["Setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
                            ["Versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
                            ["Virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
                        ]
                    }
                });
                chart.toPie();
            }
        },

        // D3 Donut
        renderD3Donut: function () {
            var self = this;
            var $el = $("#d3-chart-donut");

            if ($el.length > 0) {

                var chart = c3.generate({
                    size: {
                        height: 300
                    },
                    bindto: "#d3-chart-donut",
                    data: {
                        columns: [
                            ["Setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
                            ["Versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
                            ["Virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
                        ]
                    }
                });
                chart.toDonut();
            }
        },

        // D3 Lines
        renderD3Area: function () {
            var self = this;
            var $el = $("#d3-chart-area");

            if ($el.length > 0) {

                var chart = c3.generate({
                    size: {
                        height: 300
                    },
                    bindto: "#d3-chart-area",
                    data: {
                        columns: [
                            ['Omnes', 30, 200, 100, 400, 150, 250, 150],
                            ['Lingua', 130, 100, 140, 200, 300, 50, 250]
                        ]
                    }
                });
                chart.toArea();
            }
        },

        // Knob
        renderKnobDials: function () {
            var $el = $(".knob");
            var color = this.colors;

            $.each($el, function (i) {
                $(this).knob({
                    bgColor: "#e0e0e0",
                    fgColor: color[i]
                });
            });

        },

        // Sparklines
        renderSparklines: function () {

            // Line
            var tileLine = $(".tile-sparkline").peity("line", {
                width: "100%",
                height: 32
            });

            var line = $(".sparkline").peity("line", {
                width: 120,
                height: 20
            });

            // Bar
            var tileBar = $(".tile-sparkbar").peity("bar", {
                width: "100%",
                height: 32
            });

            var bar = $(".sparkbar").peity("bar", {
                width: 120,
                height: 20
            });

            // Realtime Line
            var tileRealtimeLine = $(".tile-sparkline-realtime").peity("line", {
                width: "100%",
                height: 65
            });

            var tileRealtimeLine2 = $(".tile-sparkline-realtime2").peity("line", {
                width: "100%",
                height: 65
            });

            var realtimeLine = $(".sparkline-realtime").peity("line", {
                width: 120,
                height: 20
            });

            // Pie
            var bar = $(".sparkpie").peity("pie", {
                height: 40,
                width: 40
            });


            // Draw Realtime Demo
            var drawValues = "12,20,15,13,28,15,17,23,10,5,2,0,1,3,2,8,4,9";
            var drawChart = function () {
                var random = Math.round(Math.random() * 10);
                var values = drawValues.split(",");
                values.shift();
                values.push(random);
                drawValues = values.join(",");

                tileRealtimeLine.text(values.join(",")).change();
                tileRealtimeLine2.text(values.join(",")).change();
                realtimeLine.text(values.join(",")).change();

                setTimeout(function () {
                    requestAnimationFrame(drawChart);
                }, 500);
            };

            drawChart();

            stagui.Events.onResize(function () {
                tileLine.change();
                line.change();
                tileBar.change();
                bar.change();
                tileRealtimeLine.change();
                tileRealtimeLine2.change();
                realtimeLine.change();
            });
        }
    };

    return stagui.Charts.init();

}(jQuery, document, window));