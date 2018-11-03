/*******************************************************************
CREATED: Sat Nov 03 2018 (TarronLane)
NOTES: 
	- Form for Space Center Directors to register their space centers
*******************************************************************/
import React from 'react';
import {Button} from '../../widget';
/**
 * props: function setPage, string cancelPage, string submitPage
 */
class FormRegisterCenter extends React.Component {
    handleSubmit (event) {
        event.preventDefault();
        this.props.setPage(this.props.submitPage);
    }

    handleCancel () {
        this.props.setPage(this.props.cancelPage);
    }

    render() {
        return <form onSubmit={this.handleSubmit.bind(this)}>
            <div><label>Name of Space Center: </label><input type='text' /></div>
            <div><label>Address Line 1: </label><input type='text' /></div>
            <div><label>Address Line 2: </label><input type='text' /></div>
            <div><input type='submit' value='Register' /><Button text='Cancel' onClick={this.handleCancel.bind(this)} /></div>
        </form>;
    }
}

export default FormRegisterCenter;
