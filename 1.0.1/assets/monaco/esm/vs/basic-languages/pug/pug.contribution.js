/*! For license information please see pug.contribution.js.LICENSE.txt */
import{registerLanguage}from"../_.contribution.js";registerLanguage({id:"pug",extensions:[".jade",".pug"],aliases:["Pug","Jade","jade"],loader:()=>import("./pug.js")});