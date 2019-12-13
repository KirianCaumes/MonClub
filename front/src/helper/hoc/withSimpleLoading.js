import React from 'react'
import Loader from '../../component/loader'
export default function withSimpleLoading(isLoading, BaseComponent) {
    return isLoading
        ? <Loader />
        : BaseComponent
}