import React from 'react'
import { Menu as BulmaMenu } from 'react-bulma-components'
import { Text } from 'office-ui-fabric-react'

class Menu extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { menu, selectedKeyURL } = this.props

        return (
            <BulmaMenu>
                {
                    menu.map((x, i) => {
                        let selectedKey = (() => {
                            if (selectedKeyURL.match(/\/membre\/.*/g)) {
                                return '/membres'
                            } else if (selectedKeyURL.match(/\/equipe\/.*/g)) {
                                return '/equipes'
                            } else if (selectedKeyURL.match(/\/utilisateur\/.*/g)) {
                                return '/utilisateurs'
                            }
                            return selectedKeyURL
                        })()
                        return (
                            <React.Fragment key={i}>
                                {

                                    <BulmaMenu.List title={x.name ? x.name : ''}>
                                        {
                                            x?.links.map((y, j) => {
                                                if (y?.links?.length) {
                                                    return (
                                                        <BulmaMenu.List.Item
                                                            key={i + "_" + j}
                                                            onClick={() => y.onClick()}
                                                            className={y.key === selectedKey ? 'is-active' : ''}
                                                        >
                                                            <BulmaMenu.List
                                                                title={y.name ? <Text variant="medium" >{y.name}</Text> : ''}
                                                            >
                                                                {
                                                                    y?.links.map((z, k) => (
                                                                        <BulmaMenu.List.Item
                                                                            key={i + "_" + j + "_" + k}
                                                                            onClick={() => z.onClick()}
                                                                            className={z.key === selectedKey ? 'is-active' : ''}
                                                                        >
                                                                            <Text variant="medium">{z.name}</Text>
                                                                        </BulmaMenu.List.Item>
                                                                    ))
                                                                }
                                                            </BulmaMenu.List>
                                                        </BulmaMenu.List.Item>
                                                    )
                                                } else {
                                                    return (
                                                        <BulmaMenu.List.Item
                                                            key={i + "_" + j}
                                                            onClick={() => y.onClick()}
                                                            className={y.key === selectedKey ? 'is-active' : ''}
                                                        >
                                                            <Text variant="medium">{y.name}</Text>
                                                        </BulmaMenu.List.Item>
                                                    )
                                                }
                                            })
                                        }
                                    </BulmaMenu.List>
                                }
                            </React.Fragment>
                        )
                    })
                }
            </BulmaMenu>
        )
    }
}

export default Menu