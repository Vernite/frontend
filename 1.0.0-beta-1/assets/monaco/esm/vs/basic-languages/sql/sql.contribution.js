/*! For license information please see sql.contribution.js.LICENSE.txt */
import{registerLanguage}from"../_.contribution.js";registerLanguage({id:"sql",extensions:[".sql"],aliases:["SQL"],loader:()=>import("./sql.js")});