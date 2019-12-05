import React from 'react'
import request from '../helper/request'
import { Nav, CommandBar } from 'office-ui-fabric-react'
import Header from '../component/header';
import { authenticate } from '../redux/actions'
import { connect } from "react-redux"

class _Layout extends React.Component {
    componentDidMount() {
        request.getContracts().then(x => console.log(x))
    }
    render() {
        return (
            <>
                <Header />
                <div style={{ display: 'flex', height: '100%' }}>
                    <aside style={{ background: 'hsl(0, 0%, 86%)' }}>
                        <Nav

                            styles={{
                                root: {
                                    width: 250,
                                    overflowY: 'auto'
                                },
                                chevronButton: {
                                    borderColor: "transparent"
                                }
                            }}
                            ariaLabel="Nav example similiar to one found in this demo page"
                            groups={[
                                {
                                    name: 'Basic components',
                                    expandAriaLabel: 'Expand Basic components section',
                                    collapseAriaLabel: 'Collapse Basic components section',
                                    links: [
                                        {
                                            key: 'ActivityItem',
                                            name: 'ActivityItem',
                                            url: '#/examples/activityitem'
                                        },
                                        {
                                            key: 'Breadcrumb',
                                            name: 'Breadcrumb',
                                            url: '#/examples/breadcrumb'
                                        },
                                        {
                                            key: 'Button',
                                            name: 'Button',
                                            url: '#/examples/button'
                                        }
                                    ]
                                },
                                {
                                    name: 'Extended components',
                                    expandAriaLabel: 'Expand Extended components section',
                                    collapseAriaLabel: 'Collapse Extended components section',
                                    links: [
                                        {
                                            key: 'ColorPicker',
                                            name: 'ColorPicker',
                                            url: '#/examples/colorpicker'
                                        },
                                        {
                                            key: 'ExtendedPeoplePicker',
                                            name: 'ExtendedPeoplePicker',
                                            url: '#/examples/extendedpeoplepicker'
                                        },
                                        {
                                            key: 'GroupedList',
                                            name: 'GroupedList',
                                            url: '#/examples/groupedlist'
                                        }
                                    ]
                                },
                                {
                                    name: 'Utilities',
                                    expandAriaLabel: 'Expand Utilities section',
                                    collapseAriaLabel: 'Collapse Utilities section',
                                    links: [
                                        {
                                            key: 'FocusTrapZone',
                                            name: 'FocusTrapZone',
                                            url: '#/examples/focustrapzone'
                                        },
                                        {
                                            key: 'FocusZone',
                                            name: 'FocusZone',
                                            url: '#/examples/focuszone'
                                        },
                                        {
                                            key: 'MarqueeSelection',
                                            name: 'MarqueeSelection',
                                            url: '#/examples/marqueeselection'
                                        }
                                    ]
                                }
                            ]}
                        />
                    </aside>
                    <div style={{ width: '100%' }}>
                        <CommandBar
                            styles={{
                                root: {
                                    background: 'hsl(0, 0%, 86%)',
                                    boxSizing: 'border-box',
                                    borderLeft: '1px solid #eee',
                                },

                            }}
                            items={[
                                {
                                    key: 'newItem',
                                    text: 'New',
                                    cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
                                    iconProps: { iconName: 'Add' },
                                    buttonStyles: { root: { background: 'hsl(0, 0%, 86%)' } },
                                    subMenuProps: {
                                        items: [
                                            {
                                                key: 'emailMessage',
                                                text: 'Email message',
                                                iconProps: { iconName: 'Mail' },
                                                ['data-automation-id']: 'newEmailButton' // optional
                                            },
                                            {
                                                key: 'calendarEvent',
                                                text: 'Calendar event',
                                                iconProps: { iconName: 'Calendar' }
                                            }
                                        ]
                                    }
                                },
                                {
                                    key: 'upload',
                                    text: 'Upload',
                                    iconProps: { iconName: 'Upload' },
                                    buttonStyles: { root: { background: 'hsl(0, 0%, 86%)' } },
                                    href: 'https://dev.office.com/fabric'
                                },
                                {
                                    key: 'share',
                                    text: 'Share',
                                    iconProps: { iconName: 'Share' },
                                    buttonStyles: { root: { background: 'hsl(0, 0%, 86%)' } },
                                    onClick: () => console.log('Share')
                                },
                                {
                                    key: 'download',
                                    text: 'Download',
                                    iconProps: { iconName: 'Download' },
                                    buttonStyles: { root: { background: 'hsl(0, 0%, 86%)' } },
                                    onClick: () => console.log('Download')
                                }
                            ]}
                        />
                        <div style={{ padding: '15px' }}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        authenticate: isAuthenticated => dispatch(authenticate(isAuthenticated))
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.common.isAuthenticated
    }
}
const Layout = connect(mapStateToProps, mapDispatchToProps)(_Layout)
export default Layout
