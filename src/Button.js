/*************************************************************************
Button.js
CREATED: 2018.11.3 (TarronLane)
NOTES:
    - A button styled to look like a button, with a prop that allows you to specify a string parameter to get passed to the onClick function (useful for routing)
*************************************************************************/
import React from 'react';
/**
 * @param {string text, function onClick, varient onClickParam} props 
 */
class Button extends React.Component {
    handleClick () {
        this.props.onClick(this.props.onClickParam);
    }

    render() {
        let style_button = {
            marginBottom: '5px',
            marginTop: '5px',
            marginRight: '5px'
        }

        return (
            <button style={style_button} onClick={this.handleClick.bind(this)}>{this.props.text}</button>
        );
    }
}

export default Button;