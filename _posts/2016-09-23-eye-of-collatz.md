---
layout: post
title: eye of collatz
---

The [Eye of Collatz](https://www.youtube.com/watch?v=sGi9pE2xP40) is a simple video visualizing the [Collatz conjecture](https://en.wikipedia.org/wiki/Collatz_conjecture).
The first thirty seconds might seem a little slow and it might not be clear what's going on, so feel free to click on the annotation that takes you to the exciting part.
Technically, each pixel in the video matters to the visualization, so I recommend high quality settings on full screen:

<iframe width="560" height="315" src="https://www.youtube.com/embed/sGi9pE2xP40" frameborder="0" allowfullscreen></iframe>

There.  Depending on how long you watched, you've now seen somewhere between zero and 180 000 of the [hailstone sequences](http://mathworld.wolfram.com/HailstoneNumber.html) that Collatz conjectured about.
Hopefully it was pretty to watch, because at this point you probably don't understand what that red swirly square has to do with Collatz.

If I were a better animator then the video might've explained itself, but instead I'll do that here.
Before that, though, try zooming waaay in on this raw frame image, especially where the square is only partially filled in:

<script src="//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<script src="/public/js/jquery.panzoom.min.js"></script>

<div class="panzoom-container">
  <img class="panzoom" src="/public/img/coll.png" />
</div>
<script>
var onMouseWheel = function( e ) {
  console.log("mouse wheel " + e);
  e.preventDefault();
  var delta = e.delta || e.originalEvent.wheelDelta;
  var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
  $panzoom.panzoom('zoom', zoomOut, {
    increment: 0.3,
    animate: true,
    minScale: 1.1,
    maxScale: 30,
    contain: 'invert',
    focal: e
  });
}
(function() {
  var $panzoom = $('.panzoom').panzoom();
  $panzoom.parent().on('mousewheel.focal', function (e) { onMouseWheel.call(this, e); });
  $panzoom.parent().on('DOMMouseScroll', function (e) { onMouseWheel.call(this, e); });
})();
</script>

Notice that the pattern is quite intricate at the pixel level.
All of that pattern is completely mathematically determined, which I find fascinating.
Now on to the understanding the math and how it produces the Eye of Collatz, if you care.

#### The Sequences

First you should understand the actual sequences being visualized.
The sequences are called hailstone sequences, and there are a ton of visualizations and descriptions of hailstone sequences out there if you want to go deeper.

A hailstone sequence starts with a number greater than two.  If that first number is even, then the next number in the sequence is smaller.  But if the first number is odd, then the next number is larger.  Every number in the sequence follows this formula:

*h<sub>n+1</sub> = h<sub>n</sub> / 2* if *h<sub>n</sub>* is even

*h<sub>n+1</sub> = 3 * h<sub>n</sub> + 1* if *h<sub>n</sub>* is odd

For instance:

- *2* is even, so the next number is *1* because *2 / 2 = 1*.
- *3* is odd, so the next number is *10* because *3 * 3 + 1 = 10*.
- *4* is even, so the next number is *2* because *4 / 2 = 2*.
- *213* is odd, so the next number is *640* because *3 * 213 + 1 = 640*.

The next numbers have the same formula applied, and you end up with sequences!
Here are the first few hailstone sequences.
You might notice something about the last number in each sequence...

```text
{ 2, 1 }
{ 3, 10, 5, 16, 8, 4, 2, 1 }
{ 4, 2, 1 }
{ 5, 16, 8, 4, 2, 1 }
{ 6, 3, 10, 5, 16, 8, 4, 2, 1 }
{ 7, 22, 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1 }
{ 8, 4, 2, 1 }
```

And so on forever and ever.
In any given sequence, the numbers can go up and down lots of times (just like hailstones in a cloud, hence the name).
Also, the sequences can be long or short - the hailstone sequence starting with *32* is 6 elements long, but one starting with *27* is 112 elements long.

Despite those differences, notice that the sequences overlap.
They all end with

```text
{ 2, 1 }
```

Three of them end with

```text
{ 10, 5, 16, 8, 4, 2, 1 }
```

And if the yet-unproven Collatz conjecture is true, then all Hailstone sequences eventually terminate at *1*.
That is, any start number will eventually lead to *1* by following the same formula.

For the Eye of Collatz, each number from *1* to *180 000* is plotted, but not in the normal *1, 2, 3...* order.  Instead, each number is plotted in the order it occurs in the sequences above.
From top-left to bottom-right, and with repeated numbers ignored, that looks like this:

```text
{ 2, 1, 3, 10, 5, 16, 8, 4, 6, 7, 22, 11, 34, 17, 52, 26, 13, 40, 20, 8, ... }
```

But how does that list of numbers end up in the video?
Each pixel in the video corresponds to a number, and in each frame, more numbers (pixels) are drawn over the black background.

#### The Pixel Grid

I mentioned that each pixel in the video corresponds to a number.
The number-to-pixel correspondence is probably the easiest thing to understand in this post - it's just a square spiral.
1 is dead center, and the numbers spiral out from there like this:

![Square spiral grid.](/public/200px_square_spiral.png)

I think the spiral in the video may be rotated 90 degrees compared to that picture.
You might notice that the spiral is exactly the same grid as from the [Ulam spiral of prime numbers](https://en.wikipedia.org/wiki/Ulam_spiral).

#### The Colors

When a number is plotted on the grid, a smaller starting number means a darker color.
For example, the pixels for the numbers *3*, *10*, *8*, *4* have a dark color because they are first plotted from the starting number *3*.
However, the numbers *7*, *22*, *11*, and *34* have a brighter color because they are first plotted from the starting number *7*.

#### Whew.

After all that, here's another picture.

<img class="panzoom" src="/public/img/coll_zoom.png" />

Notice the bright and dark diagonals?
And all the little  light and dark pockets?
How about all the different shapes like crosses and tetris pieces, or how there are vertical lines on the top, but the horizontal lines on the left?
And on a larger scale, notice that there is a lot of pattern and self-similarity in all sorts of ways all across the image, but no two parts seem to be perfectly identical.
All very interesting, considering this is emergent from two simple formulae and a single if-else condition.

My favorite pattern is the dark "valleys" along the main diagonals of the square.
I have no explanation for it, so further experimentation is necessary.
Stay tuned.

#### Built with Processing

The Eye of Collatz' frames were lovingly rendered with Processing.  It's pretty awful code, if I recall.  (This post came years after the video was made.)  After Processing did its thing, the frames were compiled into a video with some arcane set of options passed to ffmpeg.  Check out the code on [the GitHub page](http://github.com/kdbanman/collzakk) if you dare.
