'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var PropTypes = _interopDefault(require('prop-types'));
var core = require('@nivo/core');
var axes = require('@nivo/axes');
var legends = require('@nivo/legends');
var scales = require('@nivo/scales');
var compose = _interopDefault(require('recompose/compose'));
var defaultProps = _interopDefault(require('recompose/defaultProps'));
var withPropsOnChange = _interopDefault(require('recompose/withPropsOnChange'));
var pure = _interopDefault(require('recompose/pure'));
var setDisplayName = _interopDefault(require('recompose/setDisplayName'));
var voronoi = require('@nivo/voronoi');
var React = require('react');
var React__default = _interopDefault(React);
var reactMotion = require('react-motion');

var ScatterPlotPropTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.shape({
            x: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
            y: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]).isRequired
        })).isRequired
    })).isRequired,

    xScale: scales.scalePropType.isRequired,
    yScale: scales.scalePropType.isRequired,

    computedData: PropTypes.shape({
        xScale: PropTypes.func.isRequired,
        yScale: PropTypes.func.isRequired
    }).isRequired,

    layers: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.oneOf(['grid', 'axes', 'points', 'markers', 'mesh', 'legends']), PropTypes.func])).isRequired,

    axisTop: axes.axisPropType,
    axisRight: axes.axisPropType,
    axisBottom: axes.axisPropType,
    axisLeft: axes.axisPropType,

    enableGridX: PropTypes.bool.isRequired,
    enableGridY: PropTypes.bool.isRequired,

    symbolSize: PropTypes.oneOfType([PropTypes.func, PropTypes.number]).isRequired,
    symbolShape: PropTypes.oneOfType([PropTypes.oneOf(['circle', 'square'])]).isRequired,

    markers: PropTypes.arrayOf(PropTypes.shape({
        axis: PropTypes.oneOf(['x', 'y']).isRequired,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        style: PropTypes.object
    })),

    getColor: PropTypes.func.isRequired,

    isInteractive: PropTypes.bool.isRequired,
    useMesh: PropTypes.bool.isRequired,
    debugMesh: PropTypes.bool.isRequired,

    onMouseEnter: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,

    tooltipFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    tooltip: PropTypes.func,

    legends: PropTypes.arrayOf(PropTypes.shape(legends.LegendPropShape)).isRequired,

    pixelRatio: PropTypes.number.isRequired
};

var ScatterPlotDefaultProps = {
    xScale: {
        type: 'linear',
        min: 0,
        max: 'auto'
    },
    yScale: {
        type: 'linear',
        min: 0,
        max: 'auto'
    },

    layers: ['grid', 'axes', 'points', 'markers', 'mesh', 'legends'],

    axisBottom: {},
    axisLeft: {},
    enableGridX: true,
    enableGridY: true,

    symbolSize: 6,
    symbolShape: 'circle',

    colors: 'nivo',
    colorBy: 'serie.id',

    isInteractive: true,
    useMesh: false,
    debugMesh: false,
    enableStackTooltip: true,
    onMouseEnter: core.noop,
    onMouseMove: core.noop,
    onMouseLeave: core.noop,
    onClick: core.noop,

    legends: [],

    pixelRatio: global.window && global.window.devicePixelRatio ? global.window.devicePixelRatio : 1
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var commonEnhancers = [defaultProps(ScatterPlotDefaultProps), core.withTheme(), core.withColors(), core.withDimensions(), core.withMotion(), withPropsOnChange(['symbolSize'], function (_ref) {
    var symbolSize = _ref.symbolSize;
    return {
        getSymbolSize: core.getAccessorOrValue(symbolSize)
    };
}), withPropsOnChange(['data', 'xScale', 'yScale', 'width', 'height'], function (_ref2) {
    var data = _ref2.data,
        xScale = _ref2.xScale,
        yScale = _ref2.yScale,
        width = _ref2.width,
        height = _ref2.height;

    var computedData = scales.computeXYScalesForSeries(data, xScale, yScale, width, height);
    var points = computedData.series.reduce(function (agg, serie) {
        return [].concat(agg, serie.data.map(function (d, i) {
            return {
                id: serie.id + '.' + i,
                x: d.position.x,
                y: d.position.y,
                data: _extends({}, d.data, { serie: serie, id: serie.id + '.' + i })
            };
        }));
    }, []);

    return {
        computedData: computedData,
        points: points
    };
})];

var enhanceSvg = function enhanceSvg(Component) {
    return compose.apply(undefined, commonEnhancers.concat([pure, setDisplayName('ScatterPlot')]))(Component);
};

var enhanceCanvas = function enhanceCanvas(Component) {
    return compose.apply(undefined, commonEnhancers.concat([withPropsOnChange(['points', 'width', 'height', 'debugMesh'], function (_ref3) {
        var points = _ref3.points,
            width = _ref3.width,
            height = _ref3.height,
            debugMesh = _ref3.debugMesh;

        var points2d = voronoi.computeMeshPoints({
            points: points,
            xAccessor: 'x',
            yAccessor: 'y'
        }).points;

        return voronoi.computeMesh({ points: points2d, width: width, height: height, debug: debugMesh });
    }), pure, setDisplayName('ScatterPlotCanvas')]))(Component);
};

var ScatterPlotItem = function ScatterPlotItem(_ref) {
    var x = _ref.x,
        y = _ref.y,
        size = _ref.size,
        color = _ref.color,
        onMouseEnter = _ref.onMouseEnter,
        onMouseMove = _ref.onMouseMove,
        onMouseLeave = _ref.onMouseLeave,
        onClick = _ref.onClick;
    return React__default.createElement('circle', {
        cx: x,
        cy: y,
        r: size / 2,
        fill: color,
        onMouseEnter: onMouseEnter,
        onMouseMove: onMouseMove,
        onMouseLeave: onMouseLeave,
        onClick: onClick
    });
};

ScatterPlotItem.propTypes = {
    point: PropTypes.shape({
        data: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            x: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
            y: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
            serie: PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
            }).isRequired
        }).isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }).isRequired,

    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,

    onMouseEnter: PropTypes.func,
    onMouseMove: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,

    theme: PropTypes.object.isRequired
};

var enhance = compose(withPropsOnChange(['point', 'onMouseEnter', 'onMouseMove', 'onMouseLeave', 'onClick'], function (_ref2) {
    var point = _ref2.point,
        _onMouseEnter = _ref2.onMouseEnter,
        _onMouseMove = _ref2.onMouseMove,
        _onMouseLeave = _ref2.onMouseLeave,
        _onClick = _ref2.onClick;
    return {
        onMouseEnter: function onMouseEnter(event) {
            return _onMouseEnter(point, event);
        },
        onMouseMove: function onMouseMove(event) {
            return _onMouseMove(point, event);
        },
        onMouseLeave: function onMouseLeave(event) {
            return _onMouseLeave(point, event);
        },
        onClick: function onClick(event) {
            return _onClick(point, event);
        }
    };
}), pure);

var ScatterPlotItem$1 = enhance(ScatterPlotItem);

var ScatterPlotTooltip = function ScatterPlotTooltip(_ref) {
    var data = _ref.point.data,
        color = _ref.color,
        format = _ref.format,
        tooltip = _ref.tooltip,
        theme = _ref.theme;
    return React__default.createElement(core.BasicTooltip, {
        id: data.serie.id,
        value: 'x: ' + data.x + ', y: ' + data.y,
        enableChip: true,
        color: color,
        theme: theme,
        format: format,
        renderContent: typeof tooltip === 'function' ? tooltip.bind(null, _extends({ color: color }, data)) : null
    });
};

ScatterPlotTooltip.propTypes = {
    point: PropTypes.shape({
        data: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            x: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
            y: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
            serie: PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
            }).isRequired
        }).isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }).isRequired,
    color: PropTypes.string.isRequired,
    format: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    tooltip: PropTypes.func,
    theme: PropTypes.object.isRequired
};

var ScatterPlot = function (_Component) {
    inherits(ScatterPlot, _Component);

    function ScatterPlot() {
        var _temp, _this, _ret;

        classCallCheck(this, ScatterPlot);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.showTooltip = function (showTooltip, point, event) {
            var _this$props = _this.props,
                tooltipFormat = _this$props.tooltipFormat,
                tooltip = _this$props.tooltip,
                theme = _this$props.theme,
                getColor = _this$props.getColor;


            showTooltip(React__default.createElement(ScatterPlotTooltip, {
                point: point,
                color: getColor(point.data),
                format: tooltipFormat,
                tooltip: tooltip,
                theme: theme
            }), event);
        }, _this.handleMouseEnter = function (showTooltip) {
            return function (point, event) {
                var _this$props2 = _this.props,
                    isInteractive = _this$props2.isInteractive,
                    onMouseEnter = _this$props2.onMouseEnter;


                if (!isInteractive) return;

                onMouseEnter && onMouseEnter(point, event);
                _this.showTooltip(showTooltip, point, event);
            };
        }, _this.handleMouseMove = function (showTooltip) {
            return function (point, event) {
                var _this$props3 = _this.props,
                    isInteractive = _this$props3.isInteractive,
                    onMouseMove = _this$props3.onMouseMove;


                if (!isInteractive) return;

                onMouseMove && onMouseMove(point, event);
                _this.showTooltip(showTooltip, point, event);
            };
        }, _this.handleMouseLeave = function (hideTooltip) {
            return function (point, event) {
                var _this$props4 = _this.props,
                    isInteractive = _this$props4.isInteractive,
                    onMouseLeave = _this$props4.onMouseLeave;


                if (!isInteractive) return;

                onMouseLeave && onMouseLeave(point, event);
                hideTooltip();
            };
        }, _this.handleClick = function (point, event) {
            var _this$props5 = _this.props,
                isInteractive = _this$props5.isInteractive,
                onClick = _this$props5.onClick;

            if (!isInteractive || onClick === undefined) return;

            onClick(point.data, event);
        }, _temp), possibleConstructorReturn(_this, _ret);
    }

    ScatterPlot.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            data = _props.data,
            computedData = _props.computedData,
            points = _props.points,
            layers = _props.layers,
            margin = _props.margin,
            width = _props.width,
            height = _props.height,
            outerWidth = _props.outerWidth,
            outerHeight = _props.outerHeight,
            axisTop = _props.axisTop,
            axisRight = _props.axisRight,
            axisBottom = _props.axisBottom,
            axisLeft = _props.axisLeft,
            enableGridX = _props.enableGridX,
            enableGridY = _props.enableGridY,
            markers = _props.markers,
            theme = _props.theme,
            getSymbolSize = _props.getSymbolSize,
            getColor = _props.getColor,
            animate = _props.animate,
            motionStiffness = _props.motionStiffness,
            motionDamping = _props.motionDamping,
            isInteractive = _props.isInteractive,
            useMesh = _props.useMesh,
            debugMesh = _props.debugMesh,
            legends$$1 = _props.legends;
        var xScale = computedData.xScale,
            yScale = computedData.yScale;


        var motionProps = {
            animate: animate,
            motionDamping: motionDamping,
            motionStiffness: motionStiffness
        };
        var springConfig = {
            damping: motionDamping,
            stiffness: motionStiffness
        };

        var legendData = data.map(function (serie) {
            return {
                id: serie.id,
                label: serie.id,
                color: getColor({ serie: serie })
            };
        });

        return React__default.createElement(
            core.Container,
            { isInteractive: isInteractive, theme: theme },
            function (_ref) {
                var showTooltip = _ref.showTooltip,
                    hideTooltip = _ref.hideTooltip;

                var onMouseEnter = _this2.handleMouseEnter(showTooltip);
                var onMouseMove = _this2.handleMouseMove(showTooltip);
                var onMouseLeave = _this2.handleMouseLeave(hideTooltip);

                var layerById = {
                    grid: React__default.createElement(core.Grid, _extends({
                        key: 'grid',
                        theme: theme,
                        width: width,
                        height: height,
                        xScale: enableGridX ? xScale : null,
                        yScale: enableGridY ? yScale : null
                    }, motionProps)),
                    axes: React__default.createElement(axes.Axes, _extends({
                        key: 'axes',
                        xScale: xScale,
                        yScale: yScale,
                        width: width,
                        height: height,
                        theme: theme,
                        top: axisTop,
                        right: axisRight,
                        bottom: axisBottom,
                        left: axisLeft
                    }, motionProps)),
                    markers: React__default.createElement(core.CartesianMarkers, {
                        key: 'markers',
                        markers: markers,
                        width: width,
                        height: height,
                        xScale: xScale,
                        yScale: yScale,
                        theme: theme
                    }),
                    mesh: null,
                    legends: legends$$1.map(function (legend, i) {
                        return React__default.createElement(legends.BoxLegendSvg, _extends({
                            key: i
                        }, legend, {
                            containerWidth: width,
                            containerHeight: height,
                            data: legendData,
                            theme: theme
                        }));
                    })
                };

                if (animate === true) {
                    layerById.points = React__default.createElement(
                        reactMotion.TransitionMotion,
                        {
                            key: 'points',
                            styles: points.map(function (point) {
                                return {
                                    key: point.id,
                                    data: point,
                                    style: {
                                        x: reactMotion.spring(point.x, springConfig),
                                        y: reactMotion.spring(point.y, springConfig),
                                        size: reactMotion.spring(getSymbolSize(point.data), springConfig)
                                    }
                                };
                            })
                        },
                        function (interpolatedStyles) {
                            return React__default.createElement(
                                'g',
                                null,
                                interpolatedStyles.map(function (_ref2) {
                                    var key = _ref2.key,
                                        style = _ref2.style,
                                        point = _ref2.data;
                                    return React__default.createElement(ScatterPlotItem$1, {
                                        key: key,
                                        point: point,
                                        x: style.x,
                                        y: style.y,
                                        size: style.size,
                                        color: getColor(point.data),
                                        onMouseEnter: onMouseEnter,
                                        onMouseMove: onMouseMove,
                                        onMouseLeave: onMouseLeave,
                                        onClick: _this2.handleClick,
                                        theme: theme
                                    });
                                })
                            );
                        }
                    );
                } else {
                    layerById.points = points.map(function (point) {
                        return React__default.createElement(ScatterPlotItem$1, {
                            key: point.id,
                            point: point,
                            x: point.x,
                            y: point.y,
                            size: getSymbolSize(point.data),
                            color: getColor(point.data),
                            data: point.data,
                            onMouseEnter: onMouseEnter,
                            onMouseMove: onMouseMove,
                            onMouseLeave: onMouseLeave,
                            onClick: _this2.handleClick,
                            theme: theme
                        });
                    });
                }

                if (isInteractive === true && useMesh === true) {
                    layerById.mesh = React__default.createElement(voronoi.Mesh, {
                        key: 'mesh',
                        points: points,
                        width: width,
                        height: height,
                        onMouseEnter: onMouseEnter,
                        onMouseMove: onMouseMove,
                        onMouseLeave: onMouseLeave,
                        onClick: _this2.handleClick,
                        debug: debugMesh
                    });
                }

                return React__default.createElement(
                    core.SvgWrapper,
                    {
                        width: outerWidth,
                        height: outerHeight,
                        margin: margin,
                        theme: theme
                    },
                    layers.map(function (layer, i) {
                        if (typeof layer === 'function') {
                            return React__default.createElement(
                                React.Fragment,
                                { key: i },
                                layer(_extends({}, _this2.props, { xScale: xScale, yScale: yScale }))
                            );
                        }
                        return layerById[layer];
                    })
                );
            }
        );
    };

    return ScatterPlot;
}(React.Component);

ScatterPlot.propTypes = ScatterPlotPropTypes;


var ScatterPlot$1 = enhanceSvg(ScatterPlot);

var ResponsiveScatterPlot = function ResponsiveScatterPlot(props) {
    return React__default.createElement(
        core.ResponsiveWrapper,
        null,
        function (_ref) {
            var width = _ref.width,
                height = _ref.height;
            return React__default.createElement(ScatterPlot$1, _extends({ width: width, height: height }, props));
        }
    );
};

var findNodeUnderCursor = function findNodeUnderCursor(nodes, margin, x, y) {
    return nodes.find(function (node) {
        return core.isCursorInRect(node.x + margin.left - node.size / 2, node.y + margin.top - node.size / 2, node.size, node.size, x, y);
    });
};

var ScatterPlotCanvas = function (_Component) {
    inherits(ScatterPlotCanvas, _Component);

    function ScatterPlotCanvas() {
        var _temp, _this, _ret;

        classCallCheck(this, ScatterPlotCanvas);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {}, _this.handleMouseEnter = function () {}, _this.getPointForMouseEvent = function (event) {
            var _this$props = _this.props,
                points = _this$props.points,
                margin = _this$props.margin,
                width = _this$props.width,
                height = _this$props.height,
                useMesh = _this$props.useMesh,
                delaunay = _this$props.delaunay,
                onMouseMove = _this$props.onMouseMove,
                onMouseLeave = _this$props.onMouseLeave;

            var _getRelativeCursor = core.getRelativeCursor(_this.surface, event),
                x = _getRelativeCursor[0],
                y = _getRelativeCursor[1];

            var pointIndex = void 0;
            var point = void 0;
            if (useMesh === true) {
                if (core.isCursorInRect(margin.left, margin.top, width, height, x, y)) {
                    pointIndex = delaunay.find(x - margin.left, y - margin.top);
                    point = points[pointIndex];
                } else {
                    pointIndex = null;
                    point = null;
                }
            } else {
                point = findNodeUnderCursor(points, margin, x, y);
            }

            if (point && onMouseMove !== undefined) {
                onMouseMove(point, event);
            } else if (!point && _this.state.point && onMouseLeave !== undefined) {
                onMouseLeave(_this.state.point, event);
            }

            _this.setState({ pointIndex: pointIndex, point: point });

            return point;
        }, _this.handleMouseHover = function (showTooltip, hideTooltip) {
            return function (event) {
                var point = _this.getPointForMouseEvent(event);
                if (point) {
                    var _this$props2 = _this.props,
                        theme = _this$props2.theme,
                        tooltipFormat = _this$props2.tooltipFormat,
                        tooltip = _this$props2.tooltip,
                        getColor = _this$props2.getColor;

                    showTooltip(React__default.createElement(ScatterPlotTooltip, {
                        point: point,
                        color: getColor(point.data),
                        format: tooltipFormat,
                        tooltip: tooltip,
                        theme: theme
                    }), event);
                } else {
                    hideTooltip();
                }
            };
        }, _this.handleMouseLeave = function (hideTooltip) {
            return function () {
                hideTooltip();
            };
        }, _this.handleClick = function (event) {
            var point = _this.getPointForMouseEvent(event);
            if (point !== undefined) {
                _this.props.onClick(point.data, event);
            }
        }, _temp), possibleConstructorReturn(_this, _ret);
    }

    ScatterPlotCanvas.prototype.componentDidMount = function componentDidMount() {
        this.ctx = this.surface.getContext('2d');
        this.draw(this.props);
    };

    ScatterPlotCanvas.prototype.shouldComponentUpdate = function shouldComponentUpdate(props) {
        if (this.props.outerWidth !== props.outerWidth || this.props.outerHeight !== props.outerHeight || this.props.isInteractive !== props.isInteractive || this.props.theme !== props.theme) {
            return true;
        } else {
            this.draw(props);
            return false;
        }
    };

    ScatterPlotCanvas.prototype.componentDidUpdate = function componentDidUpdate() {
        this.ctx = this.surface.getContext('2d');
        this.draw(this.props);
    };

    ScatterPlotCanvas.prototype.draw = function draw(props) {
        var _this2 = this;

        var data = props.data,
            computedData = props.computedData,
            points = props.points,
            width = props.width,
            height = props.height,
            outerWidth = props.outerWidth,
            outerHeight = props.outerHeight,
            pixelRatio = props.pixelRatio,
            margin = props.margin,
            axisTop = props.axisTop,
            axisRight = props.axisRight,
            axisBottom = props.axisBottom,
            axisLeft = props.axisLeft,
            enableGridX = props.enableGridX,
            enableGridY = props.enableGridY,
            useMesh = props.useMesh,
            debugMesh = props.debugMesh,
            voronoi$$1 = props.voronoi,
            theme = props.theme,
            getSymbolSize = props.getSymbolSize,
            getColor = props.getColor,
            legends$$1 = props.legends;
        var xScale = computedData.xScale,
            yScale = computedData.yScale;


        this.surface.width = outerWidth * pixelRatio;
        this.surface.height = outerHeight * pixelRatio;

        this.ctx.scale(pixelRatio, pixelRatio);

        this.ctx.fillStyle = theme.background;
        this.ctx.fillRect(0, 0, outerWidth, outerHeight);
        this.ctx.translate(margin.left, margin.top);

        this.ctx.strokeStyle = '#dddddd';
        enableGridX && core.renderGridLinesToCanvas(this.ctx, {
            width: width,
            height: height,
            scale: xScale,
            axis: 'x'
        });
        enableGridY && core.renderGridLinesToCanvas(this.ctx, {
            width: width,
            height: height,
            scale: yScale,
            axis: 'y'
        });

        this.ctx.strokeStyle = '#000000';
        axes.renderAxesToCanvas(this.ctx, {
            xScale: xScale,
            yScale: yScale,
            width: width,
            height: height,
            top: axisTop,
            right: axisRight,
            bottom: axisBottom,
            left: axisLeft,
            theme: theme
        });

        points.forEach(function (point) {
            _this2.ctx.beginPath();
            _this2.ctx.arc(point.x, point.y, getSymbolSize(point.data) / 2, 0, 2 * Math.PI);
            _this2.ctx.fillStyle = getColor(point.data);
            _this2.ctx.fill();
        });

        if (useMesh === true && debugMesh === true) {
            var pointIndex = this.state.pointIndex;

            voronoi.renderVoronoiToCanvas(this.ctx, voronoi$$1);
            if (pointIndex !== null) {
                voronoi.renderVoronoiCellToCanvas(this.ctx, voronoi$$1, pointIndex);
            }
        }

        var legendData = data.map(function (serie) {
            return {
                id: serie.id,
                label: serie.id,
                color: getColor({ serie: serie })
            };
        });

        legends$$1.forEach(function (legend) {
            legends.renderLegendToCanvas(_this2.ctx, _extends({}, legend, {
                data: legendData,
                containerWidth: width,
                containerHeight: height
            }));
        });
    };

    ScatterPlotCanvas.prototype.render = function render() {
        var _this3 = this;

        var _props = this.props,
            outerWidth = _props.outerWidth,
            outerHeight = _props.outerHeight,
            pixelRatio = _props.pixelRatio,
            isInteractive = _props.isInteractive,
            theme = _props.theme;


        return React__default.createElement(
            core.Container,
            { isInteractive: isInteractive, theme: theme },
            function (_ref) {
                var showTooltip = _ref.showTooltip,
                    hideTooltip = _ref.hideTooltip;
                return React__default.createElement('canvas', {
                    ref: function ref(surface) {
                        _this3.surface = surface;
                    },
                    width: outerWidth * pixelRatio,
                    height: outerHeight * pixelRatio,
                    style: {
                        width: outerWidth,
                        height: outerHeight
                    },
                    onMouseEnter: _this3.handleMouseHover(showTooltip, hideTooltip),
                    onMouseMove: _this3.handleMouseHover(showTooltip, hideTooltip),
                    onMouseLeave: _this3.handleMouseLeave(hideTooltip),
                    onClick: _this3.handleClick
                });
            }
        );
    };

    return ScatterPlotCanvas;
}(React.Component);

ScatterPlotCanvas.propTypes = ScatterPlotPropTypes;

var ScatterPlotCanvas$1 = enhanceCanvas(ScatterPlotCanvas);

var ResponsiveScatterPlotCanvas = function ResponsiveScatterPlotCanvas(props) {
    return React__default.createElement(
        core.ResponsiveWrapper,
        null,
        function (_ref) {
            var width = _ref.width,
                height = _ref.height;
            return React__default.createElement(ScatterPlotCanvas$1, _extends({ width: width, height: height }, props));
        }
    );
};

exports.ScatterPlot = ScatterPlot$1;
exports.ResponsiveScatterPlot = ResponsiveScatterPlot;
exports.ScatterPlotCanvas = ScatterPlotCanvas$1;
exports.ResponsiveScatterPlotCanvas = ResponsiveScatterPlotCanvas;
exports.ScatterPlotPropTypes = ScatterPlotPropTypes;
exports.ScatterPlotDefaultProps = ScatterPlotDefaultProps;
