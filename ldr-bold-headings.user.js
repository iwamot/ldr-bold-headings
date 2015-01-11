// ==UserScript==
// @name         LDR - Bold Headings
// @namespace    http://iwamot.com/
// @version      0.0.3
// @description  見出しと思われる部分を見出しっぽくします
// @author       IWAMOTO Takashi <hello@iwamot.com> http://iwamot.com/
// @match        http://reader.livedoor.com/reader/*
// @grant        GM_addStyle
// @homepage     https://github.com/iwamot/ldr-bold-headings
// @updateURL    https://github.com/iwamot/ldr-bold-headings/raw/master/ldr-bold-headings.user.js
// ==/UserScript==

(function(w) {
  GM_addStyle('div.LDRBH {font-weight: bold !important; font-size: 1.1em !important; margin-top: 2.2em !important; margin-bottom: 1.1em !important}');

  w.register_hook('after_printfeed', function(feed) {
    feed.items.forEach(function(item) {
      (function(divId) {
        if (!document.getElementById(divId)) {
          var self = arguments.callee;
          setTimeout(function(){self(divId);}, 500);
          return;
        }

        var nodesSnapshot = document.evaluate('//div[@id="' + divId + '"]/div/node()', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        var inlineNodes = [];
        for (var i = 0, j = nodesSnapshot.snapshotLength; i < j; i++) {
          var node = nodesSnapshot.snapshotItem(i);
          if (node.nodeType == 3 || !isBlockElement(node)) {
            if (/[^\t\n\r ]/.test(node.textContent)) {
              inlineNodes.push(node);
            }
            continue;
          }

          if (inlineNodes.length > 0) {
            var div = document.createElement('div');
            div.className = 'LDRBH';
            inlineNodes.forEach(function(node) {div.appendChild(node.cloneNode(true));});
            inlineNodes[0].parentNode.insertBefore(div, inlineNodes[0]);
            inlineNodes.forEach(function(node) {node.parentNode.removeChild(node);});
            inlineNodes = [];
          }
        }
      })('item_body_' + item.id);
    });
  });

  function isBlockElement(node) {
    switch (node.tagName.toLowerCase()) {
    case 'p':
    case 'div':
    case 'table':
    case 'dl':
    case 'ul':
    case 'ol':
    case 'form':
    case 'address':
    case 'blockquote':
    case 'fieldset':
    case 'pre':
      return true;
    default:
      return false;
    }
  }
})(this.unsafeWindow);
