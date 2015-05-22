/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.utils.hashtable');
sap.apf.utils.Hashtable=function(m,o){var n=0;var i={};this.type="hashTable";this.setItem=function(k,v){var p;m.check((k!==undefined&&k!==null),"sap.apf.utils.HashTable.setItem key undefined");m.check((v!==undefined&&v!==null),"sap.apf.utils.HashTable.setItem value undefined");if(this.hasItem(k)){p=i[k]}else{n++}i[k]=v;return p};this.getNumberOfItems=function(){return n};this.getItem=function(k){m.check((k!==undefined&&k!==null),"sap.apf.utils.HashTable.getItem key undefined");return this.hasItem(k)?i[k]:undefined};this.hasItem=function(k){m.check((k!==undefined&&k!==null),"sap.apf.utils.HashTable.hasItem key undefined");return i.hasOwnProperty(k)};this.removeItem=function(k){m.check((k!==undefined&&k!==null),"sap.apf.utils.HashTable.removeItem key undefined");var I;if(this.hasItem(k)){I=i[k];n--;delete i[k];return I}else{return undefined}};this.getKeys=function(){var K=[];for(var k in i){if(this.hasItem(k)){K.push(k)}}return K};this.each=function(f){for(var k in i){if(this.hasItem(k)){f(k,i[k])}}};this.reset=function(){i={};n=0}};
