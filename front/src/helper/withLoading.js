import React from 'react'
import Loader from '../component/loader'
export default function withLoading(isLoading, BaseComponent) {
    return function (props) {
        return isLoading
            ? <Loader />
            : <BaseComponent {...props} />
    }
}