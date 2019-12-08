import React from 'react'
import { Hero, Container, Heading, Columns } from 'react-bulma-components'
import { Text, Icon, MessageBarType } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setLoading, setMessageBar } from '../redux/actions/common'
import { history } from '../helper/history'
import '../style/page/index.scss'
import request from '../helper/request'
import Loader from '../component/loader'

class _Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Accueil', key: 'accueil', onClick: () => history.push('/') },
        ])
        this.props.setCommand([
            {
                key: 'newItem',
                text: 'New',
                iconProps: { iconName: 'Add' },
                onClick: () => console.log('Calendar')
            },
            {
                key: 'upload',
                text: 'Upload',
                iconProps: { iconName: 'Upload' },
                onClick: () => console.log('Upload')
            },
            {
                key: 'share',
                text: 'Share',
                iconProps: { iconName: 'Share' },
                onClick: () => console.log('Share')
            },
            {
                key: 'download',
                text: 'Download',
                iconProps: { iconName: 'Download' },
                onClick: () => console.log('Download')
            }
        ])

        this.props.setLoading(true)
        request.getInfos()
            .then(infos => this.setState({ ...infos }))
            .catch(err => this.props.setMessageBar(true, MessageBarType.error, err.toString()))
            .finally(() => this.props.setLoading(false))
    }
    render() {
        if (this.props.isLoading) return <Loader />
        return (
            <section id="index">
                <Hero color="info">
                    <Hero.Body>
                        <Container>
                            <Heading className="is-capitalized">
                                Bienvenue : {this.props.me?.username?.split('@')?.[0]}
                            </Heading>
                        </Container>
                    </Hero.Body>
                </Hero>
                <br />
                <Columns className="is-vcentered">
                    <Columns.Column>
                        <div className="card">
                            <div className="flex-col">
                                <Text variant="large" block>
                                    <Icon iconName='Contact' />&nbsp;<span dangerouslySetInnerHTML={{__html: this.state.text}}></span>
                                </Text>
                            </div>
                        </div>
                    </Columns.Column>
                    <Columns.Column>
                        <Columns>
                            {this.state.infos?.users &&
                                <Columns.Column>
                                    <div className="card">
                                        <div className="flex-col">
                                            <Text variant="xxLarge" nowrap block>
                                                <Icon iconName='ContactList' />&nbsp;{this.state.infos?.users}
                                            </Text>
                                            <Text variant="large" nowrap block>
                                                Utilisateurs
                                            </Text>
                                        </div>
                                    </div>
                                </Columns.Column>
                            }
                            <Columns.Column>
                                <div className="card">
                                    <div className="flex-col">
                                        <Text variant="xxLarge" nowrap block>
                                            <Icon iconName='RecruitmentManagement' />&nbsp;{this.state.infos?.members}
                                        </Text>
                                        <Text variant="large" nowrap block>
                                            Membres
                                        </Text>
                                    </div>
                                </div>
                            </Columns.Column>
                        </Columns>
                        <Columns>
                            <Columns.Column>
                                <div className="card">
                                    <div className="flex-col">
                                        <Text variant="xxLarge" nowrap block>
                                            <Icon iconName='UserFollowed' />&nbsp;{this.state.infos?.membersOk}
                                        </Text>
                                        <Text variant="large" block>
                                            Membres validés
                                        </Text>
                                    </div>
                                </div>
                            </Columns.Column>
                            <Columns.Column>

                                <div className="card">
                                    <div className="flex-col">
                                        <Text variant="xxLarge" nowrap block>
                                            <Icon iconName='UserOptional' />&nbsp;{this.state.infos?.membersPending}
                                        </Text>
                                        <Text variant="large" block>
                                            Membre en attente
                                        </Text>
                                    </div>
                                </div>
                            </Columns.Column>
                        </Columns>
                    </Columns.Column>
                </Columns>
            </section>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setBreadcrumb: data => dispatch(setBreadcrumb(data)),
        setCommand: data => dispatch(setCommand(data)),
        setLoading: data => dispatch(setLoading(data)),
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
    }
}

const mapStateToProps = state => {
    return {
        me: state.user.me,
        isLoading: state.common.isLoading
    }
}
const Index = connect(mapStateToProps, mapDispatchToProps)(_Index)
export default Index
