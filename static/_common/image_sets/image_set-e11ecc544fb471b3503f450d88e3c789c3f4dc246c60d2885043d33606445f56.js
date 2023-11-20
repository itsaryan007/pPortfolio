(function () {
  (function () {
    var $, allImagesReady, debounce, imageSet;
    $ = this.jQuery;
    allImagesReady = function (wrapper, cb) {
      var imgs;
      imgs = Array.from(wrapper.querySelectorAll("img"));
      return Promise.all(
        imgs.map(
          (function (_this) {
            return function (imgElem) {
              return new Promise(function (resolve, reject) {
                if (imgElem.complete) {
                  return resolve();
                }
                imgElem.addEventListener("load", function () {
                  return resolve();
                });
                return imgElem.addEventListener("error", function () {
                  return resolve();
                });
              });
            };
          })(this)
        )
      ).then(function () {
        return cb();
      });
    };
    debounce = function (func, wait) {
      var timeout;
      timeout = void 0;
      return function () {
        var args, context;
        context = this;
        args = arguments;
        clearTimeout(timeout);
        return (timeout = setTimeout(function () {
          timeout = null;
          func.apply(context, args);
        }, wait));
      };
    };
    imageSet = this.imageSet = {
      initLightbox: function () {
        var $captionWrapper, $items, $toggleButton, shouldShowCaptions;
        $items = $(".format-image-set-items").not(".slideshow");
        $toggleButton = $('<button class="image-set-lightbox-caption-toggle">');
        $captionWrapper = $('<div class="image-set-lightbox-caption">');
        shouldShowCaptions = true;
        if (!$items.length) {
          return;
        }
        $(".format-image-set-item").featherlightGallery({
          galleryFadeIn: 300,
          openSpeed: 300,
          afterContent: function () {
            var caption;
            $(this.$content).fadeTo(0, 0);
            caption = this.$currentTarget.find("img").data("caption");
            this.$instance
              .find(
                ".image-set-lightbox-caption, .image-set-lightbox-caption-toggle"
              )
              .remove();
            if (caption) {
              $toggleButton.appendTo(
                this.$instance.find(".featherlight-content")
              );
              $captionWrapper
                .text(caption)
                .appendTo(this.$instance.find(".featherlight-content"));
              if (shouldShowCaptions) {
                $toggleButton.addClass("active");
                return $captionWrapper.addClass("active");
              }
            }
          },
          afterOpen: function () {
            return $(this.$content).fadeTo(this.galleryFadeIn, 1);
          },
        });
        return $("body").on(
          "click",
          ".image-set-lightbox-caption-toggle",
          function (e) {
            shouldShowCaptions = !shouldShowCaptions;
            $(this).toggleClass("active");
            return $(this).next(".image-set-lightbox-caption").toggle();
          }
        );
      },
      initSlideshow: function () {
        var $slideshows;
        $slideshows = $(".format-image-set-items.slideshow");
        if (!$slideshows.length) {
          return;
        }
        return $slideshows.each(function () {
          var $captionContents,
            $captionWrapper,
            $showCaptionBtn,
            $slideshow,
            $wrapper,
            autoplayOn,
            autoplaySpeed,
            moduleMeta,
            slideshow;
          $slideshow = $(this);
          $wrapper = $slideshow.parents(".format-image-set-wrapper");
          moduleMeta = $wrapper.data("module-meta");
          autoplayOn = moduleMeta.autoplay_toggle === "true";
          autoplaySpeed = parseInt(moduleMeta.autoplay_speed, 10) * 1000;
          if (isNaN(autoplaySpeed)) {
            autoplaySpeed = 2000;
          }
          $showCaptionBtn = $wrapper.find(".image-set-slideshow-show-caption");
          $captionWrapper = $wrapper.find(".image-set-slideshow-item-caption");
          $captionContents = $captionWrapper.children(
            ".image-set-slideshow-item-caption-contents"
          );
          slideshow = $slideshow.addClass("owl-carousel").owlCarousel({
            items: 1,
            center: true,
            loop: true,
            nav: false,
            autoHeight: true,
            autoplay: autoplayOn,
            autoplayTimeout: autoplaySpeed,
            autoplayHoverPause: autoplayOn,
            onInitialized: function () {
              var caption;
              caption = $slideshow
                .find(".owl-item")
                .not(".cloned")
                .eq(0)
                .find("img")
                .data("caption");
              if (caption) {
                $captionContents.text(caption);
                return $showCaptionBtn.show();
              } else {
                $captionWrapper.hide();
                return $showCaptionBtn.hide();
              }
            },
            onChanged: function (e) {
              var caption;
              if (e.page.index < 0) {
                return;
              }
              caption = $slideshow
                .find(".owl-item")
                .not(".cloned")
                .eq(e.page.index)
                .find("img")
                .data("caption");
              $slideshow
                .parents(".format-image-set-wrapper")
                .find(".image-set-slideshow-thumb")
                .removeClass("active")
                .eq(e.page.index)
                .addClass("active");
              if (caption) {
                $captionWrapper.hide();
                $captionContents.text(caption);
                return $showCaptionBtn.show();
              } else {
                $captionWrapper.hide();
                return $showCaptionBtn.hide();
              }
            },
          });
          $wrapper.find(".image-set-slideshow-nav").on("click", function (e) {
            if ($(this).hasClass("next")) {
              return $slideshow.trigger("next.owl.carousel");
            } else {
              return $slideshow.trigger("prev.owl.carousel");
            }
          });
          $wrapper
            .find(".image-set-slideshow-autoplay-toggle")
            .on("click", function (e) {
              if ($(this).hasClass("paused")) {
                $(this).removeClass("paused");
                return $slideshow.trigger("play.owl.autoplay");
              } else {
                $(this).addClass("paused");
                return $slideshow.trigger("stop.owl.autoplay");
              }
            });
          $wrapper
            .find(".image-set-slideshow-show-caption")
            .on("click", function (e) {
              $(this).hide();
              $captionWrapper = $(".image-set-slideshow-item-caption");
              $captionWrapper.children(
                ".image-set-slideshow-item-caption-contents"
              );
              return $captionWrapper.show();
            });
          $wrapper
            .find(".image-set-slideshow-item-caption-hide-button")
            .on("click", function (e) {
              $(this).parents(".image-set-slideshow-item-caption").hide();
              return $(".image-set-slideshow-show-caption").show();
            });
          $wrapper.find(".image-set-slideshow-thumb").on("click", function (e) {
            var index;
            index = $(this).index();
            return $slideshow.trigger("to.owl.carousel", [index, 250]);
          });
          $wrapper.on("mouseover", function (e) {
            if (autoplayOn) {
              return $slideshow.trigger("stop.owl.autoplay");
            }
          });
          return $wrapper.on("mouseout", function (e) {
            if (
              autoplayOn &&
              !$wrapper
                .find(".image-set-slideshow-autoplay-toggle")
                .hasClass("paused")
            ) {
              return $slideshow.trigger("play.owl.autoplay");
            }
          });
        });
      },
      scrollLimitForHorizontalSet: function ($horizontalSet) {
        var totalWidth;
        totalWidth = Array.from(
          $horizontalSet.find(".image-placeholder")
        ).reduce(function (total, elem) {
          var width;
          width = parseInt(elem.parentNode.getBoundingClientRect().width, 10);
          return total + (isNaN(width) ? 0 : width);
        }, 0);
        return -(totalWidth - $horizontalSet.width());
      },
      initHorizontal: function () {
        var $horizontalSets;
        $horizontalSets = $(".format-image-set-items.horizontal");
        return $horizontalSets.each(function () {
          var $horizontalSet, lowerLimit, scrollPos, wheelHandler;
          $horizontalSet = $(this);
          scrollPos = 0;
          lowerLimit = imageSet.scrollLimitForHorizontalSet($horizontalSet);
          window.addEventListener(
            "load",
            (function (_this) {
              return function () {
                return (lowerLimit =
                  imageSet.scrollLimitForHorizontalSet($horizontalSet));
              };
            })(this)
          );
          window.addEventListener(
            "resize",
            debounce(
              (function (_this) {
                return function () {
                  return (lowerLimit =
                    imageSet.scrollLimitForHorizontalSet($horizontalSet));
                };
              })(this),
              200
            )
          );
          wheelHandler = function (event) {
            var scrollTarget;
            scrollTarget =
              scrollPos -
              (event.originalEvent.deltaY + event.originalEvent.deltaX);
            if (scrollTarget < lowerLimit) {
              scrollPos = lowerLimit;
            } else if (scrollTarget > 0) {
              scrollPos = 0;
            } else {
              scrollPos = scrollTarget;
              event.preventDefault();
            }
            return ($horizontalSet.get(0).scrollLeft = -scrollPos);
          };
          $horizontalSet.on("wheel", wheelHandler);
          return $(document).one("touchstart", function () {
            $horizontalSet.off("wheel", wheelHandler);
            return $horizontalSet.css("overflow-x", "scroll");
          });
        });
      },
      layoutMasonrySets: function () {
        var $sets;
        $sets = $(".format-image-set-items.masonry-image-set");
        if (!$sets.length) {
          return;
        }
        return $sets.each(function () {
          var $set, $wrapper, keepOrderOn, moduleMeta, uuid;
          $set = $(this);
          uuid = Math.random().toString(36).slice(2);
          $set.attr("data-masonry-id", uuid);
          $wrapper = $($set[0]).parents(".format-image-set-wrapper");
          moduleMeta = $wrapper.data("module-meta");
          keepOrderOn = moduleMeta.keep_order === "true";
          return allImagesReady(
            document.querySelector("[data-masonry-id='" + uuid + "']"),
            function () {
              return waterfall($set[0], {
                keepOrder: keepOrderOn,
              });
            }
          );
        });
      },
    };
    return $(function () {
      imageSet.initLightbox();
      imageSet.layoutMasonrySets();
      imageSet.initSlideshow();
      imageSet.initHorizontal();
      return window.addEventListener(
        "resize",
        debounce(function () {
          var $sets;
          $sets = $(".format-image-set-items.masonry-image-set");
          if ($sets.length) {
            return $sets.each(function () {
              var $set, $wrapper, keepOrderOn, moduleMeta;
              $set = $(this);
              $wrapper = $($set[0]).parents(".format-image-set-wrapper");
              moduleMeta = $wrapper.data("module-meta");
              keepOrderOn = moduleMeta.keep_order === "true";
              return waterfall($set[0], {
                keepOrder: keepOrderOn,
              });
            });
          }
        }, 500)
      );
    });
  }.call(_4ORMAT));
}.call(this));
