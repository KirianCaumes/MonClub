import React from 'react'
import { Icon, TextField, Dropdown } from 'office-ui-fabric-react'
import PropTypes from 'prop-types'

export default class DropdownIcon extends React.Component {
    static propTypes = {
        /** Html id */
        id: PropTypes.string,
        /** Icon string */
        icon: PropTypes.string,
        /** Value to display on read */
        valueDisplay: PropTypes.string,
        /** Selected key for dropdown */
        selectedKey: PropTypes.any,
        /** Errors */
        error: PropTypes.string,
        /** Is readonly */
        readOnly: PropTypes.bool,
        /** Options for dropdown */
        options: PropTypes.arrayOf(PropTypes.object),
        /** Callback when dropdown change */
        onChange: PropTypes.func,
        /** Is dropdown disable */
        disabled: PropTypes.bool,
    }

    static defaultProps = {
        id: "",
        icon: "",
        valueDisplay: null,
        selectedKey: null,
        error: "",
        readOnly: false,
        options: [{}],
        onChange: () => null,
        disabled: false
    }


    render() {
        const { id, icon, valueDisplay, selectedKey, error, readOnly, options, onChange, disabled } = this.props

        if (readOnly) {
            return (
                <div className="flex-row flex-start">
                    <Icon className="flex-col" style={{ marginRight: '1px', height: 'auto' }} iconName={icon} />
                    <TextField
                        id={id}
                        defaultValue={valueDisplay}
                        borderless={true}
                        readOnly={true}
                        errorMessage={error}
                    />
                </div>
            )
        } else {
            return (
                <Dropdown
                    id={id}
                    selectedKey={selectedKey}
                    options={options}
                    errorMessage={error}
                    onChange={(ev, item) => onChange(ev, item)}
                    disabled={disabled}
                    onRenderOption={option => {
                        return (
                            <>
                                {option.icon && <Icon style={{ marginRight: '8px', verticalAlign: 'bottom' }} iconName={option.icon} />}
                                <span>{option.text}</span>
                            </>
                        )
                    }}
                    onRenderTitle={options => {
                        const option = options[0]

                        return (
                            <>
                                {option.icon && <Icon style={{ marginRight: '8px', verticalAlign: 'bottom' }} iconName={option.icon} />}
                                <span>{option.text}</span>
                            </>
                        )
                    }}
                />
            )
        }
    }
}
