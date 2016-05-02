---
layout: post
title: mandelgrok
---

[mandelgrok](http://kdbanman.com/mandelgrok) is a visual exploration tool for the [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set).
But it isn't like any other.
Sure, it'll render the Mandelbrot set and you can zoom in.
But mandelgrok's purpose is to show you the sequences that actually determine each coordinate's membership within the Mandelbrot set:

*z<sub>n+1</sub> = z<sub>n</sub><sup>2</sup> + c* (where *z* and *c* are complex numbers)

You form a sequence by choosing a value for *c*, setting *z<sub>0</sub>* to zero, and computing the subsequent values of *z*.
Some of those sequences plotted below.  Each plot is for some value of *c* (I don't remember which),
and the y-axis is the distance from *c* to *z<sub>x</sub>*.

![Sequence 1](https://raw.githubusercontent.com/kdbanman/mandelgrok/gh-pages/sequence_pics/waves3.png)

![Sequence 2](https://raw.githubusercontent.com/kdbanman/mandelgrok/gh-pages/sequence_pics/crazy2.png)

![Sequence 3](https://raw.githubusercontent.com/kdbanman/mandelgrok/gh-pages/sequence_pics/actually_crazy.png)

![Sequence 4](https://raw.githubusercontent.com/kdbanman/mandelgrok/gh-pages/sequence_pics/mandel_mountains.png)

Pretty, right?
Mandelgrok started as an evening project to render those sequences - I had no idea what they might look like.
But after seeing those beautiful things, I needed to see more.
After the odd spare weekend, I have a tool that looks like this:

![Mandelgrok screencap](mandelgrok_screen.png)

Check it out right [here](http://kdbanman.com/mandelgrok)!

### Built with Vanilla JS

mandelgrok is all vanilla JavaScript.*  It's just a couple of .js files and one .html file.  I use three canvases and some CSS to make it look the way it does.  Check out the code on [mandelgrok's GitHub page](http://github.com/kdbanman/mandelgrok).


*Well, almost pure vanilla.  I used JQuery.
