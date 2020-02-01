import React from 'react'
import PropTypes from 'prop-types'

export default class Emoji extends React.PureComponent {
    static propTypes = {
        /** The emoji */
        symbol: PropTypes.string,
        /** Label */
        label: PropTypes.string,
    }

    static defaultProps = {
        symbol: "🤔",
        label: ""
    }

    render() {
        const { symbol, label } = this.props;

        return (
            < span
                className="emoji"
                role="img"
                aria-label={label ? label : ""}
                aria-hidden={label ? "false" : "true"}
            >
                {symbol}
            </span >

        )

    }
}