(function() {
  var axisColor = "#AAAAAA";
  var axisGridlineColor = "#333333";
  var dataLabelColor = "#D8D8D8";
  var rangeSliderStyle = {
    sliderStyle: {
      borderColor: "#4e4e4e",
      highlightBorderColor: "#ffffff"
    },
    tooltipStyle: {
      fontColor: "#ffffff",
      borderColor: "#4e4e4e",
      highlightBorderColor: "#009de0",
      backgroundColor: "#333333"
    },
    thumbStyle: {
      indicatorStartColor: "#555555",
      indicatorEndColor: "#0c0c0c",
      indicatorPressStartColor: "#555555",
      indicatorPressEndColor: "#0c0c0c",
      indicatorBorderStartColor: "#ffffff",
      indicatorBorderEndColor: "#ffffff",
      indicatorPressBorderStartColor: "#8b8b8b",
      indicatorPressBorderEndColor: "#8b8b8b",
      indicatorInternalLineColor: "#ffffff",
      subRectBorderColor: "#ffffff",
      subRectColor: "#ffffff",
      rectOpacity: 0.3,
      rectColor: '#009de0',
      rectPressOpacity: 0.3,
      rectPressColor: "#ffffff",
    },
  };

  var tooltip = {
    background: {
      color: "#000000",
      borderColor: "#ffffff"
    },
    drawingEffect: "normal",
    footerLabel: {
      color: "#ffffff"
    },
    separationLine: {
      borderBottomColor: "ffffff"
    },
    bodyDimensionLabel: {
      color: "#c0c0c0"
    },
    bodyDimensionValue: {
      color: "#c0c0c0"
    },
    bodyMeasureLabel: {
      color: "#c0c0c0"
    },
    bodyMeasureValue: {
      color: "#ffffff"
    },
    closeButton: {
      backgroundColor: "#000000",
      borderColor: "#ffffff"
    }

  };
  var barEffect = {
    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal",
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    xAxis: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showLastLine: true,
      },
      color: axisColor,
    },
    yAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    xAxis2: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    plotArea: {
      drawingEffect: "normal",
      dataLabel: {
        style: {
          color: dataLabelColor
        }
      }
    },
  };

  var bar3dEffect = {
    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        }
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    xAxis: {
      title: {
        visible: true
      },
      axisline: {
        visible: false
      },
      gridline: {
        type: "line",
        color: axisGridlineColor
      },
      color: axisColor
    },
    yAxis: {
      title: {
        visible: true
      },
      gridline: {
        color: axisGridlineColor
      },
      color: axisColor
    },
    xAxis2: {
      title: {
        visible: true
      },
      axisline: {
        visible: false
      },
      gridline: {
        color: axisGridlineColor
      },
      color: axisColor
    },
    plotArea: {
      drawingEffect: "normal"
    },
    zAxis: {
      title: {
        visible: true
      },
      color: axisColor
    }
  };
  var dualbarEffect = {
    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal",
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    xAxis: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showLastLine: true,
      },
    },
    yAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    xAxis2: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
    },
    plotArea: {
      drawingEffect: "normal",
      dataLabel: {
        style: {
          color: dataLabelColor
        }
      }
    },
  };

  var verticalbarEffect = {
    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal",
      dataLabel: {
        style: {
          color: dataLabelColor
        }
      }
    },
    yAxis: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showFirstLine: true,
      },
      color: axisColor,
    },
    xAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    yAxis2: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    rangeSlider: rangeSliderStyle
  };
  var vertical3dbarEffect = {
    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        }
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal"
    },
    yAxis: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showFirstLine: true,
      },
      color: axisColor,
    },
    xAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    yAxis2: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    zAxis: {
      title: {
        visible: true,
      },
      color: axisColor
    }
  };
  var dualverticalbarEffect = {
    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal",
      dataLabel: {
        style: {
          color: dataLabelColor
        }
      }
    },
    yAxis: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showFirstLine: true,
      },
    },
    xAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    yAxis2: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
    },
  };

  var stackedbarEffect = {

    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal"
    },
    xAxis: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showLastLine: true,
      },
      color: axisColor,
    },
    yAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    xAxis2: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    }
  };

  var dualstackedbarEffect = {

    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal"
    },
    xAxis: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showLastLine: true,
      },
    },
    yAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    xAxis2: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
    }
  };

  var stackedverticalbarEffect = {

    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal"
    },
    yAxis: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showFirstLine: true,
      },
      color: axisColor,
    },
    xAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    yAxis2: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    }
  };

  var dualstackedverticalbarEffect = {

    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal"
    },
    yAxis: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showFirstLine: true,
      },
    },
    xAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    yAxis2: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
    }
  };

  var lineEffect = {

    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal",
      dataLabel: {
        style: {
          color: dataLabelColor
        }
      }
    },
    yAxis: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showFirstLine: true,
      },
      color: axisColor,
    },
    xAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    yAxis2: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    rangeSlider: rangeSliderStyle
  };
  var duallineEffect = {

    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal",
      dataLabel: {
        style: {
          color: dataLabelColor
        }
      }
    },
    yAxis: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showFirstLine: true,
      },
    },
    xAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    yAxis2: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
    }
  };
  var horizontallineEffect = {

    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal",
      dataLabel: {
        style: {
          color: dataLabelColor
        }
      }
    },
    xAxis: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showLastLine: true,
      },
      color: axisColor,
    },
    yAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    xAxis2: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    }
  };

  var dualhorizontallineEffect = {

    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal",
      dataLabel: {
        style: {
          color: dataLabelColor
        }
      }
    },
    xAxis: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showLastLine: true,
      },
    },
    yAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    xAxis2: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
    }
  };
  var combinationEffect = {

    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal",
      dataLabel: {
        style: {
          color: dataLabelColor
        }
      }
    },
    yAxis: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showFirstLine: true,
      },
      color: axisColor,
    },
    xAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    yAxis2: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    rangeSlider: rangeSliderStyle
  };

  var dualcombinationEffect = {

    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal",
      dataLabel: {
        style: {
          color: dataLabelColor
        }
      }
    },
    yAxis: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showFirstLine: true,
      },
    },
    xAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    yAxis2: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
    }
  };
  var horizontalcombinationEffect = {

    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal",
      dataLabel: {
        style: {
          color: dataLabelColor
        }
      }
    },
    xAxis: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showLastLine: true,
      },
      color: axisColor,
    },
    yAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    xAxis2: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    }
  };

  var dualhorizontalcombinationEffect = {

    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal",
      dataLabel: {
        style: {
          color: dataLabelColor
        }
      }
    },
    xAxis: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showLastLine: true,
      },
    },
    yAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    xAxis2: {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
    }
  };
  var bubbleEffect = {
    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal"
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    plotArea: {
      drawingEffect: "normal",
      referenceLine: {
        defaultStyle: {
          color: "#ffffff",
          label: {
            color: "#ffffff",
          }
        }
      },
      dataLabel: {
        style: {
          color: dataLabelColor
        }
      }
    },
    tooltip: tooltip,
    yAxis: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showFirstLine: true,
      },
      color: axisColor,
    },
    xAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
  };

  var pieEffect = {
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    plotArea: {
      drawingEffect: "normal"
    },
    tooltip: tooltip
  };

  var pieWithDepthEffect = {
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal"
    }
  };

  var radarEffect = {
    background: {
      visible: false,
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    plotArea: {
      drawingEffect: "normal",
      valueAxis: {
        title: {
          visible: true,
        },
        gridline: {
          color: axisGridlineColor,
        }
      },
      dataline: {
        fill: {
          transparency: 0,
        },
      },
      polarGrid: {
        color: axisGridlineColor
      },
    },
  };

  var mekkoEffect = {
    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal",
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    yAxis: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    xAxis: {
      title: {
        visible: true,
      },
      axisline: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    xAxis2: {
      title: {
        visible: true,
      },
      axisline: {
        visible: true
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    plotArea: {
      drawingEffect: "normal",
    },
  };
  var horizontalmekkoEffect = {
    background: {
      border: {
        top: {
          visible: false
        },
        bottom: {
          visible: false
        },
        left: {
          visible: false
        },
        right: {
          visible: false
        },
      },
      drawingEffect: "normal",
    },
    legend: {
      drawingEffect: "normal",
      title: {
        visible: true
      },
      scrollBarStyle: {
        fill: "#a6a6a6",
        hoverFill: "#888888",
        scrollingArea: {
          fill: '#333333',
          opacity: 1,
        }
      }
    },
    tooltip: tooltip,
    xAxis: {
      title: {
        visible: true,
      },
      axisline: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    yAxis: {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      axisline: {
        visible: true,
      },
      color: axisColor,
    },
    yAxis2: {
      title: {
        visible: true,
      },
      axisline: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
    },
    plotArea: {
      drawingEffect: "normal",
    },
  };

  sap.viz.extapi.env.Template.register({
    id: "highcontrast",
    name: "HighContrast",
    version: "4.0.0",
    properties: {
      'viz/bar': barEffect,
      'viz/3d_bar': bar3dEffect,
      'viz/image_bar': barEffect,
      'viz/multi_bar': barEffect,
      'viz/dual_bar': dualbarEffect,
      'viz/multi_dual_bar': dualbarEffect,
      'viz/column': verticalbarEffect,
      'viz/3d_column': vertical3dbarEffect,
      'viz/multi_column': verticalbarEffect,
      'viz/dual_column': dualverticalbarEffect,
      'viz/multi_dual_column': dualverticalbarEffect,
      'viz/stacked_bar': stackedbarEffect,
      'viz/multi_stacked_bar': stackedbarEffect,
      'viz/dual_stacked_bar': dualstackedbarEffect,
      'viz/multi_dual_stacked_bar': dualstackedbarEffect,
      'viz/100_stacked_bar': stackedbarEffect,
      'viz/multi_100_stacked_bar': stackedbarEffect,
      'viz/100_dual_stacked_bar': dualstackedbarEffect,
      'viz/multi_100_dual_stacked_bar': dualstackedbarEffect,
      'viz/stacked_column': stackedverticalbarEffect,
      'viz/multi_stacked_column': stackedverticalbarEffect,
      'viz/dual_stacked_column': dualstackedverticalbarEffect,
      'viz/multi_dual_stacked_column': dualstackedverticalbarEffect,
      'viz/100_stacked_column': stackedverticalbarEffect,
      'viz/multi_100_stacked_column': stackedverticalbarEffect,
      'viz/100_dual_stacked_column': dualstackedverticalbarEffect,
      'viz/multi_100_dual_stacked_column': dualstackedverticalbarEffect,
      'riv/cbar': {
        background: {
          drawingEffect: "normal"
        },
        legend: {
          drawingEffect: "normal",
          title: {
            visible: true
          },
          scrollBarStyle: {
            fill: "#a6a6a6",
            hoverFill: "#888888",
            scrollingArea: {
              fill: '#333333',
              opacity: 1,
            }
          }
        },
        tooltip: tooltip,
        plotArea: {
          drawingEffect: "normal"
        },
        yAxis: {
          title: {
            visible: true,
          },
          gridline: {
            color: axisGridlineColor,
          },
          color: axisColor,
        },
      },
      'viz/combination': combinationEffect,
      'viz/horizontal_combination': horizontalcombinationEffect,
      'viz/dual_combination': dualcombinationEffect,
      'viz/dual_horizontal_combination': dualhorizontalcombinationEffect,
      'viz/boxplot': {
        background: {
          border: {
            top: {
              visible: false
            },
            bottom: {
              visible: false
            },
            left: {
              visible: false
            },
            right: {
              visible: false
            },
          },
          drawingEffect: "normal"
        },
        legend: {
          drawingEffect: "normal",
          title: {
            visible: true
          },
          scrollBarStyle: {
            fill: "#a6a6a6",
            hoverFill: "#888888",
            scrollingArea: {
              fill: '#333333',
              opacity: 1,
            }
          }
        },
        tooltip: tooltip,
        yAxis: {
          title: {
            visible: true,
          },
          axisline: {
            visible: false,
          },
          gridline: {
            type: "line",
            color: axisGridlineColor,
            showFirstLine: true,
          },
          color: axisColor,
        },
        xAxis: {
          title: {
            visible: true,
          },
          gridline: {
            color: axisGridlineColor,
          },
          color: axisColor,
        },
        plotArea: {
          drawingEffect: "normal"
        }
      },
      'viz/horizontal_boxplot': {
        background: {
          border: {
            top: {
              visible: false
            },
            bottom: {
              visible: false
            },
            left: {
              visible: false
            },
            right: {
              visible: false
            },
          },
          drawingEffect: "normal"
        },
        legend: {
          drawingEffect: "normal",
          title: {
            visible: true
          },
          scrollBarStyle: {
            fill: "#a6a6a6",
            hoverFill: "#888888",
            scrollingArea: {
              fill: '#333333',
              opacity: 1,
            }
          }
        },
        tooltip: tooltip,
        xAxis: {
          title: {
            visible: true,
          },
          axisline: {
            visible: false,
          },
          gridline: {
            type: "line",
            color: axisGridlineColor,
            showLastLine: true,
          },
          color: axisColor,
        },
        yAxis: {
          title: {
            visible: true,
          },
          gridline: {
            color: axisGridlineColor,
          },
          color: axisColor,
        },
        plotArea: {
          drawingEffect: "normal"
        }
      },
      'viz/waterfall': {
        background: {
          border: {
            top: {
              visible: false
            },
            bottom: {
              visible: false
            },
            left: {
              visible: false
            },
            right: {
              visible: false
            },
          },
          drawingEffect: "normal"
        },
        legend: {
          drawingEffect: "normal",
          title: {
            visible: true
          },
          scrollBarStyle: {
            fill: "#a6a6a6",
            hoverFill: "#888888",
            scrollingArea: {
              fill: '#333333',
              opacity: 1,
            }
          }
        },
        tooltip: tooltip,
        yAxis: {
          title: {
            visible: true,
          },
          axisline: {
            visible: false,
          },
          gridline: {
            type: "line",
            color: axisGridlineColor,
            showFirstLine: true,
          },
          color: axisColor,
        },
        xAxis: {
          title: {
            visible: true,
          },
          color: axisColor,
        },
        plotArea: {
          drawingEffect: "normal"
        }
      },
      'viz/horizontal_waterfall': {
        background: {
          border: {
            top: {
              visible: false
            },
            bottom: {
              visible: false
            },
            left: {
              visible: false
            },
            right: {
              visible: false
            },
          },
          drawingEffect: "normal"
        },
        legend: {
          drawingEffect: "normal",
          title: {
            visible: true
          },
          scrollBarStyle: {
            fill: "#a6a6a6",
            hoverFill: "#888888",
            scrollingArea: {
              fill: '#333333',
              opacity: 1,
            }
          }
        },
        tooltip: tooltip,
        xAxis: {
          title: {
            visible: true,
          },
          axisline: {
            visible: false,
          },
          gridline: {
            type: "line",
            color: axisGridlineColor,
            showLastLine: true,
          },
          color: axisColor,
        },
        yAxis: {
          title: {
            visible: true,
          },
          color: axisColor,
        },
        plotArea: {
          drawingEffect: "normal"
        }
      },

      'viz/stacked_waterfall': stackedverticalbarEffect,
      'viz/horizontal_stacked_waterfall': stackedbarEffect,

      'viz/line': lineEffect,
      'viz/multi_line': lineEffect,
      'viz/dual_line': duallineEffect,
      'viz/multi_dual_line': duallineEffect,
      'viz/horizontal_line': horizontallineEffect,
      'viz/multi_horizontal_line': horizontallineEffect,
      'viz/dual_horizontal_line': dualhorizontallineEffect,
      'viz/multi_dual_horizontal_line': dualhorizontallineEffect,

      'viz/area': lineEffect,
      'viz/multi_area': lineEffect,
      'viz/100_area': lineEffect,
      'viz/multi_100_area': lineEffect,
      'viz/horizontal_area': horizontallineEffect,
      'viz/multi_horizontal_area': horizontallineEffect,
      'viz/100_horizontal_area': horizontallineEffect,
      'viz/multi_100_horizontal_area': horizontallineEffect,
      'viz/pie': pieEffect,
      'viz/multi_pie': pieEffect,
      'viz/donut': pieEffect,
      'viz/multi_donut': pieEffect,
      'viz/pie_with_depth': pieWithDepthEffect,
      'viz/donut_with_depth': pieWithDepthEffect,
      'viz/multi_pie_with_depth': pieWithDepthEffect,
      'viz/multi_donut_with_depth': pieWithDepthEffect,
      'viz/bubble': bubbleEffect,
      'viz/multi_bubble': bubbleEffect,
      'viz/scatter': bubbleEffect,
      'viz/multi_scatter': bubbleEffect,
      'viz/scatter_matrix': bubbleEffect,
      'viz/radar': radarEffect,
      'viz/multi_radar': radarEffect,
      'viz/tagcloud': {
        legend: {
          title: {
            visible: true
          },
          scrollBarStyle: {
            fill: "#a6a6a6",
            hoverFill: "#888888",
            scrollingArea: {
              fill: '#333333',
              opacity: 1,
            }
          }
        },
        tooltip: tooltip
      },
      'viz/heatmap': {
        legend: {
          title: {
            visible: true
          },
          scrollBarStyle: {
            fill: "#a6a6a6",
            hoverFill: "#888888",
            scrollingArea: {
              fill: '#333333',
              opacity: 1,
            }
          }
        },
        tooltip: tooltip,
        xAxis: {
          title: {
            visible: true,
          },
          color: axisColor,
        },
        yAxis: {
          title: {
            visible: true,
          },
          color: axisColor,
        },
      },
      'viz/treemap': {
        legend: {
          title: {
            visible: true
          },
          scrollBarStyle: {
            fill: "#a6a6a6",
            hoverFill: "#888888",
            scrollingArea: {
              fill: '#333333',
              opacity: 1,
            }
          }
        },
        tooltip: tooltip
      },
      'viz/mekko': mekkoEffect,
      'viz/100_mekko': mekkoEffect,
      'viz/horizontal_mekko': horizontalmekkoEffect,
      'viz/100_horizontal_mekko': horizontalmekkoEffect,
      'viz/number': {
        tooltip: tooltip,
        plotArea: {
          valuePoint: {
            label: {
              fontColor: '#D8D8D8'
            }
          }
        }
      },

      'info/line': info(lineEffect),
      'info/dual_line': infoDual(duallineEffect),
      'info/horizontal_line': info(horizontallineEffect),
      'info/dual_horizontal_line': infoDual(dualhorizontallineEffect),
      'info/bar': info(barEffect),
      'info/dual_bar': infoDual(dualbarEffect),
      'info/column': info(verticalbarEffect),
      'info/dual_column': infoDual(dualverticalbarEffect),
      'info/stacked_bar': info(stackedbarEffect),
      'info/dual_stacked_bar': infoDual(dualstackedbarEffect),
      'info/100_stacked_bar': info(stackedbarEffect),
      'info/100_dual_stacked_bar': infoDual(dualstackedbarEffect),
      'info/stacked_column': info(stackedverticalbarEffect),
      'info/dual_stacked_column': infoDual(dualstackedverticalbarEffect),
      'info/100_stacked_column': info(stackedverticalbarEffect),
      'info/100_dual_stacked_column': infoDual(dualstackedverticalbarEffect),
      'info/bubble': infoBubble(bubbleEffect),
      'info/scatter': infoBubble(bubbleEffect),
      'info/time_bubble': infoBubble(bubbleEffect),
      'info/pie': info(pieEffect),
      'info/donut': info(pieEffect),
      'info/combination': info(combinationEffect),
      'info/bullet': infoBullet()
    },
    //v-hidden-title must be set after v-title
    //v-longtick must be set after v-categoryaxisline
    css: "\
  .v-m-title .v-title{fill:#D8D8D8;}\
  .v-subtitle{fill:#D8D8D8;}\
  .v-longtick{stroke:#5e5e5e;}\
  .v-title{fill:#D8D8D8;}\
  .v-hidden-title{fill:#737373;}\
  .v-label{fill:#D8D8D8;}\
  .v-background-body{fill:#1B1B1B;}\
  .v-pie .v-donut-title{fill:#D8D8D8;}\
  .v-polar-axis-label{fill:#D8D8D8;}\
  .v-datalabel{fill:#D8D8D8;}\
  .v-hoverline{stroke:#606060;}\
  .v-hovershadow{fill:#606060;}\
  .v-hovershadow-mousedown{fill:#cccccc;}\
  .v-m-tooltip .v-background{background-color:#000000; border-color:#ffffff; fill:#1B1B1B;stroke:#FFFFFF;}\
  .v-m-tooltip .v-footer-label{color:#ffffff; fill:#D8D8D8;}\
  .v-m-tooltip .v-body-dimension-label{color:#c0c0c0;}\
  .v-m-tooltip .v-body-dimension-value{color:#c0c0c0;}\
  .v-m-tooltip .v-body-measure-label{color:#c0c0c0;}\
  .v-m-tooltip .v-body-measure-value{color:#ffffff;}\
  .v-m-tooltip .v-separationline{border-bottom-color:#ffffff;}\
  .v-m-tooltip .v-closeButton{background-color:#000000;border-color:#ffffff;}\
  .v-datapoint-default{stroke:#000000}\
  .v-datapoint-hover{stroke:#999999}\
  .v-datapoint-selected{stroke:#999999}\
  .v-datapoint .v-boxplotmidline{stroke:#ffffff}\
  .v-scrollbarThumb{fill:#c0c0c0}\
  ",
  });

  function infoBullet() {
    var ret = {
      background: {
        border: {
          top: {
            visible: false
          },
          bottom: {
            visible: false
          },
          left: {
            visible: false
          },
          right: {
            visible: false
          },
        },
        drawingEffect: "normal",
      },
      tooltip: tooltip,
      legend : {
        drawingEffect : "normal",
        title : { visible : true },
      },
      plotArea: {
        drawingEffect: "normal",
        targetValueColor: "#333333",
        targetShadowColor: "#ffffff",
        gridline: {
          visible: true
        }
      },
      categoryAxis2: {
        label: {
          style: {
            color: "#FFFFFF"
          }
        }
      }
    };

    ret.valueAxis = {
      title: {
        visible: false
      },
      axisLine: {
        visible: false
      },
      color: axisColor
    };

    ret.categoryAxis = {
      title: {
        visible: false
      },
      color: axisColor,
      hoverShadow : {
        color: "#606060"
      },
      hoverShadowMouseDown : {
        color: "#cccccc"
      }
    };

    ret.plotArea.scrollBarStyle = {
      fill: "#a6a6a6",
      hoverFill: "#888888",
      scrollingArea: {
        fill: '#333333',
        opacity: 1,
      }
    };

    general(ret);
    return ret;
  }

  function info(obj) {
    var ret = {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        ret[i] = obj[i];
      }
    }

    ret.valueAxis = {
      title: {
        visible: true
      },
      axisLine: {
        visible: false
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showLastLine: true
      },
      color: axisColor
    };

    ret.categoryAxis = {
      title: {
        visible: true
      },
      gridline: {
        color: axisGridlineColor
      },
      color: axisColor,
      hoverShadow : {
        color: "#606060"
      },
      hoverShadowMouseDown : {
        color: "#cccccc"
      }
    };

    ret.plotArea.scrollBarStyle = {
      fill: "#a6a6a6",
      hoverFill: "#888888",
      scrollingArea: {
        fill: '#333333',
        opacity: 1,
      }
    };

    general(ret);
    return ret;
  }

  function infoDual(obj) {
    var ret = {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        ret[i] = obj[i];
      }
    }
    ret.valueAxis = {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisLine: {
        visible: false,
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showFirstLine: true,
      }
    };

    ret.categoryAxis = {
      title: {
        visible: true,
      },
      gridline: {
        color: axisGridlineColor,
      },
      color: axisColor,
      hoverShadow : {
        color: "#606060"
      },
      hoverShadowMouseDown : {
        color: "#cccccc"
      }
    };

    ret.valueAxis2 = {
      title: {
        visible: true,
        applyAxislineColor: true,
      },
      axisLine: {
        visible: false,
      },
      gridline: {
        color: axisGridlineColor,
      },
    };

    ret.plotArea.scrollBarStyle = {
      fill: "#a6a6a6",
      hoverFill: "#888888",
      scrollingArea: {
        fill: '#333333',
        opacity: 1,
      }
    };

    general(ret);
    return ret;
  }

  function infoBubble(obj) {
    var ret = {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        ret[i] = obj[i];
      }
    }

    ret.valueAxis = {
      title: {
        visible: true
      },
      axisLine: {
        visible: true
      },
      gridline: {
        type: "line",
        color: axisGridlineColor,
        showLastLine: true
      },
      color: axisColor
    };

    ret.valueAxis2 = {
      title: {
        visible: true
      },
      axisLine: {
        visible: false
      },
      gridline: {
        color: axisGridlineColor
      },
      color: axisColor
    };

    ret.plotArea.scrollBarStyle = {
      fill: "#a6a6a6",
      hoverFill: "#888888",
      scrollingArea: {
        fill: '#333333',
        opacity: 1,
      }
    };

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

    var gen = obj.general = obj.general || {};
    gen.background = {
      color: "#1B1B1B"
    };

    if (!obj.plotArea.gridline) {
      obj.plotArea.gridline = {};
    }

    obj.plotArea.gridline.color = axisGridlineColor;

    obj.legend = obj.legend || {};
    obj.legend.hoverShadow = {
      color: "#606060"
    };

    obj.legend.hoverShadowMouseDown = {
      color: "#cccccc"
    };

    obj.legend.scrollBarStyle = obj.plotArea.scrollBarStyle;
  }

})();