/*! For license information please see go.contribution.js.LICENSE.txt */
import{registerLanguage}from"../_.contribution.js";registerLanguage({id:"go",extensions:[".go"],aliases:["Go"],loader:()=>import("./go.js")});