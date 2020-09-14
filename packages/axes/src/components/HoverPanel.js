import React from "react"
import { BasicTooltip  } from "@nivo/core";

/**
 * BasicTooltip, used for axis tooltips.
 * @param node - the axis tick passed in
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



export default HoverPanel
