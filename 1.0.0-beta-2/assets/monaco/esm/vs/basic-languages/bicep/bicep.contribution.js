/*! For license information please see bicep.contribution.js.LICENSE.txt */
import{registerLanguage}from"../_.contribution.js";registerLanguage({id:"bicep",extensions:[".bicep"],aliases:["Bicep"],loader:()=>import("./bicep.js")});