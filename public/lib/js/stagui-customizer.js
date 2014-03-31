(function ($, document, window) {

    if (!window.stagui) {
        console.error("stagui }> . Missing Core");
        return false;
    }

    var stagui = window.stagui;

    stagui.Customizer = {
        init: function () {
            this.$body = $("body");
            this.$customizer = $("#customizer");
            this.$resetBtn = $("#customizer-reset");
            this.$themeBlock = $(".customizer-theme-block");
            this.$themeStyle = $(".customizer-theme-style");
            this.$themeBorders = $(".customizer-border-radius");
            this.$themePreset = $(".customizer-theme-preset");
            this.theme = {};
            this.spinOpts = {
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

            this.renderCustomizer();
            this.renderPreset();

            // Customizer expiration (1hour)
            var hour = 60 * 60 * 1000;
            var now = new Date().getTime();
            var timeStamp = localStorage.getItem("stagui-timestamp");
            if (timeStamp) {
                if (now - parseInt(timeStamp) > hour) {
                    localStorage.removeItem("stagui-css");
                    localStorage.removeItem("stagui-theme");
                    localStorage.removeItem("stagui-timestamp");
                }
            }

            this.getTheme();
        },

        // Render Preset
        renderPreset: function () {
            var self = this;

            // Presets Colors
            $.each(self.$themePreset, function (i, theme) {
                var $theme = $(theme);
                var c1 = $theme.data("c1");
                var c2 = $theme.data("c2");
                $theme.find(".primary-color").css("background", c1);
                $theme.find(".secondary-color").css("background", c2);
            });

            // Controls
            self.$themePreset.on("click", function () {
                var $el = $(this);

                self.theme["c1"] = $el.data("c1");
                self.theme["c2"] = $el.data("c2");

                self.$themeBorders.find("div").removeClass("active");
                self.$themeStyle.find("div").removeClass("active");
                self.postTheme();
            });
        },

        // Render Customizer
        renderCustomizer: function () {
            var self = this;

            // Controls
            self.$themeStyle.on("click", function () {
                self.$themeStyle.find("div").removeClass("active");
                $(this).find("div").addClass("active");
                self.theme["theme-style"] = $(this).find("div").data("theme-style");
                self.postTheme();
            });

            self.$themeBorders.on("click", function () {
                self.$themeBorders.find("div").removeClass("active");
                $(this).find("div").addClass("active");
                self.theme["border-radius"] = $(this).find("div").data("border-radius");
                self.postTheme();
            });

            self.$themeBlock.on("click", function () {
                $(this).find("input").focus();
            });

            self.$themeBlock.find("input").on("change", function () {
                self.theme[$(this).attr("id")] = $(this).val();
                self.postTheme();
            });

            self.$resetBtn.on("click", function () {
                self.$themeStyle.find("div").removeClass("active");
                self.$themeBorders.find("div").removeClass("active");
                localStorage.removeItem("stagui-css");
                localStorage.removeItem("stagui-theme");
                localStorage.removeItem("stagui-timestamp");
                self.getTheme("reset");
            });
        },

        // Get Theme
        getTheme: function (reset) {
            var self = this;

            if (localStorage.getItem("stagui-theme") && localStorage.getItem("stagui-css")) {
                self.theme = $.parseJSON(localStorage.getItem("stagui-theme"));
                self.spinOpts.color = self.theme["c2-inverse"];
                self.renderTheme(localStorage.getItem("stagui-css"));
            }
            else {
                $.ajax({
                    url: "/customizer"
                })
                    .success(function (theme) {
                        self.theme = theme;
                        self.spinOpts.color = self.theme["c2-inverse"];
                        if (!reset) {
                            self.renderTheme();
                        }
                        else {
                            self.postTheme(reset);
                        }
                    })
                    .error(function () {
                        self.$customizer.remove();
                        self.$resetBtn.remove();
                        console.error("stagui }> . Customizer is not running");
                        $("body").addClass("visible");
                    });
            }
        },
        // Render Theme
        renderTheme: function (css) {
            var self = this;

            // Render Customizer Theme
            $.each(self.$themeBlock, function (i, block) {
                var $el = $(block);
                if ($el.hasClass("customizer-theme-style")) {
                    var themeStyleBlock = $el.find("div");
                    if (themeStyleBlock.attr("data-theme-style") === self.theme["theme-style"]) {
                        themeStyleBlock.addClass("active");
                    }
                }
                else if ($el.hasClass("customizer-border-radius")) {
                    var borderRadius = $el.find("div");
                    if (borderRadius.attr("data-border-radius") === self.theme["border-radius"]) {
                        borderRadius.addClass("active");
                    }
                }
                else {
                    var input = $el.find("input");
                    var hexCode = $el.find(".hex-code");
                    input.val(self.theme[input.attr("id")]);
                    hexCode.text(self.theme[input.attr("id")]);
                }
            });

            // Append CSS
            if (css) {
                var $head = $("head");
                var $customThemeStyle = $("#custom-theme");
                $customThemeStyle.remove();
                $head.append("<style id='custom-theme'>" + css + "</style>");
                stagui.Core.removeCssStates();
            }

            $("body").addClass("visible");

            // Colorpicker
            $(".customizer-colorpicker").spectrum({
                showInput: true,
                preferredFormat: "hex",
                showInitial: true,
                change: function (color) {
                    $(this).prev("label").find(".hex-code").text(color.toHexString());
                }
            });
        },

        // Post Theme
        postTheme: function (reset) {
            var self = this;

            var $customizerBody = self.$customizer.find(".customizer-body");
            $customizerBody.fadeOut(100);
            self.$customizer.addClass("customizer-toggle");
            var spinner = new Spinner(self.spinOpts).spin(self.$customizer[0]);
            self.spinOpts.color = self.theme["c2-inverse"];

            $.ajax({
                type: "POST",
                url: "/customizer",
                data: self.theme
            }).success(function (css) {
                    if (!reset) {
                        var timeStamp = new Date().getTime();
                        localStorage.setItem("stagui-css", css);
                        localStorage.setItem("stagui-theme", JSON.stringify(self.theme));
                        localStorage.setItem("stagui-timestamp", JSON.stringify(timeStamp));
                    }
                    self.renderTheme(css);
                    self.$customizer.removeClass("customizer-toggle");
                    $customizerBody.fadeIn(100);
                    spinner.stop();
                }).error(function (err) {
                    self.$customizer.remove();
                    self.$resetBtn.remove();
                    console.error("stagui }> . Customizer is not running");
                });
        }

    };

    return stagui.Customizer.init();

}(jQuery, document, window));
