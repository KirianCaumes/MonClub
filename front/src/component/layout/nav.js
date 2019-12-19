import React from 'react'
import { Nav } from 'office-ui-fabric-react'

class Aside extends React.Component {
    render() {        
        const { menu } = this.props

        return (
            <aside className="is-hidden-touch">
                <Nav
                    styles={{
                        root: {
                            width: 240,
                            overflowY: 'auto'
                        },
                        chevronButton: {
                            borderColor: "transparent"
                        }
                    }}
                    selectedKey={this.props.selectedKeyURL}
                    groups={menu}
                />
            </aside>
        )
    }
}

export default Aside