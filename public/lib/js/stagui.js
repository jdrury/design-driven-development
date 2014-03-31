(function ($, document, window) {

    var stagui;
    if (window.stagui) {
        stagui = window.stagui;
    }
    else {
        stagui = window.stagui = {};
    }

    // stagui }> . Version
    stagui.Version = "1.0.0";

    // stagui }> . Events / Hook
    stagui.Events = {

        // On Resize
        onResize: function (fn) {
            $(window).on("resize", function () {
                console.log("stagui }> . On Resize");
                fn();
            });
        },

        // Toggle Left Panel
        toggleLeftPanel: function (fn) {
            $(window).on("toggleLeftPanel", function () {
                console.log("stagui }> . Toggle Left Panel");
                fn();
            });
        },

        // Toggle Right Panel
        toggleRightPanel: function (fn) {
            $(window).on("toggleRightPanel", function () {
                console.log("stagui }> . Toggle Right Panel");
                fn();
            });
        }
    };

    // stagui }> . Core
    stagui.Core = {
        init: function () {
            this.$body = $("body");
            this.$wrapper = $(".layout-wrapper");
            this.renderVersion();
            this.renderLayout();
            this.activateNav();
            this.renderTopbarTitle();
            this.removeCssStates();
            this.animationFrame();
            this.scrollToTop();
        },

        // Remove :active, :hover, :focus - touch enabled devices
        removeCssStates: function () {
            if ('createTouch' in document) {
                try {
                    var pattern = /:hover|:active|:focus\b/,
                        sheet, rule, selectors, newSelector,
                        selectorAdded, newRule, i, j, k;

                    for (i = 0; i < document.styleSheets.length; i++) {
                        sheet = document.styleSheets[i];

                        for (j = sheet.cssRules.length - 1; j >= 0; j--) {
                            rule = sheet.cssRules[j];

                            if (rule.type !== CSSRule.STYLE_RULE || !pattern.test(rule.selectorText)) {
                                continue;
                            }

                            selectors = rule.selectorText.split(',');
                            newSelector = '';
                            selectorAdded = false;

                            // Iterate over the selectors and test them against the pattern
                            for (k = 0; k < selectors.length; k++) {
                                // Add string to the new selector if it didn't match
                                if (pattern.test(selectors[k])) {
                                    continue;
                                }

                                if (!selectorAdded) {
                                    newSelector += selectors[k];
                                    selectorAdded = true;
                                } else {
                                    newSelector += ", " + selectors[k];
                                }
                            }

                            // Remove the rule, and add the new one if we've got something
                            // added to the new selector
                            if (selectorAdded) {
                                newRule = rule.cssText.replace(/([^{]*)?/, newSelector + ' ');

                                sheet.deleteRule(j);
                                sheet.insertRule(newRule, j);
                            } else {
                                sheet.deleteRule(j);
                            }
                        }
                    }
                } catch (e) {
                }
            }
        },

        // Render Version
        renderVersion: function () {
            var $el = $(".stagui-version");
            $el.html(stagui.Version);
        },

        // Render layout features
        renderLayout: function () {
            var self = this;
            var $ltoggleBtn = $("#ltoggle-btn");
            var $rtoggleBtn = $("#rtoggle-btn");

            $ltoggleBtn.on("click", function (e) {
                //self.$wrapper.removeClass("layout-right-panel-toggle");
                self.$wrapper.toggleClass("layout-left-panel-toggle");
                $(window).trigger("toggleLeftPanel");
                $(window).trigger("resize");
                e.preventDefault(e);
            });

            $rtoggleBtn.on("click", function (e) {
                //self.$wrapper.removeClass("layout-left-panel-toggle");
                self.$wrapper.toggleClass("layout-right-panel-toggle");
                $(window).trigger("toggleRightPanel");
                $(window).trigger("resize");
                e.preventDefault(e);
            });

            /*
            stagui.Events.onResize(function () {
                self.$wrapper.removeClass("layout-right-panel-toggle");
                self.$wrapper.removeClass("layout-left-panel-toggle");
            });
            */
        },

        // Activate Navigation Links
        activateNav: function () {
            var path = window.location.pathname.split("/");
            var url = path[path.length - 1];
            if (!url) {
                url = "index.html";
            }
            var $sidebarNav = $(".sidebar-nav");
            var $sidebarLinks = $sidebarNav.find("a[href='" + url + "']");

            // Activation
            $sidebarLinks.parents("li").addClass("active");
            $sidebarLinks.parents("li").find("a.collapsed").removeClass("collapsed");
            $sidebarLinks.parents("ul").collapse("show");

            // Toggle
            $sidebarLinks.parents("ul").on("show.bs.collapse", function () {
                var $in = $sidebarNav.children("li").find("ul.collapse.in");
                $in.collapse("hide");
                $in.prev("a").addClass("collapsed");
            });
        },

        // Render Topbar Title
        renderTopbarTitle: function () {
            var pageTitle = $(".layout-header").find(".page-title").html();
            var $topbarTitle = $(".topbar-title");

            $topbarTitle.html(pageTitle);
            $topbarTitle.find("small, i, .fa").remove();
        },

        // Scroll To Top
        scrollToTop: function () {
            var $content = $(".layout-content");
            var $scrollTopBtn = $("#scroll-top");

            $scrollTopBtn.hide();

            $content.scroll(function () {
                if ($(this).scrollTop() > 100) {
                    $scrollTopBtn.fadeIn();
                } else {
                    $scrollTopBtn.fadeOut();
                }
            });

            $scrollTopBtn.click(function () {
                $content.animate({
                    scrollTop: 0
                }, 500);
                return false;
            });
        },

        // Request Animation Frame
        animationFrame: function () {
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                    || window[vendors[x] + 'CancelRequestAnimationFrame'];
            }

            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function (callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function () {
                            callback(currTime + timeToCall);
                        },
                        timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }

            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function (id) {
                    clearTimeout(id);
                };
            }
        }
    };

    stagui.Core.init();

}(jQuery, document, window));
