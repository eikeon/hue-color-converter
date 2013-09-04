/*
 * Conversions for the sRGB color space.
 * See: http://en.wikipedia.org/wiki/Srgb
 */

module colorConverter
{
  export interface xyBri
  {
    x: number; // chromaticity coordinate
    y: number; // chromaticity coordinate
    bri: number; // luminance/brightness
  }

  export interface Rgb
  {
    r: number; // red
    g: number; // green
    b: number; // blue
  }

  export function xyBriToRgb(xyb : xyBri) : Rgb {

    // parameter validation
    if (0 > xyb.x || xyb.x > .8)
      throw 'x property must be between 0 and .8, but is: ' + xyb.x;
    if (0 > xyb.y || xyb.y > 1)
      throw 'y property must be between 0 and 1, but is: ' + xyb.y;
    if (0 > xyb.bri || xyb.bri > 1)
      throw 'bri property must be between 0 and 1, but is: ' + xyb.bri;

    // init
    var x = xyb.x;
    var y = xyb.y;
    var z = 1.0 - x - y;

    var Y = xyb.bri;
    var X = (Y / y) * x;
    var Z = (Y / y) * z;
    
    // Wide gamut D65 conversion
    var r = X  * 1.612 - Y * 0.203 - Z * 0.302;
    var g = -X * 0.509 + Y * 1.412 + Z * 0.066;
    var b = X  * 0.026 - Y * 0.072 + Z * 0.962;
    
    // Apply gamma correction
    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;

    var cap = x => Math.max(0, Math.min(1, x));
    
    return { r: cap(r), g: cap(g), b: cap(b) };
  }

  export function rgbToXyBri(rgb : Rgb) : xyBri {

    // parameter validation
    if (0 > rgb.r || rgb.r > 1
      || 0 > rgb.g || rgb.g > 1
      || 0 > rgb.b || rgb.b > 1)
      throw "r, g, and, b properties must be between 0 and 1";

    // init
    var red = rgb.r;
    var green = rgb.g;
    var blue = rgb.b;

    // Apply gamma correction
    var r = (red   > 0.04045) ? Math.pow((red   + 0.055) / (1.0 + 0.055), 2.4) : (red   / 12.92);
    var g = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
    var b = (blue  > 0.04045) ? Math.pow((blue  + 0.055) / (1.0 + 0.055), 2.4) : (blue  / 12.92);
    
    // Wide gamut conversion D65
    var X = r * 0.649926 + g * 0.103455 + b * 0.197109;
    var Y = r * 0.234327 + g * 0.743075 + b * 0.022598;
    var Z = r * 0.0000000 + g * 0.053077 + b * 1.035763;

    var cx = X / (X + Y + Z);
    var cy = Y / (X + Y + Z);
    
    if (isNaN(cx)) {
      cx = 0.0;
    }
    
    if (isNaN(cy)) {
      cy = 0.0;
    }

    return { x: cx, y: cy, bri: Y };
  }

  export function rgbToHexString(rgb : Rgb) : string {

    function f(x) {
      x = Math.round(x * 255);
      var s = '0' + x.toString(16);
      return s.substr(-2);
    }

    return f(rgb.r) + f(rgb.g) + f(rgb.b);
  }

  export function hexStringToRgb(s : string) : Rgb {
    return {
      r : parseInt(s.substring(0, 2), 16) / 255,
      g : parseInt(s.substring(2, 4), 16) / 255,
      b : parseInt(s.substring(4, 6), 16) / 255
    };
  }

  export function hexStringToXyBri(s : string) : xyBri {
    return rgbToXyBri(hexStringToRgb(s));
  }

  export interface Point
  {
    x: number;
    y: number;
  }

  interface Triangle
  {
    r: Point;
    g: Point;
    b: Point;
  }

  var hueBulbs = ['LCT001'];
  var livingColors = [
    'LLC006', // Bol
    'LLC007', // Aura
  ];

  function triangleForModel(model : string) : Triangle {
    if (hueBulbs.indexOf(model) > -1)
      // Hue bulbs color gamut triangle
      return {
          r: { x: .675,  y: .322 },
          g: { x: .4091, y: .518 },
          b: { x: .167,  y: .04 },
        };
    else if (livingColors.indexOf(model) > -1)
      // LivingColors color gamut triangle
      return {
          r: { x: .704,  y: .296 },
          g: { x: .2151, y: .7106 },
          b: { x: .138,  y: .08 },
        };
    else
      // Default construct triangle wich contains all values
      return {
          r: { x: 1, y: 0 },
          g: { x: 0, y: 1 },
          b: { x: 0, y: 0 },
        };
  }

  function crossProduct(p1 : Point, p2 : Point) : number {
    return (p1.x * p2.y - p1.y * p2.x);
  }

  function isPointInTriangle(p : Point, triangle : Triangle) : boolean {
    var red = triangle.r;
    var green = triangle.g;
    var blue = triangle.b;

    var v1 = { x: green.x - red.x, y: green.y - red.y };
    var v2 = { x: blue.x - red.x,  y: blue.y - red.y };

    var q = { x: p.x - red.x, y: p.y - red.y };

    var s = crossProduct(q, v2) / crossProduct(v1, v2);
    var t = crossProduct(v1, q) / crossProduct(v1, v2);

    return (s >= 0.0) && (t >= 0.0) && (s + t <= 1.0);
  }

  function closestPointOnLine(a : Point, b: Point, p : Point) : Point {
    var ap = { x: p.x - a.x, y: p.y - a.y };
    var ab = { x: b.x - a.x, y: b.y - a.y };
    var ab2 = ab.x * ab.x + ab.y * ab.y;
    var ap_ab = ap.x * ab.x + ap.y * ab.y;

    var t = ap_ab / ab2;
    t = Math.min(1, Math.max(0, t));

    return { x: a.x + ab.x * t, y: a.y + ab.y * t };
  }

  function distance(p1 : Point, p2: Point) : number {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    var dist = Math.sqrt(dx * dx + dy * dy);

    return dist;
  }

  export function xyForModel(xy : Point, model : string) : Point {
    var triangle = triangleForModel(model);
    if (isPointInTriangle(xy, triangle))
      return xy;

    var pAB = closestPointOnLine(triangle.r, triangle.g, xy);
    var pAC = closestPointOnLine(triangle.b, triangle.r, xy);
    var pBC = closestPointOnLine(triangle.g, triangle.b, xy);

    // Get the distances per point and see which point is closer to our Point.
    var dAB = distance(xy, pAB);
    var dAC = distance(xy, pAC);
    var dBC = distance(xy, pBC);

    var lowest = dAB;
    var closestPoint = pAB;

    if (dAC < lowest) {
      lowest = dAC;
      closestPoint = pAC;
    }
    if (dBC < lowest) {
      lowest = dBC;
      closestPoint = pBC;
    }

    return closestPoint;
  }

  export function xyBriForModel(xyb : xyBri, model : string) : xyBri {
    var xy = xyForModel(xyb, model);
    return { x: xy.x, y: xy.y, bri: xyb.bri };
  }
}
