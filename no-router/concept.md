# Athena: A shot at convergence

Reading is an activity we do alone and together. We read and then we discuss. We read and then wonder out loud how awesome or horrible the book was. Yet we do it separately

The concept is simple: We build the book like we build a web application using HTML5, CSS3 and JavaScript. We then choose what parts of our applications we make available for offline use (static content, and stuff that we want to make available for using offline) and what parts, if any, are dynamic that require online access.

The idea behind the Athena Framework is to provide a tool that allows different reading and engagement experiences for users. It can be used to create serial book or magazine like experiences or create real multimedia books without the limitations we face in ePub and Kindle e-books. Athena allows you to 

Don't get me wrong. I love e-books and their posibilities. However, the market fragmentation and uneven support for web standards make it really hard to create the experiences I see as the future of digital reading and engagement.

## HTML as the delivery language

I've [written before](http://publishing-project.rivendellweb.net/html-is-the-final-product-not-the-initial-source/) about HTML and its roles as the final language for publication. I will only summarize the article I just linked. 

HTML is a powerful language full of capabilities and, alongside CSS3 and Javascript, provides the foundation of modern sites and applications. 

HTML is not an easy language to author. Depending on the variant of HTML you're writing (XHTML or regular HTML) you have to follow different rules. 

The default HTML5 is too permissive; it allows the worst [tag soup](http://www.wikiwand.com/en/Tag_soup) markup; the same markup that has been allowed by browser vendors in an effort to be competitive. It is nice to authors but makes parsing the content much harder than it needs to be. 

XHTML5 syntax (best explained in this [HTML5 Doctor](http://html5doctor.com/html-5-xml-xhtml-5/) article by Bruce Lawson) provides stricter guidelines for authors that may turn some people off from HTML altogether. Sure, attributes must be quotes, all tags must be lowercase and all attributes must be closed, including &lt;img> and &lt;br> tags. The benefit is that the stricter rules make parsing content and developing new technologies around it easier.

Because of these difficulties I present 4 solutions to create content that easily transforms to XHTML5 content. I don't go into too much detail of each solution, just enough to give you an idea of what it is.

* [Markdown](http://daringfireball.net/projects/markdown/) is a text to (X)HTML conversion tool designed for writers. It refers both to the syntax used in the Markdown text files and the applications used to perform the conversion
* [AsciiDoc](http://www.methods.co.nz/asciidoc/) is a text document format for writing notes, documentation, articles, books, ebooks, slideshows, web pages, man pages and blogs. AsciiDoc files can be translated to many formats including HTML, PDF, EPUB, man page
* [HTMLBook](https://github.com/oreillymedia/HTMLBook) is an open, XHTML5-based standard for the authoring and production of both print and digital books. It is currently under development
* [Docbook](http://docbook.org/), [DITA](http://dita.xml.org/) and [TEI](http://www.tei-c.org/index.xml) are some examples of XML vocabularies that can be converted to HTML.

## Making web sites behave like native apps

One of the biggest issues with web applications is that they are vulnerable to network latency and, particularly, having to deal with poor or non-existent network. 

A first attempt to resolve the issue was the Application Cache, documented in this [beginner introduction to App Cache](http://www.html5rocks.com/en/tutorials/appcache/beginner/) article. For a while, it was a good solution since we had nothing better.

Over time some of the pitfalls of appcache became evident and people shied away from all the little tricks that they had to do to get appcache working somewhat as planned some of the time.

The [service workers](http://www.w3.org/TR/service-workers/) specification promises native-like functionality without all the pittfalls and drawbacks of appcache and in a more reliable and developer-friendly way.

Jake Archibald created an example application to illustrate ServiceWorkers: [trained-to-thrill](https://github.com/jakearchibald/trained-to-thrill) is live on [Github](https://jakearchibald.github.io/trained-to-thrill/)

In the not so distant future, the same framework that provides the offline access to cached content will also allow developers to push messages to the serviceworker-enabled application, even when the application is not running and/or the browser is closed. Perfect for new or updated content notification.

The only drawback for service workers is that developers must host service worker based applications in an HTTPS server. Service workers are too powerful to allow potential man in the middle attacks.

## Using JSON instead of XML for content description

Current e-books use an XML vocabulary to define metadata and publication structure. It's powerful and complete but is it may not really be necessary for web-based applications; JSON may be a good alternative.

[Javascript Object Notation (JSON)](http://www.json.org/) has been around for a while but only recently (late 2013) has been [standardized](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf) by ECMA (same group that standardized Javascript) as ECMA 404. 

Most, if not all, web browsers already support parsing JSON files; this makes it easier 

## Databases

If we need a database we can handle part of the task on the browser using stuff like indexedDB ([http://www.html5rocks.com/en/tutorials/webdatabase/websql-indexeddb/](http://www.html5rocks.com/en/tutorials/webdatabase/websql-indexeddb/)). Most likely there will be some stuff that we have to handle at the server level but we should be able to cache a snapshot of the initial server interaction so we can still provide a meaningful reading experience.

Not all browsers [support](http://caniuse.com/#search=indexeddb) for the feature and in the browsers that support it, the support is incomplete in IE 10 and 11 ([https://github.com/Fyrd/caniuse/pull/532](https://github.com/Fyrd/caniuse/pull/532)) or buggy and unreliable in iOS 8 ([http://www.raymondcamden.com/2014/9/25/IndexedDB-on-iOS-8--Broken-Bad](http://www.raymondcamden.com/2014/9/25/IndexedDB-on-iOS-8--Broken-Bad)) but with the workaround it presents a good compromise for local data storage.

## The emergence of the browser OS

[Chromium / Chrome OS](http://www.chromium.org/chromium-os) for notebooks, [Firefox OS](https://developer.mozilla.org/en-US/Firefox_OS) for mobile phones and [Windows 8](http://dev.windows.com/en-us/develop) for both phone and desktop OS change the way

# How is Athena structured

Athena consists of 4 main components

* Service Worker definition and function library
* JSON package definition
* Content package
* (Optional) UI of your choice


## Service worker definition

The first step in the process is to register the service worker for our Athena application. We can have multiple serviceworkers for a domain with different scopes. In the example below we register our service worker (`worker.js`) and tie it to the `athena-project` path using [promises](http://www.html5rocks.com/en/tutorials/es6/promises/) to check whether it was successful or not.

```javascript
navigator.serviceWorker.register('/worker.js', {
  scope: '/athena-project/'}).then(function(reg) {
  console.log('◕‿◕', reg);
}, function(err) {
  console.log('ಠ_ಠ', err);
});
```

We can then 

```javascript
var caches = require('../libs/caches');

self.oninstall = function(event) {
  event.waitUntil(
    caches.open('trains-static-v14').then(function(cache) {
      return cache.addAll([
        '/trained-to-thrill/',
        '/trained-to-thrill/static/css/all.css',
        '/trained-to-thrill/static/js/page.js',
        '/trained-to-thrill/static/imgs/logo.svg',
        '/trained-to-thrill/static/imgs/icon.png'
      ]);
    })
  );
};

var expectedCaches = [
  'athena-cache-v1'
];

self.onactivate = function(event) {
  // remove caches beginning 'trains-' that aren't in
  // expectedCaches
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (!/^trains-/.test(cacheName)) {
            return;
          }
          if (expectedCaches.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
};

self.onfetch = function(event) {
  var requestURL = new URL(event.request.url);

  if (requestURL.hostname === 'api.flickr.com') {
    event.respondWith(flickrAPIResponse(event.request));
  }
  else if (/\.staticflickr\.com$/.test(requestURL.hostname)) {
    event.respondWith(flickrImageResponse(event.request));
  }
  else {
    event.respondWith(
      caches.match(event.request, {
        ignoreVary: true
      })
    );
  }
};
```

## JSON package definition

The example below is one possible way to define a book structure using JSON. All browsers can parse the JSON file and either use in two way data biding templates like moustache or handlebars or use it as the source file for Polymer or AngularJS applications. 

```json
{
  "publicaton": {
    "metadata": {
      "pub-type": "book",
      "Title": "New Adventures of Old Sherlock Holmes",
      "pub-info": [
        {
        "pub-date": "20141130",
        "pub-location": "London",
        "publisher": "That Press, Ltd"
        }
      ],
      "authors": [
        {
          "firstName": "Sherlock",
          "lastName": "Holmes"
        }
      ],
      "editors": [
          {
            "role": "Production Editor",
            "firstName": "John",
            "lastName": "Watson"
        }
      ]
    },
    "structure": {
      "content": [
        {
          "name": "Chapter 1",
          "location": "content/chapter1.html"
        },
        {
          "name": "Chapter 2",
          "location": "content/chapter2.html"
        }
      ]
    }
  }
}
```

Using the JSON above you build a user interface using AngularJS or Polymer / web components. The point is that you can build the front end using any technology that you're familiar or comfortable with. When we talk about User Interface I will use Polymer (with the limitations and shortcomings of developing technologies) because of their flexibility (and because I love playing with the technology.) 

## Content Package: Taking advantage of the open web

I separate the content from the user interface to make content and user interface easier to develop as separate projects if needed and because content should not interfere with the interface it is placed in.

Because we are working in an open web platform, the web browser, we can leverage the new technologies and APIs that are part of or related to HTML5. 

A sampling of these web technologies (and are supported in most web browsers for desktop and mobile). These are not the only technologies available; you can use pretty much any technologies you want as long as you're also willing to pay the price if support for the technologies is limited.

### Visual Technologies

#### WebGL 

>WebGL (Web Graphics Library) is a JavaScript API for rendering interactive 3D graphics and 2D graphics within any compatible web browser without the use of plug-ins.[2] WebGL is integrated completely into all the web standards of the browser allowing GPU accelerated usage of physics and image processing and effects as part of the web page canvas. WebGL elements can be mixed with other HTML elements and composited with other parts of the page or page background.[3] WebGL programs consist of control code written in JavaScript and shader code that is executed on a computer's Graphics Processing Unit (GPU). WebGL is designed and maintained by the non-profit Khronos Group.[4]
>From [Wikipedia](http://en.wikipedia.org/wiki/WebGL) 

[Google WebGL Chrome Experiments](http://www.chromeexperiments.com/) shows you what you can do with the technology and how much more we have left to explore. 

For all its strength, raw WebGL is not easy to learn or write. That's where libraries like [Three.js](http://threejs.org/), [Babylon.js](http://www.babylonjs.com/), [Scene.js](http://scenejs.org/), [GLGE](http://www.glge.org/) and many others documents in the [Khronos Group wiki](https://www.khronos.org/webgl/wiki/User_Contributions#Frameworks). I have chosen to work with Three.js.

HTML5 Rocks [introductory article](http://www.html5rocks.com/en/tutorials/three/intro/) by Paul Lewis presents a good entry level tutorial for people meeting WebGL for the first time.

Another alternative is to use declarative libraries such as [GLAM](http://tparisi.github.io/glam/#/home) and code your 3D environments the same way you create the rest of your content.

For all the advantages of a library there are times when design requirements dictate finer manipulation of the pixels on the 3D scree. WebGL allows authors to create their own vertex and fragment shaders. This is beyond most developers needs but it's always nice to know it's available. 

Paul Lewis followed his introduction to Three.js article with [An Introduction to Shaders](http://www.html5rocks.com/en/tutorials/webgl/shaders/) that explains what shaders are, the different types of shaders, how to write them and how to plug the shaders into Three.js scenes.

#### Data Visualizations

> D3.js is a JavaScript library for manipulating documents based on data. D3 helps you bring data to life using HTML, SVG and CSS. D3’s emphasis on web standards gives you the full capabilities of modern browsers without tying yourself to a proprietary framework, combining powerful visualization components and a data-driven approach to DOM manipulation.
> ...
> D3 allows you to bind arbitrary data to a Document Object Model (DOM), and then apply data-driven transformations to the document. For example, you can use D3 to generate an HTML table from an array of numbers. Or, use the same data to create an interactive SVG bar chart with smooth transitions and interaction.
> D3 is not a monolithic framework that seeks to provide every conceivable feature. Instead, D3 solves the crux of the problem: efficient manipulation of documents based on data. This avoids proprietary representation and affords extraordinary flexibility, exposing the full capabilities of web standards such as CSS3, HTML5 and SVG. With minimal overhead, D3 is extremely fast, supporting large datasets and dynamic behaviors for interaction and animation. D3’s functional style allows code reuse through a diverse collection of components and plugins.

D3 is a very flexible library used to create data-based documents and visualizations. You can make it static to represent data as a regular graph or bar chart or make it fully interactive with user-controlled data changes. 

D3 is by not the only data graphing and visualization library. Like Three.js I chose it because of its simplicity. Scott Murray's book [Interactive Data Visualization For The Web](http://shop.oreilly.com/product/0636920026938.do) does a much better job of explaining what D3 is, what it does and what it doesn't do. Look at [chapter 2](http://chimera.labs.oreilly.com/books/1230000000345/ch02.html) of the online book (and consider buying the printed or ebook verison.)

[MORE INFO ABOUT D3?]

### Non visual elements: Document semantics

There are aspects of a web page that we can't see. When I started looking at ePub I was surprised that it included semantics and structural description of elements. 

Adapted from [EPUB Content Documents 3.0](http://www.idpf.org/epub/301/spec/epub-contentdocs.html) this example indicates areas where we can use epub:type to indicate the structure of the document. Note that we had to add the epub name space to the HTML document, otherwise the browser wouldn't know what to do with the type declarations and would ignore them at best or 

```html
<html xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>The example book</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="js/script.js"></script>
</head>
<body>
<section epub:type="backmatter">
  <section epub:type="dedication">
    <p>To my buddies</p>
  </section>
  <section epub:type="index">
    <p>Index goes here</p>
  </section>
  <section>
    <dl epub:type="glossary">
      <dt>ePub</dt>
      <dt>An e-book format</dt>
    </dl>
  </section>
<section>
</body>
</html>
```

We can then style different aspects of the book depending on the epub:type attributes. To style the dedication section in the example above we could do something like:

```css
section[epub|type~='dedication'] {
  font-style: italic;
  text-align: center;
}
```

The css above witll match both **epub:type="dedication"** and 
**epub:type="dedication chapter"**. We code the CSS deffensively because the type attribute can have more than one value and the order of the values is not important. 

Another area that provides semantic structure is the World Wide Web Consortium's Web Accessibility Initiative (WAI)); the umbrella group for all of the Work in accessibility. 

I've picked the WAI's [Web Content Accessibility Guidelines 2.0](http://www.w3.org/TR/WCAG20/) and its supporting (ARIA in HTML)(http://w3c.github.io/aria-in-html/) document as guidelines for adding accessibility to our content. Note that the `aria-*` attributes are not the same as `epub:type` or microdata attributes: they may overlap in places but their emphasies 

```html
<form action="">
  <fieldset>
  <legend>Login form</legend>
    <div>
      <label for="username">Your username</label>
      <input 
        type="text" 
        id="username" 
        **aria-describedby="username-tip"** 
        required />
      <div **role="tooltip"** id="username-tip">
        Your username is your email address
      </div>
    </div>
    <div>
      <label for="password">Your password</label>
      <input 
        type="text" 
        id="password" 
        **aria-describedby="password-tip"** 
        required />
      <div role="tooltip" id="password-tip">
          Was emailed to you when you signed up
      </div>
    </div>
  </fieldset>
</form>
```
## UI of your choice

### AngularJS

### Web Components (Polymer and maybe X-Tags)

### EmberJS

# Compatibility

To a large degree Athena only supports modern browsers which may or may not be a bad thing considering what you get in return. 

## Accessibility

# Resources, links and examples

## Examples and demos

* [Trained to thrill](https://jakearchibald.github.io/trained-to-thrill/)
* [Athena-based publication sample](https://github.com/caraya/athena-framework) (work in progress)

## Availability

[http://caniuse.com/](http://caniuse.com/) to check for feature compatibility across browsers

## Inspiration

* [http://craigmod.com/journal/post_artifact/](http://craigmod.com/journal/post_artifact/)
* [http://craigmod.com/journal/ebooks/](http://craigmod.com/journal/ebooks/)
* [http://craigmod.com/journal/ipad_and_books/](http://craigmod.com/journal/ipad_and_books/)

## Offline content and Service Worker

* [http://diveintohtml5.info/offline.html](http://diveintohtml5.info/offline.html)
* [ServiceWorkers explained](https://github.com/slightlyoff/ServiceWorker/blob/master/explainer.md)
* [Is ServiceWorkers Ready](https://jakearchibald.github.io/isserviceworkerready/)
* Alex Russell's ServiceWorkers [presentation](https://www.youtube.com/watch?v=QbuLq4f6DGQ) at Chrome Dev. Summit
* HTML5 Rocks' [Introduction to Service Worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/).

## Custom data attributes

* [http://schema.org/](http://schema.org/)
* [http://html5doctor.com/html5-custom-data-attributes/](http://html5doctor.com/html5-custom-data-attributes/)

## ebooks

* Liz Castro's blog is always a good starting point. [http://www.pigsgourdsandwikis.com/](http://www.pigsgourdsandwikis.com/)
* [http://blog.epubbooks.com/](http://blog.epubbooks.com/)
* [http://epubsecrets.com/](http://epubsecrets.com/)
* [http://thefutureofpublishing.com/2011/10/amazon-kf8-and-epub-3/](The future of publishing)
