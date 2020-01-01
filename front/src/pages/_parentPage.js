import * as React from 'react'

export default class ParentPage extends React.Component {
    _onColumnClick = (params, ev, column) => {
        if (!Array.isArray(params.dataName) || params.dataName.length > 2 || params.dataName.length < 1) {
            console.error("'params.dataName' should be array with one or two arguments only")
            return
        }
        if (params.exclude.includes(column.key)) return
        const columns = this.state[params.colName]
        const items = params.dataName.length > 1 ? this[params.source][params.dataName[0]][params.dataName[1]] : this[params.source][params.dataName[0]]
        //var a = function(x, s) { if (s.length > 1) { return a(x[s[0]], s.slice(1, s.length)) } else { return x[s[0]] } }

        let newItems = items.slice();
        const newColumns = columns.slice();
        const currColumn = newColumns.filter((currCol, idx) => {
            return column.key === currCol.key;
        })[0];
        newColumns.forEach((newCol) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
        });
        newItems = this._sortItems(newItems, currColumn.fieldName || '', currColumn.isSortedDescending);

        if (params.source === "state") {
            if (params.dataName.length > 1) {
                this.setState({
                    [params.dataName[0]]: {
                        ...this.state[params.dataName[0]],
                        [params.dataName[1]]: newItems
                    }
                })
            } else {
                this.setState({
                    [params.colName]: newColumns,
                    [params.dataName]: newItems
                });
            }
        } else {
            if (typeof params.action === "function") {
                params.action(newItems)
            } else {
                this[params.source][params.action](newItems)
            }
        }
    };

    _sortItems = (items, sortBy, descending = false) => {
        if (descending) {
            return items.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) {
                    return 1;
                }
                if (a[sortBy] > b[sortBy]) {
                    return -1;
                }
                return 0;
            });
        } else {
            return items.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) {
                    return -1;
                }
                if (a[sortBy] > b[sortBy]) {
                    return 1;
                }
                return 0;
            });
        }
    };
}