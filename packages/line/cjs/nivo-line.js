'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var pure = _interopDefault(require('recompose/pure'));
var core = require('@nivo/core');
var isFunction = _interopDefault(require('lodash/isFunction'));
var d3Format = require('d3-format');
var compose = _interopDefault(require('recompose/compose'));
var withState = _interopDefault(require('recompose/withState'));
var withHandlers = _interopDefault(require('recompose/withHandlers'));
var withPropsOnChange = _interopDefault(require('recompose/withPropsOnChange'));
var reactMotion = require('react-motion');
var axes = require('@nivo/axes');
var scales = require('@nivo/scales');
var legends = require('@nivo/legends');
var d3Shape = require('d3-shape');
var defaultProps = _interopDefault(require('recompose/defaultProps'));

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

var LineAreas = function LineAreas(_ref) {
    var areaGenerator = _ref.areaGenerator,
        areaOpacity = _ref.areaOpacity,
        areaBlendMode = _ref.areaBlendMode,
        lines = _ref.lines,
        animate = _ref.animate,
        motionStiffness = _ref.motionStiffness,
        motionDamping = _ref.motionDamping;

    if (animate !== true) {
        return React__default.createElement(
            'g',
            null,
            lines.slice(0).reverse().map(function (_ref2) {
                var id = _ref2.id,
                    data = _ref2.data,
                    areaColor = _ref2.color;
                return React__default.createElement('path', {
                    key: id,
                    d: areaGenerator(data.map(function (d) {
                        return d.position;
                    })),
                    fill: areaColor,
                    fillOpacity: areaOpacity,
                    strokeWidth: 0,
                    style: {
                        mixBlendMode: areaBlendMode
                    }
                });
            })
        );
    }

    var springConfig = {
        stiffness: motionStiffness,
        damping: motionDamping
    };

    return React__default.createElement(
        'g',
        null,
        lines.slice(0).reverse().map(function (_ref3) {
            var id = _ref3.id,
                data = _ref3.data,
                areaColor = _ref3.color;
            return React__default.createElement(
                core.SmartMotion,
                {
                    key: id,
                    style: function style(spring) {
                        return {
                            d: spring(areaGenerator(data.map(function (d) {
                                return d.position;
                            })), springConfig),
                            fill: spring(areaColor, springConfig)
                        };
                    }
                },
                function (style) {
                    return React__default.createElement('path', {
                        key: id,
                        d: style.d,
                        fill: areaColor,
                        fillOpacity: areaOpacity,
                        strokeWidth: 0,
                        style: { mixBlendMode: areaBlendMode }
                    });
                }
            );
        })
    );
};

LineAreas.propTypes = _extends({
    areaOpacity: PropTypes.number.isRequired,
    areaBlendMode: core.blendModePropType.isRequired
}, core.motionPropTypes);

var LineAreas$1 = pure(LineAreas);

var LineLine = function LineLine(_ref) {
    var lineGenerator = _ref.lineGenerator,
        id = _ref.id,
        points = _ref.points,
        color = _ref.color,
        thickness = _ref.thickness,
        animate = _ref.animate,
        motionStiffness = _ref.motionStiffness,
        motionDamping = _ref.motionDamping;

    if (animate !== true) {
        return React__default.createElement('path', {
            key: id,
            d: lineGenerator(points),
            fill: 'none',
            strokeWidth: thickness,
            stroke: color
        });
    }

    var springConfig = {
        stiffness: motionStiffness,
        damping: motionDamping
    };

    return React__default.createElement(
        core.SmartMotion,
        {
            key: id,
            style: function style(spring) {
                return {
                    d: spring(lineGenerator(points), springConfig),
                    stroke: spring(color, springConfig)
                };
            }
        },
        function (style) {
            return React__default.createElement('path', {
                key: id,
                d: style.d,
                fill: 'none',
                strokeWidth: thickness,
                stroke: style.stroke
            });
        }
    );
};

LineLine.propTypes = _extends({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    points: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        y: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })),
    lineGenerator: PropTypes.func.isRequired,
    color: PropTypes.string.isRequired,
    thickness: PropTypes.number.isRequired
}, core.motionPropTypes);

var Line = pure(LineLine);

var LineLines = function LineLines(_ref) {
    var lines = _ref.lines,
        lineGenerator = _ref.lineGenerator,
        lineWidth = _ref.lineWidth,
        animate = _ref.animate,
        motionStiffness = _ref.motionStiffness,
        motionDamping = _ref.motionDamping,
        highlightedLines = _ref.highlightedLines;
    return React__default.createElement(
        'g',
        null,
        lines.map(function (_ref2) {
            var id = _ref2.id,
                data = _ref2.data,
                color = _ref2.color;

            return React__default.createElement(Line, {
                key: id,
                id: id,
                points: data.map(function (d) {
                    return d.position;
                }),
                lineGenerator: lineGenerator,
                color: color,
                thickness: highlightedLines[id] ? lineWidth + 1 : lineWidth,
                animate: animate,
                motionStiffness: motionStiffness,
                motionDamping: motionDamping
            });
        })
    );
};

LineLines.propTypes = _extends({
    lines: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        color: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.shape({
            data: PropTypes.shape({
                x: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
                y: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)])
            }).isRequired,
            position: PropTypes.shape({
                x: PropTypes.number,
                y: PropTypes.number
            }).isRequired
        })).isRequired
    })).isRequired,
    lineWidth: PropTypes.number.isRequired,
    lineGenerator: PropTypes.func.isRequired
}, core.motionPropTypes);

var LineLines$1 = pure(LineLines);

var Chip = function Chip(_ref) {
    var color = _ref.color;
    return React__default.createElement('span', { style: { display: 'block', width: '12px', height: '12px', background: color } });
};

Chip.propTypes = {
    color: PropTypes.string.isRequired
};

var LineSlicesItem = function LineSlicesItem(_ref2) {
    var slice = _ref2.slice,
        height = _ref2.height,
        showTooltip = _ref2.showTooltip,
        hideTooltip = _ref2.hideTooltip,
        isHover = _ref2.isHover;
    return React__default.createElement(
        'g',
        { transform: 'translate(' + slice.x + ', 0)' },
        isHover && React__default.createElement('line', {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: height,
            stroke: '#000',
            strokeOpacity: 0.35,
            strokeWidth: 1
        }),
        React__default.createElement('rect', {
            x: -20,
            width: 40,
            height: height,
            fill: '#F00',
            fillOpacity: 0,
            onMouseEnter: showTooltip,
            onMouseMove: showTooltip,
            onMouseLeave: hideTooltip
        })
    );
};

LineSlicesItem.propTypes = {
    slice: PropTypes.object.isRequired,
    height: PropTypes.number.isRequired,
    showTooltip: PropTypes.func.isRequired,
    hideTooltip: PropTypes.func.isRequired,
    isHover: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired,
    tooltip: PropTypes.func,
    tooltipFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};

var enhance = compose(withState('isHover', 'setIsHover', false), withPropsOnChange(['slice', 'theme', 'tooltip', 'tooltipFormat'], function (_ref3) {
    var slice = _ref3.slice,
        theme = _ref3.theme,
        tooltip = _ref3.tooltip,
        tooltipFormat = _ref3.tooltipFormat;

    var format = !tooltipFormat || isFunction(tooltipFormat) ? tooltipFormat : d3Format.format(tooltipFormat);
    var hasValues = slice.data.some(function (d) {
        return d.position.x !== null && d.position.y !== null;
    });

    return {
        tooltipElement: hasValues ? React__default.createElement(core.TableTooltip, {
            theme: theme,
            rows: slice.data.filter(function (d) {
                return d.position.x !== null && d.position.y !== null;
            }).map(function (d) {
                return [React__default.createElement(Chip, { key: d.id, color: d.serie.color }), d.serie.id, format ? format(d.data.y) : d.data.y];
            }),
            format: format,
            renderContent: typeof tooltip === 'function' ? tooltip.bind(null, _extends({}, slice)) : null
        }) : null
    };
}), withHandlers({
    showTooltip: function showTooltip(_ref4) {
        var _showTooltip = _ref4.showTooltip,
            setIsHover = _ref4.setIsHover,
            tooltipElement = _ref4.tooltipElement;
        return function (e) {
            setIsHover(true);
            _showTooltip(tooltipElement, e);
        };
    },
    hideTooltip: function hideTooltip(_ref5) {
        var _hideTooltip = _ref5.hideTooltip,
            setIsHover = _ref5.setIsHover;
        return function () {
            setIsHover(false);
            _hideTooltip();
        };
    }
}), pure);

var LineSlicesItem$1 = enhance(LineSlicesItem);

var LineSlices = function LineSlices(_ref) {
    var slices = _ref.slices,
        height = _ref.height,
        showTooltip = _ref.showTooltip,
        hideTooltip = _ref.hideTooltip,
        theme = _ref.theme,
        tooltip = _ref.tooltip,
        tooltipFormat = _ref.tooltipFormat;
    return React__default.createElement(
        'g',
        null,
        slices.map(function (slice) {
            return React__default.createElement(LineSlicesItem$1, {
                key: slice.id,
                slice: slice,
                height: height,
                showTooltip: showTooltip,
                hideTooltip: hideTooltip,
                theme: theme,
                tooltipFormat: tooltipFormat,
                tooltip: tooltip
            });
        })
    );
};

LineSlices.propTypes = {
    slices: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
        x: PropTypes.number.isRequired,
        data: PropTypes.arrayOf(PropTypes.shape({
            data: PropTypes.shape({
                x: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]),
                y: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)])
            }),
            position: PropTypes.shape({
                x: PropTypes.number,
                y: PropTypes.number
            }).isRequired,
            serie: PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                color: PropTypes.string.isRequired
            }).isRequired
        })).isRequired
    })).isRequired,
    height: PropTypes.number.isRequired,
    showTooltip: PropTypes.func.isRequired,
    hideTooltip: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    tooltip: PropTypes.func,
    tooltipFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};

var LineSlices$1 = pure(LineSlices);

/**
 * BasicTooltip, used for axis tooltips.
 * @param node - the axis tick passed in
 * @returns BasicTooltip
 */
var HoverPanel = function HoverPanel(_ref) {
    var node = _ref.node,
        theme = _ref.theme,
        format = _ref.format,
        tooltip = _ref.tooltip;
    return React__default.createElement(core.BasicTooltip, {
        id: "" + node.value,
        enableChip: false,
        color: node.color,
        theme: theme,
        format: format,
        renderContent: typeof tooltip === 'function' ? tooltip.bind(null, _extends({}, node)) : null
    });
};

var LineDots = function (_React$Component) {
    inherits(LineDots, _React$Component);

    function LineDots(props) {
        classCallCheck(this, LineDots);

        var _this = possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.setHover = _this.setHover.bind(_this);
        return _this;
    }

    LineDots.prototype.setHover = function setHover(event, node, isHovered) {
        if (isHovered) {
            this.handleHover(event, node);
        } else {
            this.handleHide(node);
        }
    };

    LineDots.prototype.handleNodeHover = function handleNodeHover(showTooltip, event, node) {
        var _props = this.props,
            theme = _props.theme,
            tooltipFormat = _props.tooltipFormat,
            tooltip = _props.tooltip;

        showTooltip(React__default.createElement(HoverPanel, {
            node: {
                value: node.id,
                yValStacked: node.data.yStacked,
                yVal: node.data.y,
                xVal: node.data.x,
                xKey: event.x,
                yKey: event.y,
                color: node.color || '#ffffff'
            },
            theme: theme,
            format: tooltipFormat,
            tooltip: tooltip
        }), event);
    };

    LineDots.prototype.handleHover = function handleHover(event, node) {
        this.handleNodeHover(this.props.showTooltip, event, node);
        this.props.setHighlightedLines(node.id, true);
    };

    LineDots.prototype.handleHide = function handleHide(node) {
        this.props.hideTooltip();
        this.props.setHighlightedLines(node.id, false);
    };

    LineDots.prototype.render = function render() {
        var _this2 = this;

        var _props2 = this.props,
            lines = _props2.lines,
            symbol = _props2.symbol,
            size = _props2.size,
            color = _props2.color,
            borderWidth = _props2.borderWidth,
            borderColor = _props2.borderColor,
            enableLabel = _props2.enableLabel,
            label = _props2.label,
            labelFormat = _props2.labelFormat,
            labelYOffset = _props2.labelYOffset,
            theme = _props2.theme,
            animate = _props2.animate,
            motionStiffness = _props2.motionStiffness,
            motionDamping = _props2.motionDamping;

        var getLabel = core.getLabelGenerator(label, labelFormat);

        var points = lines.reduce(function (acc, line) {
            var id = line.id,
                data = line.data;

            return [].concat(acc, data.filter(function (datum) {
                return datum.position.x !== null && datum.position.y !== null;
            }).map(function (datum) {
                return {
                    key: id + '.' + datum.data.x,
                    x: datum.position.x,
                    y: datum.position.y,
                    datum: _extends({}, datum, { id: id }),
                    fill: color(line),
                    stroke: borderColor(line),
                    label: enableLabel ? getLabel(datum.data) : null
                };
            }));
        }, []);

        if (animate !== true) {
            return React__default.createElement(
                'g',
                null,
                points.map(function (point) {
                    return React__default.createElement(core.DotsItem, {
                        key: point.key,
                        x: point.x,
                        y: point.y,
                        datum: point.datum,
                        symbol: symbol,
                        size: size,
                        color: point.fill,
                        borderWidth: borderWidth,
                        borderColor: point.stroke,
                        label: point.label,
                        labelYOffset: labelYOffset,
                        setHover: _this2.setHover,
                        theme: theme
                    });
                })
            );
        }
        var springConfig = {
            motionDamping: motionDamping,
            motionStiffness: motionStiffness
        };

        return React__default.createElement(
            reactMotion.TransitionMotion,
            {
                styles: points.map(function (point) {
                    return {
                        key: point.key,
                        data: point,
                        style: {
                            x: reactMotion.spring(point.x, springConfig),
                            y: reactMotion.spring(point.y, springConfig),
                            size: reactMotion.spring(size, springConfig)
                        }
                    };
                })
            },
            function (interpolatedStyles) {
                return React__default.createElement(
                    'g',
                    null,
                    interpolatedStyles.map(function (_ref) {
                        var key = _ref.key,
                            style = _ref.style,
                            point = _ref.data;
                        return React__default.createElement(core.DotsItem, _extends({
                            key: key
                        }, style, {
                            symbol: symbol,
                            datum: point.datum,
                            color: point.fill,
                            borderWidth: borderWidth,
                            borderColor: point.stroke,
                            label: point.label,
                            labelYOffset: labelYOffset,
                            setHover: _this2.setHover,
                            theme: theme
                        }));
                    })
                );
            }
        );
    };

    return LineDots;
}(React__default.Component);

LineDots.propTypes = _extends({
    lines: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired
    })),

    symbol: PropTypes.func,
    size: PropTypes.number.isRequired,
    color: PropTypes.func.isRequired,
    borderWidth: PropTypes.number.isRequired,
    borderColor: PropTypes.func.isRequired,

    enableLabel: PropTypes.bool.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    labelFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    labelYOffset: PropTypes.number,

    theme: PropTypes.shape({
        dots: core.dotsThemePropType.isRequired
    }).isRequired

}, core.motionPropTypes);

LineDots.defaultProps = {
    // labels
    enableLabel: false,
    label: 'y'
};

var LinePropTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        data: PropTypes.arrayOf(PropTypes.shape({
            x: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]),
            y: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)])
        })).isRequired
    })).isRequired,

    xScale: scales.scalePropType.isRequired,
    yScale: scales.scalePropType.isRequired,

    computedData: PropTypes.object.isRequired,
    layers: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.oneOf(['grid', 'markers', 'axes', 'areas', 'lines', 'slices', 'dots', 'legends']), PropTypes.func])).isRequired,

    curve: core.lineCurvePropType.isRequired,
    areaGenerator: PropTypes.func.isRequired,
    lineGenerator: PropTypes.func.isRequired,

    axisTop: axes.axisPropType,
    axisRight: axes.axisPropType,
    axisBottom: axes.axisPropType,
    axisLeft: axes.axisPropType,

    enableGridX: PropTypes.bool.isRequired,
    enableGridY: PropTypes.bool.isRequired,
    gridXValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
    gridYValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),

    enableDots: PropTypes.bool.isRequired,
    dotSymbol: PropTypes.func,
    dotSize: PropTypes.number.isRequired,
    dotColor: PropTypes.any.isRequired,
    dotBorderWidth: PropTypes.number.isRequired,
    dotBorderColor: PropTypes.any.isRequired,
    enableDotLabel: PropTypes.bool.isRequired,

    markers: PropTypes.arrayOf(PropTypes.shape({
        axis: PropTypes.oneOf(['x', 'y']).isRequired,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        style: PropTypes.object
    })),

    getColor: PropTypes.func.isRequired,
    enableArea: PropTypes.bool.isRequired,
    areaOpacity: PropTypes.number.isRequired,
    areaBlendMode: core.blendModePropType.isRequired,
    areaBaselineValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    lineWidth: PropTypes.number.isRequired,
    defs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired
    })).isRequired,

    isInteractive: PropTypes.bool.isRequired,
    enableStackTooltip: PropTypes.bool.isRequired,
    tooltip: PropTypes.func,
    tooltipFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

    legends: PropTypes.arrayOf(PropTypes.shape(legends.LegendPropShape)).isRequired
};

var LineDefaultProps = {
    curve: 'linear',

    xScale: {
        type: 'point'
    },
    yScale: {
        type: 'linear',
        min: 0,
        max: 'auto'
    },

    layers: ['grid', 'markers', 'axes', 'areas', 'lines', 'slices', 'dots', 'legends'],
    axisBottom: {},
    axisLeft: {},
    enableGridX: true,
    enableGridY: true,

    enableDots: true,
    dotSize: 6,
    dotColor: 'inherit',
    dotBorderWidth: 0,
    dotBorderColor: 'inherit',
    enableDotLabel: false,

    colors: 'nivo',
    colorBy: 'id',
    enableArea: false,
    areaBaselineValue: 0,
    areaOpacity: 0.2,
    areaBlendMode: 'normal',
    lineWidth: 2,
    defs: [],

    isInteractive: true,
    enableStackTooltip: true,

    legends: []
};

var Line$1 = function (_React$Component) {
    inherits(Line, _React$Component);

    function Line(props) {
        classCallCheck(this, Line);

        var _this = possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.state = {
            highlightedLines: {}
        };
        _this.setHighlightedLines = _this.setHighlightedLines.bind(_this);
        return _this;
    }

    Line.prototype.setHighlightedLines = function setHighlightedLines(key, isHighlighted) {
        var _babelHelpers$extends;

        var highlightedLines = this.state.highlightedLines;

        this.setState({ highlightedLines: _extends({}, highlightedLines, (_babelHelpers$extends = {}, _babelHelpers$extends[key] = isHighlighted, _babelHelpers$extends)) });
    };

    Line.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            computedData = _props.computedData,
            lineGenerator = _props.lineGenerator,
            areaGenerator = _props.areaGenerator,
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
            gridXValues = _props.gridXValues,
            gridYValues = _props.gridYValues,
            lineWidth = _props.lineWidth,
            enableArea = _props.enableArea,
            areaOpacity = _props.areaOpacity,
            areaBlendMode = _props.areaBlendMode,
            enableDots = _props.enableDots,
            dotSymbol = _props.dotSymbol,
            dotSize = _props.dotSize,
            dotColor = _props.dotColor,
            dotBorderWidth = _props.dotBorderWidth,
            dotBorderColor = _props.dotBorderColor,
            enableDotLabel = _props.enableDotLabel,
            dotLabel = _props.dotLabel,
            dotLabelFormat = _props.dotLabelFormat,
            dotLabelYOffset = _props.dotLabelYOffset,
            markers = _props.markers,
            theme = _props.theme,
            animate = _props.animate,
            motionStiffness = _props.motionStiffness,
            motionDamping = _props.motionDamping,
            isInteractive = _props.isInteractive,
            tooltipFormat = _props.tooltipFormat,
            tooltip = _props.tooltip,
            enableStackTooltip = _props.enableStackTooltip,
            enableDotTooltip = _props.enableDotTooltip,
            legends$$1 = _props.legends;


        var motionProps = {
            animate: animate,
            motionDamping: motionDamping,
            motionStiffness: motionStiffness
        };

        var legendData = computedData.series.map(function (line) {
            return {
                id: line.id,
                label: line.id,
                color: line.color
            };
        }).reverse();

        return React__default.createElement(
            core.Container,
            { isInteractive: isInteractive, theme: theme },
            function (_ref) {
                var showTooltip = _ref.showTooltip,
                    hideTooltip = _ref.hideTooltip;

                var layerById = {
                    grid: React__default.createElement(core.Grid, _extends({
                        key: 'grid',
                        theme: theme,
                        width: width,
                        height: height,
                        xScale: enableGridX ? computedData.xScale : null,
                        yScale: enableGridY ? computedData.yScale : null,
                        xValues: gridXValues,
                        yValues: gridYValues
                    }, motionProps)),
                    markers: React__default.createElement(core.CartesianMarkers, {
                        key: 'markers',
                        markers: markers,
                        width: width,
                        height: height,
                        xScale: computedData.xScale,
                        yScale: computedData.yScale,
                        theme: theme
                    }),
                    axes: React__default.createElement(axes.Axes, _extends({
                        key: 'axes',
                        xScale: computedData.xScale,
                        yScale: computedData.yScale,
                        width: width,
                        height: height,
                        theme: theme,
                        top: axisTop,
                        right: axisRight,
                        bottom: axisBottom,
                        left: axisLeft
                    }, motionProps)),
                    areas: null,
                    lines: React__default.createElement(LineLines$1, _extends({
                        key: 'lines',
                        lines: computedData.series,
                        lineGenerator: lineGenerator,
                        lineWidth: lineWidth,
                        highlightedLines: _this2.state.highlightedLines
                    }, motionProps)),
                    slices: null,
                    dots: null,
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

                if (enableArea) {
                    layerById.areas = React__default.createElement(LineAreas$1, _extends({
                        key: 'areas',
                        areaGenerator: areaGenerator,
                        areaOpacity: areaOpacity,
                        areaBlendMode: areaBlendMode,
                        lines: computedData.series
                    }, motionProps));
                }

                if (isInteractive && enableStackTooltip) {
                    layerById.slices = React__default.createElement(LineSlices$1, {
                        key: 'slices',
                        slices: computedData.slices,
                        height: height,
                        showTooltip: showTooltip,
                        hideTooltip: hideTooltip,
                        theme: theme,
                        tooltipFormat: tooltipFormat,
                        tooltip: tooltip
                    });
                }

                if (enableDots && enableDotTooltip) {
                    layerById.dots = React__default.createElement(LineDots, _extends({
                        key: 'dots',
                        lines: computedData.series,
                        symbol: dotSymbol,
                        size: dotSize,
                        color: core.getInheritedColorGenerator(dotColor),
                        borderWidth: dotBorderWidth,
                        borderColor: core.getInheritedColorGenerator(dotBorderColor),
                        enableLabel: enableDotLabel,
                        label: dotLabel,
                        labelFormat: dotLabelFormat,
                        labelYOffset: dotLabelYOffset,
                        theme: theme,
                        showTooltip: showTooltip,
                        hideTooltip: hideTooltip,
                        tooltipFormat: tooltipFormat,
                        tooltip: tooltip,
                        setHighlightedLines: _this2.setHighlightedLines
                    }, motionProps));
                } else if (enableDots) {
                    layerById.dots = React__default.createElement(LineDots, _extends({
                        key: 'dots',
                        lines: computedData.series,
                        symbol: dotSymbol,
                        size: dotSize,
                        color: core.getInheritedColorGenerator(dotColor),
                        borderWidth: dotBorderWidth,
                        borderColor: core.getInheritedColorGenerator(dotBorderColor),
                        enableLabel: enableDotLabel,
                        label: dotLabel,
                        labelFormat: dotLabelFormat,
                        labelYOffset: dotLabelYOffset,
                        theme: theme
                    }, motionProps));
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
                                layer(_extends({}, props, {
                                    xScale: computedData.xScale,
                                    yScale: computedData.yScale,
                                    showTooltip: showTooltip,
                                    hideTooltip: hideTooltip
                                }))
                            );
                        }
                        return layerById[layer];
                    })
                );
            }
        );
    };

    return Line;
}(React__default.Component);

Line$1.propTypes = LinePropTypes;

var enhance$1 = compose(defaultProps(LineDefaultProps), core.withTheme(), core.withColors(), core.withDimensions(), core.withMotion(), withPropsOnChange(['curve'], function (_ref2) {
    var curve = _ref2.curve;
    return {
        lineGenerator: d3Shape.line().defined(function (d) {
            return d.x !== null && d.y !== null;
        }).x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        }).curve(core.curveFromProp(curve))
    };
}), withPropsOnChange(['data', 'xScale', 'yScale', 'width', 'height'], function (_ref3) {
    var data = _ref3.data,
        xScale = _ref3.xScale,
        yScale = _ref3.yScale,
        width = _ref3.width,
        height = _ref3.height;
    return {
        computedData: scales.computeXYScalesForSeries(data, xScale, yScale, width, height)
    };
}), withPropsOnChange(['getColor', 'computedData'], function (_ref4) {
    var getColor = _ref4.getColor,
        _computedData = _ref4.computedData;

    var computedData = _extends({}, _computedData, {
        series: _computedData.series.map(function (serie) {
            return _extends({}, serie, {
                color: getColor(serie)
            });
        })
    });

    computedData.slices = scales.computeYSlices(computedData);

    return { computedData: computedData };
}), withPropsOnChange(['curve', 'computedData', 'areaBaselineValue'], function (_ref5) {
    var curve = _ref5.curve,
        computedData = _ref5.computedData,
        areaBaselineValue = _ref5.areaBaselineValue;
    return {
        areaGenerator: d3Shape.area().defined(function (d) {
            return d.x !== null && d.y !== null;
        }).x(function (d) {
            return d.x;
        }).y1(function (d) {
            return d.y;
        }).curve(core.curveFromProp(curve)).y0(computedData.yScale(areaBaselineValue))
    };
}), pure);

var enhancedLine = enhance$1(Line$1);
enhancedLine.displayName = 'Line';

var ResponsiveLine = function ResponsiveLine(props) {
    return React__default.createElement(
        core.ResponsiveWrapper,
        null,
        function (_ref) {
            var width = _ref.width,
                height = _ref.height;
            return React__default.createElement(enhancedLine, _extends({ width: width, height: height }, props));
        }
    );
};

exports.Line = enhancedLine;
exports.ResponsiveLine = ResponsiveLine;
exports.LinePropTypes = LinePropTypes;
exports.LineDefaultProps = LineDefaultProps;
