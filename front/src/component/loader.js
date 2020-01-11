import React from 'react'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react'

export default class Loader extends React.PureComponent {
    render() {
        return (
            <Spinner size={SpinnerSize.large} />
        )
    }
}