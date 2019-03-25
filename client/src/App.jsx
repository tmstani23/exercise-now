import React, { Component } from 'react';
import './App.css';


class ExerciseForm extends Component {
  state = {
    dataReturned: false,
    exerciseData: [],
    userId: "",
    description: "",
    duration: "",
    date: null,
  }
  handleSubmit = (event) => {
    // action="/api/exercise/add"
  }
  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
    
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} onChange={this.handleChange} method="post">
            <h3>Add exercises</h3>
            <p><code>POST /api/exercise/add</code></p>
            <input id="uid" type="text" name="userId" placeholder="userId*"/>
            <input id="desc" type="text" name="description" placeholder="description*"/>
            <input id="dur" type="text" name="duration" placeholder="duration* (mins.)"/>
            <input id="dat" type="text" name="date" placeholder="date (yyyy/mm/dd)"/>
            <input type="submit" value="Submit"/>
          </form>
          <p>{this.state.userId} {this.state.date}</p>
      </div>
    )
  }
}

class UserForm extends Component {
  
  state = {
    username: '',
    dataReturned: false,
    userData: [],
  }

  handleSubmit = (event) => {
    event.preventDefault();
    //const inputData = new FormData(event.target)
    console.log("clicked");
    
    fetch('/api/exercise/new-user', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      }, 
      body: JSON.stringify(this.state),
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      // reset data returned state to false:
      this.setState({dataReturned: false})
      // update state with the returned data and set data returned flag to true
      this.setState({userData: data, dataReturned: !this.state.dataReturned})
      //Call the backend api to update the userlist with the newly added user
      this.props.updateBackend()
     
    })
    .catch(err => console.log(err))
    
    
  }
  handleChange = (event) => {
    this.setState({username: event.target.value})
    
  }

  render() {
    return (
        <div>
          <h1>Exercise tracker</h1>
          <form onSubmit={this.handleSubmit} onChange={this.handleChange} method="post">
            <h3>Create a New User</h3>
            <input id="uname" type="text" name="username" placeholder="username"/>
            <input type="submit" value="Submit"/>
          </form>
          {this.state.dataReturned===true 
            ? <ul>
                <li>{this.state.userData.username}</li>
                <li>{this.state.userData.userId}</li>
            </ul>
            : <p>new user not yet created</p>
          }
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

  updateBackendApi = () => {
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
        <UserForm updateBackend = {this.updateBackendApi} />
        <ExerciseForm />
      </div>
    );
  }
}

export default App;
