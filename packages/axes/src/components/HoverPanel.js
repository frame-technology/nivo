import React from "react"
import PropTypes from 'prop-types'
import { BasicTooltip  } from "@nivo/tooltip"

/**
 * HoverPanel, used for axis tooltips
 * @param node - the data point passed in
 * @param theme - theming applied to the panel tooltip
 * @param format - format function for displaying a value
 * @param tooltip - function returning a component to render the contents of the tooltip
 * @returns BasicTooltip
 */
const HoverPanel = ({ node, theme, format, tooltip }) => (
    <BasicTooltip
        id={`${node.value}`}
        enableChip={false}
        color={node.color}
        theme={theme}
        format={format}
        renderContent={typeof tooltip === 'function' ? tooltip.bind(null, { ...node }) : null}
    />
)

HoverPanel.propTypes = {
    node: PropTypes.object.isRequired,
    theme: PropTypes.object,
    format: PropTypes.func,
    tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
}


export default HoverPanel
