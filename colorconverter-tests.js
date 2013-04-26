var colorConverter;
(function (colorConverter) {
    (function (tests) {
        var modelHueBulb = 'LCT001';
        function runTests() {
            hueColors();
        }
        tests.runTests = runTests;
        function hueColors() {
            var xyBri = colorConverter.rgbToXyBri({
                r: 1,
                g: 0,
                b: 0
            });
            xyBri = colorConverter.xyBriForModel(xyBri, modelHueBulb);
            assert(xyBri.bri > 0 && xyBri.bri <= 1, 'Brightness has invalid value');
            assert(Math.abs(xyBri.x - 0.675) < 0.0001, 'x has invalid value');
            assert(Math.abs(xyBri.y - 0.322) < 0.0001, 'y has invalid value');
            var rgb = colorConverter.xyBriToRgb(xyBri);
            assert(Math.abs(rgb.r - 0.8775) < 0.0001, 'Invalid red value');
            assert(Math.abs(rgb.g - 0.3152) < 0.0001, 'Invalid green value');
            assert(Math.abs(rgb.b - 0.0) < 0.0001, 'Invalid 1blue value');
            var xyBri = colorConverter.rgbToXyBri({
                r: 0,
                g: 1,
                b: 0
            });
            xyBri = colorConverter.xyBriForModel(xyBri, modelHueBulb);
            assert(xyBri.bri > 0 && xyBri.bri <= 1, 'Brightness has invalid value');
            assert(Math.abs(xyBri.x - 0.4091) < 0.0001, 'X has invalid value');
            assert(Math.abs(xyBri.y - 0.5180) < 0.0001, 'Y has invalid value');
            var rgb = colorConverter.xyBriToRgb(xyBri);
            assert(Math.abs(rgb.r - 0.8879) < 0.0001, 'Invalid red value');
            assert(Math.abs(rgb.g - 0.8847) < 0.0001, 'Invalid green value');
            assert(Math.abs(rgb.b - 0.2770) < 0.0001, 'Invalid 2blue value');
            var xyBri = colorConverter.rgbToXyBri({
                r: 0,
                g: 0,
                b: 1
            });
            xyBri = colorConverter.xyBriForModel(xyBri, modelHueBulb);
            assert(xyBri.bri > 0 && xyBri.bri <= 1, 'Brightness has invalid value');
            assert(Math.abs(xyBri.x - 0.167) < 0.0001, 'X has invalid value');
            assert(Math.abs(xyBri.y - 0.040) < 0.0001, 'Y has invalid value');
            var rgb = colorConverter.xyBriToRgb(xyBri);
            assert(Math.abs(rgb.r - 0.1132) < 0.0001, 'Invalid red value');
            assert(Math.abs(rgb.g - 0.1202) < 0.0001, 'Invalid green value');
            assert(Math.abs(rgb.b - 0.6885) < 0.0001, 'Invalid 3blue value');
            var xyBri = colorConverter.rgbToXyBri({
                r: 1,
                g: 1,
                b: 1
            });
            xyBri = colorConverter.xyBriForModel(xyBri, modelHueBulb);
            assert(xyBri.bri > 0 && xyBri.bri <= 1, 'Brightness has invalid value');
            assert(xyBri.x > 0 && xyBri.x <= 1, 'X has invalid value');
            assert(xyBri.y > 0 && xyBri.y <= 1, 'Y has invalid value');
        }
        function assert(p, s) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 2); _i++) {
                args[_i] = arguments[_i + 2];
            }
            if(!p && args.length) {
                args.unshift('Assertion failed');
                console.log.apply(console, args);
            }
            if(!p) {
                throw s;
            }
        }
    })(colorConverter.tests || (colorConverter.tests = {}));
    var tests = colorConverter.tests;
})(colorConverter || (colorConverter = {}));
