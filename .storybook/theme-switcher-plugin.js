// var observeDOM = (function () {
//   var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

//   return function (obj, callback) {
//     if (!obj || obj.nodeType !== 1) return;

//     if (MutationObserver) {
//       // define a new observer
//       var mutationObserver = new MutationObserver(callback)

//       // have the observer observe foo for changes in children
//       mutationObserver.observe(obj, { childList: true, subtree: true })
//       return mutationObserver
//     }

//     // browser support fallback
//     else if (window.addEventListener) {
//       obj.addEventListener('DOMNodeInserted', callback, false)
//       obj.addEventListener('DOMNodeRemoved', callback, false)
//     }
//   }
// })()

// console.log(document.body);

// document.addEventListener('DOMContentLoaded', () => {
//   setTimeout(() => {
//     console.log(document.body);
//     const themeLabel = document.querySelector('[title*=theme]');

//     console.log(themeLabel);

//     observeDOM(themeLabel, (res) => {
//       console.log(res);
//     });
//   }, 2000);
// });

// console.log(document.body);
