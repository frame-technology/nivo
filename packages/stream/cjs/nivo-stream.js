'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var core = require('@nivo/core');
var compose = _interopDefault(require('recompose/compose'));
var pure = _interopDefault(require('recompose/pure'));
var reactMotion = require('react-motion');
var withState = _interopDefault(require('recompose/withState'));
var withHandlers = _interopDefault(require('recompose/withHandlers'));
var withPropsOnChange = _interopDefault(require('recompose/withPropsOnChange'));
var legends = require('@nivo/legends');
var range = _interopDefault(require('lodash/range'));
var d3Shape = require('d3-shape');
var d3Scale = require('d3-scale');
var d3Format = require('d3-format');
var defaultProps = _interopDefault(require('recompose/defaultProps'));
var sortBy = _interopDefault(require('lodash/sortBy'));

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

var StreamLayers = function StreamLayers(_ref) {
    var layers = _ref.layers,
        fillOpacity = _ref.fillOpacity,
        borderWidth = _ref.borderWidth,
        getBorderColor = _ref.getBorderColor,
        theme = _ref.theme,
        showTooltip = _ref.showTooltip,
        hideTooltip = _ref.hideTooltip,
        getTooltipLabel = _ref.getTooltipLabel,
        animate = _ref.animate,
        motionStiffness = _ref.motionStiffness,
        motionDamping = _ref.motionDamping;

    if (animate !== true) {
        return React__default.createElement(
            'g',
            null,
            layers.map(function (layer, i) {
                var path = layer.path,
                    color = layer.color;


                var handleTooltip = function handleTooltip(e) {
                    return showTooltip(React__default.createElement(core.BasicTooltip, {
                        id: getTooltipLabel(layer),
                        enableChip: true,
                        color: color,
                        theme: theme
                    }), e);
                };

                return React__default.createElement('path', {
                    key: i,
                    onMouseMove: handleTooltip,
                    onMouseEnter: handleTooltip,
                    onMouseLeave: hideTooltip,
                    d: path,
                    fill: layer.fill ? layer.fill : layer.color,
                    fillOpacity: fillOpacity,
                    stroke: getBorderColor(layer),
                    strokeWidth: borderWidth
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
        layers.map(function (layer, i) {
            var path = layer.path,
                color = layer.color;


            var handleTooltip = function handleTooltip(e) {
                return showTooltip(React__default.createElement(core.BasicTooltip, {
                    id: getTooltipLabel(layer),
                    enableChip: true,
                    color: color,
                    theme: theme
                }), e);
            };

            return React__default.createElement(
                core.SmartMotion,
                {
                    key: i,
                    style: function style(spring) {
                        return {
                            d: spring(path, springConfig),
                            fill: spring(color, springConfig),
                            fillOpacity: spring(fillOpacity, springConfig)
                        };
                    }
                },
                function (style) {
                    return React__default.createElement('path', _extends({
                        onMouseMove: handleTooltip,
                        onMouseEnter: handleTooltip,
                        onMouseLeave: hideTooltip
                    }, style, {
                        fill: layer.fill ? layer.fill : style.fill,
                        stroke: getBorderColor(layer),
                        strokeWidth: borderWidth
                    }));
                }
            );
        })
    );
};

StreamLayers.propTypes = _extends({
    fillOpacity: PropTypes.number.isRequired,
    borderWidth: PropTypes.number.isRequired,
    getBorderColor: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    showTooltip: PropTypes.func.isRequired,
    hideTooltip: PropTypes.func.isRequired,
    getTooltipLabel: PropTypes.func.isRequired
}, core.motionPropTypes);

var getDotY = function getDotY(datum, position) {
    var y = datum.y2;
    if (position === 'center') {
        y = datum.y1 + (datum.y2 - datum.y1) / 2;
    } else if (position === 'start') {
        y = datum.y1;
    }

    return y;
};

var StreamDots = function StreamDots(_ref) {
    var id = _ref.id,
        color = _ref.color,
        data = _ref.data,
        renderDot = _ref.renderDot,
        position = _ref.position,
        getSize = _ref.getSize,
        getColor = _ref.getColor,
        getBorderWidth = _ref.getBorderWidth,
        getBorderColor = _ref.getBorderColor,
        animate = _ref.animate,
        motionStiffness = _ref.motionStiffness,
        motionDamping = _ref.motionDamping;

    if (animate !== true) {
        return data.map(function (d, i) {
            var datum = _extends({}, d, { key: id, color: color });

            return React__default.createElement(
                React.Fragment,
                { key: i },
                renderDot({
                    data: datum,
                    x: datum.x,
                    y: getDotY(datum, position),
                    size: getSize(datum),
                    color: getColor(datum),
                    borderWidth: getBorderWidth(datum)
                })
            );
        });
    }

    var springConfig = {
        stiffness: motionStiffness,
        damping: motionDamping
    };

    return React__default.createElement(
        reactMotion.TransitionMotion,
        {
            styles: data.map(function (d, i) {
                var datum = _extends({}, d, { key: id, color: color });

                return {
                    key: '' + i,
                    data: datum,
                    style: {
                        x: reactMotion.spring(datum.x, springConfig),
                        y: reactMotion.spring(getDotY(datum, position), springConfig),
                        size: reactMotion.spring(getSize(datum), springConfig),
                        borderWidth: reactMotion.spring(getBorderWidth(datum), springConfig)
                    }
                };
            })
        },
        function (interpolatedStyles) {
            return React__default.createElement(
                React.Fragment,
                null,
                interpolatedStyles.map(function (_ref2) {
                    var key = _ref2.key,
                        style = _ref2.style,
                        datum = _ref2.data;
                    return React__default.createElement(
                        React.Fragment,
                        { key: key },
                        renderDot({
                            data: datum,
                            x: style.x,
                            y: style.y,
                            size: style.size,
                            color: getColor(datum),
                            borderWidth: style.borderWidth,
                            borderColor: getBorderColor(datum)
                        })
                    );
                })
            );
        }
    );
};

StreamDots.propTypes = _extends({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    color: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number.isRequired,
        y1: PropTypes.number.isRequired,
        y2: PropTypes.number.isRequired
    })).isRequired,
    renderDot: PropTypes.func.isRequired,
    position: PropTypes.oneOf(['start', 'center', 'end']).isRequired,
    getSize: PropTypes.func.isRequired,
    getColor: PropTypes.func.isRequired,
    getBorderWidth: PropTypes.func.isRequired,
    getBorderColor: PropTypes.func.isRequired
}, core.motionPropTypes);

var enhance = compose(pure);

var StreamDots$1 = enhance(StreamDots);

var StreamSlicesItem = function StreamSlicesItem(_ref) {
    var slice = _ref.slice,
        height = _ref.height,
        showTooltip = _ref.showTooltip,
        hideTooltip = _ref.hideTooltip,
        isHover = _ref.isHover;
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
            fill: '#000',
            fillOpacity: 0,
            onMouseEnter: showTooltip,
            onMouseMove: showTooltip,
            onMouseLeave: hideTooltip
        })
    );
};

StreamSlicesItem.propTypes = {
    slice: PropTypes.object.isRequired,
    height: PropTypes.number.isRequired,
    showTooltip: PropTypes.func.isRequired,
    hideTooltip: PropTypes.func.isRequired,
    getTooltipLabel: PropTypes.func.isRequired,
    getTooltipValue: PropTypes.func.isRequired,
    isHover: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired
};

var enhance$1 = compose(withState('isHover', 'setIsHover', false), withPropsOnChange(['slice', 'theme', 'getTooltipLabel', 'getTooltipValue'], function (_ref2) {
    var slice = _ref2.slice,
        theme = _ref2.theme,
        getTooltipLabel = _ref2.getTooltipLabel,
        getTooltipValue = _ref2.getTooltipValue;

    return {
        tooltip: React__default.createElement(core.TableTooltip, {
            theme: theme,
            rows: slice.stack.map(function (p) {
                return [React__default.createElement(core.Chip, { key: p.id, color: p.color }), getTooltipLabel(p), getTooltipValue(p)];
            })
        })
    };
}), withHandlers({
    showTooltip: function showTooltip(_ref3) {
        var _showTooltip = _ref3.showTooltip,
            setIsHover = _ref3.setIsHover,
            tooltip = _ref3.tooltip;
        return function (e) {
            setIsHover(true);
            _showTooltip(tooltip, e);
        };
    },
    hideTooltip: function hideTooltip(_ref4) {
        var _hideTooltip = _ref4.hideTooltip,
            setIsHover = _ref4.setIsHover;
        return function () {
            setIsHover(false);
            _hideTooltip();
        };
    }
}), pure);

var StreamSlicesItem$1 = enhance$1(StreamSlicesItem);

var StreamSlices = function StreamSlices(_ref) {
    var slices = _ref.slices,
        height = _ref.height,
        showTooltip = _ref.showTooltip,
        hideTooltip = _ref.hideTooltip,
        theme = _ref.theme,
        getTooltipLabel = _ref.getTooltipLabel,
        getTooltipValue = _ref.getTooltipValue;
    return React__default.createElement(
        'g',
        null,
        slices.map(function (slice) {
            return React__default.createElement(StreamSlicesItem$1, {
                key: slice.index,
                slice: slice,
                height: height,
                showTooltip: showTooltip,
                hideTooltip: hideTooltip,
                theme: theme,
                getTooltipLabel: getTooltipLabel,
                getTooltipValue: getTooltipValue
            });
        })
    );
};

StreamSlices.propTypes = {
    slices: PropTypes.arrayOf(PropTypes.shape({
        index: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        stack: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            color: PropTypes.string.isRequired
        })).isRequired
    })).isRequired,
    height: PropTypes.number.isRequired,
    showTooltip: PropTypes.func.isRequired,
    hideTooltip: PropTypes.func.isRequired,
    getTooltipLabel: PropTypes.func.isRequired,
    getTooltipValue: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
};

var StreamSlices$1 = pure(StreamSlices);

var StreamDotsItem = function StreamDotsItem(_ref) {
    var x = _ref.x,
        y = _ref.y,
        size = _ref.size,
        color = _ref.color,
        borderWidth = _ref.borderWidth,
        borderColor = _ref.borderColor;

    return React__default.createElement('circle', {
        cx: x,
        cy: y,
        r: size * 0.5,
        fill: color,
        strokeWidth: borderWidth,
        stroke: borderColor
    });
};

StreamDotsItem.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    borderWidth: PropTypes.number.isRequired,
    borderColor: PropTypes.string.isRequired
};

var StreamPropTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    keys: PropTypes.array.isRequired,

    stack: PropTypes.func.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,

    order: core.stackOrderPropType.isRequired,
    offsetType: core.stackOffsetPropType.isRequired,
    curve: core.areaCurvePropType.isRequired,
    areaGenerator: PropTypes.func.isRequired,

    axisTop: PropTypes.object,
    axisRight: PropTypes.object,
    axisBottom: PropTypes.object,
    axisLeft: PropTypes.object,
    enableGridX: PropTypes.bool.isRequired,
    enableGridY: PropTypes.bool.isRequired,

    colors: PropTypes.any.isRequired,
    fillOpacity: PropTypes.number.isRequired,
    getColor: PropTypes.func.isRequired, // computed
    defs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired
    })).isRequired,
    fill: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        match: PropTypes.oneOfType([PropTypes.oneOf(['*']), PropTypes.object, PropTypes.func]).isRequired
    })).isRequired,
    borderWidth: PropTypes.number.isRequired,
    borderColor: PropTypes.any.isRequired,
    getBorderColor: PropTypes.func.isRequired, // computed

    enableDots: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).isRequired,
    renderDot: PropTypes.func.isRequired,
    dotPosition: PropTypes.oneOf(['start', 'center', 'end']).isRequired,
    dotSize: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,
    getDotSize: PropTypes.func.isRequired,
    dotColor: PropTypes.any.isRequired,
    dotBorderWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,
    getDotBorderWidth: PropTypes.func.isRequired,
    dotBorderColor: PropTypes.any.isRequired,

    isInteractive: PropTypes.bool,
    tooltipLabel: PropTypes.func,
    getTooltipLabel: PropTypes.func.isRequired,
    tooltipFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    getTooltipValue: PropTypes.func.isRequired,
    enableStackTooltip: PropTypes.bool.isRequired,

    legends: PropTypes.arrayOf(PropTypes.shape(legends.LegendPropShape)).isRequired
};

var StreamDefaultProps = {
    order: 'none',
    offsetType: 'wiggle',
    curve: 'catmullRom',

    axisBottom: {},
    enableGridX: true,
    enableGridY: false,

    borderWidth: 0,
    borderColor: 'inherit:darker(1)',

    colors: 'nivo',
    fillOpacity: 1,
    defs: [],
    fill: [],

    enableDots: false,
    dotPosition: 'center',
    renderDot: StreamDotsItem,
    dotSize: 6,
    dotColor: 'inherit',
    dotBorderWidth: 0,
    dotBorderColor: 'inherit',

    isInteractive: true,

    enableStackTooltip: true,

    legends: []
};

var stackMin = function stackMin(layers) {
    return Math.min.apply(Math, layers.reduce(function (acc, layer) {
        return [].concat(acc, layer.map(function (d) {
            return d[0];
        }));
    }, []));
};
var stackMax = function stackMax(layers) {
    return Math.max.apply(Math, layers.reduce(function (acc, layer) {
        return [].concat(acc, layer.map(function (d) {
            return d[1];
        }));
    }, []));
};

var enhance$2 = (function (Component) {
    return compose(defaultProps(StreamDefaultProps), core.withTheme(), core.withCurve(), core.withDimensions(), core.withMotion(), withPropsOnChange(['curveInterpolator'], function (_ref) {
        var curveInterpolator = _ref.curveInterpolator;
        return {
            areaGenerator: d3Shape.area().x(function (_ref2) {
                var x = _ref2.x;
                return x;
            }).y0(function (_ref3) {
                var y1 = _ref3.y1;
                return y1;
            }).y1(function (_ref4) {
                var y2 = _ref4.y2;
                return y2;
            }).curve(curveInterpolator)
        };
    }), withPropsOnChange(['colors'], function (_ref5) {
        var colors = _ref5.colors;
        return {
            getColor: core.getColorRange(colors)
        };
    }), withPropsOnChange(['borderColor'], function (_ref6) {
        var borderColor = _ref6.borderColor;
        return {
            getBorderColor: core.getInheritedColorGenerator(borderColor)
        };
    }), withPropsOnChange(['keys', 'offsetType', 'order'], function (_ref7) {
        var keys = _ref7.keys,
            offsetType = _ref7.offsetType,
            order = _ref7.order;
        return {
            stack: d3Shape.stack().keys(keys).offset(core.stackOffsetFromProp(offsetType)).order(core.stackOrderFromProp(order))
        };
    }), withPropsOnChange(['stack', 'data', 'width', 'height'], function (_ref8) {
        var stack = _ref8.stack,
            data = _ref8.data,
            width = _ref8.width,
            height = _ref8.height;

        var layers = stack(data);
        layers.forEach(function (layer) {
            layer.forEach(function (point) {
                point.value = point.data[layer.key];
            });
        });

        var minValue = stackMin(layers);
        var maxValue = stackMax(layers);

        return {
            layers: layers,
            xScale: d3Scale.scalePoint().domain(range(data.length)).range([0, width]),
            yScale: d3Scale.scaleLinear().domain([minValue, maxValue]).range([height, 0])
        };
    }), withPropsOnChange(['dotSize'], function (_ref9) {
        var dotSize = _ref9.dotSize;
        return {
            getDotSize: typeof dotSize === 'function' ? dotSize : function () {
                return dotSize;
            }
        };
    }), withPropsOnChange(['dotColor'], function (_ref10) {
        var dotColor = _ref10.dotColor;
        return {
            getDotColor: core.getInheritedColorGenerator(dotColor)
        };
    }), withPropsOnChange(['dotBorderWidth'], function (_ref11) {
        var dotBorderWidth = _ref11.dotBorderWidth;
        return {
            getDotBorderWidth: typeof dotBorderWidth === 'function' ? dotBorderWidth : function () {
                return dotBorderWidth;
            }
        };
    }), withPropsOnChange(['dotBorderColor'], function (_ref12) {
        var dotBorderColor = _ref12.dotBorderColor;
        return {
            getDotBorderColor: core.getInheritedColorGenerator(dotBorderColor)
        };
    }), withPropsOnChange(['tooltipLabel', 'tooltipFormat'], function (_ref13) {
        var tooltipLabel = _ref13.tooltipLabel,
            tooltipFormat = _ref13.tooltipFormat;

        var getTooltipLabel = function getTooltipLabel(d) {
            return d.id;
        };
        if (typeof tooltipLabel === 'function') {
            getTooltipLabel = tooltipLabel;
        }

        var getTooltipValue = function getTooltipValue(d) {
            return d.value;
        };
        if (typeof tooltipFormat === 'function') {
            getTooltipValue = tooltipFormat;
        } else if (typeof tooltipFormat === 'string' || tooltipFormat instanceof String) {
            var formatter = d3Format.format(tooltipFormat);
            getTooltipValue = function getTooltipValue(d) {
                return formatter(d.value);
            };
        }

        return {
            getTooltipValue: getTooltipValue,
            getTooltipLabel: getTooltipLabel
        };
    }), pure)(Component);
});

var Stream = function Stream(_ref) {
    var data = _ref.data,
        keys = _ref.keys,
        xScale = _ref.xScale,
        yScale = _ref.yScale,
        layers = _ref.layers,
        areaGenerator = _ref.areaGenerator,
        margin = _ref.margin,
        width = _ref.width,
        height = _ref.height,
        outerWidth = _ref.outerWidth,
        outerHeight = _ref.outerHeight,
        axisTop = _ref.axisTop,
        axisRight = _ref.axisRight,
        axisBottom = _ref.axisBottom,
        axisLeft = _ref.axisLeft,
        enableGridX = _ref.enableGridX,
        enableGridY = _ref.enableGridY,
        theme = _ref.theme,
        getColor = _ref.getColor,
        fillOpacity = _ref.fillOpacity,
        borderWidth = _ref.borderWidth,
        getBorderColor = _ref.getBorderColor,
        defs = _ref.defs,
        fill = _ref.fill,
        enableDots = _ref.enableDots,
        dotPosition = _ref.dotPosition,
        renderDot = _ref.renderDot,
        getDotSize = _ref.getDotSize,
        getDotColor = _ref.getDotColor,
        getDotBorderWidth = _ref.getDotBorderWidth,
        getDotBorderColor = _ref.getDotBorderColor,
        animate = _ref.animate,
        motionStiffness = _ref.motionStiffness,
        motionDamping = _ref.motionDamping,
        isInteractive = _ref.isInteractive,
        getTooltipValue = _ref.getTooltipValue,
        getTooltipLabel = _ref.getTooltipLabel,
        enableStackTooltip = _ref.enableStackTooltip,
        legends$$1 = _ref.legends;

    var enhancedLayers = layers.map(function (points, i) {
        var layer = points.map(function (point, i) {
            return {
                index: i,
                x: xScale(i),
                value: point.value,
                y1: yScale(point[0]),
                y2: yScale(point[1])
            };
        });

        return {
            id: keys[i],
            layer: layer,
            path: areaGenerator(layer),
            color: getColor(i)
        };
    });

    var slices = range(data.length).map(function (i) {
        return {
            index: i,
            x: enhancedLayers[0].layer[i].x,
            stack: sortBy(enhancedLayers.map(function (layer) {
                return _extends({
                    id: layer.id,
                    color: layer.color
                }, layer.layer[i]);
            }), 'y2')
        };
    });

    var motionProps = {
        animate: animate,
        motionDamping: motionDamping,
        motionStiffness: motionStiffness
    };

    var boundDefs = core.bindDefs(defs, enhancedLayers, fill);

    return React__default.createElement(
        core.Container,
        { isInteractive: isInteractive, theme: theme },
        function (_ref2) {
            var showTooltip = _ref2.showTooltip,
                hideTooltip = _ref2.hideTooltip;
            return React__default.createElement(
                core.SvgWrapper,
                {
                    width: outerWidth,
                    height: outerHeight,
                    margin: margin,
                    defs: boundDefs,
                    theme: theme
                },
                React__default.createElement(core.Grid, _extends({
                    theme: theme,
                    width: width,
                    height: height,
                    xScale: enableGridX ? xScale : null,
                    yScale: enableGridY ? yScale : null
                }, motionProps)),
                React__default.createElement(StreamLayers, _extends({
                    layers: enhancedLayers,
                    fillOpacity: fillOpacity,
                    borderWidth: borderWidth,
                    getBorderColor: getBorderColor,
                    showTooltip: showTooltip,
                    hideTooltip: hideTooltip,
                    getTooltipLabel: getTooltipLabel,
                    theme: theme
                }, motionProps)),
                React__default.createElement(core.Axes, _extends({
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
                enableDots && enhancedLayers.map(function (layer) {
                    return React__default.createElement(StreamDots$1, _extends({
                        key: layer.id,
                        id: layer.id,
                        color: layer.color,
                        data: layer.layer,
                        renderDot: renderDot,
                        position: dotPosition,
                        getSize: getDotSize,
                        getColor: getDotColor,
                        getBorderWidth: getDotBorderWidth,
                        getBorderColor: getDotBorderColor
                    }, motionProps));
                }),
                isInteractive && enableStackTooltip && React__default.createElement(StreamSlices$1, {
                    slices: slices,
                    height: height,
                    showTooltip: showTooltip,
                    hideTooltip: hideTooltip,
                    theme: theme,
                    getTooltipValue: getTooltipValue,
                    getTooltipLabel: getTooltipLabel
                }),
                legends$$1.map(function (legend, i) {
                    var legendData = enhancedLayers.map(function (l) {
                        return {
                            id: l.id,
                            label: l.id,
                            color: l.color,
                            fill: l.fill
                        };
                    }).reverse();

                    return React__default.createElement(legends.BoxLegendSvg, _extends({
                        key: i
                    }, legend, {
                        containerWidth: width,
                        containerHeight: height,
                        data: legendData,
                        theme: theme
                    }));
                })
            );
        }
    );
};

Stream.propTypes = StreamPropTypes;

var enhancedStream = enhance$2(Stream);
enhancedStream.displayName = 'Stream';

var ResponsiveStream = function ResponsiveStream(props) {
    return React__default.createElement(
        core.ResponsiveWrapper,
        null,
        function (_ref) {
            var width = _ref.width,
                height = _ref.height;
            return React__default.createElement(enhancedStream, _extends({ width: width, height: height }, props));
        }
    );
};

exports.Stream = enhancedStream;
exports.ResponsiveStream = ResponsiveStream;
exports.StreamPropTypes = StreamPropTypes;
exports.StreamDefaultProps = StreamDefaultProps;
