/*!
 * Stiles 1.0
 * @author Andy Mikulski <github.com/andymikulski>
 * @url https://github.com/andymikulski/stiles
 */

;
(function(window, document, undefined) {
  window.Stiles = (function(Stiles) {
    var styles = {},
      privateStyles = null;

    /**
     * Stiles constructor.
     * Accepts a 1-to-1 map of CSS definitions, properties, and values.
     * Passing an empty object will still pollute the global namespace.
     *
     * @param {Object} styles? Hashmap of CSS definitions
     */
    function Stiles(styles) {
      // if we actually have a style map,
      // we'll complete the Stiles.Stilinski formula
      if (styles) {
        Stilinski(styles);
      }

      return this;
    }


    /**
     * CSS style parser and injector.
     * This is the 'action' method, where the styles passed in are ultimately
     * led to their injection. This can be considered the 'refresh' method,
     * as well.
     *
     * @param {Object} styles Hashmap of CSS definitions
     */
    function Stilinski(styles) {
      if (!styles) {
        return;
      }

      // generate the private stylesheet for this Stiles instance
      privateStyles = createPrivateStyles();

      // kick off the CSS parsing
      analyzeStyles(styles);
    }


    /**
     * Generates a new stylesheet element and inserts it into the page,
     * which is later used to hold the parsed CSS style declarations
     *
     * @return {CSSStyleSheet} Blank stylesheet.
     */
    function createPrivateStyles() {

      // only create one stylesheet, ever
      if (privateStyles) {
        return styles.privateStyles;
      }

      // generate a new style element
      var style = document.createElement('style');
      // webkit needs something in it
      style.appendChild(document.createTextNode(''));
      document.head.appendChild(style);

      // return the actual style sheet so we can insert rules into it later
      return style.sheet;
    }


    /**
     * Recursive function to analyze an object,
     * and build CSS Rules from its properties and nested objects.
     *
     * @param  {Object} tree            Hashmap of CSS definitions to traverse
     * @param  {String} parentSelector? Selector of parent, if nested
     * @return {String}                 Fully resolved CSS definition in `selector { property: value }` format
     */
    function analyzeStyles(tree, parentSelector) {
      // No parent selector means we're probably at the top of the tree
      if (!parentSelector) {
        parentSelector = '';
      }

      // combined/calculated css property/values (returned later)
      var totalRules = '',
        // loop variable
        definedValue;

      // for each selector presented in our CSS tree,
      // we'll traverse and update the selector's CSS,
      // or ask that another branch be analyzed if necessary
      for (var selector in tree) {
        // grab the value of whatever we're looking at
        definedValue = tree[selector];

        // need to change the spacing if & is present,
        // cause that chagnes if it's a modifier or a child class
        if (selector.charAt(0) === '&') {
          // entries starting with a & is a modifier class
          // e.g. `&.is-something`
          selector = selector.substr(1);
        } else {
          // else, it's a child
          // e.g. `.child-element`
          selector = ' ' + selector;
        }


        // if what we're looking at is an object,
        // we need to DIVE DEEPER AND CHECK IT OUT
        if (typeof definedValue === 'object') {
          // we just recursively analyze the styles in this new sub-tree
          analyzeStyles(definedValue, parentSelector + selector);
          // this will force the tree to be fully traversed,
          // even the really nested parts
        } else {
          // else we're just looking at some CSS stuff,
          // so we'll add it to the current selector's lineup
          totalRules += selector + ':' + definedValue + ';';
        }
      }

      // if we have a selector
      // (e.g. if we're not at the top of the tree or something)
      // add the new CSS definition into the dom
      if (parentSelector) {
        addCSSRule(parentSelector, totalRules);
      }

      // for good measure, return it as a string in case it's needed or something
      return parentSelector + '{ ' + totalRules + ' }';
    }


    /**
     * Utility function to insert CSS rules into the dom.
     *
     * @param {String} selector The element selector to apply the CSS rules to
     * @param {String} rules    A single string of CSS property/values to apply to the selector
     * @param {Number} index?   Optional order in which to add the style declarations. Defaults to the bottom of the stack.
     */
    function addCSSRule(selector, rules, index) {
      var sheet = privateStyles || createPrivateStyles();

      if ('insertRule' in sheet) {
        sheet.insertRule(selector + '{' + rules + '}', index);
      } else if ('addRule' in sheet) {
        sheet.addRule(selector, rules, index);
      }
    }

    return Stiles;
  })(window.Stiles || {});

})(window, document);
