/**
 * Featherlight Gallery – an extension for the ultra slim jQuery lightbox
 * Version 1.7.13 - http://noelboss.github.io/featherlight/
 *
 * Copyright 2018, Noël Raoul Bossart (http://www.noelboss.com)
 * MIT Licensed.
 **/
!(function (a) {
  function b(c, d) {
    if (!(this instanceof b)) {
      var e = new b(a.extend({ $source: c, $currentTarget: c.first() }, d));
      return e.open(), e;
    }
    a.featherlight.apply(this, arguments), this.chainCallbacks(h);
  }
  var c = function (a) {
    window.console &&
      window.console.warn &&
      window.console.warn("FeatherlightGallery: " + a);
  };
  if (typeof a === "undefined")
    return c("Too much lightness, Featherlight needs jQuery.");
  if (!a.featherlight)
    return c("Load the featherlight plugin before the gallery plugin");
  var d =
      "ontouchstart" in window ||
      (window.DocumentTouch && document instanceof DocumentTouch),
    e = a.event && a.event.special.swipeleft && a,
    f =
      window.Hammer &&
      function (a) {
        var b = new window.Hammer.Manager(a[0]);
        return b.add(new window.Hammer.Swipe()), b;
      },
    g = d && (e || f);
  d &&
    !g &&
    c(
      "No compatible swipe library detected; one must be included before featherlightGallery for swipe motions to navigate the galleries."
    );
  var h = {
    afterClose: function (a, b) {
      var c = this;
      return (
        c.$instance.off("next." + c.namespace + " previous." + c.namespace),
        c._swiper &&
          (c._swiper
            .off("swipeleft", c._swipeleft)
            .off("swiperight", c._swiperight),
          (c._swiper = null)),
        a(b)
      );
    },
    beforeOpen: function (a, b) {
      var c = this;
      return (
        c.$instance.on(
          "next." + c.namespace + " previous." + c.namespace,
          function (a) {
            var b = a.type === "next" ? 1 : -1;
            c.navigateTo(c.currentNavigation() + b);
          }
        ),
        g &&
          ((c._swiper = g(c.$instance)
            .on(
              "swipeleft",
              (c._swipeleft = function () {
                c.$instance.trigger("next");
              })
            )
            .on(
              "swiperight",
              (c._swiperight = function () {
                c.$instance.trigger("previous");
              })
            )),
          c.$instance.addClass(this.namespace + "-swipe-aware", g)),
        c.$instance
          .find("." + c.namespace + "-content")
          .append(c.createNavigation("previous"))
          .append(c.createNavigation("next")),
        a(b)
      );
    },
    beforeContent: function (a, b) {
      var c = this.currentNavigation(),
        d = this.slides().length;
      return (
        this.$instance
          .toggleClass(this.namespace + "-first-slide", c === 0)
          .toggleClass(this.namespace + "-last-slide", c === d - 1),
        a(b)
      );
    },
    onKeyUp: function (a, b) {
      var c = { 37: "previous", 39: "next" }[b.keyCode];
      return c ? (this.$instance.trigger(c), !1) : a(b);
    },
  };
  a.featherlight.extend(b, { autoBind: "[data-featherlight-gallery]" }),
    a.extend(b.prototype, {
      previousIcon: "&#9664;",
      nextIcon: "&#9654;",
      galleryFadeIn: 100,
      galleryFadeOut: 300,
      slides: function () {
        return this.filter ? this.$source.find(this.filter) : this.$source;
      },
      images: function () {
        return (
          c("images is deprecated, please use slides instead"), this.slides()
        );
      },
      currentNavigation: function () {
        return this.slides().index(this.$currentTarget);
      },
      navigateTo: function (b) {
        var c = this,
          d = c.slides(),
          e = d.length,
          f = c.$instance.find("." + c.namespace + "-inner");
        return (
          (b = ((b % e) + e) % e),
          (c.$currentTarget = d.eq(b)),
          c.beforeContent(),
          a
            .when(c.getContent(), f.fadeTo(c.galleryFadeOut, 0.2))
            .always(function (a) {
              c.setContent(a), c.afterContent(), a.fadeTo(c.galleryFadeIn, 1);
            })
        );
      },
      createNavigation: function (b) {
        var c = this;
        return a(
          '<span title="' +
            b +
            '" class="' +
            this.namespace +
            "-" +
            b +
            '"><span>' +
            this[b + "Icon"] +
            "</span></span>"
        ).click(function (d) {
          a(this).trigger(b + "." + c.namespace), d.preventDefault();
        });
      },
    }),
    (a.featherlightGallery = b),
    (a.fn.featherlightGallery = function (a) {
      return b.attach(this, a), this;
    }),
    a(document).ready(function () {
      b._onReady();
    });
})(_4ORMAT.jQuery);
