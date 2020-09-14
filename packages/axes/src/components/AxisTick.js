/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { memo, useEffect } from 'react'
import { animated } from 'react-spring'
import PropTypes from 'prop-types'
import { useTheme } from '@nivo/core'

const AxisTick = ({
    value: _value,
    format,
    lineX,
    lineY,
    onClick,
    textBaseline,
    textAnchor,
    animatedProps,
    axisTooltip,
    moveHoverPanel,
    hideHover
}) => {
    const theme = useTheme()

    const clearHoverTracking = () => {
        hideHover && hideHover()
        this._tickText.removeEventListener("mousemove", this.moveHoverPanel);
    }

    const moveHoverPanelFunc = (e) => {
        moveHoverPanel && moveHoverPanel(e);
    }

    const showHoverPanel = (e) => {
        this._tickText.addEventListener("mousemove", moveHoverPanelFunc);
        moveHoverPanelFunc(e);
    }

    const setUpListener = () => {
        this._tickText.addEventListener("mouseover", showHoverPanel);
        this._tickText.addEventListener("mouseout", clearHoverTracking)
    }
    const removeListeners = () => {
        this._tickText.removeEventListener("mouseover", showHoverPanel);
        this._tickText.removeEventListener("mouseout", clearHoverTracking);
    }

    useEffect(() => {
        if (axisTooltip) {
            const uniqName = `${value}${lineX}${lineY}`
            this._tickText = document.getElementById(uniqName)
            setUpListener()
            return removeListeners
        }
    }, [lineX, lineY])
    let value = _value
    if (format !== undefined) {
        value = format(value)
    }

    let gStyle = { opacity: animatedProps.opacity }
    if (onClick) {
        gStyle['cursor'] = 'pointer'
    }

    return (
        <animated.g
            transform={animatedProps.transform}
            {...(onClick ? { onClick: e => onClick(e, value) } : {})}
            style={gStyle}
        >
            <line x1={0} x2={lineX} y1={0} y2={lineY} style={theme.axis.ticks.line} />
            <animated.text
                dominantBaseline={textBaseline}
                textAnchor={textAnchor}
                transform={animatedProps.textTransform}
                style={theme.axis.ticks.text}
                id={`${value}${lineX}${lineY}`}
            >
                {value}
            </animated.text>
        </animated.g>
    )
}

AxisTick.propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)])
        .isRequired,
    format: PropTypes.func,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    lineX: PropTypes.number.isRequired,
    lineY: PropTypes.number.isRequired,
    textX: PropTypes.number.isRequired,
    textY: PropTypes.number.isRequired,
    textBaseline: PropTypes.string.isRequired,
    textAnchor: PropTypes.string.isRequired,
    opacity: PropTypes.number.isRequired,
    rotate: PropTypes.number.isRequired,
    onClick: PropTypes.func,
    animatedProps: PropTypes.object.isRequired,
    axisTooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    moveHoverPanel: PropTypes.func,
    hideHover: PropTypes.func
}
AxisTick.defaultProps = {
    opacity: 1,
    rotate: 0,
}

export default memo(AxisTick)
