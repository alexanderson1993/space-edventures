/*************************************************************************
Link.js
CREATED: 2018.11.3 (TarronLane)
NOTES:
    - A button styled to look like a link, with a prop that allows you to specify a string parameter to get passed to the onClick function (useful for routing)
*************************************************************************/
import React from 'react';
/**
 * @param {string text, function onClick, varient onClickParam} props 
 */
class Link extends React.Component {
    handleClick () {
        this.props.onClick(this.props.onClickParam);
    }

    render () {
        let style_link = {
            background: 'none',
            color: 'blue',
            border: 'none', 
            padding: '0',
            font: 'inherit',
            /*border is optional*/
            borderBottom: '1px solid blue',
            cursor: 'pointer',
        }

        return (
            <button style={style_link} onClick={this.handleClick.bind(this)}>{this.props.text}</button>
        );
    }
}

export default Link;