import React, { Component } from 'react';
import './App.css';

class UserForm extends Component {
  handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target)

    fetch('/api/exercise/add', {
      method: 'POST',
      body: formData,
    })
  }
  render() {
    return (
        <div>
          <h1>Exercise tracker</h1>
          <form onSubmit={this.handleSubmit} method="post">
            <h3>Create a New User</h3>
            <input id="uname" type="text" name="username" placeholder="username"/>
            <input type="submit" value="Submit"/>
          </form>
        </div>
    )
  }
}

class ActivateUsers extends Component {
  state = {
    buttonClicked: false,
  }
  handleClick = (event) => {
    this.setState({buttonClicked: !this.state.buttonClicked})
  }
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Show Users</button>
        {this.state.buttonClicked === true 
          ? <UserList userData = {this.props.userData}/> 
          : <p>No user data listed</p>
        }   
      </div>
      
    )
  }
}

function UserList(props) {
  // create a jsx list of items containing all user data
  const listItems = props.userData.map((item, index) => {
    return <ul key={index}>
      {/* Return username and id for each user as list items*/}
      <li>Username: {item.username}</li>
      <li>User Id: {item._id}</li>
    </ul>
  })
  return (
    <div>
      {listItems}
    </div>
  )
}

class App extends Component {
  
  state = {
    userData: [],
    isLoading: true,
  };

  componentDidMount() {
    //Get data from the backend api server
    this.callBackendApi()
      //Update the state data with the new data 
      .then(res => {
        this.setState({userData: res, isLoading: false });
      })
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
        
        <p>Backend Data:</p>
        {this.state.isLoading === true
          ? <p>No data yet</p>
          : <ActivateUsers userData = {this.state.userData}/>
        }
        <UserForm />
        
      </div>
    );
  }
}

export default App;
