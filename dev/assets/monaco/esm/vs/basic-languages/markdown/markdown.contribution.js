/*! For license information please see markdown.contribution.js.LICENSE.txt */
import{registerLanguage}from"../_.contribution.js";registerLanguage({id:"markdown",extensions:[".md",".markdown",".mdown",".mkdn",".mkd",".mdwn",".mdtxt",".mdtext"],aliases:["Markdown","markdown"],loader:()=>import("./markdown.js")});