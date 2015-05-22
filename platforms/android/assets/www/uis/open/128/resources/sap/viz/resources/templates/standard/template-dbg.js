(function() {
var axisColor = "#333333";
var axisGridlineColor = "#d8d8d8";
var rangeSliderStyle = {
        sliderStyle : {
        borderColor : "#d8d8d8",
        highlightBorderColor : "#707070"
    },
    tooltipStyle : {
        fontColor : "#000000",
        borderColor : "#bebebe",
        highlightBorderColor : "#748cb2",
        backgroundColor : "#f4f3f4"
    },
    thumbStyle : {
        indicatorStartColor : "#fbfbfb",
        indicatorEndColor : "#cccccc",
        indicatorPressStartColor : "#e8e8e8",
        indicatorPressEndColor : "#a4a4a4",
        indicatorBorderStartColor : "#878787",
        indicatorBorderEndColor : "#474747",
        indicatorPressBorderStartColor : "#878787",
        indicatorPressBorderEndColor : "#474747",
        indicatorInternalLineColor : "#000000",
        subRectBorderColor : "#707070",
        subRectColor : "#bbbbbb",
        rectOpacity : 0.2,
        rectColor : '#009de0',
        rectPressOpacity : 0.48,
        rectPressColor : "#636363",
    },
};
var barEffect = {
  background : {
    border : {
      top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
    },
    drawingEffect : "normal",
  },
  legend : {
    drawingEffect : "normal",
    title : { visible : true },
  },
  tooltip : {
    drawingEffect : "normal"
  },
  xAxis : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      type : "line",
      color : axisGridlineColor,
      showLastLine : true,
    },
    color : axisColor,
  },
  yAxis : {
    title : {
      visible : true,
    },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  },
  xAxis2 : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  },
  plotArea : {
    drawingEffect : "normal",
  },
};
var bar3dEffect = {
		  background : {
		    border : {
		      top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
		    },
		    drawingEffect : "normal",
		  },
		  legend : {
		    drawingEffect : "normal",
		    title : { visible : true },
		  },
		  tooltip : {
		    drawingEffect : "normal"
		  },
		  xAxis : {
		    title : {
		      visible : true,
		    },
		    axisline : { visible : false, },
		    gridline : {
		      type : "line",
		      color : axisGridlineColor,
		      showLastLine : true,
		    },
		    color : axisColor,
		  },
		  yAxis : {
		    title : {
		      visible : true,
		    },
		    gridline : {
		      color : axisGridlineColor,
		    },
		    color : axisColor,
		  },
		  xAxis2 : {
		    title : {
		      visible : true,
		    },
		    axisline : { visible : false, },
		    gridline : {
		      color : axisGridlineColor,
		    },
		    color : axisColor,
		  },
		  plotArea : {
		    drawingEffect : "normal",
		  },
		  zAxis : {
		    title : {
		      visible : true
		    },
		    color : axisColor
		  }
};

var dualbarEffect = {
    background : {
      border : {
        top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
      },
      drawingEffect : "normal",
    },
    legend : {
      drawingEffect : "normal",
      title : { visible : true },
    },
    tooltip : {
      drawingEffect : "normal"
    },
    xAxis : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        type : "line",
        color : axisGridlineColor,
        showLastLine : true,
      },
    },
    yAxis : {
      title : {
        visible : true,
      },
      gridline : {
        color : axisGridlineColor,
      },
      color : axisColor,
    },
    xAxis2 : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        color : axisGridlineColor,
      },
    },
    plotArea : {
      drawingEffect : "normal",
    },
  };

var verticalbarEffect = {
  background : {
    border : {
      top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
    },
    drawingEffect : "normal"
  },
  legend : {
    drawingEffect : "normal",
    title : { visible : true },
  },
  tooltip : {
    drawingEffect : "normal"
  },
  plotArea : {
    drawingEffect : "normal"
  },
  yAxis : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      type : "line",
      color : axisGridlineColor,
      showFirstLine : true,
    },
    color : axisColor,
  },
  xAxis : {
    title : {
      visible : true,
    },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  },
  yAxis2 : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  },
  rangeSlider : rangeSliderStyle
};
var vertical3dbarEffect = {
		  background : {
		    border : {
		      top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
		    },
		    drawingEffect : "normal"
		  },
		  legend : {
		    drawingEffect : "normal",
		    title : { visible : true },
		  },
		  tooltip : {
		    drawingEffect : "normal"
		  },
		  plotArea : {
		    drawingEffect : "normal"
		  },
		  yAxis : {
		    title : {
		      visible : true,
		    },
		    axisline : { visible : false, },
		    gridline : {
		      type : "line",
		      color : axisGridlineColor,
		      showFirstLine : true,
		    },
		    color : axisColor,
		  },
		  xAxis : {
		    title : {
		      visible : true,
		    },
		    gridline : {
		      color : axisGridlineColor,
		    },
		    color : axisColor,
		  },
		  yAxis2 : {
		    title : {
		      visible : true,
		    },
		    axisline : { visible : false, },
		    gridline : {
		      color : axisGridlineColor,
		    },
		    color : axisColor,
		  },
		  zAxis : {
		    title : {
		      visible : true
		    },
		    color : axisColor
		  }
};

var dualverticalbarEffect = {
    background : {
      border : {
        top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
      },
      drawingEffect : "normal"
    },
    legend : {
      drawingEffect : "normal",
      title : { visible : true },
    },
    tooltip : {
      drawingEffect : "normal"
    },
    plotArea : {
      drawingEffect : "normal"
    },
    yAxis : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        type : "line",
        color : axisGridlineColor,
        showFirstLine : true,
      },
    },
    xAxis : {
      title : {
        visible : true,
      },
      gridline : {
        color : axisGridlineColor,
      },
      color : axisColor,
    },
    yAxis2 : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        color : axisGridlineColor,
      },
    },
  };

var stackedbarEffect = {

  background : {
    border : {
      top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
    },
    drawingEffect : "normal"
  },
  legend : {
    drawingEffect : "normal",
    title : { visible : true },
  },
  tooltip : {
    drawingEffect : "normal"
  },
  plotArea : {
    drawingEffect : "normal"
  },
  xAxis : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      type : "line",
      color : axisGridlineColor,
      showLastLine : true,
    },
    color : axisColor,
  },
  yAxis : {
    title : {
      visible : true,
    },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  },
  xAxis2 : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  }
};

var dualstackedbarEffect = {

    background : {
      border : {
        top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
      },
      drawingEffect : "normal"
    },
    legend : {
      drawingEffect : "normal",
      title : { visible : true },
    },
    tooltip : {
      drawingEffect : "normal"
    },
    plotArea : {
      drawingEffect : "normal"
    },
    xAxis : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        type : "line",
        color : axisGridlineColor,
        showLastLine : true,
      },
    },
    yAxis : {
      title : {
        visible : true,
      },
      gridline : {
        color : axisGridlineColor,
      },
      color : axisColor,
    },
    xAxis2 : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        color : axisGridlineColor,
      },
    }
  };

var stackedverticalbarEffect = {

  background : {
    border : {
      top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
    },
    drawingEffect : "normal"
  },
  legend : {
    drawingEffect : "normal",
    title : { visible : true },
  },
  tooltip : {
    drawingEffect : "normal"
  },
  plotArea : {
    drawingEffect : "normal"
  },
  yAxis : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      type : "line",
      color : axisGridlineColor,
      showFirstLine : true,
    },
    color : axisColor,
  },
  xAxis : {
    title : {
      visible : true,
    },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  },
  yAxis2 : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  }
};

var dualstackedverticalbarEffect = {

    background : {
      border : {
        top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
      },
      drawingEffect : "normal"
    },
    legend : {
      drawingEffect : "normal",
      title : { visible : true },
    },
    tooltip : {
      drawingEffect : "normal"
    },
    plotArea : {
      drawingEffect : "normal"
    },
    yAxis : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        type : "line",
        color : axisGridlineColor,
        showFirstLine : true,
      },
    },
    xAxis : {
      title : {
        visible : true,
      },
      gridline : {
        color : axisGridlineColor,
      },
      color : axisColor,
    },
    yAxis2 : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        color : axisGridlineColor,
      },
    }
  };

var lineEffect = {

  background : {
    border : {
      top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
    },
    drawingEffect : "normal"
  },
  legend : {
    drawingEffect : "normal",
    title : { visible : true },
  },
  tooltip : {
    drawingEffect : "normal"
  },
  plotArea : {
    drawingEffect : "normal"
  },
  yAxis : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      type : "line",
      color : axisGridlineColor,
      showFirstLine : true,
    },
    color : axisColor,
  },
  xAxis : {
    title : {
      visible : true,
    },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  },
  yAxis2 : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  },
  rangeSlider : rangeSliderStyle
};
var duallineEffect = {

    background : {
      border : {
        top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
      },
      drawingEffect : "normal"
    },
    legend : {
      drawingEffect : "normal",
      title : { visible : true },
    },
    tooltip : {
      drawingEffect : "normal"
    },
    plotArea : {
      drawingEffect : "normal"
    },
    yAxis : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        type : "line",
        color : axisGridlineColor,
        showFirstLine : true,
      },
    },
    xAxis : {
      title : {
        visible : true,
      },
      gridline : {
        color : axisGridlineColor,
      },
      color : axisColor,
    },
    yAxis2 : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        color : axisGridlineColor,
      },
    }
  };
var horizontallineEffect = {

  background : {
    border : {
      top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
    },
    drawingEffect : "normal"
  },
  legend : {
    drawingEffect : "normal",
    title : { visible : true },
  },
  tooltip : {
    drawingEffect : "normal"
  },
  plotArea : {
    drawingEffect : "normal"
  },
  xAxis : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      type : "line",
      color : axisGridlineColor,
      showLastLine : true,
    },
    color : axisColor,
  },
  yAxis : {
    title : {
      visible : true,
    },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  },
  xAxis2 : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  }
};

var dualhorizontallineEffect = {

    background : {
      border : {
        top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
      },
      drawingEffect : "normal"
    },
    legend : {
      drawingEffect : "normal",
      title : { visible : true },
    },
    tooltip : {
      drawingEffect : "normal"
    },
    plotArea : {
      drawingEffect : "normal"
    },
    xAxis : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        type : "line",
        color : axisGridlineColor,
        showLastLine : true,
      },
    },
    yAxis : {
      title : {
        visible : true,
      },
      gridline : {
        color : axisGridlineColor,
      },
      color : axisColor,
    },
    xAxis2 : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        color : axisGridlineColor,
      },
    }
  };
var combinationEffect = {

  background : {
    border : {
      top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
    },
    drawingEffect : "normal"
  },
  legend : {
    drawingEffect : "normal",
    title : { visible : true },
  },
  tooltip : {
    drawingEffect : "normal"
  },
  plotArea : {
    drawingEffect : "normal"
  },
  yAxis : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      type : "line",
      color : axisGridlineColor,
      showFirstLine : true,
    },
    color : axisColor,
  },
  xAxis : {
    title : {
      visible : true,
    },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  },
  yAxis2 : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  },
  rangeSlider : rangeSliderStyle
};

var dualcombinationEffect = {

    background : {
      border : {
        top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
      },
      drawingEffect : "normal"
    },
    legend : {
      drawingEffect : "normal",
      title : { visible : true },
    },
    tooltip : {
      drawingEffect : "normal"
    },
    plotArea : {
      drawingEffect : "normal"
    },
    yAxis : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        type : "line",
        color : axisGridlineColor,
        showFirstLine : true,
      },
    },
    xAxis : {
      title : {
        visible : true,
      },
      gridline : {
        color : axisGridlineColor,
      },
      color : axisColor,
    },
    yAxis2 : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        color : axisGridlineColor,
      },
    }
  };
var horizontalcombinationEffect = {

  background : {
    border : {
      top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
    },
    drawingEffect : "normal"
  },
  legend : {
    drawingEffect : "normal",
    title : { visible : true },
  },
  tooltip : {
    drawingEffect : "normal"
  },
  plotArea : {
    drawingEffect : "normal"
  },
  xAxis : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      type : "line",
      color : axisGridlineColor,
      showLastLine : true,
    },
    color : axisColor,
  },
  yAxis : {
    title : {
      visible : true,
    },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  },
  xAxis2 : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  }
};

var dualhorizontalcombinationEffect = {

    background : {
      border : {
        top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
      },
      drawingEffect : "normal"
    },
    legend : {
      drawingEffect : "normal",
      title : { visible : true },
    },
    tooltip : {
      drawingEffect : "normal"
    },
    plotArea : {
      drawingEffect : "normal"
    },
    xAxis : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        type : "line",
        color : axisGridlineColor,
        showLastLine : true,
      },
     },
    yAxis : {
      title : {
        visible : true,
      },
      gridline : {
        color : axisGridlineColor,
      },
      color : axisColor,
    },
    xAxis2 : {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisline : { visible : false, },
      gridline : {
        color : axisGridlineColor,
      },
    }
  };
var bubbleEffect = {
  background : {
    border : {
      top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
    },
    drawingEffect : "normal"
  },
  legend : {
    drawingEffect : "normal",
    title : { visible : true },
  },
  plotArea : {
    drawingEffect : "normal",
    referenceLine : {
      template : 'standard'
    }
  },
  yAxis : {
    title : {
      visible : true,
    },
    axisline : { visible : false, },
    gridline : {
      type : "line",
      color : axisGridlineColor,
      showFirstLine : true,
    },
    color : axisColor,
  },
  xAxis : {
    title : {
      visible : true,
    },
    gridline : {
      color : axisGridlineColor,
    },
    color : axisColor,
  },
};

var pieEffect = {
  legend : {
    drawingEffect : "normal",
    title : { visible : true },
  },
  plotArea : {
    drawingEffect : "normal"
  }  
};

var pieWithDepthEffect = {
  legend : {
    drawingEffect : "normal",
    title : { visible : true },
  },
  plotArea : {
    drawingEffect : "normal"
  }  
};

var radarEffect = {
  background : {
    visible: false,
  },
  legend : {
    drawingEffect : "normal",
    title : { visible : true },
  },
  tooltip : {
    drawingEffect : "normal"
  },
  plotArea : {
    drawingEffect : "normal",
    valueAxis : {
      title : { visible : true, },
      gridline : {
        color : axisGridlineColor,
      }
    },
    dataline : {
      fill : {
        transparency : 0,
      },
    },
  },
};

var mekkoEffect = {
    background : {
      border : {
        top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
      },
      drawingEffect : "normal",
    },
    legend : {
      drawingEffect : "normal",
      title : { visible : true },
    },
    tooltip : {
      drawingEffect : "normal"
    },
    yAxis : {
      title : {
        visible : true,
      },
      axisline : { visible : false, },
      gridline : {
        type : "line",
        color : axisGridlineColor,
      },
      color : axisColor,
    },
    xAxis : {
      title : {
        visible : true,
      },
      axisline : {
        visible : true,
      },
      gridline : {
        color : axisGridlineColor,
      },
      color : axisColor,
    },
    xAxis2 : {
      title : {
        visible : true,
      },
      axisline : { visible : true},
      gridline : {
        color : axisGridlineColor,
      },
      color : axisColor,
    },
    plotArea : {
      drawingEffect : "normal",
    },
  };
var horizontalmekkoEffect = {
    background : {
      border : {
        top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
      },
      drawingEffect : "normal",
    },
    legend : {
      drawingEffect : "normal",
      title : { visible : true },
    },
    tooltip : {
      drawingEffect : "normal"
    },
    xAxis : {
      title : {
        visible : true,
      },
      axisline : { visible : false, },
      gridline : {
        type : "line",
        color : axisGridlineColor,
      },
      color : axisColor,
    },
    yAxis : {
      title : {
        visible : true,
      },
      gridline : {
        color : axisGridlineColor,
      },
      axisline : { visible : true, },
      color : axisColor,
    },
    yAxis2 : {
      title : {
        visible : true,
      },
      axisline : { visible : true, },
      gridline : {
        color : axisGridlineColor,
      },
      color : axisColor,
    },
    plotArea : {
      drawingEffect : "normal",
    },
  };
  
  sap.viz.extapi.env.Template.register({
  id : "standard",
  name : "Standard",
  version : "4.0.0",
  properties : {
    'viz/bar' : barEffect,
    'viz/3d_bar' : bar3dEffect,
    'viz/image_bar' : barEffect,
    'viz/multi_bar' : barEffect,
    'viz/dual_bar' : dualbarEffect,
    'viz/multi_dual_bar' : dualbarEffect,
    'viz/column' : verticalbarEffect,
    'viz/3d_column' : vertical3dbarEffect,
    'viz/multi_column' : verticalbarEffect,
    'viz/dual_column' : dualverticalbarEffect,
    'viz/multi_dual_column' : dualverticalbarEffect,
    'viz/stacked_bar' : stackedbarEffect,
    'viz/multi_stacked_bar' : stackedbarEffect,
    'viz/dual_stacked_bar' : dualstackedbarEffect,
    'viz/multi_dual_stacked_bar' : dualstackedbarEffect,
    'viz/100_stacked_bar' : stackedbarEffect,
    'viz/multi_100_stacked_bar' : stackedbarEffect,
    'viz/100_dual_stacked_bar' : dualstackedbarEffect,
    'viz/multi_100_dual_stacked_bar' : dualstackedbarEffect,
    'viz/stacked_column' : stackedverticalbarEffect,
    'viz/multi_stacked_column' : stackedverticalbarEffect,
    'viz/dual_stacked_column' : dualstackedverticalbarEffect,
    'viz/multi_dual_stacked_column' : dualstackedverticalbarEffect,
    'viz/100_stacked_column' : stackedverticalbarEffect,
    'viz/multi_100_stacked_column' : stackedverticalbarEffect,
    'viz/100_dual_stacked_column' : dualstackedverticalbarEffect,
    'viz/multi_100_dual_stacked_column' : dualstackedverticalbarEffect,
    'riv/cbar' : {
      background : {
        drawingEffect : "normal"
      },
      legend : {
        drawingEffect : "normal",
        title : { visible : true },
      },
      tooltip : {
        drawingEffect : "normal"
      },
      plotArea : {
        drawingEffect : "normal"
      },
      yAxis : {
        title : {
          visible : true,
        },    
        gridline : {
          color : axisGridlineColor,
        },
        color : axisColor,
      },
    },
    'viz/combination' : combinationEffect,
    'viz/horizontal_combination' : horizontalcombinationEffect,
    'viz/dual_combination' : dualcombinationEffect,
    'viz/dual_horizontal_combination' : dualhorizontalcombinationEffect,
    'viz/boxplot' : {
      background : {
        border : {
          top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
        },
        drawingEffect : "normal"
      },
      legend : {
        drawingEffect : "normal",
        title : { visible : true },
      },
      tooltip : {
        drawingEffect : "normal"
      },
      yAxis : {
        title : {
          visible : true,
        },    
        axisline : {
          visible : false,
        },
        gridline : {
          type : "line",
          color : axisGridlineColor,
          showFirstLine : true,
        },
        color : axisColor,
      },
      xAxis : {
        title : {
          visible : true,
        },    
        gridline : {
          color : axisGridlineColor,
        },
        color : axisColor,
      },
      plotArea : {
        drawingEffect : "normal"
      }
    },
    'viz/horizontal_boxplot' : {
      background : {
        border : {
          top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
        },
        drawingEffect : "normal"
      },
      legend : {
        drawingEffect : "normal",
        title : { visible : true },
      },
      tooltip : {
        drawingEffect : "normal"
      },
      xAxis : {
        title : {
          visible : true,
        },    
        axisline : {
          visible : false,
        },
        gridline : {
          type : "line",
          color : axisGridlineColor,
          showLastLine : true,
        },
        color : axisColor,
      },
      yAxis : {
        title : {
          visible : true,
        },    
        gridline : {
          color : axisGridlineColor,
        },
        color : axisColor,
      },
      plotArea : {
        drawingEffect : "normal"
      }
    },
    'viz/waterfall' : {
      background : {
        border : {
          top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
        },
        drawingEffect : "normal"
      },
      legend : {
        drawingEffect : "normal",
        title : { visible : true },
      },
      tooltip : {
        drawingEffect : "normal"
      },
      yAxis : {
        title : {
          visible : true,
        },
        axisline : {
          visible : false,
        },
        gridline : {
          type : "line",
          color : axisGridlineColor,
          showFirstLine : true,
        },
        color : axisColor,
      },
      xAxis : {
        title : {
          visible : true,
        },
        color : axisColor,
      },
      plotArea : {
        drawingEffect : "normal"
      }
    },
    'viz/horizontal_waterfall' : {
      background : {
        border : {
          top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
        },
        drawingEffect : "normal"
      },
      legend : {
        drawingEffect : "normal",
        title : { visible : true },
      },
      tooltip : {
        drawingEffect : "normal"
      },
      xAxis : {
        title : {
          visible : true,
        },
        axisline : {
          visible : false,
        },
        gridline : {
          type : "line",
          color : axisGridlineColor,
          showLastLine : true,
        },
        color : axisColor,
      },
      yAxis : {
        title : {
          visible : true,
        },
        color : axisColor,
      },
      plotArea : {
        drawingEffect : "normal"
      }
    },
    
    'viz/stacked_waterfall' : stackedverticalbarEffect,
    'viz/horizontal_stacked_waterfall' :stackedbarEffect,
    
    'viz/line' : lineEffect,
    'viz/multi_line' : lineEffect,
    'viz/dual_line' : duallineEffect,
    'viz/multi_dual_line' : duallineEffect,
    'viz/horizontal_line' : horizontallineEffect,
    'viz/multi_horizontal_line' : horizontallineEffect,
    'viz/dual_horizontal_line' : dualhorizontallineEffect,
    'viz/multi_dual_horizontal_line' : dualhorizontallineEffect,
    
    'viz/area': lineEffect,
    'viz/multi_area': lineEffect,
    'viz/100_area': lineEffect,
    'viz/multi_100_area': lineEffect,
    'viz/horizontal_area': horizontallineEffect,
    'viz/multi_horizontal_area': horizontallineEffect,
    'viz/100_horizontal_area': horizontallineEffect,
    'viz/multi_100_horizontal_area': horizontallineEffect,
    'viz/pie' : pieEffect,
    'viz/multi_pie' : pieEffect,
    'viz/donut' : pieEffect,
    'viz/multi_donut' : pieEffect,
    'viz/pie_with_depth': pieWithDepthEffect,
    'viz/donut_with_depth': pieWithDepthEffect,
    'viz/multi_pie_with_depth': pieWithDepthEffect,
    'viz/multi_donut_with_depth': pieWithDepthEffect,
    'viz/bubble' : bubbleEffect,
    'viz/multi_bubble' : bubbleEffect,
    'viz/scatter' : bubbleEffect,
    'viz/multi_scatter' : bubbleEffect,
    'viz/scatter_matrix' : bubbleEffect,
    'viz/radar' : radarEffect,
    'viz/multi_radar' : radarEffect,
    'viz/tagcloud' : {
      legend : {
        title : { visible : true },
      },
    },
    'viz/heatmap' : {
      legend : {
        title : { visible : true },
      },
      xAxis : {
        title : {
          visible : true,
        },
        color : axisColor,
      },
      yAxis : {
        title : {
          visible : true,
        },
        color : axisColor,
      },
    },
    'viz/treemap' : {
      legend : {
        title : { visible : true },
      }
    },
    'viz/mekko': mekkoEffect,
    'viz/100_mekko' : mekkoEffect,
    'viz/horizontal_mekko' : horizontalmekkoEffect,
    'viz/100_horizontal_mekko' : horizontalmekkoEffect,
    'viz/number' : {
        plotArea: {
            valuePoint: {
                label: {
                    fontColor: '#000000'
                }
            }
        }
    },
    
    'info/line' : info(lineEffect),
    'info/dual_line' : infoDual(duallineEffect),
    'info/horizontal_line' : info(horizontallineEffect),
    'info/dual_horizontal_line' : infoDual(dualhorizontallineEffect),
    'info/bar' : info(barEffect),
    'info/dual_bar' : infoDual(dualbarEffect),
    'info/column' : info(verticalbarEffect),
    'info/dual_column' : infoDual(dualverticalbarEffect),
    'info/stacked_bar' : info(stackedbarEffect),
    'info/dual_stacked_bar' : infoDual(dualstackedbarEffect),
    'info/100_stacked_bar' : info(stackedbarEffect),
    'info/100_dual_stacked_bar' : infoDual(dualstackedbarEffect),
    'info/stacked_column' : info(stackedverticalbarEffect),
    'info/dual_stacked_column' : infoDual(dualstackedverticalbarEffect),
    'info/100_stacked_column' : info(stackedverticalbarEffect),
    'info/100_dual_stacked_column' : infoDual(dualstackedverticalbarEffect),
    'info/bubble' : infoBubble(bubbleEffect),
    'info/scatter' : infoBubble(bubbleEffect),
    'info/time_bubble' : infoBubble(bubbleEffect),
    'info/pie' : info(pieEffect),
    'info/donut' : info(pieEffect),
    'info/combination' : info(combinationEffect),
    'info/bullet' : {
      legend : {
        drawingEffect : "normal",
        title : { visible : true },
      },
      tooltip : {
        drawingEffect : "normal"
      },
      valueAxis : {
        title : {
          visible : false,
        },
        axisLine : {
          visible : false,
        },
        gridline : {
          type : "line",
          color : axisGridlineColor,
          showLastLine : true,
        },
        color : axisColor,
      },
      categoryAxis : {
        title : {
          visible : false,
        },
        gridline : {
          color : axisGridlineColor,
        },
        color : axisColor,
      },
      plotArea : {
        background : {
          border : {
            top : { visible : false }, bottom : { visible : false }, left : { visible : false }, right : { visible : false },
          },
          drawingEffect : "normal",
        },
        drawingEffect : "normal",
        gridline : {
          visible : true
        }
      }
    }
  },
  //v-longtick must be set after v-categoryaxisline
  css : ".v-datapoint .v-boxplotmidline{stroke:#333333}\
         .v-longtick{stroke:#b3b3b3;}"
});
  
  function info(obj) {
    var ret = {};
    for ( var i in obj) {
      if (obj.hasOwnProperty(i)) {
        ret[i] = obj[i];
      }
    }
    
    ret.valueAxis = {
      title : {
        visible : true,
      },
      axisLine : { visible : false, },
      gridline : {
        type : "line",
        color : axisGridlineColor,
        showLastLine : true,
      },
      color : axisColor,
    };
    
    ret.categoryAxis = {
      title : {
        visible : true,
      },
      gridline : {
        color : axisGridlineColor,
      },
      color : axisColor,
    };
    
    general(ret);
    return ret;
  }
  
  function infoDual(obj) {
    var ret = {};
    for ( var i in obj) {
      if (obj.hasOwnProperty(i)) {
        ret[i] = obj[i];
      }
    }
    
    ret.valueAxis = {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisLine : { visible : false, },
      gridline : {
        type : "line",
        color : axisGridlineColor,
        showFirstLine : true,
      },
    },
    ret.categoryAxis = {
      title : {
        visible : true,
      },
      gridline : {
        color : axisGridlineColor,
      },
      color : axisColor,
    },
    ret.valueAxis2 = {
      title : {
        visible : true,
        applyAxislineColor : true,
      },
      axisLine : { visible : false, },
      gridline : {
        color : axisGridlineColor,
      },
    }
    
    general(ret);
    return ret;
  }
  
  function infoBubble(obj) {
    var ret = {};
    for ( var i in obj) {
      if (obj.hasOwnProperty(i)) {
        ret[i] = obj[i];
      }
    }
    
    ret.valueAxis = {
      title : {
        visible : true,
      },
      axisLine : { visible : true, },
      gridline : {
        type : "line",
        color : axisGridlineColor,
        showLastLine : true,
      },
      color : axisColor,
    };
    
    ret.valueAxis2 = {
      title : {
        visible : true,
      },
      axisLine : { visible : false, },
      gridline : {
        color : axisGridlineColor,
      },
      color : axisColor,
    }
    general(ret);
    return ret;
  }
  
  function general(obj) {
    obj.plotArea.background = obj.background;
    delete obj.background;
    
    delete obj.xAxis;
    delete obj.xAxis2;
    delete obj.yAxis;
    delete obj.yAxis2;
  }
})();