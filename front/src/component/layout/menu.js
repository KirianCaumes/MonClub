import React from 'react'
import { Menu as BulmaMenu } from 'react-bulma-components'

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
                                            x?.links.map((y, j) => (
                                                <BulmaMenu.List.Item
                                                    key={i + "_" + j}
                                                    onClick={() => y.onClick()}
                                                    className={y.key === selectedKey ? 'is-active' : ''}
                                                >
                                                    {y.name}
                                                </BulmaMenu.List.Item>
                                            ))
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