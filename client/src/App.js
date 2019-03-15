import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  
  state = {
    data: '',
  };

  componentDidMount() {
    //Get data from the backend api server
    this.callBackendApi()
      //Update the state data with the new data 
      .then(res => this.setState({data: res.users[0].username}))
      .catch(err => console.log(err));
  }

  callBackendApi = async () => {
    const response = await fetch('/api/exercise/users');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  }
  
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <p>Backend Data:</p>
        <p>
          {this.state.data}
        </p>
      </div>
    );
  }
}

export default App;
