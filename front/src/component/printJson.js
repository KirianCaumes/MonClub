import React from "react"

export const PrintJson = (props) => (
    <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(props.data, null, 2)}</pre>
)
