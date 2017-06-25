// #################################################################
// #################################################################
//			WHATS INSIDE HERE?
// #################################################################
// #################################################################

// instafeed - giflinks - tweet.js - twitterfeed.js + initializations

// #################################################################
// #################################################################
//			-= instafeed =-
// #################################################################
// #################################################################
(function() {
    var e, t;
    e = function() {
        function e(e, t) {
            var n, r;
            this.options = {
                target: "instafeed",
                get: "popular",
                resolution: "thumbnail",
                sortBy: "none",
                links: !0,
                mock: !1,
                useHttp: !1
            };
            if (typeof e == "object")
                for (n in e) r = e[n], this.options[n] = r;
            this.context = t != null ? t : this, this.unique = this._genKey()
        }
        return e.prototype.hasNext = function() {
            return typeof this.context.nextUrl == "string" && this.context.nextUrl.length > 0
        }, e.prototype.next = function() {
            return this.hasNext() ? this.run(this.context.nextUrl) : !1
        }, e.prototype.run = function(t) {
            var n, r, i;
            if (typeof this.options.clientId != "string" && typeof this.options.accessToken != "string") throw new Error("Missing clientId or accessToken.");
            if (typeof this.options.accessToken != "string" && typeof this.options.clientId != "string") throw new Error("Missing clientId or accessToken.");
            return this.options.before != null && typeof this.options.before == "function" && this.options.before.call(this), typeof document != "undefined" && document !== null && (i = document.createElement("script"), i.id = "instafeed-fetcher", i.src = t || this._buildUrl(), n = document.getElementsByTagName("head"), n[0].appendChild(i), r = "instafeedCache" + this.unique, window[r] = new e(this.options, this), window[r].unique = this.unique), !0
        }, e.prototype.parse = function(e) {
            var t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S;
            if (typeof e != "object") {
                if (this.options.error != null && typeof this.options.error == "function") return this.options.error.call(this, "Invalid JSON data"), !1;
                throw new Error("Invalid JSON response")
            }
            if (e.meta.code !== 200) {
                if (this.options.error != null && typeof this.options.error == "function") return this.options.error.call(this, e.meta.error_message), !1;
                throw new Error("Error from Instagram: " + e.meta.error_message)
            }
            if (e.data.length === 0) {
                if (this.options.error != null && typeof this.options.error == "function") return this.options.error.call(this, "No images were returned from Instagram"), !1;
                throw new Error("No images were returned from Instagram")
            }
            this.options.success != null && typeof this.options.success == "function" && this.options.success.call(this, e), this.context.nextUrl = "", e.pagination != null && (this.context.nextUrl = e.pagination.next_url);
            if (this.options.sortBy !== "none") {
                this.options.sortBy === "random" ? d = ["", "random"] : d = this.options.sortBy.split("-"), p = d[0] === "least" ? !0 : !1;
                switch (d[1]) {
                    case "random":
                        e.data.sort(function() {
                            return .5 - Math.random()
                        });
                        break;
                    case "recent":
                        e.data = this._sortBy(e.data, "created_time", p);
                        break;
                    case "liked":
                        e.data = this._sortBy(e.data, "likes.count", p);
                        break;
                    case "commented":
                        e.data = this._sortBy(e.data, "comments.count", p);
                        break;
                    default:
                        throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.")
                }
            }
            if (typeof document != "undefined" && document !== null && this.options.mock === !1) {
                a = e.data, this.options.limit != null && a.length > this.options.limit && (a = a.slice(0, this.options.limit + 1 || 9e9)), n = document.createDocumentFragment(), this.options.filter != null && typeof this.options.filter == "function" && (a = this._filter(a, this.options.filter));
                if (this.options.template != null && typeof this.options.template == "string") {
                    i = "", o = "", l = "", v = document.createElement("div");
                    for (m = 0, b = a.length; m < b; m++) s = a[m], u = s.images[this.options.resolution].url, this.options.useHttp || (u = u.replace("http://", "//")), o = this._makeTemplate(this.options.template, {
                        model: s,
                        id: s.id,
                        link: s.link,
                        image: u,
                        caption: this._getObjectProperty(s, "caption.text"),
                        likes: s.likes.count,
                        comments: s.comments.count,
                        location: this._getObjectProperty(s, "location.name")
                    }), i += o;
                    v.innerHTML = i, S = [].slice.call(v.childNodes);
                    for (g = 0, w = S.length; g < w; g++) h = S[g], n.appendChild(h)
                } else
                    for (y = 0, E = a.length; y < E; y++) s = a[y], f = document.createElement("img"), u = s.images[this.options.resolution].url, this.options.useHttp || (u = u.replace("http://", "//")), f.src = u, this.options.links === !0 ? (t = document.createElement("a"), t.href = s.link, t.appendChild(f), n.appendChild(t)) : n.appendChild(f);
                document.getElementById(this.options.target).appendChild(n), r = document.getElementsByTagName("head")[0], r.removeChild(document.getElementById("instafeed-fetcher")), c = "instafeedCache" + this.unique, window[c] = void 0;
                try {
                    delete window[c]
                } catch (x) {}
            }
            return this.options.after != null && typeof this.options.after == "function" && this.options.after.call(this), !0
        }, e.prototype._buildUrl = function() {
            var e, t, n;
            e = "https://api.instagram.com/v1";
            switch (this.options.get) {
                case "popular":
                    t = "media/popular";
                    break;
                case "tagged":
                    if (typeof this.options.tagName != "string") throw new Error("No tag name specified. Use the 'tagName' option.");
                    t = "tags/" + this.options.tagName + "/media/recent";
                    break;
                case "location":
                    if (typeof this.options.locationId != "number") throw new Error("No location specified. Use the 'locationId' option.");
                    t = "locations/" + this.options.locationId + "/media/recent";
                    break;
                case "user":
                    if (typeof this.options.userId != "number") throw new Error("No user specified. Use the 'userId' option.");
                    if (typeof this.options.accessToken != "string") throw new Error("No access token. Use the 'accessToken' option.");
                    t = "users/" + this.options.userId + "/media/recent";
                    break;
                default:
                    throw new Error("Invalid option for get: '" + this.options.get + "'.")
            }
            return n = "" + e + "/" + t, this.options.accessToken != null ? n += "?access_token=" + this.options.accessToken : n += "?client_id=" + this.options.clientId, this.options.limit != null && (n += "&count=" + this.options.limit), n += "&callback=instafeedCache" + this.unique + ".parse", n
        }, e.prototype._genKey = function() {
            var e;
            return e = function() {
                return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1)
            }, "" + e() + e() + e() + e()
        }, e.prototype._makeTemplate = function(e, t) {
            var n, r, i, s, o;
            r = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/, n = e;
            while (r.test(n)) i = n.match(r)[1], s = (o = this._getObjectProperty(t, i)) != null ? o : "", n = n.replace(r, "" + s);
            return n
        }, e.prototype._getObjectProperty = function(e, t) {
            var n, r;
            t = t.replace(/\[(\w+)\]/g, ".$1"), r = t.split(".");
            while (r.length) {
                n = r.shift();
                if (!(e != null && n in e)) return null;
                e = e[n]
            }
            return e
        }, e.prototype._sortBy = function(e, t, n) {
            var r;
            return r = function(e, r) {
                var i, s;
                return i = this._getObjectProperty(e, t), s = this._getObjectProperty(r, t), n ? i > s ? 1 : -1 : i < s ? 1 : -1
            }, e.sort(r.bind(this)), e
        }, e.prototype._filter = function(e, t) {
            var n, r, i, s, o;
            n = [], i = function(e) {
                if (t(e)) return n.push(e)
            };
            for (s = 0, o = e.length; s < o; s++) r = e[s], i(r);
            return n
        }, e
    }(), t = typeof exports != "undefined" && exports !== null ? exports : window, t.Instafeed = e
}).call(this);

// #################################################################
// #################################################################
//			-= giflinks =-
// #################################################################
// #################################################################

var GifLinks = (function() {

  'use strict';
  var body;
  var container;

  /* -------------------------
  /*          UTILS
  /* -------------------------*/

  // Soft object augmentation
  function extend( target, source ) {

    for ( var key in source ) {
      if ( !( key in target ) ) {
        target[ key ] = source[ key ];
      }
    }

    return target;
  }

  // Applys a dict of css properties to an element
  function applyProperties( target, properties ) {

    for( var key in properties ) {
      target.style[ key ] = properties[ key ];
    }
  }

  /* -------------------------
  /*          App
  /* -------------------------*/

  // Initialize
  function init( elements, preload ) {

    if ( elements.length ) {

      // Loop and assign
      for( var i = 0; i < elements.length; i++ ) {

        if ( preload === true ) {
          preloadAndTrack( elements[ i ] );
        } else {
          track( elements[ i ] );
        }
      }

    } else {

       if ( preload === true ) {
        preloadAndTrack( elements );
      } else {
        track( elements );
      }
    }
  }

  // Start tracking after preload
  function preloadAndTrack( element ) {

    var awesomeGif = element.getAttribute( 'data-src' );
    if ( awesomeGif ) {

      // Load the image
      var img = new Image();
      img.onload = function() {

        element.className += ' preloaded'
        track( element )
      }

      img.src = awesomeGif;
    }
  }

  // Start tracking mouse hovers
  function track( element ) {

     // "Party on Wayne" ~ "Party on Garth"
    element.addEventListener( 'mouseover',  function() { startPartying( this ); }, false );
    element.addEventListener( 'touchstart', function() { startPartying( this ); }, false);

    // Someone called the cops.
    element.addEventListener( 'mouseout',     function() { stopPartying(); }, false);
    element.addEventListener( 'touchmove',    function( event ) { event.preventDefault(); stopPartying(); }, false);
    element.addEventListener( 'click',        function() { stopPartying(); }, false);
    element.addEventListener( 'dblclick',     function() { stopPartying(); }, false);

    addClasses( element );
  }

  // Adds classes to do with giflink status (has link etc)
  function addClasses( element ) {

    element.className += ' giflink ready';

    if ( element.href ) {
      element.className += ' has-link';
    } else {
      element.className += ' no-link';
    }
  }

  // Create and cache the gif container.
  function createContainer() {

    var containerProperties = {
      'backgroundPosition': '50% 50%',
      'backgroundSize': 'cover',
      'pointerEvents': 'none',
      'position': 'fixed',
      'zIndex': '999999',
      'display': 'none',
      'height': '100%',
      'width': '100%',
      'margin': '0px',
      'left': '0px',
      'top': '0px',
    }

    container = document.createElement( 'div' );
    applyProperties( container, containerProperties );
    body.appendChild( container );
  }

  // Add the background to the container, and the container to the page!
  function startPartying( element ) {

    var awesomeGif = element.getAttribute( 'data-src' );
    if( awesomeGif ) {
      container.style[ 'backgroundImage' ] = 'url(' + awesomeGif + ')';
      container.style[ 'display' ] = 'block';
    } else {
      console.log( "Sorry, an element doesn't have a data-src!" );
    }
  }

  // Hide the container
  function stopPartying() {

    container.style[ 'display' ] = 'none';
    container.style[ 'backgroundImage' ] = '';
  }


  function main( elements, options ) {

    // Caching
    body = document.body;
    createContainer();

    var preload = false;
    if ( options && options.preload ) {
      preload = !!options.preload;
    }

    // Initialize giflinks
    init( elements, preload );
  }

  return extend( main, {

  });

})();

// #################################################################
// #################################################################
//			-= twitter feed =-
// #################################################################
// #################################################################

$(document).ready(function() {
    function j(a) {
        return a = a.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(a) {
            return '<a href="' + a + '" >' + a + "</a>"
        }), a = a.replace(/\B@([_a-z0-9]+)/gi, function(a) {
            return '<a href="http://twitter.com/' + a.substring(1) + '">' + a.charAt(0) + a.substring(1) + "</a>"
        })
    }

    function k(a) {
        var b = a.split(" ");
        a = b[1] + " " + b[2] + ", " + b[5] + " " + b[3];
        var c = Date.parse(a),
            d = arguments.length > 1 ? arguments[1] : new Date,
            e = parseInt((d.getTime() - c) / 1e3),
            f = a.substr(4, 2) + " " + a.substr(0, 3);
        return e += 60 * d.getTimezoneOffset(), 60 > e ? "1m" : 120 > e ? "1m" : 3600 > e ? parseInt(e / 60).toString() + "m" : 7200 > e ? "1h" : 86400 > e ? parseInt(e / 3600).toString() + "h" : 172800 > e ? f : f
    }
    var a = 3,
        b = "vlrprbttst",
        c = "valerio",
        d = !1,
        e = !1,
        f = !0,
        h = "",
        i = "";
    i += '<div id="loading-container"><img src="images/ajax-loader.gif" alt="tweet loader" /></div>', $("#twitter-feed").html(h + i), $.getJSON("get-tweets.php", function(b) {
        for (var c = "", g = 1, i = 0; i < b.length; i++) {
            var l = b[i].user.name,
                m = b[i].user.screen_name,
                n = b[i].user.profile_image_url_https,
                o = b[i].text,
                p = !1,
                q = !1,
                r = b[i].id_str;
            "undefined" != typeof b[i].retweeted_status && (n = b[i].retweeted_status.user.profile_image_url_https, l = b[i].retweeted_status.user.name, m = b[i].retweeted_status.user.screen_name, r = b[i].retweeted_status.id_str, p = !0), "@" == b[i].text.substr(0, 1) && (q = !0), (1 == e || 0 == p && 0 == e) && (1 == d || 0 == d && 0 == q) && b[i].text.length > 1 && a >= g && (1 == f && (o = j(o)), 1 == g && (c += h), c += '<div class="twitter-article">', c += '<div class="twitter-text"><p><span class="tweet-time"><a href="https://twitter.com/' + m + "/status/" + r + '">' + k(b[i].created_at) + "</a></span><br/>" + o + "</p></div>", c += "</div>", g++)
        }
        $("#twitter-feed").html(c)
    })
});


// #################################################################
// #################################################################
//			-= tweet.js =-
// #################################################################
// #################################################################


jQuery(function($){
	   $(".tweet").tweet({
		   username: "SJ_Nailed_It",
		   join_text: "auto",
		   count: 1,
		   auto_join_text_default: "Nailed It on Twitter",
		   auto_join_text_ed: "we",
		   auto_join_text_ing: "we were",
		   auto_join_text_reply: "we replied to",
		   auto_join_text_url: "we were checking out",
		   loading_text: "loading tweets..."
	   });
   });

// jquery.tweet.js - See http://tweet.seaofclouds.com/ or https://github.com/seaofclouds/tweet for more info
// Copyright (c) 2008-2011 Todd Matthews & Steve Purcell
(function (factory) {
 if (typeof define === 'function' && define.amd)
   define(['jquery'], factory); // AMD support for RequireJS etc.
 else
   factory(jQuery);
}(function ($) {
 $.fn.tweet = function(o){
   var s = $.extend({
	 username: null,                           // [string or array] required unless using the 'query' option; one or more twitter screen names (use 'list' option for multiple names, where possible)
	 list: null,                               // [string]   optional name of list belonging to username
	 favorites: false,                         // [boolean]  display the user's favorites instead of his tweets
	 query: null,                              // [string]   optional search query (see also: http://search.twitter.com/operators)
	 avatar_size: 0,                        // [integer]  height and width of avatar if displayed (48px max)
	 count: 1,                                 // [integer]  how many tweets to display?
	 fetch: null,                              // [integer]  how many tweets to fetch via the API (set this higher than 'count' if using the 'filter' option)
	 page: 1,                                  // [integer]  which page of results to fetch (if count != fetch, you'll get unexpected results)
	 retweets: true,                           // [boolean]  whether to fetch (official) retweets (not supported in all display modes)
	 intro_text: null,                         // [string]   do you want text BEFORE your your tweets?
	 outro_text: null,                         // [string]   do you want text AFTER your tweets?
	 join_text:  null,                         // [string]   optional text in between date and tweet, try setting to "auto"
	 auto_join_text_default: "i said,",        // [string]   auto text for non verb: "i said" bullocks
	 auto_join_text_ed: "i",                   // [string]   auto text for past tense: "i" surfed
	 auto_join_text_ing: "i am",               // [string]   auto tense for present tense: "i was" surfing
	 auto_join_text_reply: "i replied to",     // [string]   auto tense for replies: "i replied to" @someone "with"
	 auto_join_text_url: "i was looking at",   // [string]   auto tense for urls: "i was looking at" http:...
	 loading_text: null,                       // [string]   optional loading text, displayed while tweets load
	 refresh_interval: null ,                  // [integer]  optional number of seconds after which to reload tweets
	 twitter_url: "twitter.com",               // [string]   custom twitter url, if any (apigee, etc.)
	 twitter_api_url: "api.twitter.com",       // [string]   custom twitter api url, if any (apigee, etc.)
	 twitter_search_url: "search.twitter.com", // [string]   custom twitter search url, if any (apigee, etc.)
	 template: "{avatar}{time}{join}{text}",   // [string or function] template used to construct each tweet <li> - see code for available vars
	 comparator: function(tweet1, tweet2) {    // [function] comparator used to sort tweets (see Array.sort)
	   return tweet2["tweet_time"] - tweet1["tweet_time"];
	 },
	 filter: function(tweet) {                 // [function] whether or not to include a particular tweet (be sure to also set 'fetch')
	   return true;
	 }
	 // You can attach callbacks to the following events using jQuery's standard .bind() mechanism:
	 //   "loaded" -- triggered when tweets have been fetched and rendered
   }, o);

   // See http://daringfireball.net/2010/07/improved_regex_for_matching_urls
   var url_regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;

   // Expand values inside simple string templates with {placeholders}
   function t(template, info) {
	 if (typeof template === "string") {
	   var result = template;
	   for(var key in info) {
		 var val = info[key];
		 result = result.replace(new RegExp('{'+key+'}','g'), val === null ? '' : val);
	   }
	   return result;
	 } else return template(info);
   }
   // Export the t function for use when passing a function as the 'template' option
   $.extend({tweet: {t: t}});

   function replacer (regex, replacement) {
	 return function() {
	   var returning = [];
	   this.each(function() {
		 returning.push(this.replace(regex, replacement));
	   });
	   return $(returning);
	 };
   }

   function escapeHTML(s) {
	 return s.replace(/</g,"&lt;").replace(/>/g,"^&gt;");
   }

   $.fn.extend({
	 linkUser: replacer(/(^|[\W])@(\w+)/gi, "$1@<a href=\"http://"+s.twitter_url+"/$2\">$2</a>"),
	 // Support various latin1 (\u00**) and arabic (\u06**) alphanumeric chars
	 linkHash: replacer(/(?:^| )[\#]+([\w\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0600-\u06ff]+)/gi,
						' <a href="http://'+s.twitter_search_url+'/search?q=&tag=$1&lang=all'+((s.username && s.username.length == 1 && !s.list) ? '&from='+s.username.join("%2BOR%2B") : '')+'">#$1</a>'),
	 capAwesome: replacer(/\b(awesome)\b/gi, '<span class="awesome">$1</span>'),
	 capEpic: replacer(/\b(epic)\b/gi, '<span class="epic">$1</span>'),
	 makeHeart: replacer(/(&lt;)+[3]/gi, "<tt class='heart'>&#x2665;</tt>")
   });

   function linkURLs(text, entities) {
	 return text.replace(url_regexp, function(match) {
	   var url = (/^[a-z]+:/i).test(match) ? match : "http://"+match;
	   var text = match;
	   for(var i = 0; i < entities.length; ++i) {
		 var entity = entities[i];
		 if (entity.url == url && entity.expanded_url) {
		   url = entity.expanded_url;
		   text = entity.display_url;
		   break;
		 }
	   }
	   return "<a href=\""+escapeHTML(url)+"\">"+escapeHTML(text)+"</a>";
	 });
   }

   function parse_date(date_str) {
	 // The non-search twitter APIs return inconsistently-formatted dates, which Date.parse
	 // cannot handle in IE. We therefore perform the following transformation:
	 // "Wed Apr 29 08:53:31 +0000 2009" => "Wed, Apr 29 2009 08:53:31 +0000"
	 return Date.parse(date_str.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3'));
   }

   function relative_time(date) {
	 var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
	 var delta = parseInt((relative_to.getTime() - date) / 1000, 10);
	 var r = '';
	 if (delta < 1) {
	   r = 'just now';
	 } else if (delta < 60) {
	   r = delta + ' seconds ago';
	 } else if(delta < 120) {
	   r = 'a minute ago';
	 } else if(delta < (45*60)) {
	   r = (parseInt(delta / 60, 10)).toString() + ' minutes ago';
	 } else if(delta < (2*60*60)) {
	   r = 'an hour ago';
	 } else if(delta < (24*60*60)) {
	   r = '' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
	 } else if(delta < (48*60*60)) {
	   r = 'a day ago';
	 } else {
	   r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
	 }
	 return 'about ' + r;
   }

   function build_auto_join_text(text) {
	 if (text.match(/^(@([A-Za-z0-9-_]+)) .*/i)) {
	   return s.auto_join_text_reply;
	 } else if (text.match(url_regexp)) {
	   return s.auto_join_text_url;
	 } else if (text.match(/^((\w+ed)|just) .*/im)) {
	   return s.auto_join_text_ed;
	 } else if (text.match(/^(\w*ing) .*/i)) {
	   return s.auto_join_text_ing;
	 } else {
	   return s.auto_join_text_default;
	 }
   }

   function build_api_url() {
	 var proto = ('https:' == document.location.protocol ? 'https:' : 'http:');
	 var count = (s.fetch === null) ? s.count : s.fetch;
	 var common_params = '&include_entities=1&callback=?';
	 if (s.list) {
	   return proto+"//"+s.twitter_api_url+"/1.1/"+s.username[0]+"/lists/"+s.list+"/statuses.json?page="+s.page+"&per_page="+count+common_params;
	 } else if (s.favorites) {
	   return proto+"//"+s.twitter_api_url+"/favorites/"+s.username[0]+".json?page="+s.page+"&count="+count+common_params;
	 } else if (s.query === null && s.username.length == 1) {
	   return proto+'//'+s.twitter_api_url+'/1.1/statuses/user_timeline.json?screen_name='+s.username[0]+'&count='+count+(s.retweets ? '&include_rts=1' : '')+'&page='+s.page+common_params;
	 } else {
	   var query = (s.query || 'from:'+s.username.join(' OR from:'));
	   return proto+'//'+s.twitter_search_url+'/search.json?&q='+encodeURIComponent(query)+'&rpp='+count+'&page='+s.page+common_params;
	 }
   }

   function extract_avatar_url(item, secure) {
	 if (secure) {
	   return ('user' in item) ?
		 item.user.profile_image_url_https :
		 extract_avatar_url(item, false).
		   replace(/^http:\/\/[a-z0-9]{1,3}\.twimg\.com\//, "https://s3.amazonaws.com/twitter_production/");
	 } else {
	   return item.profile_image_url || item.user.profile_image_url;
	 }
   }

   // Convert twitter API objects into data available for
   // constructing each tweet <li> using a template
   function extract_template_data(item){
	 var o = {};
	 o.item = item;
	 o.source = item.source;
	 o.screen_name = item.from_user || item.user.screen_name;
	 o.avatar_size = s.avatar_size;
	 o.avatar_url = extract_avatar_url(item, (document.location.protocol === 'https:'));
	 o.retweet = typeof(item.retweeted_status) != 'undefined';
	 o.tweet_time = parse_date(item.created_at);
	 o.join_text = s.join_text == "auto" ? build_auto_join_text(item.text) : s.join_text;
	 o.tweet_id = item.id_str;
	 o.twitter_base = "http://"+s.twitter_url+"/";
	 o.user_url = o.twitter_base+o.screen_name;
	 o.tweet_url = o.user_url+"/status/"+o.tweet_id;
	 o.reply_url = o.twitter_base+"intent/tweet?in_reply_to="+o.tweet_id;
	 o.retweet_url = o.twitter_base+"intent/retweet?tweet_id="+o.tweet_id;
	 o.favorite_url = o.twitter_base+"intent/favorite?tweet_id="+o.tweet_id;
	 o.retweeted_screen_name = o.retweet && item.retweeted_status.user.screen_name;
	 o.tweet_relative_time = relative_time(o.tweet_time);
	 o.entities = item.entities ? (item.entities.urls || []).concat(item.entities.media || []) : [];
	 o.tweet_raw_text = o.retweet ? ('RT @'+o.retweeted_screen_name+' '+item.retweeted_status.text) : item.text; // avoid '...' in long retweets
	 o.tweet_text = $([linkURLs(o.tweet_raw_text, o.entities)]).linkUser().linkHash()[0];
	 o.tweet_text_fancy = $([o.tweet_text]).makeHeart().capAwesome().capEpic()[0];

	 // Default spans, and pre-formatted blocks for common layouts
	 o.text = t('<span class="tweet_text">{tweet_text_fancy}</span>', o);
	 o.user = t('<a class="tweet_user" href="{user_url}">{screen_name}</a>', o);

	 o.avatar = o.avatar_size ?
	   t('<a class="tweet_avatar" href="{user_url}"><img src="{avatar_url}" height="{avatar_size}" width="{avatar_size}" alt="{screen_name}\'s avatar" title="{screen_name}\'s avatar" border="0"/></a>', o) : '';


	 o.join = s.join_text ? t(' <span class="tweet_join">{join_text}</span> ', o) : ' ';
	  o.time = t('<span class="tweet_time"><a href="{tweet_url}" title="view tweet on twitter">{tweet_relative_time}</a></span>', o);
	 o.reply_action = t('<a class="tweet_action tweet_reply" href="{reply_url}">reply</a>', o);
	 o.retweet_action = t('<a class="tweet_action tweet_retweet" href="{retweet_url}">retweet</a>', o);
	 o.favorite_action = t('<a class="tweet_action tweet_favorite" href="{favorite_url}">favorite</a>', o);
	 return o;
   }

   return this.each(function(i, widget){
	 var list = $('<ul class="tweet_list">');
	 var intro = '<p class="tweet_intro">'+s.intro_text+'</p>';
	 var outro = '<p class="tweet_outro">'+s.outro_text+'</p>';
	 var loading = $('<p class="loading">'+s.loading_text+'</p>');

	 if(s.username && typeof(s.username) == "string"){
	   s.username = [s.username];
	 }

	 $(widget).unbind("tweet:load").bind("tweet:load", function(){
	   if (s.loading_text) $(widget).empty().append(loading);
	   $.getJSON(build_api_url(), function(data){
		 $(widget).empty().append(list);
		 if (s.intro_text) list.before(intro);
		 list.empty();

		 var tweets = $.map(data.results || data, extract_template_data);
		 tweets = $.grep(tweets, s.filter).sort(s.comparator).slice(0, s.count);
		 list.append($.map(tweets, function(o) { return "<li>" + t(s.template, o) + "</li>"; }).join('')).
			 children('li:first').addClass('tweet_first').end().
			 children('li:odd').addClass('tweet_even').end().
			 children('li:even').addClass('tweet_odd');

		 if (s.outro_text) list.after(outro);
		 $(widget).trigger("loaded").trigger((tweets.length === 0 ? "empty" : "full"));
		 if (s.refresh_interval) {
		   window.setTimeout(function() { $(widget).trigger("tweet:load"); }, 1000 * s.refresh_interval);
		 }
	   });
	 }).trigger("tweet:load");
   });
 };
}));

// #################################################################
// #################################################################
//			-= INIT =-
// #################################################################
// #################################################################

// twitter self initiates

//instagram
var userFeed = new Instafeed({
	get : 'user',
	userId : 33551734,
	accessToken : '33551734.1677ed0.55edac8ccae947ce9b98824757fef93c',
	limit : 3,
	resolution : 'standard_resolution',
	template : '<div class="insta-wrapper"><a href="{{link}}" target="_blank"><img src="{{image}}"><div class="insta-text-wrapper"><div class="insta-caption">{{caption}}</div><div class="insta-geolocation">{{location}}</div></div></a></div>'
});
userFeed.run();
function checklocation(){
    var emptyLocation = $('.insta-geolocation:empty');
    var presentLocation = $(".insta-geolocation:not(:empty)");
    $(emptyLocation).parent().remove();
    $(presentLocation).prepend("<i class='fa fa-map-marker'></i> ")
}
$(document).ready(function(){
    setTimeout(checklocation, 1000);
})

// spotify
function get_spotify() {
	$.ajax({
		type : 'POST',
		url : 'spotify.php',
		data : {
			request : 'true'
		},
		success : function(reply) {
			$('.now-playing').html("<p>" + reply + "</p>");
		}
	});

};
get_spotify();

// giflink
var element = document.querySelector( '.profile-pic');
GifLinks( element, { preload: true } );
