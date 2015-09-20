/*!
 * Stiles 1.0
 * @author Andy Mikulski <github.com/andymikulski>
 */

;
(function(window, document, undefined) {
  window.Stiles = (function(Stiles) {
    var styles = {},
      privateStyles = null;

    /**
     * Constructor
     */
    function Stiles(styles) {
      polluteGlobal();

      if (styles) {
        Stilinski(styles);
      }

      return this;
    }

    function Stilinski(styles) {

      if (!styles) {
        return;
      }

      styles = styles;

      privateStyles = createPrivateStyles();
      analyzeStyles(styles);
    }

    function polluteGlobal() {
      // cant use bracket notation here.. so...
      window.block = 'block';
      window.absolute = 'absolute';
      window.fixed = 'fixed';
      window.none = 'none';
      window.hidden = 'hidden';
      window.visible = 'visible';
      //..yeah..
    }

    function createPrivateStyles() {

      // only create one stylesheet, ever
      if (privateStyles) {
        return styles.privateStyles;
      }

      var style = document.createElement('style');
      style.appendChild(document.createTextNode(''));
      document.head.appendChild(style);

      return style.sheet;
    }

    function analyzeStyles(tree, groupName) {


      if (!groupName) {
        groupName = '';
      }

      var totalRules = '',
        definedValue;

      for (var selector in tree) {
        definedValue = tree[selector];

        if (selector.charAt(0) === '&') {
          selector = selector.substr(1);
        } else {
          selector = ' ' + selector;
        }

        if (typeof definedValue === 'object') {
          analyzeStyles(definedValue, groupName + selector);
        } else {
          totalRules += selector + ':' + definedValue + ';';
        }
      }

      if (groupName) {
        addCSSRule(groupName, totalRules);
      }
    }

    function addCSSRule(selector, rules, index) {
      var sheet = privateStyles;

      if ('insertRule' in sheet) {
        sheet.insertRule(selector + '{' + rules + '}', index);
      } else if ('addRule' in sheet) {
        sheet.addRule(selector, rules, index);
      }
    }

    return Stiles;
  })(window.Stiles || {});

  // pollute globals
  new Stiles();
})(window, document);
