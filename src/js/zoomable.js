(function() {
  "use strict";
  window.DocumentKit = window.DocumentKit || {};

  function Zoomable(options) {
    this.$el = options.$el;
    this.$container = $("<div></div>").addClass('zoomable-container');
    this.$zoomableItem = $("<div></div>").addClass('zoomable-item');
    this.$controls = null;

    this.insertControls();
    this.initializePanzoom();
    this.bindEvents();
  }

  Zoomable.prototype.insertControls = function insertControls() {
    /* Insert container */
    this.$container.insertBefore(this.$el);
    this.$container.height(($(window).height() * 0.8));

    this.$zoomableItem.appendTo(this.$container);

    /* Wrap in zoomable-item element */
    this.$el.detach().appendTo(this.$zoomableItem);

    this.$controls = this.buildControls();
    this.$controls.appendTo(this.$container);
  }

  Zoomable.prototype.buildControls = function buildControls() {
    var $controls = $('<div></div>').addClass('zoomable-controls');

    $('<button class="zoom-in">+</button>').appendTo($controls);
    $('<button class="zoom-out">&ndash;</button>').appendTo($controls);

    return $controls;
  }

  Zoomable.prototype.initializePanzoom = function initializePanzoom() {
    this.$zoomableItem.panzoom({
      minScale: 1,
      maxScale: 5,
      increment: 1,
      contain: false
    });
  }

  Zoomable.prototype.bindEvents = function bindEvents() {
    this.$zoomableItem.on('dblclick', $.proxy(this.zoomWithDoubleClick, this));

    this.$zoomableItem.on('mousewheel.focal',
                         $.proxy(this.zoomWithScrollWheel, this));

    this.$controls.find('.zoom-out').on('click',
                       $.proxy(this.zoomOutToMiddle, this));

    this.$controls.find('.zoom-in').on('click',
                       $.proxy(this.zoomWithButton, this));
  }


  Zoomable.prototype.zoomWithDoubleClick = function zoomWithDoubleClick(event) {
    var containerOffset = this.$container.offset();

    this.$zoomableItem.panzoom('zoom', {
      focal: {
        clientX: (event.pageX - containerOffset.left),
        clientY: (event.pageY - containerOffset.top)
      }
    });
  }


  Zoomable.prototype.zoomWithScrollWheel = function zoomWithScrollWheel(event) {
    event.preventDefault();

    var delta = event.delta || event.originalEvent.wheelDelta;
    var zoomOut = delta ? delta < 0 : event.originalEvent.deltaY > 0;

    var focal = event;
    if (zoomOut == true) {
      focal = {
        clientX: (this.$container.width() / 2),
        clientY: (this.$container.height() / 2),
      }
    }

    this.$zoomableItem.panzoom('zoom', zoomOut, {
      increment: 0.1,
      animate: false,
      focal: focal
    });
  }

  Zoomable.prototype.zoomWithButton = function zoomWithButton(event) {
    this.$zoomableItem.panzoom('zoom');
  }

  Zoomable.prototype.zoomOutToMiddle = function zoomOutToMiddle() {
    var focal = {
      clientX: (this.$container.width() / 2),
      clientY: (this.$container.height() / 2)
    };

    this.$zoomableItem.panzoom('zoom', true, {
      focal: focal
    })
  }

  DocumentKit.Zoomable = Zoomable;

  $(function(){
    $('*[data-zoomable="true"]').each(function(){
      new DocumentKit.Zoomable({
        $el: $(this),
      });
    });
  });
}());
