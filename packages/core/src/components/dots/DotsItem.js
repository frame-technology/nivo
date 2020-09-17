/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { memo, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSpring, animated } from 'react-spring'
import { dotsThemePropType } from '../../theming'
import { useMotionConfig } from '../../motion'
import DotsItemSymbol from './DotsItemSymbol'

const DotsItem = ({
    x,
    y,
    id,
    symbol,
    size,
    datum,
    color,
    borderWidth,
    borderColor,
    label,
    labelTextAnchor,
    labelYOffset,
    theme,
    setHover,
    enableDotHover
}) => {
    const { animate, config: springConfig } = useMotionConfig()

    const animatedProps = useSpring({
        transform: `translate(${x}, ${y})`,
        config: springConfig,
        immediate: !animate,
    })

    const _dotSymbol = useRef(null)

    const clearHoverTracking = () => {
        setHover && setHover(null, datum, false)
        _dotSymbol.current.removeEventListener("mousemove", moveHoverPanel)
    }

    const moveHoverPanel = (e) => {
        setHover(e, {...datum, id, color}, true)
    }

    const showHoverPanel = (e) => {
        _dotSymbol.current.addEventListener("mousemove", moveHoverPanel)
        moveHoverPanel(e);
    }

    const setUpListener = () => {
        _dotSymbol.current.addEventListener("mouseover", showHoverPanel)
        _dotSymbol.current.addEventListener("mouseout", clearHoverTracking)
    }
    const removeListeners = () => {
        _dotSymbol.current.removeEventListener("mouseover", showHoverPanel)
        _dotSymbol.current.removeEventListener("mouseout", clearHoverTracking)
    }

    useEffect(() => {
        if (setHover && _dotSymbol.current) {
            setUpListener()
            return removeListeners
        }
    }, [])


    return (
        <animated.g transform={animatedProps.transform} style={{ pointerEvents: 'none' }} ref={_dotSymbol}>
            {React.createElement(symbol, {
                size,
                color,
                datum,
                borderWidth,
                borderColor,
                hoverable: enableDotHover || false
            })}
            {label && (
                <text textAnchor={labelTextAnchor} y={labelYOffset} style={theme.dots.text}>
                    {label}
                </text>
            )}
        </animated.g>
    )
}

DotsItem.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    datum: PropTypes.object.isRequired,
    id: PropTypes.string,

    size: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    borderWidth: PropTypes.number.isRequired,
    borderColor: PropTypes.string.isRequired,

    symbol: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    labelTextAnchor: PropTypes.oneOf(['start', 'middle', 'end']),
    labelYOffset: PropTypes.number.isRequired,

    theme: PropTypes.shape({
        dots: dotsThemePropType.isRequired,
    }).isRequired,
    enableDotHover: PropTypes.bool,
    setHover: PropTypes.func
}

export const DotsItemDefaultProps = {
    symbol: DotsItemSymbol,

    labelTextAnchor: 'middle',
    labelYOffset: -12,
    enableDotHover: false
}

DotsItem.defaultProps = DotsItemDefaultProps

export default memo(DotsItem)
