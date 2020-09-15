/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { memo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSpring, animated } from 'react-spring'
import { dotsThemePropType } from '../../theming'
import { useMotionConfig } from '../../motion'
import DotsItemSymbol from './DotsItemSymbol'

const DotsItem = ({
    x,
    y,
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
    setHover
}) => {
    const { animate, config: springConfig } = useMotionConfig()

    const animatedProps = useSpring({
        transform: `translate(${x}, ${y})`,
        config: springConfig,
        immediate: !animate,
    })
    const clearHoverTracking = () => {
        setHover && setHover(null, datum, false)
        this._dotSymbol.current.removeEventListener("mousemove", moveHoverPanel);
    }

    const moveHoverPanel = (e) => {
        setHover(e, {...datum, color}, true);
    }

    const showHoverPanel = (e) => {
        this._dotSymbol.current.addEventListener("mousemove", moveHoverPanel);
        moveHoverPanel(e);
    }

    const setUpListener = () => {
        this._dotSymbol.current.addEventListener("mouseover", showHoverPanel);
        this._dotSymbol.current.addEventListener("mouseout", clearHoverTracking)
    }
    const removeListeners = () => {
        this._dotSymbol.current.removeEventListener("mouseover", showHoverPanel);
        this._dotSymbol.current.removeEventListener("mouseout", clearHoverTracking);
    }

    useEffect(() => {
        if (!this._dotSymbol) {
            this._dotSymbol = React.createRef();
        }
    }, [])

    useEffect(() => {
        if (setHover && this._dotSymbol.current) {
            setUpListener()
            return removeListeners
        }
    }, [])

    return (
        <animated.g transform={animatedProps.transform} style={{ pointerEvents: 'none' }} ref={this._dotSymbol}>
            {React.createElement(symbol, {
                size,
                color,
                datum,
                borderWidth,
                borderColor,
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
    setHover: PropTypes.func,
}

export const DotsItemDefaultProps = {
    symbol: DotsItemSymbol,

    labelTextAnchor: 'middle',
    labelYOffset: -12,
}

DotsItem.defaultProps = DotsItemDefaultProps

export default memo(DotsItem)
