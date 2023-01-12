export function isArray(array){return Array.isArray(array)}export function isString(str){return"string"==typeof str}export function isObject(obj){return!("object"!=typeof obj||null===obj||Array.isArray(obj)||obj instanceof RegExp||obj instanceof Date)}export function isTypedArray(obj){const TypedArray=Object.getPrototypeOf(Uint8Array);return"object"==typeof obj&&obj instanceof TypedArray}export function isNumber(obj){return"number"==typeof obj&&!isNaN(obj)}export function isIterable(obj){return!!obj&&"function"==typeof obj[Symbol.iterator]}export function isBoolean(obj){return!0===obj||!1===obj}export function isUndefined(obj){return void 0===obj}export function isDefined(arg){return!isUndefinedOrNull(arg)}export function isUndefinedOrNull(obj){return isUndefined(obj)||null===obj}export function assertType(condition,type){if(!condition)throw new Error(type?`Unexpected type, expected '${type}'`:"Unexpected type")}export function assertIsDefined(arg){if(isUndefinedOrNull(arg))throw new Error("Assertion Failed: argument is undefined or null");return arg}export function isFunction(obj){return"function"==typeof obj}export function validateConstraints(args,constraints){const len=Math.min(args.length,constraints.length);for(let i=0;i<len;i++)validateConstraint(args[i],constraints[i])}export function validateConstraint(arg,constraint){if(isString(constraint)){if(typeof arg!==constraint)throw new Error(`argument does not match constraint: typeof ${constraint}`)}else if(isFunction(constraint)){try{if(arg instanceof constraint)return}catch(_a){}if(!isUndefinedOrNull(arg)&&arg.constructor===constraint)return;if(1===constraint.length&&!0===constraint.call(void 0,arg))return;throw new Error("argument does not match one of these constraints: arg instanceof constraint, arg.constructor === constraint, nor constraint(arg) === true")}}export function getAllPropertyNames(obj){let res=[],proto=Object.getPrototypeOf(obj);for(;Object.prototype!==proto;)res=res.concat(Object.getOwnPropertyNames(proto)),proto=Object.getPrototypeOf(proto);return res}export function getAllMethodNames(obj){const methods=[];for(const prop of getAllPropertyNames(obj))"function"==typeof obj[prop]&&methods.push(prop);return methods}export function createProxyObject(methodNames,invoke){const createProxyMethod=method=>function(){const args=Array.prototype.slice.call(arguments,0);return invoke(method,args)},result={};for(const methodName of methodNames)result[methodName]=createProxyMethod(methodName);return result}export function withNullAsUndefined(x){return null===x?void 0:x}export function assertNever(value,message="Unreachable"){throw new Error(message)}