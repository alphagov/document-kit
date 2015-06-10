(function() {
  "use strict";
  window.DocumentKit = window.DocumentKit || {};

  function ContentsBar(options) {
    this.$el = options.$el;

    this.$container = $('body');
    this.$sliderEl = this.$el.find('.slider');

    this.fixedClassName = 'with-fixed-contents';
    this.selectedClassName = 'selected';

    this.distanceFromTop = this.$el.offset().top;

    this.insertStubElement();
    this.bindEvents();
    this.respondToScrollPosition();
  }

  ContentsBar.prototype.insertStubElement = function insertStubElement() {
    var stubElement = $("<span></span>");

    stubElement.addClass("contents-stub");
    stubElement.css('height', this.$el.css('height'));

    stubElement.insertBefore(this.$el);
  }

  ContentsBar.prototype.bindEvents = function bindEvents() {
    $(window).on('scroll', $.proxy(this.respondToScrollPosition, this));
  }

  ContentsBar.prototype.respondToScrollPosition = function respondToScrollPosition() {
    this.addRemoveFixedClass();
    this.setSelectedItem();
  }

  ContentsBar.prototype.addRemoveFixedClass = function addRemoveFixedClass() {
    if (window.scrollY >= this.distanceFromTop) {
      this.$container.addClass(this.fixedClassName);
    } else {
      this.$container.removeClass(this.fixedClassName);
    }
  }

  ContentsBar.prototype.setSelectedItem = function setSelectedItem() {
    var $contentItems = this.$el.find('li');

    var activeItems = $.grep( $contentItems, $.proxy(function(item, _){
      return this.inOrAboveViewport(item);
    }, this));

    if (activeItems.length == 0) {
      this.$sliderEl.css('left', 0);
      return;
    }

    var $latestActiveItem = $(activeItems).last();
    this.$sliderEl.css('left', $latestActiveItem.offset().left);
  }

  ContentsBar.prototype.inOrAboveViewport = function inOrAboveViewport(item) {
    var targetAnchor = $(item).find('a').attr('href');
    var $targetEl = $(targetAnchor);

    if ($targetEl.length == 0) {
      return false;
    }
    if (window.scrollY > ($targetEl.offset().top - this.$el.height())) {
      return true;
    }
    return false;
  }

  DocumentKit.ContentsBar = ContentsBar;

  $(function(){
    $('.contents').each(function(){
      new DocumentKit.ContentsBar({
        $el: $(this),
      });
    });
  });
}());
