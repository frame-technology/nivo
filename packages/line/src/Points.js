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
import { getLabelGenerator, DotsItem, useTheme } from '@nivo/core'

const Points = ({ points, symbol, size, borderWidth, enableLabel, label, labelYOffset, setHover, enableDotHover }) => {
    const theme = useTheme()
    const getLabel = getLabelGenerator(label)

    /**
     * We reverse the `points` array so that points from the lower lines in stacked lines
     * graph are drawn on top. See https://github.com/plouc/nivo/issues/1051.
     */
    const mappedPoints = points.reverse().map(point => {
        const mappedPoint = {
            id: point.id,
            x: point.x,
            y: point.y,
            datum: point.data,
            fill: point.color,
            serieId: point.serieId,
            stroke: point.borderColor,
            label: enableLabel ? getLabel(point.data) : null,
        }

        return mappedPoint
    })

    return (
        <g>
            {mappedPoints.map(point => (
                <DotsItem
                    key={point.id}
                    id={point.serieId}
                    x={point.x}
                    y={point.y}
                    datum={point.datum}
                    symbol={symbol}
                    size={size}
                    color={point.fill}
                    borderWidth={borderWidth}
                    borderColor={point.stroke}
                    label={point.label}
                    labelYOffset={labelYOffset}
                    theme={theme}
                    setHover={setHover}
                    enableDotHover={enableDotHover}
                />
            ))}
        </g>
    )
}

Points.propTypes = {
    points: PropTypes.arrayOf(PropTypes.object),
    symbol: PropTypes.func,
    size: PropTypes.number.isRequired,
    color: PropTypes.func.isRequired,
    borderWidth: PropTypes.number.isRequired,
    borderColor: PropTypes.func.isRequired,
    enableLabel: PropTypes.bool.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    labelYOffset: PropTypes.number,
    setHover: PropTypes.func,
    enableDotHover: PropTypes.bool
}

export default memo(Points)
