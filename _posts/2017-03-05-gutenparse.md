---
layout: post
title: gutenparse and LabGub
---

The gutenparse project is a little python project written to prune and balance a dataset of public domain books from Project Gutenberg.
Check out [the GitHub repo](https://github.com/kdbanman/gutenparse) to see how it works.
This post is the story of how I used that project to create the Labelled and Balanced Gutenberg Bookset, or LabGub for short.

# Story

I have a few goals for the LabGub data:

- Fully labelled

   Each book in the dataset must be labelled for exploitation with supervised learning.

- Balanced

   Each label of interest must be evenly represented throughout the data.
   There are many interesting techniques to deal with imbalance in datasets, and dealing with minor imbalance is not at all difficult.
   However, I would like this dataset to be _very_ easy to pick up and use, so users shouldn't need to peer into LabGub's statistics to choose a batch sampling method.
   Naive uniform sampling must be sufficient.

- Big

   There should be as much text and as many books as possible in the dataset.
   The range of labels in the dataset should be as plentiful as possible as well.
   This goal is subordinate to the first two, however.

There are two steps to making this dataset: pruning and balancing.
Read on if you're interested in how they happened.

## Pruning

Any dataset pulled from the real world, when viewed through the lens of a particular project or goal, has plenty of missing labels and unnecessary or unexpected information.
This one is no stranger!
So let's start cleaning it up.
(One project's trash is another project's treasure, so if you want the dataset backup from any step in this process, shoot me an email.)

### Starting Point

I started off with a big ol' dump of books from Project Gutenberg's FTP endpoints.
It's just a big, flat directory with a directory for each book, and (hopefully) two files per book directory.
One RDF metadata file, and one UTF-8 file containing the actual book text.

```
txt_and_rdf/
    ├── 9043/
    │   ├── pg9043.rdf
    │   └── pg9043.txt.utf8
    ├── 9044/
    │   ├── pg9044.rdf
    │   └── pg9044.txt.utf8
    ├── 9045/
    │   ├── pg9045.rdf
    │   └── pg9045.txt.utf8
    ├── 9046/
    │   ├── pg9046.rdf
    │   └── pg9046.txt.utf8
    ├── 9047/
    |   ├── pg9047.rdf
    |   └── pg9047.txt.utf8
    ...
```

The first thing I did is remove all files except those RDF and UTF-8 files, then remove the empty directories, and then remove the directories with only one file.
Of course I didn't record how much data I was deleting in this process, or the bash pipe soup that actually did the magic, but the audit trail starts now!
This is now my starting point, with 39807 books totalling 15 gigabytes of text and metadata:

```
$ ls txt_and_rdf | wc -l
39807
```

```
$ du -hs txt_and_rdf
15G     txt_and_rdf
```

Now I'll prune and measure iteratively until I have a well-balanced dataset that's (hopefully) still pretty big.

### English Only

I would _like_ to make this dataset multilingual, but the overwhelming majority of books in the starting set are English.
So, in order to have a balanced representation of the most common languages, I'd need to remove almost all of the English books.
A core priority of this project is dataset size, so I'll just remove all books that aren't English.
Specifically, I'll remove any book where English does not appear as any of the languages.

```
$ python remove_non_english.py txt_and_rdf/*/*.rdf
Processing 39807 meta files...

Removing FR /home/ec2-user/data/big_drive/prunes/txt_and_rdf/10053
Removing LA /home/ec2-user/data/big_drive/prunes/txt_and_rdf/10054
Removing DE /home/ec2-user/data/big_drive/prunes/txt_and_rdf/10055
...

Non-English languages encountered during removal:
FR (1801)
FI (1561)
DE (992)
NL (648)
PT (520)
ES (405)
IT (308)
SV (130)
...

Removed 6577 books.
```

To see the omitted output of that command, see [this log file]({{ site.url }}/public/raw/english_only_log.txt).
You might notice ~6000 lines down that the script found a book with more than one title.
That's surprising, but whatever.
Data is just weird sometimes.
We'll have a look at what that is at the end if it's still hanging around after more pruning steps.

At the end of that pruning step, we lost 6577 books.
Let's back that directory up and measure it.

```
$ mv txt_and_rdf english_only                 # the directory is no longer best described as text and rdf
$ tar -czf english_only.tar.gz english_only   # compressing it in case we need it later is a good idea
$ chmod -w english_only.tar.gz                # let's remove write permissions so we don't wreck it
$ du -hs english_only
13G     english_only
$ ls english_only | wc -l
33230
```

We only lost 2 gigabytes and we still have tens of thousands of books.
Neat!

### No Unknowns

Next we'll remove any book that's missing metadata we're interested in.
It would be cool to exploit the unlabelled data with some unsupervised pretraining or something, but that's not what I have in mind for this dataset.
For now, let's just drop all the unlabelled data.

Specifically, books will be removed if they aren't labelled with a title, author, author birth year, language, or Library of Congress Classification.
(LCC, which is just a fancy acronym for subject.)
_Technically_, books with unknown languages are already gone from the previous step.
A smarter person might've done this in a different order, but onward and upward!

```
$ python remove_unknowns.py english_only/*/*.rdf
Processing 33230 meta files...

Removing /home/ec2-user/data/big_drive/prunes/english_only/10000 for:
['author']

Removing /home/ec2-user/data/big_drive/prunes/english_only/10001 for:
['author']

Removing /home/ec2-user/data/big_drive/prunes/english_only/1000 for:
['author', 'lcc']

...

Unknowns encountered during removal:
author (9049)
lcc (1838)
title (1)

Removed 9992 books.
```

Again, check out the omitted output in [the log file]({{ site.url }}/public/raw/labelled_english_only_log.txt).
Looks like our friend with more than one title made it passed the language pruning - he shows up around 28K lines down the log.

We lost 9992 books this time.
Let's back up and measure again.

```
$ mv english_only labelled_english_only
$ tar -czf labelled_english_only.tar.gz labelled_english_only
$ chmod -w labelled_english_only.tar.gz
$ du -hs labelled_english_only
9.0G    labelled_english_only
$ ls labelled_english_only | wc -l
23238
```

It might seem silly to throw away so much data because of missing author birth dates or LCC subjects, but pre-pruned datasets are being saved so feel free to request them and prune them to your own liking!
I think a fully labelled dataset with over twenty thousand books totalling gigabytes in size is still really cool!

### Single Authors

Now I'll purge any books that have more than one author.
I feel like I'm saying this a lot, but this might seem silly.
Why not keep those books around?
Especially considering many single author books in the dataset might be missing an author?

There are a couple of reasons.
First, the models I plan on training are simpler with single authors.
And given a book with two or more authors, I cannot bring myself to _choose_ which of the authors to keep.
Even if I remove statistical bias and choose randomly, it feels like a personal and academic affront to prefer one author to another.
Second, there's really only one reason and you already read it.
We probably won't lose that many books anyways.

```
$ python remove_multiple_authors.py labelled_english_only/*/*.rdf
Processing 23238 meta files...

Removing /home/ec2-user/data/big_drive/prunes/labelled_english_only/10008 for authors White, Stewart Edward -- Adams, Samuel Hopkins
Removing /home/ec2-user/data/big_drive/prunes/labelled_english_only/10042 for authors Smith, Henrietta Brown -- Murray, E. R. (Elsie Riach)
Removing /home/ec2-user/data/big_drive/prunes/labelled_english_only/10056 for authors Mencius -- Confucius
...

Removed 667 books.
```

Peek at [the log file]({{ site.url }}/public/raw/single_author_labelled_english_only_log.txt) if you wish.
You might notice an error message - "No handlers could be found for logger "rdflib.term".
I'm not _exactly_ sure where that's coming from, but we'll dig in later if it becomes a problem.
Also, notice that the book with multiple titles is gone now!

Some pretty heavy hitting authors got removed!
George Washington, William Shakespeare, Voltaire, David Hume, Karl Marx, John Quincy Adams, Charles Dickens, Theodore Roosevelt, Confucius...
Now I feel a bit of remorse for removing these books.
Hopefully those authors are represented in the books written by single authors, because it would be a shame for any model trained on this data to be devoid of their influence!

Oh well!
Let's back up and measure our last pruning step.

```
$ mv labelled_english_only single_author_labelled_english_only
$ tar -czf single_author_labelled_english_only.tar.gz single_author_labelled_english_only
$ chmod -r single_author_labelled_english_only.tar.gz
$ du -hs single_author_labelled_english_only
8.7G    single_author_labelled_english_only
$ ls single_author_labelled_english_only | wc -l
22571
```

Barely lost anything!
That's it for pruning, so let's name the directory appropriately.

```
$ mv single_author_labelled_english_only pruned
```

Now we'll move on to balancing.

## Balancing

Here I'll make sure the labels that I care about are represented evenly in the dataset.
The labels I care about are author birth year and LCC subject
You'll see why I care about them in a future post, but for now, let's measure the labels in the unbalanced dataset we just made.

### Preliminary Measurement

Now that the dataset is fully labelled, let's see what we have.

```
$ python aggregate_stats.py single_author_labelled_english_only/*/*.rdf
Processing 22571 meta files...

pruned/10002/pg10002.rdf
TITLE:    The House on the Borderland
AUTHOR:   (1877) Hodgson, William Hope
LANGUAGES:     en
----
LCC SUBJECT:      PR
----
LCSH SUBJECT:  Science fiction


pruned/10003/pg10003.rdf
TITLE:    My First Years as a Frenchwoman, 1876-1879
AUTHOR:   (1833) Waddington, Mary King
LANGUAGES:     en
...

ALL LCC SUBJECTS:
PS (5137)
PR (4633)
PZ (2959)
...

ALL AUTHOR BIRTH YEARS:
1862 (555)
1863 (499)
1866 (459)
...

ALL LANGUAGES:
en (22571)
es (10)
fr (9)
...
```

See the omitted output with each book and some aggregate statistics in [its output log]({{ site.url }}/public/raw/pruned_stats_log.txt).
There is also [a CSV file]({{ site.url }}/public/raw/pruned_stats.csv) with all the books and labels that we can do some easy analysis with nice tools.

First, let's see how many books we have across all of the author birth years.

<svg width="700" height="400" class="birth_year_histogram"></svg>
<link rel="stylesheet" type="text/css" href="/public/css/gutenparse.css">
<script type="text/javascript" src="https://d3js.org/d3.v4.min.js"></script>
<script type="text/javascript" src="/public/js/birth_year_histogram.js"></script>

Seems we have quite the concentration of authors born in the 1800s!
(Anyone want to guess when the Gutenberg printing press emerged?)
Let's toss that histogram on a log scale so we can see the lower frequency data, and lets break it down into many more buckets.

<svg width="700" height="400" class="birth_year_log_histogram"></svg>
<script type="text/javascript" src="/public/js/birth_year_log_histogram.js"></script>

The buckets with a count of zero or one don't show up at all on the log scale graph, but it's still a helpful view.
I'm quite surprised that we have dozens of books over 2000 years old.
Neat!

Of course, counting the books isn't the only way to measure, because the books have different sizes.
Here's a plot of the total amount of text across all books in the same histogram buckets.  We'll also only look at years beyond 1500, because it's very obvious that a balanced representation of years prior will not be possible with what's available.

<svg width="700" height="400" class="bytes_by_birth_year"></svg>
<script type="text/javascript" src="/public/js/bytes_by_birth_year.js"></script>

- bar chart count of alphabetical LCC
- bar chart count of only first LCC letter
- lcc subject vs birth year.  correlation?

### Birth Year Balancing

TODO

For the particular LabGub dataset that we're building, though, I'm pretty sure that very old stuff is going to disappear.
The goal here is balanced representation across a range of years in order keep training on this dataset as accessible as possible.
The ideal balance would be a completely uniform distribution over a range of years that is as countinuous as possible.
In other words, we need to construct a rectangle that rises from the horizontal axis and is circumscribed by our data's distribution, and fill it with a subset of our data.

There are many such rectangles, but maximizing the number of books we keep means we need to maximize the area of the rectangle.
It's pretty obvious from the histograms that we won't be using any books written by authors born before 1500, so let's prune away everything but that slice.

```
$ python remove_pre_1500.py pruned_stats.csv
TODO
```

Notice I've switched to using the CSV file to cycle through the books.
It's _much_ faster than reading, parsing, and querying an RDF graph file for each book.
As usual, I've posted [the removal log]({{ site.url }}/public/raw/post_1500_pruned_log.txt) for the curious.

For the histogram, we'll use a linear scale for the histogram again so that our intuitive sense of area is useful here.

- histogram of year of post_1500_prune


### LCC Subject Balancing

TODO

## Surgery By Hand

My code is imperfect, and so are my assumptions, so there are a couple of stragglers to hunt down.
We'll look close at these anomalies and understand why they threw me off.

TODO:
- multiple title book
- No handlers could be found for logger "rdflib.term"
- 900/pg900.txt.utf8:
   ```
   <u+feff>
   attention:

   the xml file included in this set has the following warning about the folio file (900-n.nfo):

   do not download !!! see #892 for html format, #733 for plain text.
   the folio format is obsolete. you won't be able to display the file.

   if you are tempted to try and download it anyway, you may expect your computer to crash!

   these files are being retained in the project gutenberg collection as examples of the obsolete formats of the early days.

   dw
   ```
