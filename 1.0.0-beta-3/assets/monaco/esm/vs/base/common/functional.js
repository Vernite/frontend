export function once(fn){const _this=this;let result,didCall=!1;return function(){return didCall||(didCall=!0,result=fn.apply(_this,arguments)),result}}