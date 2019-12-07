import React from 'react'
import { CommandBar } from 'office-ui-fabric-react'

class Command extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { backgroundColor } = this.props
        return (
            <CommandBar
                styles={{
                    root: {
                        background: backgroundColor,
                    },
                }}
                items={[
                    {
                        key: 'newItem',
                        text: 'New',
                        iconProps: { iconName: 'Add' },
                        buttonStyles: { root: { background: backgroundColor } },
                        onClick: () => console.log('Calendar')
                    },
                    {
                        key: 'upload',
                        text: 'Upload',
                        iconProps: { iconName: 'Upload' },
                        buttonStyles: { root: { background: backgroundColor } },
                        onClick: () => console.log('Upload')
                    },
                    {
                        key: 'share',
                        text: 'Share',
                        iconProps: { iconName: 'Share' },
                        buttonStyles: { root: { background: backgroundColor } },
                        onClick: () => console.log('Share')
                    },
                    {
                        key: 'download',
                        text: 'Download',
                        iconProps: { iconName: 'Download' },
                        buttonStyles: { root: { background: backgroundColor } },
                        onClick: () => console.log('Download')
                    }
                ]}
            />
        )
    }
}

export default Command