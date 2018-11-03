import React from "react";
import ReactDOM from "react-dom";
import AdminHome from './admin/Admin.js';
import "./styles.css";

// Constants
import Constant from './constants.js';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: Constant.ADMINHOME
        }
    }

    handleClick () {
        this.setState({
            currentPage: Constant.ADMINHOME
        });
    }

    goToHome () {
        this.setState({
            currentPage: Constant.HOME
        });
    }

    render() {
        if (this.state.currentPage === Constant.ADMINHOME) {
            return (
                <AdminHome goToHome={this.goToHome.bind(this)}/>
            );
        }
        else {
            return (
            <div className="App">
                    <h1>Hello CodeSandbox</h1>
                    <h2>Start editing to see some magic happen!</h2>
                    <button type="link" onClick={this.handleClick.bind(this)} >View Admin Pages</button>
                </div>
            );

        }
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
