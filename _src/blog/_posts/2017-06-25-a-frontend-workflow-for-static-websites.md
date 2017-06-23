---
post-description: Introducing BoxTent: a front end highly automated workflow for simple static websites
post-image: boxtent.jpg
---

<img src="/images/blog/boxtent.jpg" class="cover">

I've created and launched BoxTent around a year ago and after using it on many projects I now have a solid understanding of its potential, that's why I've decided to write a blog post about it.

[BoxTent](http://boxtent.top) is not a framework of any sort, it could be described more as an highly automated workflow, designed to build simple static websites with performance in mind. Every time I started a new project I would always ended up setting a similar work environment, one that took care of the SAMO&copy; stuff like sass support, javascript concatenation, assets optimization and so on. I've decided to optimize the time involved in setting up the work environment and the task management, that's how [BoxTent](http://boxtent.top) was born.

<!--more-->

## When should I use BoxTent.

BoxTent is definitely for you if:

- you are building a small, static website using simple HTML, CSS and JAVASCRIPT (a personal portfolio for example)
- you care about performant code (minification, assets optimization, javascript concatenation)
- You don't have a deploy procedure, you just drag and drop your website files via FTP
- You want to use [Grunt](https://gruntjs.com/) as you like to automate-all-the-things

That's exactly BoxTent's _forte_, as you get out of the box support for:

- `.scss` support and compilation. You can easily extend your `gruntfile.js` to support any sass plugins such as [compass](http://compass-style.org/), [susy](http://susy.oddbird.net/) or any other.
- images optimization and compression
- minification for `.html`, `.css` and `.js` files
- `.js` files compression and concatenation in a single production minified file
- you can use includes in HTML
- you don't have to care about CSS vendor prefixes, you can choose the desired browser support and autoprefixer will do the rest...
- ...And much, much more!

You work is conveniently split into an `_src` folder with your source files, a `_dev` folder with your processed-but-not-production-ready files and finally, typing the `grunt build` command, the whole site gets optimized in the `_site` folder, ready for production.

## BoxTent + Jekyll

[Jekyll](https://jekyllrb.com/) is great, I just love it. What I don't like though, is the following:

- the generated website is not optimized.
- the `jekyll serve` command just won't reload my browser on changes (But this may be just a problem I have, as Jekyll doesn't officially support Windows).
- I prefer to code a website my own way, use Jekyll only for my blog section and not have two separate project to achieve that.

These things I didn't like about Jekyll are now solved by BoxTent. The integration between BoxTent and Jekyll is a breeze as BoxTent uses a very similar folder naming convention and they get very well togheter. This very website [was once run on Jekyll only](https://github.com/vlrprbttst/valeriopierbattista.com-2016) but I've recently switched to [Boxtent **and** Jekyll](https://github.com/vlrprbttst/valeriopierbattista.com-2017) (for the blog section only) and it's going great so far, I'm very happy about this fusion.

## Is it hackable?

BoxTent is easily hackable and extensible to suit your needs if you know your way in a `gruntfile.js`. You can check out [the repository of this very website](https://github.com/vlrprbttst/valeriopierbattista.com-2017) to see how I integrated the susy grid, compass, some php to grab my tweets, jekyll and a bunch of jquery plugins. Don't forget BoxTent also has a extensive user guide at [www.boxtent.top](www.boxtent.top). 

## Isn't BoxTent born obsolete?

You read this blog post and you ask yourself why, you watch your calendar and see a big flashing **2017** written on it. The question arises: "isn't this approach a bit old style?". Actually this may be a slightly old fashioned way of dealing with a web development project, but it still makes sense for some situations:

- not all projects are so technically complex to justify the adoption of a javascript framework like angular or react over a simple structure like HTML, CSS and JAVASCRIPT (with or without jquery). Think of a documentation website, a personal page or a static website for a small client.
- you may be a beginner and you are teaching yourself grunt and frontend development
- you need to set up a development environment quickly, but you still want to deliver performant and fully optimized code.
