(function ($, document, window) {

    if (!window.stagui) {
        console.error("stagui }> . Missing Core");
        return false;
    }

    var stagui = window.stagui;

    stagui.Analytics = {

        init: function () {
            this.analyticsID = "UA-48106536-1";
            this.analyticsDomain = "stagui.com";
            this.tracking();
        },

        // Tracking
        tracking: function () {
            var self = this;

            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            ga('create', self.analyticsID, self.analyticsDomain);
            ga('send', 'pageview');

        }
    };

    stagui.Analytics.init();

}(jQuery, document, window));
