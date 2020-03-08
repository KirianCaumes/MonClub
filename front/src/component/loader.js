import React from 'react'
import PropTypes from 'prop-types'

export default class Loader extends React.PureComponent {
    static propTypes = {
        /** Loader color */
        color: PropTypes.string,
    }

    static defaultProps = {
        color: '#fff',
    }

    render() {
        const { color } = this.props
        return (
            <div className="my-loader">
                <div >
                    <div style={{ borderColor: `${color}` }}></div>
                    <div style={{ borderColor: `${color}` }}></div>
                </div>
            </div>
        )
    }
}