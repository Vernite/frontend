/*! For license information please see qsharp.contribution.js.LICENSE.txt */
import{registerLanguage}from"../_.contribution.js";registerLanguage({id:"qsharp",extensions:[".qs"],aliases:["Q#","qsharp"],loader:()=>import("./qsharp.js")});