import React from 'react'
import { BaseComponent } from "@uifabric/utilities"
import { connect } from "react-redux"
import { PrimaryButton, Spinner, SpinnerSize, TextField, IconButton, DefaultButton, DialogType, Dialog, DialogFooter, Text } from 'office-ui-fabric-react'


class _FileInput extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            isUploading: false,
            isDeleteing: false,
            showDialog: false
        }
    }

    render() {
        const { isUploading, isDeleteing, showDialog } = this.state
        const { errorMessage, isFile, read, fileName } = this.props
        if (read) {
            return (
                <>
                    <DefaultButton
                        text="Télécharger"
                        iconProps={{ iconName: 'Download' }}
                        disabled={!isFile}
                        onClick={() => this.props.onDownload()}
                    />
                    <Text variant="small" block>{fileName}</Text>
                </>
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
                            disabled={isUploading || isFile}
                        />
                        <IconButton
                            iconProps={{ iconName: 'Delete' }}
                            disabled={isUploading || !isFile}
                            onClick={() => {
                                this.setState({ showDialog: true })
                            }}
                        />
                        {isUploading && <>&nbsp;&nbsp;<Spinner size={SpinnerSize.small} labelPosition="right" /></>}
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
                    <Text variant="small" block>{fileName}</Text>
                    {
                        errorMessage &&
                        <TextField
                            errorMessage={errorMessage}
                            styles={{ wrapper: { display: 'none' } }}
                        />
                    }
                    <Dialog
                        hidden={!showDialog}
                        onDismiss={() => this.setState({ showDialog: false })}
                        dialogContentProps={{
                            type: DialogType.normal,
                            title: 'Supprimer le document',
                            subText: 'Êtes-vous certains de vouloir supprimer le document ? Cette action est définitive.'
                        }}
                        modalProps={{
                            isBlocking: true,
                            styles: { main: { maxWidth: 450 } },
                            dragOptions: false
                        }}
                    >
                        <DialogFooter>
                            <DefaultButton
                                onClick={() => this.setState({ showDialog: false })}
                                text="Annuler"
                                disabled={isDeleteing}
                            />
                            <PrimaryButton
                                onClick={() => {
                                    this.setState({ isDeleteing: true })
                                    this.props.onDelete().finally(() => this.setState({ isDeleteing: false, showDialog: false }))
                                }}
                                disabled={isDeleteing}
                            >
                                Oui {isDeleteing && <>&nbsp;&nbsp;<Spinner size={SpinnerSize.small} labelPosition="right" /></>}
                            </PrimaryButton>
                        </DialogFooter>
                    </Dialog>
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