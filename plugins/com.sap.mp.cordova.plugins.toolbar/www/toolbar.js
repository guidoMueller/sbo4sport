// 3.7.1
var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    items = [],
    callbacks = [];

/**
 * The toolbar plugin allows an application to create a native toolbar using JavaScript.
 * On Android, a double tap gesture is used to display/hide the toolbar.
 * On iOS, A long press with 2 fingers will display the toolbar.
 * @namespace
 * @alias Toolbar
 * @memberof sap
 */
var toolbar = {
    /**
     * Adds an item to the toolbar.
     * @param {Object} item - Properties used for creating the toolbar item.
     * @param {String} item.label - The text for the toolbar item.
     * @param {String} item.icon - The name of the icon to display for the toolbar item.  The name is resolved to the platforms assets.
     * @param {number} item.showAsAction - Sets how this item should be display with the Action Bar.  One of `SHOW_AS_ACTION_ALWAYS`, `SHOW_AS_ACTION_IF_ROOM`, or `SHOW_AS_ACTION_NEVER`.  Optionally you may OR the value with `SHOW_AS_ACTION_WITH_TEXT`.  Defaults to `SHOW_AS_ACTION_NEVER`.  Android Only.  
     * @param {Function} callback - Callback function that is invoked when the item is clicked.
     * @example
     * sap.Toolbar.addItem({ "label" : "Refresh", "icon" : "smp_reload", "showAsAction" : sap.Toolbar.SHOW_AS_ACTION_ALWAYS }, function() {
     *     window.location.reload();
     * });
     */
    addItem : function(item, callback) {
        argscheck.checkArgs("of", "toolbar.addItem", arguments);
        items.push(item);
        callbacks.push(callback);
    },
    /**
     * Clears all the items from the toolbar.
     * @param {Function} callback - Callback function that is invoked when the clear is finished.
     * @example
     * sap.Toolbar.clear(function() {
     *     console.log("Cleared toolbar");
     * });
     */
    clear : function(callback) {
    	items = [];
        callbacks = [];
    	
        exec(callback, callback, "toolbar", "clear", []);
    },
    /**
     * Always show this item as a button in an Action Bar.  It is recommended that at most 2 items have this set.  Android Only.
     * @constant
     * @type {number}
     */
    SHOW_AS_ACTION_ALWAYS : 2,
    /**
     * Show this item as a button in an Action Bar if the system decides there is room for it.  Android Only.
     * @constant
     * @type {number}
     */
    SHOW_AS_ACTION_IF_ROOM : 1,
    /**
     * Never show this item as a button in an Action Bar.  Android Only.
     * @constant
     * @type {number}
     */
    SHOW_AS_ACTION_NEVER : 0,
    /**
     * When this item is in the action bar, always show it with a text label even if it also has an icon specified.  Android Only.
     * @constant
     * @type {number}
     */
    SHOW_AS_ACTION_WITH_TEXT : 4
};

var isShowing = false;

function apply(x, y)
{
	exec(function(index) {
		if (index >= 0) {
			if (callbacks && index < callbacks.length) {
				callbacks[index].apply(null, null);
			}
		}
	}, null, "toolbar", "apply", [items, x, y]);
}

toolbar.show = function(x, y){
    apply(x, y);
    isShowing = true;
}

document.addEventListener("deviceready", function(){
	var lastTouch = 0;
	document.addEventListener("touchstart",function(e){
		var thisTouch = new Date().getTime();
		var difference = thisTouch - lastTouch;
		if (difference <= 300) {
			apply(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
			isShowing = !isShowing;
		}
		lastTouch = thisTouch;
	});
		
	// Clear toolbar with Cordova load.
	toolbar.clear();

	// If the menu button is pressed, make sure the toolbar is showing
	// (otherwise the menu buttons will not work).
	document.addEventListener("menubutton", function(){
			if (!isShowing) {
				apply(0, 0);
				isShowing = !isShowing;
			}
	}, false);
});

module.exports = toolbar;
