import React from 'react'
import '../../node_modules/bulma-extensions/dist/css/bulma-extensions.min.css'

export default class FullLoader extends React.Component {
    render() {
        return (
            <div className={`pageloader ${this.props.isLoading ? 'is-active' : ''}`} style={{ transition: this.props.isLoading ? 'none' : '' }}>
                <span className="title">Chargement</span>
            </div>
        )
    }
}