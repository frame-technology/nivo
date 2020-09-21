/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Axis from './Axis'
import { axisPropType } from '../props'
import HoverPanel from "./HoverPanel";

const positions = ['top', 'right', 'bottom', 'left']

const Axes = ({ xScale, yScale, width, height, top, right, bottom, left, axisTooltip, tooltipFormat, showTooltip, hideTooltip, theme }) => {
    const axes = { top, right, bottom, left }

    let [handleNodeHover, moveHoverPanel, hideHover] = [function() {}, function() {}, function() {}];
    if (axisTooltip) {
        handleNodeHover = (showTooltip, event) => {
            showTooltip(
                event,
                <HoverPanel
                    node={{value: event.target.textContent, xKey: event.x, yKey: event.y, color: "#ffffff"}}
                    theme={theme}
                    format={tooltipFormat}
                    tooltip={axisTooltip}
                />
            )
        }

        moveHoverPanel = (e) => {
            handleNodeHover(showTooltip, e)
        }

        hideHover = () => {
            hideTooltip();
        }
    }


    return positions.map(position => {
        const axis = axes[position]

        if (!axis) return null

        const isXAxis = position === 'top' || position === 'bottom'
        const ticksPosition = position === 'top' || position === 'left' ? 'before' : 'after'

        return (
            <Axis
                key={position}
                {...axis}
                axis={isXAxis ? 'x' : 'y'}
                x={position === 'right' ? width : 0}
                y={position === 'bottom' ? height : 0}
                scale={isXAxis ? xScale : yScale}
                length={isXAxis ? width : height}
                ticksPosition={ticksPosition}
                axisTooltip={axisTooltip}
                moveHoverPanel={moveHoverPanel}
                hideHover={hideHover}
            />

        )
    })
}

Axes.propTypes = {
    xScale: PropTypes.func,
    yScale: PropTypes.func,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    top: axisPropType,
    right: axisPropType,
    bottom: axisPropType,
    left: axisPropType,
    axisTooltip: PropTypes.func,
    tooltipFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    showTooltip: PropTypes.func,
    hideTooltip: PropTypes.func,
    theme: PropTypes.object
}

export default memo(Axes)
