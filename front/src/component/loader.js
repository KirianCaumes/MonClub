import React from 'react'
import '../../node_modules/bulma-extensions/dist/css/bulma-extensions.min.css'

export default class Loader extends React.Component {
    render() {
        return (
            <div className="pageloader is-active" style={{ background: 'linear-gradient(to right bottom, #2B6CA3 0%, #2B6CA3 75%, #0f3375)' }}>
                <span className="title">Chargement</span>
            </div>
        )
    }
}