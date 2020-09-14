'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var PropTypes = _interopDefault(require('prop-types'));
var core = require('@nivo/core');
var withPropsOnChange = _interopDefault(require('recompose/withPropsOnChange'));
var d3Shape = require('d3-shape');
var d3Scale = require('d3-scale');
var React = require('react');
var React__default = _interopDefault(React);
var compose = _interopDefault(require('recompose/compose'));
var defaultProps = _interopDefault(require('recompose/defaultProps'));
var pure = _interopDefault(require('recompose/pure'));
var setDisplayName = _interopDefault(require('recompose/setDisplayName'));
var axes = require('@nivo/axes');

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

var commonVariablePropTypes = {
    key: PropTypes.string.isRequired,
    ticksPosition: PropTypes.oneOf(['before', 'after']),
    tickSize: PropTypes.number,
    tickPadding: PropTypes.number,
    tickRotation: PropTypes.number,
    tickFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    legend: PropTypes.node,
    legendPosition: PropTypes.oneOf(['start', 'middle', 'end']),
    legendOffset: PropTypes.number
};

var commonPropTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    variables: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape(_extends({}, commonVariablePropTypes, {
        key: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['point']).isRequired,
        padding: PropTypes.number,
        values: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
        tickValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
    })), PropTypes.shape(_extends({}, commonVariablePropTypes, {
        type: PropTypes.oneOf(['linear']).isRequired,
        min: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
        max: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
        tickValues: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)])
    }))])).isRequired,
    layout: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
    curve: core.lineCurvePropType.isRequired,
    lineGenerator: PropTypes.func.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    lineOpacity: PropTypes.number.isRequired,
    axesPlan: PropTypes.oneOf(['foreground', 'background']).isRequired,
    axesTicksPosition: PropTypes.oneOf(['before', 'after']).isRequired,
    theme: core.themePropType.isRequired
};

var commonDefaultProps = {
    layout: 'horizontal',
    curve: 'linear',
    colors: 'yellow_orange_red',
    colorBy: 'index',
    strokeWidth: 2,
    lineOpacity: 0.35,
    axesPlan: 'foreground',
    axesTicksPosition: 'after'
};

var commonEnhancers = [core.withDimensions(), core.withColors({
    defaultColors: commonDefaultProps.colors,
    defaultColorBy: commonDefaultProps.colorBy,
    destKey: 'getLineColor'
}), core.withTheme(), withPropsOnChange(['curve'], function (_ref) {
    var curve = _ref.curve;
    return {
        lineGenerator: d3Shape.line().x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        }).curve(core.curveFromProp(curve))
    };
})];

var computeParallelCoordinatesLayout = function computeParallelCoordinatesLayout(_ref) {
    var width = _ref.width,
        height = _ref.height,
        data = _ref.data,
        variables = _ref.variables,
        layout = _ref.layout;

    var variablesScale = d3Scale.scalePoint().range(layout === 'horizontal' ? [0, width] : [height, 0]).domain(variables.map(function (_ref2) {
        var key = _ref2.key;
        return key;
    }));

    var range = layout === 'horizontal' ? [height, 0] : [0, width];
    var variablesWithScale = variables.map(function (variable) {
        var allValues = new Set();
        data.forEach(function (d) {
            return allValues.add(d[variable.key]);
        });

        var scale = void 0;
        if (variable.type === 'linear') {
            var min = variable.min !== undefined && variable.min !== 'auto' ? variable.min : Math.min.apply(Math, Array.from(allValues));
            var max = variable.max !== undefined && variable.max !== 'auto' ? variable.max : Math.max.apply(Math, Array.from(allValues));

            scale = d3Scale.scaleLinear().rangeRound(range).domain([min, max]);
        }

        if (variable.type === 'point') {
            scale = d3Scale.scalePoint().range(range).domain(variable.values || allValues);

            if (variable.padding !== undefined) {
                scale.padding(variable.padding);
            }
        }

        return _extends({}, variable, {
            scale: scale,
            values: Array.from(allValues)
        });
    });

    var dataWithPoints = data.map(function (datum, index) {
        var points = variablesWithScale.map(function (variable) {
            return {
                x: layout === 'horizontal' ? variablesScale(variable.key) : variable.scale(datum[variable.key]),
                y: layout === 'horizontal' ? variable.scale(datum[variable.key]) : variablesScale(variable.key)
            };
        });

        return _extends({ index: index }, datum, { points: points });
    });

    return {
        variablesScale: variablesScale,
        variablesWithScale: variablesWithScale,
        dataWithPoints: dataWithPoints
    };
};

var ParallelCoordinatesLayout = function (_PureComponent) {
    inherits(ParallelCoordinatesLayout, _PureComponent);

    function ParallelCoordinatesLayout() {
        classCallCheck(this, ParallelCoordinatesLayout);
        return possibleConstructorReturn(this, _PureComponent.apply(this, arguments));
    }

    ParallelCoordinatesLayout.prototype.render = function render() {
        var _props = this.props,
            width = _props.width,
            height = _props.height,
            data = _props.data,
            variables = _props.variables,
            layout = _props.layout,
            children = _props.children;


        return children(computeParallelCoordinatesLayout({
            width: width,
            height: height,
            data: data,
            variables: variables,
            layout: layout
        }));
    };

    return ParallelCoordinatesLayout;
}(React.PureComponent);

ParallelCoordinatesLayout.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])).isRequired,
    variables: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({
        key: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['point']).isRequired,
        padding: PropTypes.number,
        values: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
    }), PropTypes.shape({
        key: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['linear']).isRequired,
        min: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
        max: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])])
    })])).isRequired,
    layout: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
    children: PropTypes.func.isRequired
};

var ParallelCoordinatesLineTooltip = function (_PureComponent) {
    inherits(ParallelCoordinatesLineTooltip, _PureComponent);

    function ParallelCoordinatesLineTooltip() {
        classCallCheck(this, ParallelCoordinatesLineTooltip);
        return possibleConstructorReturn(this, _PureComponent.apply(this, arguments));
    }

    ParallelCoordinatesLineTooltip.prototype.render = function render() {
        var _props = this.props,
            data = _props.data,
            variables = _props.variables,
            theme = _props.theme;


        return React__default.createElement(core.TableTooltip, {
            theme: theme,
            rows: variables.map(function (variable) {
                return [variable.key, React__default.createElement(
                    'strong',
                    null,
                    data[variable.key]
                )];
            } // eslint-disable-line react/jsx-key
            )
        });
    };

    return ParallelCoordinatesLineTooltip;
}(React.PureComponent);

ParallelCoordinatesLineTooltip.propTypes = {
    data: PropTypes.object.isRequired,
    variables: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })).isRequired,
    theme: core.themePropType.isRequired
};

var ParallelCoordinatesLine = function (_PureComponent) {
    inherits(ParallelCoordinatesLine, _PureComponent);

    function ParallelCoordinatesLine() {
        var _temp, _this, _ret;

        classCallCheck(this, ParallelCoordinatesLine);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = possibleConstructorReturn(this, _PureComponent.call.apply(_PureComponent, [this].concat(args))), _this), _this.handleActiveMouse = function (event) {
            var _this$props = _this.props,
                showTooltip = _this$props.showTooltip,
                data = _this$props.data,
                variables = _this$props.variables,
                theme = _this$props.theme;

            showTooltip(React__default.createElement(ParallelCoordinatesLineTooltip, { data: data, variables: variables, theme: theme }), event);
        }, _this.handleMouseLeave = function () {
            _this.props.hideTooltip();
        }, _temp), possibleConstructorReturn(_this, _ret);
    }

    ParallelCoordinatesLine.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            lineGenerator = _props.lineGenerator,
            points = _props.points,
            strokeWidth = _props.strokeWidth,
            color = _props.color,
            opacity = _props.opacity,
            animate = _props.animate,
            motionStiffness = _props.motionStiffness,
            motionDamping = _props.motionDamping;


        var pathDefinition = lineGenerator(points);

        if (animate !== true) {
            return React__default.createElement('path', {
                d: pathDefinition,
                stroke: color,
                strokeWidth: strokeWidth,
                strokeLinecap: 'round',
                opacity: opacity,
                fill: 'none',
                onMouseEnter: this.handleActiveMouse,
                onMouseMove: this.handleActiveMouse,
                onMouseLeave: this.handleMouseLeave
            });
        }

        var springConfig = {
            stiffness: motionStiffness,
            damping: motionDamping
        };

        return React__default.createElement(
            core.SmartMotion,
            {
                style: function style(spring) {
                    return {
                        d: spring(pathDefinition, springConfig),
                        opacity: spring(opacity, springConfig)
                    };
                }
            },
            function (style) {
                return React__default.createElement('path', {
                    d: style.d,
                    stroke: color,
                    strokeWidth: strokeWidth,
                    strokeLinecap: 'round',
                    opacity: style.opacity,
                    fill: 'none',
                    onMouseEnter: _this2.handleActiveMouse,
                    onMouseMove: _this2.handleActiveMouse,
                    onMouseLeave: _this2.handleMouseLeave
                });
            }
        );
    };

    return ParallelCoordinatesLine;
}(React.PureComponent);

ParallelCoordinatesLine.propTypes = _extends({
    data: PropTypes.object.isRequired,
    variables: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })).isRequired,
    lineGenerator: PropTypes.func.isRequired,
    points: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    })).isRequired,
    strokeWidth: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    opacity: PropTypes.number.isRequired,
    showTooltip: PropTypes.func.isRequired,
    hideTooltip: PropTypes.func.isRequired,
    theme: core.themePropType.isRequired
}, core.motionPropTypes);

var ParallelCoordinates = function (_Component) {
    inherits(ParallelCoordinates, _Component);

    function ParallelCoordinates() {
        classCallCheck(this, ParallelCoordinates);
        return possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    ParallelCoordinates.prototype.render = function render() {
        var _props = this.props,
            data = _props.data,
            variables = _props.variables,
            layout = _props.layout,
            margin = _props.margin,
            width = _props.width,
            height = _props.height,
            outerWidth = _props.outerWidth,
            outerHeight = _props.outerHeight,
            axesPlan = _props.axesPlan,
            axesTicksPosition = _props.axesTicksPosition,
            lineGenerator = _props.lineGenerator,
            strokeWidth = _props.strokeWidth,
            lineOpacity = _props.lineOpacity,
            getLineColor = _props.getLineColor,
            theme = _props.theme,
            animate = _props.animate,
            motionStiffness = _props.motionStiffness,
            motionDamping = _props.motionDamping,
            isInteractive = _props.isInteractive;


        var motionProps = {
            animate: animate,
            motionStiffness: motionStiffness,
            motionDamping: motionDamping
        };

        return React__default.createElement(
            ParallelCoordinatesLayout,
            {
                width: width,
                height: height,
                data: data,
                variables: variables,
                layout: layout
            },
            function (_ref) {
                var variablesScale = _ref.variablesScale,
                    variablesWithScale = _ref.variablesWithScale,
                    dataWithPoints = _ref.dataWithPoints;

                var axes$$1 = variablesWithScale.map(function (variable) {
                    return React__default.createElement(axes.Axis, _extends({
                        key: variable.key,
                        axis: layout === 'horizontal' ? 'y' : 'x',
                        length: layout === 'horizontal' ? height : width,
                        x: layout === 'horizontal' ? variablesScale(variable.key) : 0,
                        y: layout === 'horizontal' ? 0 : variablesScale(variable.key),
                        scale: variable.scale,
                        ticksPosition: variable.ticksPosition || axesTicksPosition,
                        tickValues: variable.tickValues,
                        tickSize: variable.tickSize,
                        tickPadding: variable.tickPadding,
                        tickRotation: variable.tickRotation,
                        tickFormat: variable.tickFormat,
                        legend: variable.legend,
                        legendPosition: variable.legendPosition,
                        legendOffset: variable.legendOffset,
                        theme: theme
                    }, motionProps));
                });

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
                                theme: theme
                            },
                            axesPlan === 'background' && axes$$1,
                            dataWithPoints.map(function (datum) {
                                return React__default.createElement(ParallelCoordinatesLine, _extends({
                                    key: datum.index,
                                    data: datum,
                                    variables: variables,
                                    lineGenerator: lineGenerator,
                                    points: datum.points,
                                    strokeWidth: strokeWidth,
                                    opacity: lineOpacity,
                                    color: getLineColor(datum),
                                    theme: theme,
                                    showTooltip: showTooltip,
                                    hideTooltip: hideTooltip
                                }, motionProps));
                            }),
                            axesPlan === 'foreground' && axes$$1
                        );
                    }
                );
            }
        );
    };

    return ParallelCoordinates;
}(React.Component);

ParallelCoordinates.propTypes = commonPropTypes;
var enhance = compose.apply(undefined, [defaultProps(commonDefaultProps)].concat(commonEnhancers, [core.withMotion(), pure]));

var ParallelCoordinates$1 = setDisplayName('ParallelCoordinates')(enhance(ParallelCoordinates));

var ResponsiveParallelCoordinates = function ResponsiveParallelCoordinates(props) {
    return React__default.createElement(
        core.ResponsiveWrapper,
        null,
        function (_ref) {
            var width = _ref.width,
                height = _ref.height;
            return React__default.createElement(ParallelCoordinates$1, _extends({ width: width, height: height }, props));
        }
    );
};

var ParallelCoordinatesCanvas = function (_Component) {
    inherits(ParallelCoordinatesCanvas, _Component);

    function ParallelCoordinatesCanvas() {
        classCallCheck(this, ParallelCoordinatesCanvas);
        return possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    ParallelCoordinatesCanvas.prototype.componentDidMount = function componentDidMount() {
        this.ctx = this.surface.getContext('2d');
        this.draw(this.props);
    };

    ParallelCoordinatesCanvas.prototype.shouldComponentUpdate = function shouldComponentUpdate(props) {
        if (this.props.outerWidth !== props.outerWidth || this.props.outerHeight !== props.outerHeight || this.props.isInteractive !== props.isInteractive || this.props.theme !== props.theme) {
            return true;
        } else {
            this.draw(props);
            return false;
        }
    };

    ParallelCoordinatesCanvas.prototype.componentDidUpdate = function componentDidUpdate() {
        this.ctx = this.surface.getContext('2d');
        this.draw(this.props);
    };

    ParallelCoordinatesCanvas.prototype.draw = function draw(props) {
        var _this2 = this;

        var layout = props.layout,
            dataWithPoints = props.dataWithPoints,
            variablesWithScale = props.variablesWithScale,
            variablesScale = props.variablesScale,
            width = props.width,
            height = props.height,
            outerWidth = props.outerWidth,
            outerHeight = props.outerHeight,
            pixelRatio = props.pixelRatio,
            getLineColor = props.getLineColor,
            margin = props.margin,
            lineOpacity = props.lineOpacity,
            strokeWidth = props.strokeWidth,
            lineGenerator = props.lineGenerator,
            axesTicksPosition = props.axesTicksPosition,
            theme = props.theme;


        this.surface.width = outerWidth * pixelRatio;
        this.surface.height = outerHeight * pixelRatio;

        this.ctx.scale(pixelRatio, pixelRatio);
        this.ctx.fillStyle = theme.background;
        this.ctx.fillRect(0, 0, outerWidth, outerHeight);
        this.ctx.translate(margin.left, margin.top);

        lineGenerator.context(this.ctx);
        dataWithPoints.forEach(function (datum) {
            _this2.ctx.save();
            _this2.ctx.globalAlpha = lineOpacity;

            _this2.ctx.beginPath();
            lineGenerator(datum.points);
            _this2.ctx.strokeStyle = getLineColor(datum);
            _this2.ctx.lineWidth = strokeWidth;
            _this2.ctx.stroke();

            _this2.ctx.restore();
        });

        variablesWithScale.map(function (variable) {
            axes.renderAxisToCanvas(_this2.ctx, {
                axis: layout === 'horizontal' ? 'y' : 'x',
                scale: variable.scale,
                x: layout === 'horizontal' ? variablesScale(variable.key) : 0,
                y: layout === 'horizontal' ? 0 : variablesScale(variable.key),
                length: layout === 'horizontal' ? height : width,
                ticksPosition: axesTicksPosition,
                theme: theme
            });
        });
    };

    ParallelCoordinatesCanvas.prototype.render = function render() {
        var _this3 = this;

        var _props = this.props,
            pixelRatio = _props.pixelRatio,
            outerWidth = _props.outerWidth,
            outerHeight = _props.outerHeight,
            theme = _props.theme,
            isInteractive = _props.isInteractive;


        return React__default.createElement(
            core.Container,
            { isInteractive: isInteractive, theme: theme },
            function () {
                return React__default.createElement('canvas', {
                    ref: function ref(surface) {
                        _this3.surface = surface;
                    },
                    width: outerWidth * pixelRatio,
                    height: outerHeight * pixelRatio,
                    style: {
                        width: outerWidth,
                        height: outerHeight
                    }
                });
            }
        );
    };

    return ParallelCoordinatesCanvas;
}(React.Component);

ParallelCoordinatesCanvas.propTypes = _extends({}, commonPropTypes, {
    pixelRatio: PropTypes.number.isRequired
});
var enhance$1 = compose.apply(undefined, [defaultProps(_extends({}, commonDefaultProps, {
    pixelRatio: global.window && global.window.devicePixelRatio ? global.window.devicePixelRatio : 1
}))].concat(commonEnhancers, [withPropsOnChange(['width', 'height', 'data', 'variables', 'layout'], function (_ref) {
    var width = _ref.width,
        height = _ref.height,
        data = _ref.data,
        variables = _ref.variables,
        layout = _ref.layout;
    return computeParallelCoordinatesLayout({
        width: width,
        height: height,
        data: data,
        variables: variables,
        layout: layout
    });
}), pure]));

var ParallelCoordinatesCanvas$1 = setDisplayName('ParallelCoordinatesCanvas')(enhance$1(ParallelCoordinatesCanvas));

var ResponsiveParallelCoordinatesCanvas = function ResponsiveParallelCoordinatesCanvas(props) {
    return React__default.createElement(
        core.ResponsiveWrapper,
        null,
        function (_ref) {
            var width = _ref.width,
                height = _ref.height;
            return React__default.createElement(ParallelCoordinatesCanvas$1, _extends({ width: width, height: height }, props));
        }
    );
};

exports.ParallelCoordinates = ParallelCoordinates$1;
exports.ResponsiveParallelCoordinates = ResponsiveParallelCoordinates;
exports.ParallelCoordinatesCanvas = ParallelCoordinatesCanvas$1;
exports.ResponsiveParallelCoordinatesCanvas = ResponsiveParallelCoordinatesCanvas;
exports.commonPropTypes = commonPropTypes;
exports.commonDefaultProps = commonDefaultProps;
