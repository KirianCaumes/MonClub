import React from 'react'
import { Icon, TextField, Dropdown } from 'office-ui-fabric-react'
import PropTypes from 'prop-types'
import { SharedColors } from '@uifabric/fluent-theme/lib/fluent/FluentColors'

export default class DropdownIcon extends React.PureComponent {
    static propTypes = {
        /** Html id */
        id: PropTypes.string,
        /** Icon string */
        icon: PropTypes.string,
        /** Value to display on read */
        valueDisplay: PropTypes.string,
        /** Value to display on read and when no value*/
        placeholder: PropTypes.string,
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
        placeholder: null,
        selectedKey: null,
        error: "",
        readOnly: false,
        options: [{}],
        onChange: () => null,
        disabled: false
    }

    getIconColor(iconName) {
        switch (iconName) {
            case 'Accept':
                return SharedColors.green10
            case 'Cancel':
                return SharedColors.red10
            default:
                return ''
        }
    }


    render() {
        const { id, icon, valueDisplay, placeholder, selectedKey, error, readOnly, options, onChange, disabled } = this.props

        if (readOnly) {
            return (
                <div className="flex-row flex-start">
                    {icon && <Icon className="flex-col" style={{ marginRight: '1px', height: 'auto' }} iconName={icon} styles={{ root: { color: this.getIconColor(icon) } }} />}
                    <TextField
                        id={id}
                        defaultValue={valueDisplay}
                        placeholder={placeholder}
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
                    placeholder={placeholder}
                    options={options}
                    errorMessage={error}
                    onChange={(ev, item) => onChange(ev, item)}
                    disabled={disabled}
                    onRenderOption={option => {
                        return (
                            <>
                                {option.icon && <Icon style={{ marginRight: '8px', verticalAlign: 'bottom' }} iconName={option.icon} styles={{ root: { color: this.getIconColor(option.icon) } }} />}
                                <span>{option.text}</span>
                            </>
                        )
                    }}
                    onRenderTitle={options => {
                        const option = options[0]

                        return (
                            <>
                                {option.icon && <Icon style={{ marginRight: '8px', verticalAlign: 'bottom' }} iconName={option.icon} styles={{ root: { color: this.getIconColor(option.icon) } }} />}
                                <span>{option.text}</span>
                            </>
                        )
                    }}
                />
            )
        }
    }
}
