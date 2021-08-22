/*
 * A pure javascript class for paginating through any number of DOM elements
 * v1.0.1
 *
 * @copyright	Copyright (C) 2011 Simplify Your Web, Inc. All rights reserved.
 * @license	GNU General Public License version 3 or later; see LICENSE.txt
 */

"use strict";

if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

function _instanceof(left, right) {
  if (
    right != null &&
    typeof Symbol !== "undefined" &&
    right[Symbol.hasInstance]
  ) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/*
 * A pure javascript class for paginating through any number of DOM elements
 *
 * @copyright	Copyright (C) 2011 Simplify Your Web, Inc. All rights reserved.
 * @license		GNU General Public License version 3 or later; see LICENSE.txt
 */
var purePajinate =
  /*#__PURE__*/
  (function() {
    function purePajinate(options) {
      _classCallCheck(this, purePajinate);

      this.config = {
        containerSelector: ".items",
        itemSelector: ".item",
        navigationSelector: ".page_navigation",
        itemsPerPage: 10,
        pageLinksToDisplay: 10,
        startPage: 0,
        wrapAround: false,
        navLabelFirst: "First",
        navLabelPrev: "Prev",
        navLabelNext: "Next",
        navLabelLast: "Last",
        navOrder: ["first", "prev", "num", "next", "last"],
        showFirstLast: false,
        showPrevNext: true,
        hideOnSmall: false,
        defaultClass: "",
        activeClass: "active",
        disabledClass: "disabled",
        onInit: function onInit() {},
        onPageDisplayed: function onPageDisplayed() {}
      };

      if (typeof options !== "undefined") {
        var userSettings = options;

        for (var attrname in userSettings) {
          if (userSettings[attrname] != undefined) {
            this.config[attrname] = userSettings[attrname];
          }
        }
      }

      this.init();
    }

    _createClass(purePajinate, [
      {
        key: "init",
        value: function init() {
          this.config.item_container = document.querySelector(
            this.config.containerSelector
          );
          this.config.pagination_containers = document.querySelectorAll(
            this.config.navigationSelector
          );
          /* Get all the items that are paginated */

          var items = this.config.item_container.querySelectorAll(
            this.config.itemSelector
          );

          if (
            this.config.hideOnSmall &&
            this.config.itemsPerPage >= items.length
          ) {
            return;
          }

          this.current_page = this.config.startPage;

          for (var i = 0; i < items.length; i++) {
            items[i].style.display = "none";
            items[i].classList.add("hidden");
          }
          /* Calculate the number of pages needed */

          var number_of_pages = Math.ceil(
            items.length / this.config.itemsPerPage
          );
          /* Construct the navigation bar */

          var more = '<li class="ellipse more"><span>...</span></li>';
          var less = '<li class="ellipse less"><span>...</span></li>';
          var first = !this.config.showFirstLast
            ? ""
            : '<li class="first_link ' +
              this.config.defaultClass +
              '"><a href="" onclick="return false;">' +
              this.config.navLabelFirst +
              "</a></li>";
          var last = !this.config.showFirstLast
            ? ""
            : '<li class="last_link ' +
              this.config.defaultClass +
              '"><a href="" onclick="return false;">' +
              this.config.navLabelLast +
              "</a></li>";
          var previous = !this.config.showPrevNext
            ? ""
            : '<li class="previous_link ' +
              this.config.defaultClass +
              '"><a href="" onclick="return false;">' +
              this.config.navLabelPrev +
              "</a></li>";
          var next = !this.config.showPrevNext
            ? ""
            : '<li class="next_link ' +
              this.config.defaultClass +
              '"><a href="" onclick="return false;">' +
              this.config.navLabelNext +
              "</a></li>";
          var navigation_html = "<ul>";

          for (var _i = 0; _i < this.config.navOrder.length; _i++) {
            switch (this.config.navOrder[_i]) {
              case "first":
                navigation_html += first;
                break;

              case "last":
                navigation_html += last;
                break;

              case "next":
                navigation_html += next;
                break;

              case "prev":
                navigation_html += previous;
                break;

              case "num":
                if (this.config.showPrevNext) {
                  navigation_html += less;
                }

                var current_link = 0;

                while (number_of_pages > current_link) {
                  var extra_class = "";

                  if (current_link == 0) {
                    extra_class = " first";
                  }

                  if (current_link == number_of_pages - 1) {
                    extra_class = " last";
                  }

                  navigation_html +=
                    '<li class="page_link' +
                    extra_class +
                    " " +
                    this.config.defaultClass +
                    '" longdesc="' +
                    current_link +
                    '"><a href="" onclick="return false;"><span>' +
                    (current_link + 1) +
                    "</span></a></li>";
                  current_link++;
                }

                if (this.config.showPrevNext) {
                  navigation_html += more;
                }

                break;
            }
          }

          navigation_html += "</ul>";
          /* Iterate through all pagination blocks */

          this.config.pagination_containers.forEach(function(el) {
            el.innerHTML = navigation_html;
            /* Show a subset of page links */

            var page_links = el.querySelectorAll(".page_link");
            var min = Math.min(
              page_links.length,
              this.config.pageLinksToDisplay
            );

            for (var _i2 = 0; _i2 < page_links.length; _i2++) {
              if (
                _i2 >= this.config.pageLinksToDisplay + this.config.startPage ||
                _i2 < this.config.startPage
              ) {
                page_links[_i2].style.display = "none";
              }
            }
            /* Hide the more/less indicators */

            el.querySelectorAll(".ellipse").forEach(function(ellipses) {
              ellipses.style.display = "none";
            });
            /* Set the active page link styling */

            if(el.querySelector(".previous_link")) {
                var first_page = el.querySelector(".previous_link")
                    .nextElementSibling.nextElementSibling;
                first_page.classList.add("active_page");
                first_page.classList.add(this.config.activeClass);
            }
            this.total_page_no_links = page_links.length;
            this.config.pageLinksToDisplay = Math.min(
              this.config.pageLinksToDisplay,
              this.total_page_no_links
            );
            var that = this;
            /* avoids bind(this) in function(e) { }.bind(this) */

            if (this.config.showFirstLast) {
              /* Event handler for 'First' link */
              el.querySelector(".first_link").addEventListener(
                "click",
                function(e) {
                  e.preventDefault();
                  that.showFirstPage(el);
                }
              );
              /* Event handler for 'Last' link */

              el.querySelector(".last_link").addEventListener("click", function(
                e
              ) {
                e.preventDefault();
                that.showLastPage(el);
              });
            }

            if (this.config.showPrevNext) {
              /* Event handler for 'Prev' link */
              el.querySelector(".previous_link").addEventListener(
                "click",
                function(e) {
                  e.preventDefault();
                  that.showPrevPage(el);
                }
              );
              /* Event handler for 'Next' link */

              el.querySelector(".next_link").addEventListener("click", function(
                e
              ) {
                e.preventDefault();
                that.showNextPage(el);
              });
            }
            /* Event handler for each 'Page' link */

            el.querySelectorAll(".page_link").forEach(function(page) {
              page.addEventListener("click", function(e) {
                e.preventDefault();
                that.gotopage(page.getAttribute("longdesc"));
              });
            }, that);
          }, this);
          this.gotopage(parseInt(this.config.startPage));
          /* Set the pagination as ready */

          this.config.item_container.classList.add("loaded");
          /* Call user onInit */

          this.config.onInit.call(this);
        }
      },
      {
        key: "showFirstPage",
        value: function showFirstPage(el) {
          this.movePageNumbersRight(el.querySelector(".first_link"), 0);
          this.gotopage(0);
        }
      },
      {
        key: "showLastPage",
        value: function showLastPage(el) {
          var lastPage = this.total_page_no_links - 1;
          this.movePageNumbersLeft(el.querySelector(".last_link"), lastPage);
          this.gotopage(lastPage);
        }
      },
      {
        key: "showPrevPage",
        value: function showPrevPage(el) {
          var new_page = parseInt(this.current_page) - 1;
          var before_active = el
            .querySelector(".previous_link")
            .parentNode.querySelector(".active_page").previousElementSibling;

          if (
            before_active != null &&
            before_active.classList.contains("page_link")
          ) {
            this.movePageNumbersRight(
              el.querySelector(".previous_link"),
              new_page
            );
            this.gotopage(new_page);
          } else if (this.config.wrapAround) {
            this.movePageNumbersLeft(
              el.querySelector(".previous_link"),
              this.total_page_no_links - 1
            );
            this.gotopage(this.total_page_no_links - 1);
          }
        }
      },
      {
        key: "showNextPage",
        value: function showNextPage(el) {
          var new_page = parseInt(this.current_page) + 1;
          var after_active = el
            .querySelector(".next_link")
            .parentNode.querySelector(".active_page").nextElementSibling;

          if (
            after_active != null &&
            after_active.classList.contains("page_link")
          ) {
            this.movePageNumbersLeft(el.querySelector(".next_link"), new_page);
            this.gotopage(new_page);
          } else if (this.config.wrapAround) {
            this.movePageNumbersRight(el.querySelector(".next_link"), 0);
            this.gotopage(0);
          }
        }
      },
      {
        key: "gotopage",
        value: function gotopage(page_num) {
          page_num = parseInt(page_num, 10);
          var ipp = parseInt(this.config.itemsPerPage);
          /* Find the start of the next slice */

          var start_from = page_num * ipp;
          /* Find the end of the next slice */

          var end_on = start_from + ipp;
          /* Hide the current page */

          var items = this.config.item_container.querySelectorAll(
            this.config.itemSelector
          );

          var _loop = function _loop(i) {
            if (i >= end_on || i < start_from) {
              items[i].style.display = "none";
              items[i].classList.remove("visible");
              items[i].classList.add("hidden");
            } else {
              items[i].style.display = "inline-block";
              setTimeout(function() {
                items[i].classList.remove("hidden");
                items[i].classList.add("visible");
              }, 20);
            }
          };

          for (var i = 0; i < items.length; i++) {
            _loop(i);
          }
          /* Reassign the active class */

          this.config.pagination_containers.forEach(function(el) {
            var page_links = el.querySelectorAll(".page_link");

            for (var _i3 = 0; _i3 < page_links.length; _i3++) {
              if (page_links[_i3].getAttribute("longdesc") == page_num) {
                page_links[_i3].classList.add("active_page");

                page_links[_i3].classList.add(this.config.activeClass);
              } else {
                page_links[_i3].classList.remove("active_page");

                page_links[_i3].classList.remove(this.config.activeClass);
              }
            }
          }, this);
          /* Set the current page */

          this.current_page = page_num;
          /* Hide the more and/or less indicators */

          this.toggleMoreLess();
          /* Add a class to the next or prev links if there are no more pages next or previous to the active page */

          if (!this.config.wrapAround) {
            this.tagNextPrev();
          }

          this.config.onPageDisplayed.call(this, page_num + 1);
        }
      },
      {
        key: "movePageNumbersLeft",
        value: function movePageNumbersLeft(e, new_p) {
          var new_page = new_p;
          e.parentNode.querySelectorAll(".page_link").forEach(function(el) {
            if (
              el.getAttribute("longdesc") == new_page &&
              !el.classList.contains("active_page") &&
              el.style.display == "none"
            ) {
              this.config.pagination_containers.forEach(function(el) {
                var page_links = el.querySelectorAll(".page_link");

                for (var i = 0; i < page_links.length; i++) {
                  if (
                    i < new_page + 1 &&
                    i >= parseInt(new_page - this.config.pageLinksToDisplay + 1)
                  ) {
                    page_links[i].style.display = "inline";
                  } else {
                    page_links[i].style.display = "none";
                  }
                }
              }, this);
            }
          }, this);
        }
      },
      {
        key: "movePageNumbersRight",
        value: function movePageNumbersRight(e, new_p) {
          var new_page = new_p;
          e.parentNode.querySelectorAll(".page_link").forEach(function(el) {
            if (
              el.getAttribute("longdesc") == new_page &&
              !el.classList.contains("active_page") &&
              el.style.display == "none"
            ) {
              this.config.pagination_containers.forEach(function(el) {
                var page_links = el.querySelectorAll(".page_link");

                for (var i = 0; i < page_links.length; i++) {
                  if (
                    i < new_page + parseInt(this.config.pageLinksToDisplay) &&
                    i >= new_page
                  ) {
                    page_links[i].style.display = "inline";
                  } else {
                    page_links[i].style.display = "none";
                  }
                }
              }, this);
            }
          }, this);
        }
      },
      {
        key: "toggleMoreLess",
        value: function toggleMoreLess() {
          this.config.pagination_containers.forEach(function(container) {
            var more = container.querySelector(".more");

            if (more != null) {
              more.style.display = "none";

              if (container.querySelector(".page_link.last") && this.isHidden(container.querySelector(".page_link.last"))) {
                more.style.display = "inline";
              }
            }

            var less = container.querySelector(".less");

            if (less != null) {
              less.style.display = "none";

              if (container.querySelector(".page_link.first") && this.isHidden(container.querySelector(".page_link.first"))) {
                less.style.display = "inline";
              }
            }
          }, this);
        }
      },
      {
        key: "tagNextPrev",
        value: function tagNextPrev() {
          this.config.pagination_containers.forEach(function(container) {
            var next = container.querySelector(".next_link");
            var previous = container.querySelector(".previous_link");
            var first = container.querySelector(".first_link");
            var last = container.querySelector(".last_link");

            if (container.querySelector(".page_link.last") && 
              container
                .querySelector(".page_link.last")
                .classList.contains("active_page")
            ) {
              if (next != null) {
                next.classList.add("no_more");
                next.classList.add(this.config.disabledClass);
              }

              if (last != null) {
                last.classList.add("no_more");
                last.classList.add(this.config.disabledClass);
              }
            } else {
              if (next != null) {
                next.classList.remove("no_more");
                next.classList.remove(this.config.disabledClass);
              }

              if (last != null) {
                last.classList.remove("no_more");
                last.classList.remove(this.config.disabledClass);
              }
            }

            if (container.querySelector(".page_link.first") && 
              container
                .querySelector(".page_link.first")
                .classList.contains("active_page")
            ) {
              if (previous != null) {
                previous.classList.add("no_more");
                previous.classList.add(this.config.disabledClass);
              }

              if (first != null) {
                first.classList.add("no_more");
                first.classList.add(this.config.disabledClass);
              }
            } else {
              if (previous != null) {
                previous.classList.remove("no_more");
                previous.classList.remove(this.config.disabledClass);
              }

              if (first != null) {
                first.classList.remove("no_more");
                first.classList.remove(this.config.disabledClass);
              }
            }
          }, this);
        }
      },
      {
        key: "isHidden",
        value: function isHidden(el) {
          var style = window.getComputedStyle(el);
          return style.display === "none" || style.visibility === "hidden";
        }
      }
    ]);

    return purePajinate;
  })();
