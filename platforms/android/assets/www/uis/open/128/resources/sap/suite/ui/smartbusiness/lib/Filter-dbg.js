

jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.Filter");
sap.ui.core.Control.extend("sap.suite.ui.smartbusiness.lib.Filter", {
	metadata : {
		properties : {
			evaluationId:"string",
			dimensions : {
				type : "any",
				defaultValue : []
			},
			visible:{
				type:"boolean",
				defaultValue:true
			},
			advancedSetting : {
				type : "object",
				defaultValue : {}
			},
			mode:{
				type:"string",
				defaultValue:"Runtime"
			},
			suppressAction:{
				type:"boolean",
				defaultValue:false
			},
			sapSystem : {
				type : "string",
				defaultValue : null
			}
		},
		aggregations : {
			"_filter" : {
				type : "sap.ui.core.Control",
				multiple : false,
				visibility : "hidden"
			},
			"_popover":{
				type:"sap.m.Popover",
				multiple:false,
				visibility:"hidden"
			}
		},
		events : {
			filterChange : {}
		}
	},
	renderer : function(oRm, oControl) {
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("SmartBusinessFilter");
		oRm.writeClasses();
		oRm.write(">");
		oRm.renderControl(oControl.getAggregation("_filter"));
		oRm.write("</div>");
	}
});
sap.suite.ui.smartbusiness.lib.Filter.prototype.init  = function() {
	this._filterObj={};
	if(sap.ushell && sap.ushell.Container) {
		this.urlParsingService = sap.ushell.Container.getService("URLParsing");
	}
	else {
		this.urlParsingService = undefined;
	}
	//this.urlParsingService = sap.ushell.Container.getService("URLParsing");
};
sap.suite.ui.smartbusiness.lib.Filter.prototype.onBeforeRendering = function() {
	if(this.getEvaluationId()){
		try{
			this._updateOdataProperties();
			this._facetListsReference={};
			var childControl=this._getChildControl();
			childControl.setVisible(this.getVisible());
			this.setAggregation("_filter",childControl );
			this._initModel();
			if(this.getMode()=="Runtime"){
				this._addDimensions(this.getDimensions());
			}else{
				this._addDimensionsDesignTime(this.getDimensions());
			}
		}catch(e){}
	}
};
sap.suite.ui.smartbusiness.lib.Filter.prototype.onAfterRendering = function() {
	this.refreshFilter(true);
};
sap.suite.ui.smartbusiness.lib.Filter.prototype.getFacetFilterReference  = function() {
	return this.getAggregation("_filter");
};
sap.suite.ui.smartbusiness.lib.Filter.prototype.getSelectedItems  = function() {
	var filter= this.getAggregation("_filter");
	var list= filter.getLists();
	var c=0;
	for(var i=0;i<list.length;i++){
		if(list[i].getSelectedItems().length>0){
			c++;
		}
	}
	if(c>0)
	{
		return true;
	}else{
		return false;
	}

};
//sap.suite.ui.smartbusiness.lib.Filter.prototype.setVisible=function(visibility){
//if(visibility){
//this.$().show();
//}else{
//this.$().hide();
//}
//}
sap.suite.ui.smartbusiness.lib.Filter.prototype._updateOdataProperties=function(){
	if(this.urlParsingService) {
		this._serviceUri = this.urlParsingService.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.getSapSystem());	
	}
	else {
		this._serviceUri = this.EVALUATION.getODataUrl();
	}
	//this._serviceUri = this.urlParsingService.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.getSapSystem());
	this._entitySet = this.EVALUATION.getEntitySet();
};
sap.suite.ui.smartbusiness.lib.Filter.prototype._getChildControl=function(){
	var control,that=this;
	function _getInHBoxWrapper(oControl, width){
		return new sap.m.HBox({
			items:oControl,
			width:width
		})
	}
	if(this.getMode()=="Runtime"){
		control= new sap.m.FacetFilter({
			showReset:true,
			showPersonalization:true,
			reset:jQuery.proxy(function(){
				that.resetFilter.call(this);
			},this)
		});
	}else{ 
		this._facetContainer=new sap.m.ScrollContainer({
			vertical:false,
			horizontal:true,
		}).addStyleClass("facetFilterContainer");
		control= new sap.m.HBox({
			justifyContent:"SpaceBetween",
			alignItems:"Center",
			items:[   _getInHBoxWrapper([this._facetContainer]),
			          _getInHBoxWrapper([new sap.m.Button({
			        	  icon:"sap-icon://undo",
			        	  type:"Transparent",
			        	  press:function(){
			        		  if(!that.getSuppressAction()){ that.rerender();}
			        	  }
			          }),
			          new sap.m.Button({
			        	  icon:"sap-icon://add-filter",
			        	  type:"Transparent",
			        	  press:function(){
			        		  if(!that.getSuppressAction()){
			        			  that._popover.openBy(this);
			        		  }    
			        	  }
			          })])]
		});
	}
	return control;
};
sap.suite.ui.smartbusiness.lib.Filter.prototype.resetFilter=function(){
	this._filterObj=sap.suite.smartbusiness.url.hash.getApplicationParameters();
	var viewId=sap.suite.smartbusiness.url.hash.getApplicationParameters().viewId[0];
	var newUrlParams={viewId:[viewId]};
	var that=this;
	var dimensions= sap.suite.smartbusiness.odata.getAllDimensions(this._serviceUri,this._entitySet);
	dimensions.forEach(function(s){
		delete that._filterObj[s];
	});
	for(var each in this._filterObj){
		newUrlParams[each]=this._filterObj[each];
	}
	sap.suite.smartbusiness.url.hash.setApplicationParameters(newUrlParams);
	this.rerender();
};
sap.suite.ui.smartbusiness.lib.Filter.prototype._addDimensions = function(dimensions) {
	var allDimensions=[];
	if(dimensions && dimensions.length) {
		if(typeof dimensions == 'string') {
			dimensions = dimensions.split(",");
		}
	}
	if(this.getEvaluationId()){
		var deltaDimensions=sap.suite.smartbusiness.odata.getAllDimensions(this._serviceUri,this._entitySet);
	}
	for(var i=0;i<dimensions.length;i++){
		allDimensions.push({name:dimensions[i],isDelta:false});
	}
	for(var i=0;i<deltaDimensions.length;i++){
		if(dimensions.indexOf(deltaDimensions[i])==-1)
			allDimensions.push({name:deltaDimensions[i],isDelta:true});
	}
	var mProperties=sap.suite.smartbusiness.odata.properties(this._serviceUri,this._entitySet);
	var COLUMN_LABEL_MAPPING = mProperties.getLabelMappingObject();
	try{
		allDimensions.sort(function(a,b){return COLUMN_LABEL_MAPPING[a.name]>COLUMN_LABEL_MAPPING[b.name]?1:-1;});
	}catch(e){jQuery.sap.log.error(e);}
	
	for(var i = 0; i < allDimensions.length ; i++) {
		this.addFacetList(allDimensions[i].name,allDimensions[i].isDelta);
	}
	
};
sap.suite.ui.smartbusiness.lib.Filter.prototype.facetListClosed = function(oEvent) {
	this.fireFilterChange(oEvent);
};
sap.suite.ui.smartbusiness.lib.Filter.prototype.setEvaluationData = function(evaluation) {
	this.EVALUATION = evaluation;
};

sap.suite.ui.smartbusiness.lib.Filter.prototype.getSelectedKeys=function(oList){
	var selectedKeys=[];
	if(oList.getActive()){
		var items=oList.getItems();
		for(var i=0;i<items.length;i++){
			if(items[i].getSelected()){
				var val=items[i].getBindingContext().getObject()[oList._techName];
				var selection=(val||val==0)?val:"";
				selection=selection.getTime?selection.getTime():selection;
				selectedKeys.push(selection+"");
			}
		}
	}
	return selectedKeys;
};

sap.suite.ui.smartbusiness.lib.Filter.prototype.addFacetList = function(facetListName,isDelta) {
	var that = this;
	var facetFilter = this.getAggregation("_filter");
	var mProperties=sap.suite.smartbusiness.odata.properties(this._serviceUri,this._entitySet);
	var COLUMN_LABEL_MAPPING = mProperties.getLabelMappingObject();
	var TEXT_PROPERTY_MAPPING=mProperties.getTextPropertyMappingObject();
	var facetList = new sap.m.FacetFilterList({
		key : facetListName,
		title : COLUMN_LABEL_MAPPING[facetListName],
		displaySecondaryValues: true,
		growingThreshold:999,
		active:!isDelta,
		listOpen:function(){
			that._fetchListData(this);
		}
	});
	this._facetListsReference[facetListName]=facetList;
	facetList._techName=facetListName;
	facetList._isDelta=isDelta;
	facetList._isFilterDirty=true;
	facetList._prevSelectedKeys=[];
	if(this.getMode()=="Runtime"){
		facetList.attachListClose(function() {
			var prevFilters=sap.suite.smartbusiness.url.hash.getApplicationParameters(['viewId']);
			this._prevSelectedKeys = prevFilters[this._techName]||[];              
			if(JSON.stringify(this._prevSelectedKeys)!=JSON.stringify(that.getSelectedKeys(this))){
				this._prevSelectedKeys=that.getSelectedKeys(this);
				that._setFilterDirty(this.getKey());
				that._updateFilter(this.getKey(),this._prevSelectedKeys);          
			}
			if(!this.getActive()){
				this._isFilterDirty=true
			}
		});
	}
	facetList.bindAggregation("items", "/",new sap.m.FacetFilterItem({
		key : {
			path : facetListName
		},

		text : {
			formatter: that._getColumnValueFormatter(TEXT_PROPERTY_MAPPING[facetListName]), 
			path : TEXT_PROPERTY_MAPPING[facetListName]
		}
	})).setModel(new sap.ui.model.json.JSONModel());
	facetFilter.addList(facetList);
};
sap.suite.ui.smartbusiness.lib.Filter.prototype.refreshFilter=function(bNoRerender){
	if(this.getVisible()){
		var prevFilter=this._filterObj||{};
		try {
			var facetLists=this._facetListsReference;
			if(facetLists && this.getMode() == "Runtime") {
				this._filterObj=sap.suite.smartbusiness.url.hash.getApplicationParameters(["viewId"]);
				for(var each in this._filterObj){
					if((prevFilter[each]+"")!=(this._filterObj[each]+"")){
						facetLists[each].setActive(true);
						facetLists[each].setVisible(true);
						facetLists[each]._isSelectionChanged=true;
					}
				}
				for(var each in prevFilter){
					if((prevFilter[each]+"")!=(this._filterObj[each]+"")){
						facetLists[each].setActive(true);
						facetLists[each].setVisible(true);
						facetLists[each]._isSelectionChanged=true;
					}
				}
				bNoRerender = !!bNoRerender;
				if(this.getAggregation("_filter") && !bNoRerender) {
					//this.getAggregation("_filter").rerender();
				}
			}

			var filter=this.getAggregation("_filter");
			if(filter){
				var list= filter.getLists();
				var filterObj=sap.suite.smartbusiness.url.hash.getApplicationParameters(["viewId"]);
				for(var each in filterObj){
					for(var i=0;i<list.length;i++){
						if(list[i].getKey()==each){
							this.updateSelections(list[i],filterObj[each])
						}
					}
				}
			}
		} catch(e) {

		}
	}
};
sap.suite.ui.smartbusiness.lib.Filter.prototype.updateSelections= function(facetList, selectedKeys){
	var facetData=facetList.getModel().getData();
	if(!(facetData instanceof Array) || !facetData.length) {
		if(selectedKeys.length==1){
			facetList._isFilterDirty=true;
			this._fetchListData(facetList); 
		}else{
			this._fetchPseudoListData(facetList,selectedKeys);
			facetList._isFilterDirty=true;
		}
	}else{
		this._retainListSelections(facetList);
	}

	
	
}
sap.suite.ui.smartbusiness.lib.Filter.prototype._updateFilter=function(sDimensionName,oFilters){
	this._filterObj=sap.suite.smartbusiness.url.hash.getApplicationParameters();
	var viewId=sap.suite.smartbusiness.url.hash.getApplicationParameters().viewId[0];
	var newUrlParams={viewId:[viewId]};
	if(oFilters.length) {
		this._filterObj[sDimensionName]=oFilters;
	} else {
		delete this._filterObj[sDimensionName];
	}
	for(var each in this._filterObj){
		newUrlParams[each]=this._filterObj[each];
	}
	sap.suite.smartbusiness.url.hash.setApplicationParameters(newUrlParams);
};
sap.suite.ui.smartbusiness.lib.Filter.prototype._getValidFilters=function(sDimensionName){
	var obj=[];
	
	var filterObj=sap.suite.smartbusiness.url.hash.getApplicationParameters(["viewId", sDimensionName]);
	for(var each in filterObj) {
		var filterValues = filterObj[each];
		if(filterValues && filterValues.length) {
			filterValues.forEach(function(sFilterValue) {
				obj.push({
					NAME : each,
					VALUE_1 : sFilterValue,
					VALUE_2 : "",
					TYPE : "FI",
					OPERATOR : "EQ"
				});
			});
		}
	}
	return obj;
};

sap.suite.ui.smartbusiness.lib.Filter.prototype.getActiveDimensions=function(){
	var tmp=[];
	if(this.getMode()=="RunTime"){
		var filterLists=this.getAggregation("_filter").getLists();
		filterLists.forEach(function(s){
			if(s.getActive()){
				tmp.push(s._techName);
			}         
		});
	}else{
		var listData=this._designTimeModel.getProperty("/");
		listData.forEach(function(s){
			if(s.selected){tmp.push(s.name);}
		});
	}
	return tmp;
};
sap.suite.ui.smartbusiness.lib.Filter.prototype._retainListSelections=function(oList){
	if(this.getMode()=="Runtime"){
		this._filterObj=sap.suite.smartbusiness.url.hash.getApplicationParameters(["viewId"]);
		var curFilterObj=this._filterObj[oList.getKey()]||[];
		for(var i=0,items=oList.getItems();i<items.length;i++){
			var curKey=items[i].getBindingContext().getObject()[oList._techName]||"";
			curKey=curKey.getTime?curKey.getTime()+"":curKey+"";
			items[i].setSelected(curFilterObj.indexOf(curKey)!=-1);
		}
		oList._isSelectionChanged=false;
	}
};
sap.suite.ui.smartbusiness.lib.Filter.prototype._getFilterString=function(sDim,obj) {
	return sap.suite.smartbusiness.odata.getUri({
		entitySet:this._entitySet,
		serviceUri:this._serviceUri,
		dimension:sDim,
		filter :obj.concat(this.EVALUATION.getFilters().results)
	}).uri;
};

sap.suite.ui.smartbusiness.lib.Filter.prototype._setFilterDirty=function(excludableListKey){
	var facetFilter=this.getAggregation("_filter");
	for(var i=0,lists=facetFilter.getLists();i<lists.length;i++){
		if(lists[i].getKey()!=excludableListKey){
			lists[i]._isFilterDirty=true;
		}
	}
};
sap.suite.ui.smartbusiness.lib.Filter.prototype._onAfterListDataFetch=function(oList,data){
	oList.getModel().setData(data);
	this._retainListSelections(oList);
	oList._isFilterDirty=false;
	oList.setBusy(false);
};
sap.suite.ui.smartbusiness.lib.Filter.prototype._fetchPseudoListData=function(oList,pseudoValues){
	var dummyData=[];
	var a=oList.getKey();
	for(var each in pseudoValues){
		var obj={};
		obj[a]=pseudoValues[each];
		dummyData.push(obj);
	}
	this._onAfterListDataFetch(oList,dummyData);
	// 
};
sap.suite.ui.smartbusiness.lib.Filter.prototype._fetchListData=function(oList,oFilter){
	if(oList._isFilterDirty){
		var that=this;
		if(this.getMode()=="Runtime"){
			oList.setBusy(true);
			this.oDataModel.read(this._getFilterString(oList.getKey(),this._getValidFilters(oList.getKey())),
					null, null, true, function(data) {
				that._onAfterListDataFetch(oList,data.results);
				
			},function(){

			});
		}
	}else if(oList._isSelectionChanged) {
		this._retainListSelections(oList);
	}
};
sap.suite.ui.smartbusiness.lib.Filter.prototype._initModel = function() {
	if(this.getEvaluationId()) {
		if(sap.suite.smartbusiness.odata) {
			this.oDataModel = sap.suite.smartbusiness.odata.getModelByServiceUri(this._serviceUri);
		} else {
			this.oDataModel=  new sap.ui.model.odata.ODataModel(this._serviceUri, true);
		}
	}
};





sap.suite.ui.smartbusiness.lib.Filter.prototype._getColumnValueFormatter=function(sName){
	var formatter=function (s) {return s==0?s+"":s;}
	var oMetaData=sap.suite.smartbusiness.odata.getEdmType(this._serviceUri,sName,true);
	var sType=oMetaData.type;
	var sFormat=oMetaData.format.toUpperCase();
	if(sType=='Edm.DateTime'){
		if(!sap.suite.smartbusiness.odata.isTimeZoneIndependent(this._serviceUri,this._entitySet)){
    		var style;
    		if(sFormat=="DATE"){
    			style="daysAgo";
    		}else if(sFormat=="DATETIME"){
    			style="short";
    		}else if(sFormat=="NONE"){
    			style="daysAgo";
    		}
    		if(style){
				var oF=new sap.ca.ui.model.type.Date({
					style: style
				});
				formatter=function(s){
					return oF.formatValue(s,"string");
				}
    		}
		}else{
    		formatter=function(ts){
    			if(ts && ts.getMinutes){
    				ts= new Date(ts.getTime());
        			ts.setMinutes( ts.getMinutes() + ts.getTimezoneOffset());
        			var instanceType=(sFormat=="DATE")?"getDateInstance":"getDateTimeInstance";
        			return sap.ui.core.format.DateFormat[instanceType]().format(ts);
    			}
    			return ts;
    		}
		}
	}
	return formatter;

};
/**
 * DesignTime Related Methods
 */
sap.suite.ui.smartbusiness.lib.Filter.prototype._getDesignTimeModel=function(dimensions){
	var d=[];
	dimensions=dimensions||[];
	var mProperties=sap.suite.smartbusiness.odata.properties(this._serviceUri,this._entitySet);
	var COLUMN_LABEL_MAPPING = mProperties.getLabelMappingObject();
	var allDimensions=sap.suite.smartbusiness.odata.getAllDimensions(this._serviceUri,this._entitySet);
	if(dimensions && dimensions.length) {
		if(typeof dimensions == 'string') {
			dimensions = dimensions.split(",");
		}
	}
	allDimensions.forEach(function(s){
		d.push({name:s,label:COLUMN_LABEL_MAPPING[s],selected:dimensions.indexOf(s)!=-1});
	});
	return new sap.ui.model.json.JSONModel(d);
};


sap.suite.ui.smartbusiness.lib.Filter.prototype._addDimensionsDesignTime=function(dimensions){
	function onDimensionSearch(oEvent){
		var filter = [];
		var sQuery = oEvent.getSource().getValue();
		var binding = popoverList.getBinding("items");
		if (sQuery && sQuery.length > 0) {
			filter= [new sap.ui.model.Filter("label", sap.ui.model.FilterOperator.Contains, sQuery)] 
		}
		binding.filter(filter);
	}

	this._designTimeModel=this._getDesignTimeModel(dimensions);
	this._designTimeModel.setSizeLimit(999);
	this._facetContainer.setModel(this._designTimeModel);
	var popoverList= new sap.m.List({
		mode:"MultiSelect"
	});
	var searchField= new sap.m.SearchField({
		width:"100%",
		liveChange:jQuery.proxy(onDimensionSearch,this)
	});  
	this._popover= new sap.m.Popover({
		customHeader:searchField,
		content:[popoverList],
		showHeader:false,
		placement:"Bottom"
	});
	this._popover.setModel(this._designTimeModel);
	var sorter=new sap.ui.model.Sorter('label',false);
	popoverList.bindAggregation("items",{
		path:"/",
		template:new sap.m.StandardListItem({
			title:"{label}",
			selected:"{selected}"
		}),
		sorter:sorter
	});
	var facetListTemplate=new sap.m.HBox({
		visible:"{selected}",
		justifyContent:"SpaceBetween",
		items:[new sap.m.Label({
			text:"{label}"
		}).addStyleClass("dimensionName"),new sap.ui.core.Icon({
			src:"sap-icon://sys-cancel",
			visible:!this.getSuppressAction(),
			press:function(){
				this.getParent().setVisible(false);
			}
		})]
	}).addStyleClass("facetFilterDimension");
	var facetListContainer= new sap.m.HBox();
	facetListContainer.bindAggregation("items","/",facetListTemplate);
	this._facetContainer.addContent(facetListContainer);    
};

