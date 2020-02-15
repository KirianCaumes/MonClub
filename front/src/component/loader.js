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
                    <div style={{ border: `4px solid ${color}` }}></div>
                    <div style={{ border: `4px solid ${color}` }}></div>
                </div>
            </div>
        )
    }
}