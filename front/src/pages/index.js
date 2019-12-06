import React from 'react'
import request from '../helper/request'
import { Depths } from '@uifabric/fluent-theme'
import { Hero, Container, Heading, Columns } from 'react-bulma-components'
import { Breadcrumb, Text, Icon } from 'office-ui-fabric-react'

class Index extends React.Component {
    componentDidMount() {
        // request.getContracts().then(x => console.log(x))
    }
    render() {
        return (
            <section id="index">
                <Hero style={{ boxShadow: Depths.depth16, borderRadius: '5px', background: 'linear-gradient(to right, #2B6CA3 0%, #2B6CA3 75%, #0f3375)' }} color="info">
                    <Hero.Body style={{ padding: '2rem 1.5rem' }}>
                        <Container>
                            <Heading>
                                Bienvenu : kirian.caumes
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

export default Index;
