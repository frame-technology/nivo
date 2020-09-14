'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var PropTypes = _interopDefault(require('prop-types'));
var d3Scale = require('d3-scale');
var d3Delaunay = require('d3-delaunay');
var compose = _interopDefault(require('recompose/compose'));
var defaultProps = _interopDefault(require('recompose/defaultProps'));
var withPropsOnChange = _interopDefault(require('recompose/withPropsOnChange'));
var pure = _interopDefault(require('recompose/pure'));
var core = require('@nivo/core');
var React = require('react');
var React__default = _interopDefault(React);

var VoronoiPropTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    })).isRequired,

    xDomain: PropTypes.arrayOf(PropTypes.number).isRequired,
    yDomain: PropTypes.arrayOf(PropTypes.number).isRequired,

    enableLinks: PropTypes.bool.isRequired,
    linkLineWidth: PropTypes.number.isRequired,
    linkLineColor: PropTypes.string.isRequired,

    enableCells: PropTypes.bool.isRequired,
    cellLineWidth: PropTypes.number.isRequired,
    cellLineColor: PropTypes.string.isRequired,

    enablePoints: PropTypes.bool.isRequired,
    pointSize: PropTypes.number.isRequired,
    pointColor: PropTypes.string.isRequired,

    delaunay: PropTypes.object.isRequired,
    voronoi: PropTypes.object.isRequired
};

var VoronoiDefaultProps = {
    enableLinks: false,
    linkLineWidth: 1,
    linkLineColor: '#bbb',

    enableCells: true,
    cellLineWidth: 2,
    cellLineColor: '#000',

    enablePoints: true,
    pointSize: 4,
    pointColor: '#666'
};

var enhance = (function (Component) {
    return compose(defaultProps(VoronoiDefaultProps), core.withTheme(), core.withDimensions(), withPropsOnChange(['xDomain', 'yDomain', 'width', 'height'], function (_ref) {
        var xDomain = _ref.xDomain,
            yDomain = _ref.yDomain,
            width = _ref.width,
            height = _ref.height;
        return {
            xScale: d3Scale.scaleLinear().domain(xDomain).range([0, width]),
            yScale: d3Scale.scaleLinear().domain(yDomain).range([0, height])
        };
    }), withPropsOnChange(['data', 'xScale', 'yScale'], function (_ref2) {
        var data = _ref2.data,
            xScale = _ref2.xScale,
            yScale = _ref2.yScale;
        return {
            scaledPoints: data.map(function (d) {
                return {
                    data: d,
                    x: xScale(d.x),
                    y: yScale(d.y)
                };
            })
        };
    }), withPropsOnChange(['scaledPoints', 'width', 'height'], function (_ref3) {
        var scaledPoints = _ref3.scaledPoints,
            width = _ref3.width,
            height = _ref3.height;

        var delaunay = d3Delaunay.Delaunay.from(scaledPoints.map(function (p) {
            return [p.x, p.y];
        }));
        var voronoi = delaunay.voronoi([0, 0, width, height]);

        return {
            delaunay: delaunay,
            voronoi: voronoi
        };
    }), pure)(Component);
});

var Voronoi = function Voronoi(_ref) {
    var delaunay = _ref.delaunay,
        voronoi = _ref.voronoi,
        margin = _ref.margin,
        outerWidth = _ref.outerWidth,
        outerHeight = _ref.outerHeight,
        enableLinks = _ref.enableLinks,
        linkLineWidth = _ref.linkLineWidth,
        linkLineColor = _ref.linkLineColor,
        enableCells = _ref.enableCells,
        cellLineWidth = _ref.cellLineWidth,
        cellLineColor = _ref.cellLineColor,
        enablePoints = _ref.enablePoints,
        pointSize = _ref.pointSize,
        pointColor = _ref.pointColor,
        theme = _ref.theme;

    return React__default.createElement(
        core.Container,
        { isInteractive: false, theme: theme },
        function () {
            return (/*{ showTooltip, hideTooltip }*/React__default.createElement(
                    core.SvgWrapper,
                    { width: outerWidth, height: outerHeight, margin: margin, theme: theme },
                    enableLinks && React__default.createElement('path', {
                        stroke: linkLineColor,
                        strokeWidth: linkLineWidth,
                        fill: 'none',
                        d: delaunay.render()
                    }),
                    enableCells && React__default.createElement('path', {
                        d: voronoi.render(),
                        fill: 'none',
                        stroke: cellLineColor,
                        strokeWidth: cellLineWidth
                    }),
                    enablePoints && React__default.createElement('path', {
                        stroke: 'none',
                        fill: pointColor,
                        d: delaunay.renderPoints(undefined, pointSize / 2)
                    }),
                    React__default.createElement('path', {
                        fill: 'none',
                        stroke: cellLineColor,
                        strokeWidth: cellLineWidth,
                        d: voronoi.renderBounds()
                    })
                )
            );
        }
    );
};

Voronoi.propTypes = VoronoiPropTypes;

var Voronoi$1 = enhance(Voronoi);

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

var ResponsiveVoronoi = function ResponsiveVoronoi(props) {
    return React__default.createElement(
        core.ResponsiveWrapper,
        null,
        function (_ref) {
            var width = _ref.width,
                height = _ref.height;
            return React__default.createElement(Voronoi$1, _extends({ width: width, height: height }, props));
        }
    );
};

var getAccessor = function getAccessor(directive) {
    return typeof directive === 'function' ? directive : function (d) {
        return d[directive];
    };
};

var computeMeshPoints = function computeMeshPoints(_ref) {
    var points = _ref.points,
        xAccessor = _ref.xAccessor,
        yAccessor = _ref.yAccessor;

    var getX = getAccessor(xAccessor);
    var getY = getAccessor(yAccessor);

    return {
        points: points.map(function (p) {
            return [getX(p), getY(p)];
        })
    };
};

var computeMesh = function computeMesh(_ref2) {
    var points = _ref2.points,
        width = _ref2.width,
        height = _ref2.height,
        debug = _ref2.debug;

    var delaunay = d3Delaunay.Delaunay.from(points);
    var voronoi = debug === true ? delaunay.voronoi([0, 0, width, height]) : undefined;

    return { delaunay: delaunay, voronoi: voronoi };
};

var Mesh = function (_Component) {
    inherits(Mesh, _Component);

    function Mesh(props) {
        classCallCheck(this, Mesh);

        var _this = possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            index: null
        };

        _this.handleMouseIn = function (handler, event) {
            var _this$props = _this.props,
                delaunay = _this$props.delaunay,
                points = _this$props.points;

            var _getRelativeCursor = core.getRelativeCursor(_this.rect, event),
                x = _getRelativeCursor[0],
                y = _getRelativeCursor[1];

            var index = delaunay.find(x, y);

            if (handler !== undefined) {
                handler(points[index], event);
            }

            if (_this.state.index !== index) {
                _this.setState({ index: index });
            }
        };

        _this.handleMouseEnter = function (event) {
            _this.handleMouseIn(_this.props.onMouseEnter, event);
        };

        _this.handleMouseMove = function (event) {
            _this.handleMouseIn(_this.props.onMouseMove, event);
        };

        _this.handleMouseLeave = function (event) {
            var _this$props2 = _this.props,
                onMouseLeave = _this$props2.onMouseLeave,
                points = _this$props2.points;
            var index = _this.state.index;


            if (onMouseLeave !== undefined) {
                onMouseLeave(points[index], event);
            }

            _this.setState({ index: null });
        };

        _this.handleClick = function (event) {
            var _this$props3 = _this.props,
                onClick = _this$props3.onClick,
                points = _this$props3.points;
            var index = _this.state.index;


            if (onClick === undefined || index === null) return;

            onClick(points[index], event);
        };

        _this.setRectRef = function (element) {
            _this.rect = element;
        };
        return _this;
    }

    Mesh.prototype.render = function render() {
        var _props = this.props,
            width = _props.width,
            height = _props.height,
            voronoi = _props.voronoi,
            voronoiPath = _props.voronoiPath,
            debug = _props.debug;
        var index = this.state.index;


        return React__default.createElement(
            'g',
            { ref: this.setRectRef },
            debug && React__default.createElement('path', { d: voronoiPath, stroke: 'red', strokeWidth: 0.5, opacity: 0.75 }),
            index !== null && debug && React__default.createElement('path', { fill: 'red', opacity: 0.25, d: voronoi.renderCell(index) }),
            React__default.createElement('rect', {
                width: width,
                height: height,
                fill: 'purple',
                opacity: 0,
                style: { cursor: 'crosshair' },
                onMouseEnter: this.handleMouseEnter,
                onMouseMove: this.handleMouseMove,
                onMouseLeave: this.handleMouseLeave,
                onClick: this.handleClick
            })
        );
    };

    return Mesh;
}(React.Component);

Mesh.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    points: PropTypes.array.isRequired,
    xAccessor: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func]).isRequired,
    yAccessor: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func]).isRequired,
    onMouseEnter: PropTypes.func,
    onMouseMove: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,
    debug: PropTypes.bool.isRequired,

    delaunay: PropTypes.shape({
        find: PropTypes.func.isRequired
    }).isRequired,
    voronoi: PropTypes.shape({
        renderCell: PropTypes.func.isRequired
    }),
    voronoiPath: PropTypes.string
};


var enhance$1 = compose(defaultProps({
    xAccessor: 'x',
    yAccessor: 'y',
    debug: false
}), withPropsOnChange(['points', 'xAccessor', 'yAccessor'], function (_ref) {
    var points = _ref.points,
        xAccessor = _ref.xAccessor,
        yAccessor = _ref.yAccessor;
    return {
        points2d: computeMeshPoints({ points: points, xAccessor: xAccessor, yAccessor: yAccessor }).points
    };
}), withPropsOnChange(['points2d', 'width', 'height', 'debug'], function (_ref2) {
    var points2d = _ref2.points2d,
        width = _ref2.width,
        height = _ref2.height,
        debug = _ref2.debug;

    var mesh = computeMesh({ points: points2d, width: width, height: height, debug: debug });

    var voronoiPath = void 0;
    if (debug === true) {
        voronoiPath = mesh.voronoi.render();
    }

    return _extends({}, mesh, {
        voronoiPath: voronoiPath
    });
}));

var Mesh$1 = enhance$1(Mesh);

var renderVoronoiToCanvas = function renderVoronoiToCanvas(ctx, voronoi) {
    ctx.save();

    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    voronoi.render(ctx);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
};

var renderVoronoiCellToCanvas = function renderVoronoiCellToCanvas(ctx, voronoi, index) {
    ctx.save();

    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    voronoi.renderCell(index, ctx);
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.restore();
};

exports.Voronoi = Voronoi$1;
exports.ResponsiveVoronoi = ResponsiveVoronoi;
exports.Mesh = Mesh$1;
exports.computeMeshPoints = computeMeshPoints;
exports.computeMesh = computeMesh;
exports.renderVoronoiToCanvas = renderVoronoiToCanvas;
exports.renderVoronoiCellToCanvas = renderVoronoiCellToCanvas;
exports.VoronoiPropTypes = VoronoiPropTypes;
exports.VoronoiDefaultProps = VoronoiDefaultProps;
