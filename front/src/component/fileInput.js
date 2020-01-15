
import React from 'react'
import { PrimaryButton, Spinner, SpinnerSize, TextField, IconButton, DefaultButton, DialogType, Dialog, DialogFooter, Text, TooltipHost, DirectionalHint, TooltipDelay } from 'office-ui-fabric-react'
import PropTypes from 'prop-types'

export default class FileInput extends React.PureComponent {
    static propTypes = {
        /** Error message to be displayed */
        errorMessage: PropTypes.string,
        /** Is already a file ? */
        isFile: PropTypes.bool,
        /** Is readonly ? */
        isRead: PropTypes.bool,
        /** Is force disabled */
        isDisabled: PropTypes.bool,
        /** File name ? */
        fileName: PropTypes.string,
        /** Tooltip text to display, null if none ? */
        tooltipContent: PropTypes.string,        
        /** Callback to download button */
        onDownload: PropTypes.func,
        /** Callback to open button */
        onOpen: PropTypes.func,
        /** Callback to upload button */
        onUpload: PropTypes.func,
        /** Callback to delete button */
        onDelete: PropTypes.func,
    }

    static defaultProps = {
        errorMessage: null,
        isFile: false,
        isRead: true,
        isDisabled: false,
        fileName: null,
        tooltipContent: null,
        onDownload: () => { return Promise.resolve() },
        onOpen: () => { return Promise.resolve() },
        onUpload: () => { return Promise.resolve() },
        onDelete: () => { return Promise.resolve() }
    }

    state = {
        isUploading: false,
        isDeleteing: false,
        isDownloading: false,
        showDialog: false
    }

    render() {
        const { isDownloading, isUploading, isDeleteing, showDialog } = this.state
        const { errorMessage, isFile, isRead, fileName, isDisabled, tooltipContent } = this.props
        if (isRead) {
            return (
                <div style={{ ...this.props.style }}>
                    <div className="flex-row flex-start">
                        <TooltipHost
                            content={tooltipContent}
                            directionalHint={DirectionalHint.bottomCenter}
                            delay={TooltipDelay.zero}                            
                        >
                            <DefaultButton
                                split
                                text="Télécharger"
                                iconProps={{ iconName: 'Download' }}
                                disabled={!isFile || isDownloading || isDisabled}
                                onClick={() => {
                                    this.setState({ isDownloading: true })
                                    this.props.onDownload().finally(() => this.setState({ isDownloading: false }))
                                }}
                                menuProps={{
                                    items: [
                                        {
                                            key: 'open',
                                            text: 'Visionner',
                                            disabled: isDisabled,
                                            iconProps: { iconName: 'OpenInNewTab' },
                                            onClick: () => {
                                                this.setState({ isDownloading: true })
                                                this.props.onOpen().finally(() => this.setState({ isDownloading: false }))
                                            }
                                        }
                                    ]
                                }}
                            />
                        </TooltipHost>
                        {isDownloading && <>&nbsp;&nbsp;<Spinner size={SpinnerSize.small} /></>}

                    </div>
                    <Text variant="small" block>{fileName}</Text>
                </div>
            )
        } else {
            return (
                <>
                    <div style={{ ...this.props.style }} className="flex-row flex-start">
                        <PrimaryButton
                            iconProps={{ iconName: 'Upload' }}
                            text={"Téléverser"}
                            onClick={() => {
                                this.uploadFile.value = null
                                this.uploadFile.click()
                            }}
                            disabled={isUploading || isFile || isDisabled}
                        />
                        <IconButton
                            iconProps={{ iconName: 'Delete' }}
                            disabled={isUploading || !isFile || isDisabled}
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
                            type: DialogType.largeHeader,
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