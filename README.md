# Sense Boxplot

The boxplot is a great way to visualize arrays of data values. Here's a good explanation of it from [Wikipedia].

### Data
The way the data is brought in is only a *tiny bit* unusual. We want all of the numeric values with NO AGGREGATION so you actually want to add 2 dimensions - first dimension is the actual dimension (in the example provided it's a Quarter, so Q1, Q2, etc). Second dimension is the set of numeric values you want the chart to crunch on, in the example provided it's Revenue.

In order to be able to replicate exactly what Bostock did and see they match, I am ingesting his sample CSV in the app provided; However, because his csv is pivoted, I used a crosstable function in the loadscript to unpivot and get the data in a way we normally consume it.

### Version
1.0

### Original Source
This was adapted from Mike Bostock's D3 Boxplot [here]

### Todo's

 - Get some animated transitions going

License
----

MIT

[Wikipedia]:http://en.wikipedia.org/wiki/Box_plot
[here]:http://bl.ocks.org/jensgrubert/7789216
