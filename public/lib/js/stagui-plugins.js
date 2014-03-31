(function ($, document, window) {

    if (!window.stagui) {
        console.error("stagui }> . Missing Core");
        return false;
    }

    var stagui = window.stagui;

    stagui.Plugins = {

        init: function () {
            var self = this;
            this.fastClick();
            this.renderButtons();
            this.renderColorpicker();
            this.renderDatepicker();
            this.renderTimepicker();
            this.renderDaterangepicker();
            this.renderSpin();
            this.renderTooltip();
            this.renderPopover();
            this.renderSortable();
            this.renderSlider();
            this.renderSpinner();
            this.renderSyntaxHighlighter();
            this.renderNotifications();
            this.renderSelect2();
            this.renderCheckable();
            this.renderDatatables();
            this.renderHandsontable();
            this.renderWysiwyg();
            this.renderMarkdown();
            this.renderCodemirror();
            this.renderValidation();
            this.renderTypeahead();
            this.renderFullCalendar();
            this.renderMaps();

            // Re-render on resize
            stagui.Events.onResize(function () {
                self.renderSpin();
            });
        },

        // FastClick
        fastClick: function () {
            FastClick.attach(document.body);
        },

        // Blocker
        renderBlocker: function ($el) {
            if ($el.length > 0) {
                var spinOpts = {
                    lines: 11,
                    length: 0,
                    width: 5,
                    radius: 11,
                    corners: 1,
                    rotate: 0,
                    direction: 1,
                    color: '#000',
                    speed: 1.1,
                    trail: 100,
                    shadow: false,
                    hwaccel: true,
                    className: 'spinner',
                    zIndex: 2e9,
                    top: 'auto',
                    left: 'auto'
                };
                var blockerTmpl = '<div class="blocker"></div>';
                $el.addClass("relative");
                $el.append(blockerTmpl);
                var $blocker = $el.find(".blocker");

                var blockerSpinner = new Spinner(spinOpts).spin($blocker[0]);

                // Remove
                setTimeout(function () {
                    blockerSpinner.stop();
                    $blocker.fadeOut("500", function () {
                        $blocker.remove();
                        $el.removeClass("relative");
                    });
                }, 3500);
            }
        },

        // State Buttons
        renderButtons: function () {
            var self = this;
            var $tile = $(".tile");
            var $panel = $(".panel");

            // State Btn
            $('.state-btn').on("click", function () {
                var btn = $(this);
                btn.button('loading');
                setTimeout(function () {
                    btn.button('reset')
                }, 3500);
            });

            // Refresh Btn
            $panel.find(".btn-refresh").on("click", function () {
                var $self = $(this).parents(".panel");
                self.renderBlocker($self);
            });

            $tile.find(".btn-refresh").on("click", function () {
                var $self = $(this).parents(".tile");
                self.renderBlocker($self);
            });

            // Remove Btn
            $panel.find(".btn-remove").on("click", function () {
                var $self = $(this).parents(".panel");
                $self.fadeOut(500, function () {
                    $self.remove();
                });
            });

            $tile.find(".btn-remove").on("click", function () {
                var $self = $(this).parents(".tile");
                $self.fadeOut(500, function () {
                    $self.remove();
                });
            });

        },

        // Colorpicker
        renderColorpicker: function () {
            $(".colorpicker").spectrum({
                showInput: true,
                showInitial: true,
                showPalette: true,
                preferredFormat: "hex"
            });
        },

        // Datepicker
        renderDatepicker: function () {
            $(".datepicker").pickadate();

            $(".datepicker-select").pickadate({
                selectYears: true,
                selectMonths: true
            });

            $(".datepicker-disabled").pickadate({
                disable: [1, 4, 7]
            });
        },

        // Timepicker
        renderTimepicker: function () {
            $(".timepicker").pickatime();

            $(".timepicker-interval").pickatime({
                interval: 200
            });

            $(".timepicker-disabled").pickatime({
                disable: [
                    [0, 30],
                    [2, 0],
                    [8, 30],
                    [9, 0]
                ]
            });
        },

        // Daterangepicker
        renderDaterangepicker: function () {
            $(".daterange").daterangepicker({
                applyClass: 'btn-primary',
                cancelClass: 'btn-default'
            });

            $('.daterangetime').daterangepicker({
                timePicker: true,
                timePickerIncrement: 30,
                format: 'MM/DD/YYYY h:mm A',
                applyClass: 'btn-primary',
                cancelClass: 'btn-default'
            });

            $('.daterangewidget').daterangepicker(
                {
                    opens: "left",
                    startDate: moment().subtract('days', 29),
                    endDate: moment(),
                    minDate: '01/01/2012',
                    maxDate: '12/31/2014',
                    dateLimit: { days: 60 },
                    showDropdowns: true,
                    showWeekNumbers: true,
                    ranges: {
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                        'Last 7 Days': [moment().subtract('days', 6), moment()],
                        'Last 30 Days': [moment().subtract('days', 29), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                    },
                    buttonClasses: ['btn btn-default'],
                    applyClass: 'btn-primary',
                    format: 'MM/DD/YYYY',
                    separator: ' to '
                },
                function (start, end) {
                    $('.daterangewidget span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                }
            );
            $('.daterangewidget span').html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        },

        // Tooltip
        renderTooltip: function () {
            $(".tooltip-trigger").tooltip();
        },

        // Loader
        renderSpin: function () {
            var spinOpts = {
                lines: 11, // The number of lines to draw
                length: 0, // The length of each line
                width: 5, // The line thickness
                radius: 11, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1.1, // Rounds per second
                trail: 100, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: true, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px
            };

            $(".spin").each(function (i, v) {
                $(v).find(".spinner").remove();
                var spinner = new Spinner(spinOpts).spin($(v)[0]);
            });
        },

        // Popover
        renderPopover: function () {
            $(".popover-trigger").popover();
        },

        // Sortable
        renderSortable: function () {
            var $el = $(".sortable");

            $el.sortable({
                placeholder: "sortable-placeholder",
                connectWith: ".sortable",
                handle: ".sort-handle",
                dropOnEmpty: true,
                scroll: true,
                //revert: true,
                opacity: 0.7,
                tolerance: 'pointer',
                forcePlaceholderSize: true,
                update: function (event, ui) {
                    $(window).resize();
                }
            });

        },

        // Slider
        renderSlider: function () {
            $(".noui-slider-one").noUiSlider({
                range: [0, 250],
                start: 150,
                handles: 1,
                connect: "lower"
            });

            $(".noui-slider-range").noUiSlider({
                range: [0, 250],
                start: [50, 150],
                connect: true
            });

            $(".noui-slider-vertical").noUiSlider({
                range: [0, 250],
                start: 70,
                handles: 1,
                connect: "lower",
                orientation: "vertical"
            });

            $(".noui-slider-vertical-range").noUiSlider({
                range: [0, 250],
                start: [50, 150],
                connect: true,
                orientation: "vertical"
            });
        },

        // Spinner
        renderSpinner: function () {
            $('.input-spinner').spinedit({
                minimum: -10000,
                maximum: 10000,
                step: 100,
                value: 0,
                numberOfDecimals: 0
            });
        },

        // Syntax Highlighter
        renderSyntaxHighlighter: function () {
            SyntaxHighlighter.all();
        },

        // Notifications
        renderNotifications: function () {
            var options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "",
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

            var toastActive;

            $(".notification-trigger-top-left-default").on("click", function () {
                function showNotification() {
                    options.positionClass = toastActive;
                    toastr.options = options;
                    toastr.info('<h5><i class="fa fa-fw fa-coffee"></i> Top Left Default</h5> Cum ceteris in veneratione tui montes, nascetur mus.');
                }

                if (toastActive && toastActive !== "toast-top-left") {
                    toastr.clear();
                    toastActive = "toast-top-left";
                    setTimeout(showNotification, 500);
                }
                else if (!toastActive) {
                    toastActive = "toast-top-left";
                    showNotification();
                }
                else {
                    showNotification();
                }
            });

            $(".notification-trigger-top-right-default").on("click", function () {
                function showNotification() {
                    options.positionClass = toastActive;
                    toastr.options = options;
                    toastr.info('<h5><i class="fa fa-fw fa-coffee"></i> Top Right Default</h5> Cum ceteris in veneratione tui montes, nascetur mus.');
                }

                if (toastActive && toastActive !== "toast-top-right") {
                    toastr.clear();
                    toastActive = "toast-top-right";
                    setTimeout(showNotification, 500);
                }
                else if (!toastActive) {
                    toastActive = "toast-top-right";
                    showNotification();
                }
                else {
                    showNotification();
                }

            });

            $(".notification-trigger-bottom-left-default").on("click", function () {
                function showNotification() {
                    options.positionClass = toastActive;
                    toastr.options = options;
                    toastr.info('<h5><i class="fa fa-fw fa-coffee"></i> Bottom Left Default</h5> <p>Cum ceteris in veneratione tui montes, nascetur mus.</p>');
                }

                if (toastActive && toastActive !== "toast-bottom-left") {
                    toastr.clear();
                    toastActive = "toast-bottom-left";
                    setTimeout(showNotification, 500);
                }
                else if (!toastActive) {
                    toastActive = "toast-bottom-left";
                    showNotification();
                }
                else {
                    showNotification();
                }

            });

            $(".notification-trigger-bottom-right-default").on("click", function () {
                function showNotification() {
                    options.positionClass = toastActive;
                    toastr.options = options;
                    toastr.info('<h5><i class="fa fa-fw fa-coffee"></i> Bottom Right Default</h5> <p>Cum ceteris in veneratione tui montes, nascetur mus.</p>');
                }

                if (toastActive && toastActive !== "toast-bottom-right") {
                    toastr.clear();
                    toastActive = "toast-bottom-right";
                    setTimeout(showNotification, 500);
                }
                else if (!toastActive) {
                    toastActive = "toast-top-right";
                    showNotification();
                }
                else {
                    showNotification();
                }

            });

            $(".notification-trigger-top-full-default").on("click", function () {
                function showNotification() {
                    options.positionClass = toastActive;
                    toastr.options = options;
                    toastr.info('<h5><i class="fa fa-fw fa-coffee"></i> Top Full Default</h5> <p>Cum ceteris in veneratione tui montes, nascetur mus.</p>');
                }

                if (toastActive && toastActive !== "toast-top-full-width") {
                    toastr.clear();
                    toastActive = "toast-top-full-width";
                    setTimeout(showNotification, 500);
                }
                else if (!toastActive) {
                    toastActive = "toast-top-full-width";
                    showNotification();
                }
                else {
                    showNotification();
                }

            });

            $(".notification-trigger-bottom-full-default").on("click", function () {
                function showNotification() {
                    options.positionClass = toastActive;
                    toastr.options = options;
                    toastr.info('<h5><i class="fa fa-fw fa-coffee"></i> Bottom Full Default</h5> <p>Cum ceteris in veneratione tui montes, nascetur mus.</p>');
                }

                if (toastActive && toastActive !== "toast-bottom-full-width") {
                    toastr.clear();
                    toastActive = "toast-bottom-full-width";
                    setTimeout(showNotification, 500);
                }
                else if (!toastActive) {
                    toastActive = "toast-bottom-full-width";
                    showNotification();
                }
                else {
                    showNotification();
                }

            });

            $(".notification-trigger-top-right-success").on("click", function () {
                function showNotification() {
                    options.positionClass = toastActive;
                    toastr.options = options;
                    toastr.success('<h5><i class="fa fa-fw fa-check"></i> Top Right Success</h5> <p>Cum ceteris in veneratione tui montes, nascetur mus.</p>');
                }

                if (toastActive && toastActive !== "toast-top-right") {
                    toastr.clear();
                    toastActive = "toast-top-right";
                    setTimeout(showNotification, 500);
                }
                else if (!toastActive) {
                    toastActive = "toast-top-right";
                    showNotification();
                }
                else {
                    showNotification();
                }

            });

            $(".notification-trigger-top-right-warning").on("click", function () {
                function showNotification() {
                    options.positionClass = toastActive;
                    toastr.options = options;
                    toastr.warning('<h5><i class="fa fa-fw fa-warning"></i> Top Right Warning</h5> <p>Cum ceteris in veneratione tui montes, nascetur mus.</p>');
                }

                if (toastActive && toastActive !== "toast-top-right") {
                    toastr.clear();
                    toastActive = "toast-top-right";
                    setTimeout(showNotification, 500);
                }
                else if (!toastActive) {
                    toastActive = "toast-top-right";
                    showNotification();
                }
                else {
                    showNotification();
                }

            });

            $(".notification-trigger-top-right-danger").on("click", function () {
                function showNotification() {
                    options.positionClass = toastActive;
                    toastr.options = options;
                    toastr.error('<h5><i class="fa fa-fw fa-fire"></i> Top Right Warning</h5> <p>Cum ceteris in veneratione tui montes, nascetur mus.</p>');
                }

                if (toastActive && toastActive !== "toast-top-right") {
                    toastr.clear();
                    toastActive = "toast-top-right";
                    setTimeout(showNotification, 500);
                }
                else if (!toastActive) {
                    toastActive = "toast-top-right";
                    showNotification();
                }
                else {
                    showNotification();
                }

            });
        },

        // Select2
        renderSelect2: function () {
            $(".select2").select2({
                placeholder: "Select a state",
                allowClear: true
            });
        },

        // Checkboxes / Radios
        renderCheckable: function () {
            $(".checkable").each(function () {
                $(this).prettyCheckable();
            });
        },

        // Datatables
        renderDatatables: function () {
            $('.datatables').dataTable({
                "sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>r><'table-responsive't><'row'<'col-sm-6'i><'col-sm-6'p>>",
                "aLengthMenu": [
                    [10, 25, 50, 100, -1],
                    [10, 25, 50, 100, "All"]
                ],
                "iDisplayLength": 10,
                "oLanguage": {
                    "oPaginate": {
                        "sPrevious": "",
                        "sNext": ""
                    }
                }
            });
        },

        // Handsontable
        renderHandsontable: function () {
            function createSpreadsheetData(rowCount, colCount) {
                rowCount = typeof rowCount === 'number' ? rowCount : 100;
                colCount = typeof colCount === 'number' ? colCount : 4;
                var rows = [];
                for (var i = 0; i < rowCount; i++) {
                    var row = [];
                    for (var j = 0; j < colCount; j++) {
                        row.push(Handsontable.helper.spreadsheetColumnLabel(j) + i);
                    }
                    rows.push(row);
                }
                return rows;
            }

            var $el = $(".grid-editor");
            if ($el.length > 0) {
                $el.each(function (i) {
                    var data;
                    if (i === 0) {
                        data = createSpreadsheetData(10, 40);
                    }
                    else {
                        data = createSpreadsheetData(2, 40);
                    }

                    $(this).handsontable({
                        data: data,
                        rowHeaders: true,
                        colHeaders: true,
                        contextMenu: true
                    });
                });
            }
        },

        // Wysiwyg
        renderWysiwyg: function () {
            var $el = $(".wysiwyg-editor");
            if ($el.length > 0) {
                $el.summernote({
                    height: 300,
                    focus: true,
                    tabsize: 2
                });
            }
        },

        // Markdown
        renderMarkdown: function () {
            $(".markdown-editor").markdown({
                savable: true
            });
        },

        // Codemirror
        renderCodemirror: function () {
            var $el = $(".code-editor");

            if ($el.length > 0) {
                var editor = CodeMirror($el[0], {
                    mode: "javascript",
                    indentUnit: 4,
                    indentWithTabs: true,
                    enterMode: "keep",
                    tabMode: "shift",
                    lineNumbers: true,
                    styleActiveLine: true,
                    value: $("#code-value").html().trim(),
                    theme: "eclipse"
                });
            }
        },

        // Validate
        renderValidation: function () {
            var $el = $(".form-validate");

            $el.each(function () {
                var $form = $(this);
                $form.parsley({
                    successClass: 'form-group-success',
                    errorClass: 'form-group-danger',
                    errors: {
                        classHandler: function (el) {
                            return $(el).parents(".form-group");
                        },
                        container: function (el) {
                            // Switcher exception
                            var $el = $(el);
                            if ($el.parents(".has-switch").length > 0) {
                                return $el.parents(".has-switch").parent();
                            }
                        }
                    }
                });
                $form.find(".submit-validate").on("click", function () {
                    $form.parsley("validate");
                    return false;
                });
            });
        },

        // Typeahead
        renderTypeahead: function () {
            var $el = $("#typeahead");

            var repos;

            repos = new Bloodhound({
                datumTokenizer: function (d) {
                    return d.tokens;
                },
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                prefetch: '../data/typeahead.json'
            });

            repos.initialize();

            $el.typeahead(null, {
                name: 'repos',
                source: repos.ttAdapter(),
                templates: {
                    suggestion: Handlebars.compile([
                        '<p class="repo-description"><strong>{{name}}</strong> <small><em>{{ language }}</em></small> <br> {{description}}</p>'
                    ].join(''))
                }
            });
        },

        // Full Calendar
        renderFullCalendar: function () {
            var $el = $(".full-calendar");
            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            $el.fullCalendar({
                header: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'today month,agendaWeek,agendaDay'
                },
                editable: true,
                droppable: true,
                height: 600,
                events: [
                    {
                        title: 'All Day Event',
                        start: new Date(y, m, 1)
                    },
                    {
                        title: 'Info Long Event',
                        start: new Date(y, m, d - 5),
                        end: new Date(y, m, d - 2),
                        color: "#299ede"
                    },
                    {
                        title: 'Warning Event',
                        start: new Date(y, m, d - 3, 16, 0),
                        allDay: false,
                        color: "#f09b07"
                    },
                    {
                        title: 'Success Event',
                        start: new Date(y, m, d + 4, 16, 0),
                        allDay: false,
                        color: "#44b836"
                    },
                    {
                        title: 'Success Event',
                        start: new Date(y, m, d, 10, 30),
                        allDay: false,
                        color: "#44b836"
                    },
                    {
                        title: 'Primary Event',
                        start: new Date(y, m, d, 12, 0),
                        end: new Date(y, m, d, 14, 0),
                        allDay: false,
                        color: "#13508c"
                    },
                    {
                        title: 'Secondary Event',
                        start: new Date(y, m, d + 1, 19, 0),
                        end: new Date(y, m, d + 1, 22, 30),
                        allDay: false,
                        color: "#d22014"
                    },
                    {
                        title: 'Link Event',
                        start: new Date(y, m, 28),
                        end: new Date(y, m, 29),
                        url: '#',
                        color: "#"
                    }
                ],
                drop: function (date, allDay) {

                    var originalEventObject = $(this).data('eventObject');

                    var copiedEventObject = $.extend({}, originalEventObject);

                    copiedEventObject.start = date;
                    copiedEventObject.allDay = allDay;

                    $el.fullCalendar('renderEvent', copiedEventObject, true);

                }
            });
        },

        // Maps
        renderMaps: function () {
            var SFLatLng = new google.maps.LatLng(37.774, -122.419);

            // Base
            var $mapSimple = $("#map-simple");
            var mapSimple;

            function baseInit() {
                var mapOptions = {
                    zoom: 8,
                    center: SFLatLng
                };
                mapSimple = new google.maps.Map($mapSimple[0], mapOptions);
            }

            if ($mapSimple.length > 0) {
                google.maps.event.addDomListener(window, 'load', baseInit);
            }

            // Geolocation
            var $mapGeo = $("#map-geo");
            var mapGeo;

            function geoInit() {
                var mapOptions = {
                    zoom: 6
                };
                mapGeo = new google.maps.Map($mapGeo[0], mapOptions);

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var pos = new google.maps.LatLng(position.coords.latitude,
                            position.coords.longitude);

                        new google.maps.InfoWindow({
                            map: mapGeo,
                            position: pos,
                            content: 'You are here! - HTML5 Geolocation'
                        });

                        mapGeo.setCenter(pos);
                    }, function () {
                        handleNoGeolocation(true);
                    });
                } else {
                    handleNoGeolocation(false);
                }
            }

            function handleNoGeolocation(errorFlag) {
                if (errorFlag) {
                    var content = 'Error: The Geolocation service failed.';
                } else {
                    var content = 'Error: Your browser doesn\'t support geolocation.';
                }

                var options = {
                    map: mapGeo,
                    position: new google.maps.LatLng(60, 105),
                    content: content
                };

                new google.maps.InfoWindow(options);
                mapGeo.setCenter(options.position);
            }

            if ($mapGeo.length > 0) {
                google.maps.event.addDomListener(window, 'load', geoInit);
            }

            // Marker
            var $mapMarker = $("#map-marker");
            var marker;
            var mapMarker;

            function markerInit() {
                var mapOptions = {
                    zoom: 13,
                    center: SFLatLng
                };

                mapMarker = new google.maps.Map($mapMarker[0], mapOptions);

                marker = new google.maps.Marker({
                    map: mapMarker,
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    position: SFLatLng
                });
                google.maps.event.addListener(marker, 'click', toggleBounce);
            }

            function toggleBounce() {

                if (marker.getAnimation() != null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            }


            if ($mapMarker.length > 0) {
                google.maps.event.addDomListener(window, 'load', markerInit);
            }
        }
    };

    stagui.Plugins.init();

}(jQuery, document, window));
