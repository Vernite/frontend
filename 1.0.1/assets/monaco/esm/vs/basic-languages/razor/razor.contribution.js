/*! For license information please see razor.contribution.js.LICENSE.txt */
import{registerLanguage}from"../_.contribution.js";registerLanguage({id:"razor",extensions:[".cshtml"],aliases:["Razor","razor"],mimetypes:["text/x-cshtml"],loader:()=>import("./razor.js")});