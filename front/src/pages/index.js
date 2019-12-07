import React from 'react'
import { Depths } from '@uifabric/fluent-theme'
import { Hero, Container, Heading, Columns } from 'react-bulma-components'
import { Text, Icon } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand } from '../redux/actions/common'
import { history } from '../helper/history'

class _Index extends React.Component {
    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Accueil', key: 'accueil', onClick: () => history.push('/') },
        ])
        this.props.setCommand([
            {
                key: 'newItem',
                text: 'New',
                iconProps: { iconName: 'Add' },
                buttonStyles: { root: { background: null } },
                onClick: () => console.log('Calendar')
            },
            {
                key: 'upload',
                text: 'Upload',
                iconProps: { iconName: 'Upload' },
                buttonStyles: { root: { background: null } },
                onClick: () => console.log('Upload')
            },
            {
                key: 'share',
                text: 'Share',
                iconProps: { iconName: 'Share' },
                buttonStyles: { root: { background: null } },
                onClick: () => console.log('Share')
            },
            {
                key: 'download',
                text: 'Download',
                iconProps: { iconName: 'Download' },
                buttonStyles: { root: { background: null } },
                onClick: () => console.log('Download')
            }
        ])
    }
    render() {
        return (
            <section id="index">
                <Hero style={{ boxShadow: Depths.depth16, borderRadius: '5px', background: 'linear-gradient(to right, #2B6CA3 0%, #2B6CA3 75%, #0f3375)' }} color="info">
                    <Hero.Body style={{ padding: '2rem 1.5rem' }}>
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
                        <div style={{ background: 'white', height: '324px', boxShadow: Depths.depth4, textAlign: 'center' }}>
                            <div className="flex-col">
                                <Text variant="xxLarge" nowrap block>
                                    <Icon iconName='AccountManagement' />&nbsp;Titre
                                    </Text>
                                <Text variant="large" nowrap block>
                                    125
                                    </Text>
                            </div>
                        </div>
                    </Columns.Column>
                    <Columns.Column>
                        <Columns>
                            <Columns.Column>
                                <div style={{ background: 'white', height: '150px', boxShadow: Depths.depth4, textAlign: 'center' }}>
                                    <div className="flex-col">
                                        <Text variant="xxLarge" nowrap block>
                                            <Icon iconName='AccountManagement' />&nbsp;Titre
                                    </Text>
                                        <Text variant="large" nowrap block>
                                            125
                                    </Text>
                                    </div>
                                </div>
                            </Columns.Column>
                            <Columns.Column>

                                <div style={{ background: 'white', height: '150px', boxShadow: Depths.depth4, textAlign: 'center' }}>
                                    <div className="flex-col">
                                        <Text variant="xxLarge" nowrap block>
                                            <Icon iconName='AccountManagement' />&nbsp;Titre
                                    </Text>
                                        <Text variant="large" nowrap block>
                                            125
                                    </Text>
                                    </div>
                                </div>
                            </Columns.Column>
                        </Columns>
                        <Columns>
                            <Columns.Column>

                                <div style={{ background: 'white', height: '150px', boxShadow: Depths.depth4, textAlign: 'center' }}>
                                    <div className="flex-col">
                                        <Text variant="xxLarge" nowrap block>
                                            <Icon iconName='AccountManagement' />&nbsp;Titre
                                    </Text>
                                        <Text variant="large" nowrap block>
                                            125
                                    </Text>
                                    </div>
                                </div>
                            </Columns.Column>
                            <Columns.Column>

                                <div style={{ background: 'white', height: '150px', boxShadow: Depths.depth4, textAlign: 'center' }}>
                                    <div className="flex-col">
                                        <Text variant="xxLarge" nowrap block>
                                            <Icon iconName='AccountManagement' />&nbsp;Titre
                                    </Text>
                                        <Text variant="large" nowrap block>
                                            125
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
        setCommand: data => dispatch(setCommand(data))
    }
}

const mapStateToProps = state => {
    return {
        me: state.user.me
    }
}
const Index = connect(mapStateToProps, mapDispatchToProps)(_Index)
export default Index
