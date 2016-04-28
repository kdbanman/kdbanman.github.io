---
layout: post
title: mandelgrok
---

[mandelgrok](http://kdbanman.com/mandelgrok) is a visual exploration tool for the [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set).  But it isn't like any other.  Sure, it'll render the Mandelbrot set and you can zoom in.  But mandelgrok's purpose is to show you the sequences that actually determine each coordinate's membership within the Mandelbrot set:

*z<sub>n+1</sub> = z<sub>n</sub><sup>2</sup> + c* (where *z* and *c* are complex numbers)

Check it out right [here](http://kdbanman.com/mandelgrok)!

### Built with Vanilla JS

mandelgrok is all vanilla JavaScript.*  It's just a couple of .js files and one .html file.  I use three canvases and some CSS to make it look the way it does.  Check out the code on [mandelgrok's GitHub page](http://github.com/kdbanman/mandelgrok).


*Well, almost pure vanilla.  I used JQuery.
