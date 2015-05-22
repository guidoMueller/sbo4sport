// Copyright (c) 2013 SAP AG, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.services.LaunchPage");sap.ushell.services.LaunchPage=function(a,c){var t=this;this.getGroups=function(){var p=a.getGroups();p.fail(function(){jQuery.sap.log.error("getGroups failed")});return p};this.getDefaultGroup=function(){var p=a.getDefaultGroup();p.fail(function(){jQuery.sap.log.error("getDefaultGroup failed")});return p};this.getGroupTitle=function(g){return a.getGroupTitle(g)};this.getGroupId=function(g){return a.getGroupId(g)};this.getGroupTiles=function(g){return a.getGroupTiles(g)};this.addGroup=function(T){var p=a.addGroup(T);p.fail(function(){jQuery.sap.log.error("addGroup "+T+" failed")});return p};this.removeGroup=function(g,i){var p=a.removeGroup(g,i);p.fail(function(){jQuery.sap.log.error("Fail to removeGroup "+t.getGroupTitle(g))});return p};this.resetGroup=function(g,i){var p=a.resetGroup(g,i);p.fail(function(){jQuery.sap.log.error("Fail to resetGroup "+t.getGroupTitle(g))});return p};this.isGroupRemovable=function(g){return a.isGroupRemovable(g)};this.moveGroup=function(g,n){var p=a.moveGroup(g,n);p.fail(function(){jQuery.sap.log.error("Fail to moveGroup "+t.getGroupTitle(g))});return p};this.setGroupTitle=function(g,T){var p=a.setGroupTitle(g,T);p.fail(function(){jQuery.sap.log.error("Fail to set Group title: "+t.getGroupTitle(g))});return p};this.hideGroups=function(h){var d=jQuery.Deferred();if(typeof a.hideGroups!=="function"){d.reject('hideGroups() is not implemented in the Adapter.')}else{a.hideGroups(h).done(function(){d.resolve()}).fail(function(m){jQuery.sap.log.error("Fail to store groups visibility."+m);d.reject()})}return d.promise()};this.isGroupVisible=function(g){if(typeof a.isGroupVisible==="function"){return a.isGroupVisible(g)}return true};this.addTile=function(C,g){var p=a.addTile(C,g);p.fail(function(){jQuery.sap.log.error("Fail to add Tile: "+t.getCatalogTileId(C))});return p};this.removeTile=function(g,T,i){var p=a.removeTile(g,T,i);p.fail(function(){jQuery.sap.log.error("Fail to remove Tile: "+t.getTileId(T))});return p};this.moveTile=function(T,s,i,S,o){var p=a.moveTile(T,s,i,S,o);p.fail(function(){jQuery.sap.log.error("Fail to move Tile: "+t.getTileId(T))});return p};this.getTileId=function(T){return a.getTileId(T)};this.getTileTitle=function(T){return a.getTileTitle(T)};this.getTileView=function(T){var d=a.getTileView(T);if(!jQuery.isFunction(d.promise)){d=jQuery.Deferred().resolve(d).promise()}return d};this.getTileSize=function(T){return a.getTileSize(T)};this.getTileTarget=function(T){return a.getTileTarget(T)};this.getTileDebugInfo=function(T){if(typeof a.getTileDebugInfo==="function"){return a.getTileDebugInfo(T)}return undefined};this.isTileIntentSupported=function(T){if(typeof a.isTileIntentSupported==="function"){return a.isTileIntentSupported(T)}return true};this.refreshTile=function(T){a.refreshTile(T)};this.setTileVisible=function(T,n){return a.setTileVisible(T,n)};this.getCatalogs=function(){return a.getCatalogs()};this.isCatalogsValid=function(){return a.isCatalogsValid()};this.getCatalogData=function(C){if(typeof a.getCatalogData!=="function"){jQuery.sap.log.warning("getCatalogData not implemented in adapter",null,"sap.ushell.services.LaunchPage");return{id:this.getCatalogId(C)}}return a.getCatalogData(C)};this.getCatalogError=function(C){return a.getCatalogError(C)};this.getCatalogId=function(C){return a.getCatalogId(C)};this.getCatalogTitle=function(C){return a.getCatalogTitle(C)};this.getCatalogTiles=function(C){var p=a.getCatalogTiles(C);p.fail(function(){jQuery.sap.log.error("Fail to get Tiles of Catalog: "+t.getCatalogTitle(C))});return p};this.getCatalogTileId=function(T){return a.getCatalogTileId(T)};this.getCatalogTileTitle=function(C){return a.getCatalogTileTitle(C)};this.getCatalogTileSize=function(C){return a.getCatalogTileSize(C)};this.getCatalogTileView=function(C){return a.getCatalogTileView(C)};this.getCatalogTileTargetURL=function(C){return a.getCatalogTileTargetURL(C)};this.getCatalogTileKeywords=function(C){return a.getCatalogTileKeywords(C)};this.getCatalogTilePreviewTitle=function(C){return a.getCatalogTilePreviewTitle(C)};this.getCatalogTilePreviewIcon=function(C){return a.getCatalogTilePreviewIcon(C)};this.addBookmark=function(p,g){if(!p.title){jQuery.sap.log.error("Add Bookmark - Missing title");throw new Error("Title missing in bookmark configuration")}if(!p.url){jQuery.sap.log.error("Add Bookmark - Missing URL");throw new Error("URL missing in bookmark configuration")}var P=a.addBookmark(p,g);P.fail(function(){jQuery.sap.log.error("Fail to add bookmark for URL: "+p.url+" and Title: "+p.title)});return P};this.countBookmarks=function(u){if(!u||typeof u!=="string"){jQuery.sap.log.error("Fail to count bookmarks. No valid URL");throw new Error("Missing URL")}var p=a.countBookmarks(u);p.fail(function(){jQuery.sap.log.error("Fail to count bookmarks")});return p};this.deleteBookmarks=function(u){if(!u||typeof u!=="string"){throw new Error("Missing URL")}var p=a.deleteBookmarks(u);p.fail(function(){jQuery.sap.log.error("Fail to delete bookmark for: "+u)});return p};this.updateBookmarks=function(u,p){if(!u||typeof u!=="string"){jQuery.sap.log.error("Fail to update bookmark. No valid URL");throw new Error("Missing URL")}if(!p||typeof p!=="object"){jQuery.sap.log.error("Fail to update bookmark. No valid parameters, URL is: "+u);throw new Error("Missing parameters")}var P=a.updateBookmarks(u,p);P.fail(function(){jQuery.sap.log.error("Fail to update bookmark for: "+u)});return P};this.onCatalogTileAdded=function(T){return a.onCatalogTileAdded(T)}}}());