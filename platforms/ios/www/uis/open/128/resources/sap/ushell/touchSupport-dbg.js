;/*global jQuery, sap, clearTimeout, console, window */
/*global jQuery, sap, clearTimeout, console, window */
(function () {
    "use strict";

    jQuery.sap.declare("sap.ushell.touchSupport");

    sap.ushell.touchSupport = function(cfg) {

        if (!cfg || !cfg.rootSelector || !cfg.containerSelector || !cfg.draggableSelector) {
            throw new Error("No configuration object to initialize User Interaction module.");
        }

        /* PRIVATE MEMBERS */
        //TODO: write optional and mandatory parameters.
        this.animationDuration;         // {Number} animation duration in ms
        this.captureStart;              // {Function} capture start event X and Y position
        this.captureMove;               // {Function} capture move event X and Y position
        this.captureEnd;                // {Function} capture end event X and Y position
        this.clickEvent;                // {String} `click` event
        this.clickHandler;              // {Function} capture click event and prevent the default behaviour on IOS
        this.clone;                     // {Element} cloned draggable element
        this.cloneClass;                // {String} clone CSS Class
        this.container;                 // {Element} content container to be scrolled
        this.contextMenuEvent;          // {String} `contextmenu` event for Windows 8 Chrome
        this.debug;                     // {Boolean} for debug mode
        this.dragAndScrollCallback;     // {Function} Callback function executes while drag mode is active
        this.dragAndScrollDuration;     // {Number} Scroll timer duration in ms
        this.dragAndScrollTimer;        // {Number} timer ID. Used in drag & scroll animation
        this.draggable;                 // {Array<Element>|NodeList<Element>} list of draggable elements
        this.placeHolderClass;          // {String} placeholder CSS Class
        this.draggableSelector;         // {String} CSS Selector String which specifies the draggable elements
        this.draggableSelectorExclude;  // {String} CSS Selector String which specifies the elements that can not be draggable but can be droppable
        this.doubleTapCallback;         // {Function} Callback function execute when double tap
        this.doubleTapDelay;            // {Number} number of milliseconds to recognize double tap
        this.element;                   // {Element} draggable element
        this.endEvent;                  // {String} `touchend` or `mouseup`
        this.endX;                      // {Number} X coordinate of end event
        this.endY;                      // {Number} Y coordinate of end event
        this.isTouch;                   // {Boolean} does browser supports touch events
        this.lastElement;               // {Element} last tapped element
        this.lastTapTime;               // {Number} number of milliseconds elapsed since last touch start
        this.log;                       // {Function} logs to console in debug mode
        this.mode;                      // {String} current feature mode `normal`, `scroll`, `drag`, `move`
        this.moveEvent;                 // {String} `touchmove` or `mousemove`
        this.moveTolerance;             // {Number} tolerance in pixels between touchStart and touchMove
        this.moveX;                     // {Number} X coordinate of move event
        this.moveY;                     // {Number} Y coordinate of move event
        this.noop;                      // {Function} empty function
        this.preventClickFlag;          // {Boolean} flag indicates if prevent default click behaviour
        this.preventClickTimeoutId;     // {Number}  timer ID. Used to clear click preventing
        this.startEvent;                // {String} `touchstart` or `mousedown`
        this.startX;                    // {Number} X coordinate of start event
        this.startY;                    // {Number} Y coordinate of start event
        this.switchModeDelay;           // {Number} switch mode delay in ms
        this.tapsNumber;                // {Number} the number of taps. could be 0 / 1 / 2
        this.timer;                     // {Number} timer ID. Used to decide mode
        this.touchCancelEvent;          // {String} `touchcanel` event
        this.touchDragCallback;         // {Function} Callback function execute when drag mode is active
        this.touchEndCallback;          // {Function} Callback function execute after capture `touchend` event
        this.touchStartCallback;        // {Function} Callback function execute after capture `touchstart` event
        this.wrapper;                   // {Element} content container parent

        /**
         * Initialize state using configuration
         *
         * @private
         */
        this.init = function (cfg) {
            var isTouch;
            this.startX = -1;
            this.startY = -1;
            this.moveX = -1;
            this.moveY = -1;
            this.endX = -1;
            this.endY = -1;

            this.container = document.querySelector(cfg.containerSelector);
            this.switchModeDelay = cfg.switchModeDelay || 1500;
            this.dragAndScrollDuration = cfg.dragAndScrollDuration || 230;
            this.moveTolerance = cfg.moveTolerance === 0 ? 0 : cfg.moveTolerance || 10;
            this.draggableSelector = cfg.draggableSelector;
            this.draggableSelectorExclude = cfg.draggableSelectorExclude;
            this.mode = 'normal';
            this.debug = cfg.debug || false;
            this.root = document.querySelector(cfg.rootSelector);
            this.animationDuration = cfg.animationDuration ||330;
            this.noop = function() {};
            this.tapsNumber = 0;
            this.lastTapTime = 0;
            this.log = this.debug ? this.logToConsole : this.noop;
            this.placeHolderClass = cfg.placeHolderClass || "";
            this.cloneClass = cfg.cloneClass || "";
            this.wrapper = cfg.wrapperSelector ? document.querySelector(cfg.wrapperSelector) : this.container.parentNode;
            this.touchStartCallback = typeof cfg.touchStartCallback === 'function' ? cfg.touchStartCallback : this.noop;
            this.doubleTapCallback = typeof cfg.doubleTapCallback === 'function' ? cfg.doubleTapCallback : this.noop;
            this.touchEndCallback = typeof cfg.touchEndCallback === 'function' ? cfg.touchEndCallback : this.noop;
            this.touchDragCallback = typeof cfg.touchDragCallback === 'function' ? cfg.touchDragCallback : this.noop;
            this.dragAndScrollCallback = typeof cfg.dragAndScrollCallback === 'function' ? cfg.dragAndScrollCallback : this.noop;
            this.doubleTapDelay = cfg.doubleTapDelay || 500;

            /*
             * Detect if browser supports touch events
             * and define start, move and end events
             * according to browser capabilities
             */
            if(isTouch = ('ontouchstart' in window)) {
                this.startEvent = 'touchstart';
                this.moveEvent = 'touchmove';
                this.endEvent = 'touchend';
                this.contextMenuEvent = 'contextmenu';
                this.touchCancelEvent = 'touchcancel';
                this.clickEvent = 'click';
                this.captureStart = this.captureTouchStart;
                this.captureMove = this.captureTouchMove;
                this.captureEnd = this.captureTouchEnd;
            } else {
                throw new Error('Not supported!');
            }
        };

        /* PRIVATE METHODS */

        /**
         * Iterates over array-like object and calls callback function
         * for each item
         *
         * @param {Array|NodeList|Arguments} scope - array-like object
         * @param {Function} callback - function to be called for each element in scope
         * @returns {Array|NodeList|Arguments} scope
         */
        this.forEach = function (scope, callback) {
            /*
             * NodeList and Arguments don't have forEach,
             * therefore borrow it from Array.prototype
             */
            return Array.prototype.forEach.call(scope, callback);
        };

        /**
         * Returns index of item in array-like object
         *
         * @param {Array|NodeList|Arguments} scope - array-like object
         * @param {*} item - item which index to be found
         * @returns {Number} index of item in the array-like object
         */
        this.indexOf = function (scope, item) {
            /*
             * NodeList and Arguments don't have indexOf,
             * therefore borrow it from Array.prototype
             */
            return Array.prototype.indexOf.call(scope, item);
        };

        /**
         * Cuts item from array-like object and pastes before reference item
         *
         * @param {Array|NodeList|Arguments} scope
         * @param {*} item
         * @param {*} referenceItem
         */
        this.insertBefore = function (scope, item, referenceItem) {
            var itemIndex,
                referenceItemIndex,
                splice;

            splice = Array.prototype.splice;
            itemIndex = this.indexOf(scope, item);
            referenceItemIndex = this.indexOf(scope, referenceItem);

            splice.call(
                scope,
                    referenceItemIndex - (itemIndex < referenceItemIndex ? 1 : 0),
                0,
                splice.call(scope, itemIndex, 1)[0]
            );
        };

        /**
         * Log to console
         *
         * @private
         */
        this.logToConsole = function () {
            console.log.apply(console, arguments);
        };


        this.getDraggableElement = function (touch) {
            var currentElement = touch.target;
            var element = undefined;

            this.draggable = jQuery(this.draggableSelector, this.container);
            //Since we are listening on the root element,
            //we would like to identify when a draggable element is being touched.
            //The target element of the event is the lowest element in the DOM hierarchy
            //where the user touched the screen.
            //We need to climb in the DOM tree from the target element until we identify the draggable element,
            //or getting out of container scope.
            while (typeof element === 'undefined' && currentElement !== this.root) {
                //Only draggable tiles
                if (this.indexOf(this.draggable, currentElement) >= 0 && jQuery(currentElement).not(this.draggableSelectorExclude).length > 0) {
                    element = currentElement;
                }
                currentElement = currentElement.parentNode;
            }

            return element;
        };

        /**
         * Capture X and Y coordinates of touch start event
         *
         * @param {TouchEvent} evt - touch start event
         * @private
         */
        this.captureTouchStart = function (evt) {
            var touch;
            this.endHandler(evt);
            this.element = undefined;

            if(evt.touches.length === 1) {
                touch = evt.touches[0];
                this.element = this.getDraggableElement(touch);
                this.startX = touch.pageX;
                this.startY = touch.pageY;
                this.lastMoveX = 0;
                this.lastMoveY = 0;
                //Check if it is a doubletap flow or single tap
                if (this.lastTapTime && this.lastElement && this.element && (this.lastElement === this.element)
                    && Math.abs(Date.now() - this.lastTapTime) < this.doubleTapDelay) {
                        this.lastTapTime = 0;
                        this.tapsNumber = 2;
                }
                else {
                    this.lastTapTime = Date.now();
                    this.tapsNumber = 1;
                    this.lastElement = this.element;
                }
            }
            this.log('captureTouchStart('+ this.startX +', '+ this.startY +')');
        };

        /**
         * Handler for `mousedown` or `touchstart`
         *
         * @private
         */
        this.startHandler = function (evt) {
            this.log('startHandler');
            clearTimeout(this.timer);
            delete this.timer;
            this.captureStart(evt);
            if(this.element) {
                this.touchStartCallback(evt, this.element);
                if (this.tapsNumber === 2) {
                    this.mode = 'double-tap';
                    return;
                }
                this.timer = setTimeout(function () {
                    this.log('mode switched to drag');
                    this.mode = 'drag';
                    this.createClone();
                }.bind(this), this.switchModeDelay);
            }
        }.bind(this);

        /**
         * Capture X and Y coordinates of touch move event
         *
         * @param {TouchEvent} evt - touch move event
         * @private
         */
        this.captureTouchMove = function (evt) {
            var touch;
            if(evt.touches.length === 1) {
                touch = evt.touches[0];
                this.moveX = touch.pageX;
                this.moveY = touch.pageY;
            }
            this.log('captureTouchMove(' + this.moveX + ', ' + this.moveY + ')');
        };

        /**
         * Handler for `mousemove` or `touchmove`
         *
         * @private
         */
        this.moveHandler = function(evt) {
            this.log('moveHandler');
            this.captureMove(evt);
            switch(this.mode) {
                case 'normal':
                    if (Math.abs(this.startX - this.moveX) > this.moveTolerance || Math.abs(this.startY - this.moveY) > this.moveTolerance) {
                        this.log('-> normal');
                        this.mode = 'scroll';
                        clearTimeout(this.timer);
                        delete this.timer;
                    }
                    break;
                case 'scroll':
                    this.log('-> scroll');
                    break;
                case 'drag':
                    evt.preventDefault();
                    this.log('-> drag');
                    this.mode = 'drag-and-scroll';
                    this.translateClone();
                    this.dragAndScroll();
                    this.touchDragCallback(evt, this.element);
                    break;
                case 'drag-and-scroll':
                    evt.stopPropagation();
                    evt.preventDefault();
                    this.log('-> drag-and-scroll');
                    this.translateClone();
                    this.dragAndScroll();
                    this.moveDraggable();
                    this.dragAndScrollCallback(evt, this.clone);
                    break;
            }
        }.bind(this);

        /**
         * Capture X and Y coordinates of touch end event
         *
         * @param {TouchEvent} evt - touch move event
         * @private
         */
        this.captureTouchEnd = function (evt) {
            var touch;
            if(evt.changedTouches.length === 1) {
                touch = evt.changedTouches[0];
                this.endX = touch.pageX;
                this.endY = touch.pageY;
            }
            this.log('captureTouchEnd('+ this.endX +', '+ this.endY +')');
        };

        /**
         * Handler for `contextmenu` event. Disable right click on Chrome
         *
         * @private
         */
        this.contextMenuHandler = function (evt) {
            evt.preventDefault();
        }.bind(this);

        /**
         *
         * @param event
         */
        this.clickHandler = function (event) {
            if (this.preventClickFlag) {
                this.preventClickFlag = false;
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                clearTimeout(this.preventClickTimeoutId);
            }
        }.bind(this);

        /**
         * This function solves a bug which causes the tile to be launched after D&D.
         */
        this.preventClick = function () {
            this.preventClickFlag = true;
            this.preventClickTimeoutId = setTimeout(function () {
                this.preventClickFlag = false;
            }, 100);
        };

        /**
         * Handler for `mouseup` or `touchend`
         *
         * @private
         */
        this.endHandler = function (evt) {
            this.log('endHandler');
            this.captureEnd(evt);
            switch(this.mode) {
                case 'normal':
                    this.log('-> normal');
                    break;
                case 'scroll':
                    this.log('-> scroll');
                    break;
                case 'drag':
                    this.log('-> drag');
                    this.removeClone();
                    this.touchEndCallback(evt, this.element);
                    this.preventClick();
                    break;
                case 'drag-and-scroll':
                    this.log('-> drag-and-scroll');
                    this.removeClone();
                    this.touchEndCallback(evt, this.element);
                    this.preventClick();
                    evt.stopPropagation();
                    evt.preventDefault();
                    break;
                case 'double-tap':
                    this.log('-> double-tap');
                    this.doubleTapCallback(evt, this.element);
                    break;
            }
            clearTimeout(this.timer);
            delete this.timer;
            this.lastMoveX = 0;
            this.lastMoveY = 0;
            this.mode = 'normal';
        }.bind(this);

        /**
         * Create clone of draggable element
         *
         * @private
         */
        this.createClone = function () {
            var style,
                rect;

            rect = this.element.getBoundingClientRect();
            this.clone = this.element.cloneNode(true);
            this.clone.className += (' ' + this.cloneClass);
            this.element.className += (' ' + this.placeHolderClass);
            style = this.clone.style;
            style.position = 'fixed';
            style.display = 'block';
            style.top = rect.top + 'px';
            style.left = rect.left + 'px';
            style.width = rect.width + 'px';
            style.zIndex = '100'
            style.webkitTransition = '-webkit-transform 0ms cubic-bezier(0.33, 0.66, 0.66, 1)';
            style.transition = '-webkit-transform 0ms cubic-bezier(0.33, 0.66, 0.66, 1)';
            style.webkitTransform = 'translate3d(0px, 0px, 0px) ';
            this.root.appendChild(this.clone);

            this.log('createClone');
        };

        /**
         * Remove clone of draggable element
         *
         * @private
         */
        this.removeClone = function () {
            this.element.className = this.element.className.split(' ' + this.placeHolderClass).join('');
            this.clone.parentElement.removeChild(this.clone);
            // unset reference to DOM element of the clone, otherwise it will remain DOM fragment
            this.clone = null;
            this.log('removeClone');
        };

        /**
         * Translate clone of draggable element
         *
         * @private
         */
        this.translateClone = function () {
            var deltaX,
                deltaY;

            deltaX = this.moveX - this.startX;
            deltaY = this.moveY - this.startY;
            this.clone.style.webkitTransform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0px)';

            this.log('translateClone (' + deltaX + ', ' + deltaY + ')');
        };

        /**
         * Scroll while dragging if needed
         *
         * @private
         */
        this.dragAndScroll = function () {
            var
            /*
             * Indicates how much pixels of draggable element are overflowing in a vertical axis.
             * When deltaY is negative - content should be scrolled down,
             * when deltaY is positive - content should be scrolled up,
             * when deltaY is zero - content should not be scrolled
             */
                deltaY,
            /*
             * Duration of scrolling animation in milliseconds.
             * Greater value makes scroll faster, lower values - smoother
             */
                duration,
                style,
                that;

            function startAnimation() {
                style.webkitTransition = '-webkit-transform ' + duration + 'ms linear';
                style.transition = '-webkit-transform ' + duration + 'ms linear';
                style.webkitTransform = 'translate(0px, ' + deltaY + 'px) scale(1) translateZ(0px)';
            }

            function clearAnimation() {
                style.webkitTransition = '';
                style.transition = '';
                style.webkitTransform = '';
                that.wrapper.scrollTop -= deltaY;
            }

            function getDeltaY() {
                var rect,
                    delta;

                if(that.clone) {
                    rect = that.clone.getBoundingClientRect();

                    // Up
                    delta = that.wrapper.offsetTop - rect.top;
                    if (delta > 0) {
                        return delta;
                    }

                    // Down
                    delta = that.wrapper.offsetTop + that.wrapper.offsetHeight - (rect.top + that.clone.offsetHeight);
                    if (delta < 0) {
                        return delta;
                    }
                }
                return 0;
            }

            function isScrollPossible() {
                //Down
                if (deltaY < 0) {
                    //Calculate the difference between (document - wrapper) and (difference between : document - wrapper + container height + wrapper height )
                    return that.wrapper.getBoundingClientRect().top - (that.container.getBoundingClientRect().top + that.container.offsetHeight) + that.wrapper.offsetHeight < 0;
                }
                //Up
                //Calculate the difference between (document - wrapper) and (document - container + container.top)
                return that.container.getBoundingClientRect().top - (that.wrapper.getBoundingClientRect().top + that.container.offsetTop) < 0;
            }

            function start() {
                startAnimation();
                that.dragAndScrollTimer = setTimeout(function() {
                    clearAnimation();
                    that.dragAndScrollTimer = undefined;
                    if((deltaY = getDeltaY()) !== 0 && isScrollPossible()) {
                        start();
                    }
                }, duration);
            }

            that = this;
            deltaY = getDeltaY();
            if(deltaY !== 0 && !this.dragAndScrollTimer && isScrollPossible()) {
                duration = this.dragAndScrollDuration;
                style = this.container.style;
                start();
            }

            this.log('dragAndScroll (' + deltaY + ')');
        };

        /**
         * Move draggable element forward and backward
         * across another draggable elements
         *
         * @private
         */
        this.moveDraggable = function() {
            var elementIndex,
                hoverElement,
                hoverElementIndex,
                isHorizontalIntersection,
                isVerticalIntersection,
                rect,
                style;



            this.forEach(this.draggable, function(item, index) {
                /*
                 * There is no way to break native forEach,
                 * so just speed it up using fast check
                 * before executing expensive DOM manipulations
                 */
                if(!hoverElement) {
                    rect = item.getBoundingClientRect();
                    style = window.getComputedStyle(item);
                    isHorizontalIntersection = !(rect.right < this.moveX || rect.left > this.moveX);
                    isVerticalIntersection = !(rect.bottom < this.moveY || rect.top > this.moveY);
                    if(isHorizontalIntersection && isVerticalIntersection) {
                        hoverElement = item;
                        hoverElementIndex = index;
                    }
                }
            }.bind(this));

            if(hoverElement && this.element !== hoverElement) {

                /*
                 * Reorder draggable elements
                 */
                elementIndex = this.indexOf(this.draggable, this.element);
                //Check if there was enough movement in order to mover the element
                if (Math.abs(this.lastMoveX - this.moveX) >= this.moveTolerance && Math.abs(this.lastMoveY - this.moveY) >= this.moveTolerance) {
                    if (hoverElementIndex < elementIndex) {
                        hoverElement.parentNode.insertBefore(this.element, hoverElement);
                        this.insertBefore(this.draggable, this.element, hoverElement);
                    } else if (hoverElementIndex > elementIndex) {
                        hoverElement.parentNode.insertBefore(this.element, hoverElement.nextSibling);
                        this.insertBefore(this.draggable, this.element, this.draggable[hoverElementIndex + 1]);
                    }
                    this.lastMoveX = this.moveX;
                    this.lastMoveY = this.moveY;
                }
            }

            this.log('moveDraggable');
        };

        /* PUBLIC METHODS */

        /**
         * Enable feature
         *
         * @public
         */
        this.enable = function () {
            this.log('enable');
            this.root.addEventListener(this.startEvent, this.startHandler, false);
            this.root.addEventListener(this.moveEvent, this.moveHandler, true);
            this.root.addEventListener(this.endEvent, this.endHandler, false);
            this.root.addEventListener(this.contextMenuEvent, this.contextMenuHandler, false);
            this.root.addEventListener(this.clickEvent, this.clickHandler, true);
            this.root.addEventListener(this.touchCancelEvent, this.endHandler, false);

            return this;
        };

        /**
         * Disable feature
         *
         * @public
         */
        this.disable = function () {
            this.log('disable');
            this.root.removeEventListener(this.startEvent, this.startHandler, false);
            this.root.removeEventListener(this.moveEvent, this.moveHandler, true);
            this.root.removeEventListener(this.endEvent, this.endHandler, false);
            this.root.removeEventListener(this.contextMenuEvent, this.contextMenuHandler, false);
            this.root.removeEventListener(this.clickEvent, this.clickHandler, true);
            this.root.removeEventListener(this.touchCancelEvent, this.endHandler, false);

            return this;
        };

        /*
         * Initialize dynamic feature state
         * and behaviour using configuration
         */
        this.init(cfg);
    };
})();
