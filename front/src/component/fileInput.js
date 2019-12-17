import React from 'react'
import { BaseComponent } from "@uifabric/utilities"
import { connect } from "react-redux"
import { PrimaryButton, Spinner, SpinnerSize, TextField, IconButton, DefaultButton } from 'office-ui-fabric-react'


class _FileInput extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            isUploading: false
        }
    }

    render() {
        const { isUploading } = this.state
        const { errorMessage, disabled, read } = this.props
        if (read) {
            return (
                <DefaultButton
                    text="Télécharger"
                    iconProps={{ iconName: 'Download' }}
                    disabled={disabled}
                    onClick={() => this.props.onDownload()}
                />
            )
        } else {
            return (
                <>
                    <div style={{ ...this.props.style, display: 'flex' }}>
                        <PrimaryButton
                            iconProps={{ iconName: 'Upload' }}
                            text={"Téléverser"}
                            onClick={() => {
                                this.uploadFile.value = null
                                this.uploadFile.click()
                            }}
                            disabled={isUploading}
                        />
                        <IconButton
                            iconProps={{ iconName: 'Delete' }}
                            disabled={isUploading || disabled}
                            onClick={() => {
                                this.setState({ isUploading: true })
                                this.props.onDelete().finally(() => this.setState({ isUploading: false }))
                            }}
                        />
                        {
                            isUploading &&
                            <>&nbsp;&nbsp;<Spinner size={SpinnerSize.small} labelPosition="right" /></>
                        }
                        <input
                            type="file"
                            ref={input => this.uploadFile = input}
                            onChange={e => {
                                if (e.target?.files?.[0]) {
                                    this.setState({ isUploading: true })
                                    this.props.onUpload(e.target.files[0]).finally(() => this.setState({ isUploading: false }))
                                }
                            }}
                            style={{ display: 'none' }}
                        />
                    </div>
                    {
                        errorMessage &&
                        <TextField
                            errorMessage={errorMessage}
                            styles={{ wrapper: { display: 'none' } }}
                        />
                    }
                </>
            )
        }
    }
}

const mapDispatchToProps = dispatch => {
    return {}
}

const mapStateToProps = state => {
    return {}
}
const FileInput = connect(mapStateToProps, mapDispatchToProps)(_FileInput)

export default FileInput