// For speciality multi-select
Array.prototype.search = function (elem) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == elem) return i;
  }

  return -1;
};

class Multiselect {
  constructor(selector) {
    if (!$(selector)) {
      console.error("ERROR: Element %s does not exist.", selector);
      return;
    }
    console.log(this.selector);

    this.selector = selector;
    this.selections = [];

    (function (that) {
      that.events();
    })(this);
  }
  open(that) {
    var target = $(that).parent().attr("data-target");

    // If we are not keeping track of this one's entries, then
    // start doing so.
    if (!this.selections) {
      this.selections = [];
    }

    $(this.selector + ".multiselect").toggleClass("active");
  }
  close() {
    $(this.selector + ".multiselect").removeClass("active");
  }
  events() {
    var that = this;

    $(document).on(
      "click",
      that.selector + ".multiselect > .title",
      function (e) {
        if (e.target.className.indexOf("close-icon") < 0) {
          that.open();
        }
      }
    );

    $(document).on(
      "click",
      that.selector + ".multiselect option",
      function (e) {
        var selection = $(this).attr("value");
        var target = $(this).parent().parent().attr("data-target");

        var io = that.selections.search(selection);

        if (io < 0) that.selections.push(selection);
        else that.selections.splice(io, 1);

        that.selectionStatus();
        that.setSelectionsString();
      }
    );

    $(document).on(
      "click",
      that.selector + ".multiselect > .title > .close-icon",
      function (e) {
        that.clearSelections();
      }
    );

    $(document).click(function (e) {
      if (e.target.className.indexOf("title") < 0) {
        if (e.target.className.indexOf("text") < 0) {
          if (e.target.className.indexOf("-icon") < 0) {
            if (
              e.target.className.indexOf("selected") < 0 ||
              e.target.localName != "option"
            ) {
              that.close();
            }
          }
        }
      }
    });
  }
  selectionStatus() {
    var obj = $(this.selector + ".multiselect");

    if (this.selections.length) obj.addClass("selection");
    else obj.removeClass("selection");
  }
  clearSelections() {
    this.selections = [];
    this.selectionStatus();
    this.setSelectionsString();
  }
  getSelections() {
    return this.selections;
  }
  setSelectionsString() {
    var selects = this.getSelectionsString().split(", ");
    var input = $(this.selector + " .multi-input")[0];
    console.log("input", input);
    input.setAttribute("value", this.getSelectionsString());
    $(this.selector + ".multiselect > .title").attr("title", selects);

    var opts = $(this.selector + ".multiselect option");

    if (selects.length > 6) {
      var _selects = this.getSelectionsString().split(", ");
      _selects = _selects.splice(0, 6);
      $(this.selector + ".multiselect > .title > .text").text(
        _selects + " [...]"
      );
    } else {
      $(this.selector + ".multiselect > .title > .text").text(selects);
    }

    for (var i = 0; i < opts.length; i++) {
      $(opts[i]).removeClass("selected");
    }

    for (var j = 0; j < selects.length; j++) {
      var select = selects[j];

      for (var i = 0; i < opts.length; i++) {
        if ($(opts[i]).attr("value") == select) {
          $(opts[i]).addClass("selected");
          break;
        }
      }
    }
  }
  getSelectionsString() {
    if (this.selections.length > 0) return this.selections.join(", ");
    else return "Select";
  }
  setSelections(arr) {
    if (!arr[0]) {
      error("ERROR: This does not look like an array.");
      return;
    }

    this.selections = arr;
    this.selectionStatus();
    this.setSelectionsString();
  }
}

$(document).ready(function () {
  var multi = new Multiselect("#specialities");
  var multiLanguage = new Multiselect("#languages");
});
