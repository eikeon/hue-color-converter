Hue color converter
===================

Hue bulbs recieve colors in two parts: `brightness` is set explicitly, and colors are set using `xy` coordinates.  
See Wikipedia for more details about [sRGB color space](https://en.wikipedia.org/wiki/SRGB).

This library can convert RGB colors to `xyBri` objects, which have `x` and `y` properties for color coordinates and a `bri` property for brightness.

    var color = colorConverter.rgbToXyBri({r: 0.768, g: 0.819, b: 0.502 }});

A convenience function `hexStringToXyBri` can be used to convert an HTML color to `xyBri` objects.

Note however that not all colors can be represented by every type of lamp.
To make sure a color can be shown by a particular lamp, use the `xyBriForModel` function.

    var xyb = colorConverter.hexStringToXyBri('C4D180');
    var color = colorConverter.xyBriForModel(xyb, 'LCT001');

    myApi.sendToLamp({
      'on': true,
      'bri': color.bri,
      'xy': [ color.x, color.y ]
    });


Models
------

These models of lamps are known in this library:

  * `LCT001`: Hue bulb 2012
  * `LLC006`: LivingColors Bol
  * `LLC007`: LivingColors Aura


TypeScript
----------

This library is written in [TypeScript](http://www.typescriptlang.org/), a typed superset of JavaScript. To install TypeScript and compile this library, run this:

    npm install -g typescript
    tsc colorspace.ts

