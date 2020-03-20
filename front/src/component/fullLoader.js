import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'office-ui-fabric-react'

export default class FullLoader extends React.PureComponent {
    static propTypes = {
        /** Is app loading ? */
        isLoading: PropTypes.bool,
    }

    static defaultProps = {
        isLoading: false,
    }

    state = {
        phraseDisplay: ""
    }

    componentDidMount() {
        this.phrases = [
            "Chargement...",
            "Regonflage des ballons...",
            "Préparation des roucoulettes...",
            "Mise en place des chabalas...",
            "Accrochage des filets de buts...",
            "Nettoyage des chasubles...",
            "Mise en place de la table de marque...",
            "Lancement des kung fu...",
            "Initialisation du 7 de départ...",
            "Arrivé des joueurs sur le terrain...",
            "Échauffement en cours"
        ]

        const applyPhrase = () => this.setState({ phraseDisplay: this.phrases[Math.floor(Math.random() * this.phrases.length)] })
        applyPhrase()
        setInterval(applyPhrase, 5000)
    }

    render() {
        return (
            <div className={`pageloader ${this.props.isLoading ? 'is-active' : ''}`} style={{ transition: this.props.isLoading ? 'none' : '' }}>
                <span className="title"><Text>{this.state.phraseDisplay}</Text></span>
            </div>
        )
    }
}