import React, { Component } from 'react';
import './App.css';

class App extends Component {
  
  state = {
    userData: [],
    isLoading: true,
    limit: 10,
    skip: 0,
    totalResults: 0,
  };

  componentDidMount() {
    this.updateBackendApi()
  }

  handlePrevResultsClick = async () => {
    let skip = this.state.skip;
    let limit = this.state.limit;
    let newSkip = skip - limit
    await this.setState({skip: newSkip, prevResults: true});
    this.updateBackendApi();
  } 

  updateBackendApi = () => {
    //console.log(skipInput, "skipinput")
    //Get data from the backend api server
     //console.log(JSON.stringify(this.state), "beforefetch state")
     fetch('/api/exercise/users', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      }, 
      body: JSON.stringify(this.state),
    })
    .then(res => res.json())
     //Update the state data with the new data 
    .then(res => {
      this.setState({userData: res.userArr, isLoading: false, skip: res.skip, prevResults: res.prevResults, totalResults: res.totalResults });
      //console.log(JSON.stringify(this.state));
      })
    .catch(err => console.log(err));
  }
  
  render() {
    return (
      <div className="container">
        
        
        {this.state.isLoading === true
          ? <Loading />
          : <ActivateUsers userData = {this.state.userData} updateBackend = {this.updateBackendApi} handlePrev = {this.handlePrevResultsClick} />
        }
        <UserForm updateBackend = {this.updateBackendApi} />
        
        <ExerciseForm />
        
        <ActivateLogs />
        
        
      </div>
    );
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
      <div className="col1">
        <h1>All Users</h1>
        <button onClick={this.handleClick}>Show Users</button>
        {this.state.buttonClicked === true 
          ? <UserList userData = {this.props.userData} updateBackend = {this.props.updateBackend} handlePrev = {this.props.handlePrev} /> 
          : null
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
      <button onClick={props.updateBackend}>More Results</button>
      <button onClick={props.handlePrev}>Prev Results</button>

    </div>
  )
}

class UserForm extends Component {
  
  state = {
    username: '',
    dataReturned: null,
    userData: [],
    
  }

  handleSubmit = (event) => {
    event.preventDefault();
    // reset data returned state to false:
    this.setState({dataReturned: false})

    fetch('/api/exercise/new-user', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      }, 
      body: JSON.stringify(this.state),
    })
    .then(res => res.json())
    .then(data => {
      // update state with the returned data and set data returned flag to true
      this.setState({userData: data, dataReturned: !this.state.dataReturned});
      //Call the backend api to update the userlist with the newly added user
    })
    .catch(err => console.log(err))
    
    
  }
  handleChange = (event) => {
    this.setState({username: event.target.value})
    
  }

  render() {
    return (
        <div className="col2">
          <form onSubmit={this.handleSubmit} onChange={this.handleChange} method="post">
            <h1>Create a New User</h1>
            <input id="uname" type="text" name="username" placeholder="username"/>
            <input type="submit" value="Submit"/>
          </form>
          {this.state.dataReturned===true && this.state.userData.errorMessage === undefined
            ? <ul>
                <li>{this.state.userData.username}</li>
                <li>{this.state.userData.userId}</li>
            </ul>
            : null
          }
          {this.state.dataReturned === true && this.state.userData.errorMessage !== undefined
            ? <DisplayErrors errorMessage = {this.state.userData.errorMessage} />
            : null
          }
          {this.state.dataReturned === false
            ? <Loading />
            : null
          }
        </div>

    )
  }
}

class ExerciseForm extends Component {
  state = {
    dataReturned: null,
    exerciseData: [],
    userId: "",
    description: "",
    duration: "",
    date: "",
    buttonClicked: false,
  }
  handleClick = (event) => {
    this.setState({buttonClicked: !this.state.buttonClicked})
  }

  handleSubmit = (event) => {
    // action="/api/exercise/add"
    event.preventDefault();
    // reset data returned state to false:
    this.setState({dataReturned: false, exerciseData: []})
    
    fetch('/api/exercise/add', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      }, 
      body: JSON.stringify(this.state),
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      // update state with the returned data and set data returned flag to true
      this.setState({exerciseData: data, dataReturned: !this.state.dataReturned})
      //Call the backend api to update the userlist with the newly added user
     
     
    })
    .catch(err => {
      console.log(err);
    })
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
      <div className="col3">
        <h1>Add exercises</h1>
        <button onClick={this.handleClick}>Show Users</button>
        {this.state.buttonClicked === true 
          ? <div>
              <form onSubmit={this.handleSubmit} onChange={this.handleChange} method="post">
                  <input id="uid" type="text" name="userId" placeholder="userId*"/>
                  <input id="desc" type="text" name="description" placeholder="description*"/>
                  <input id="dur" type="text" name="duration" placeholder="duration* (mins.)"/>
                  <input id="dat" type="text" name="date" placeholder="date (yyyy/mm/dd)"/>
                  <input type="submit" value="Submit"/>
                </form>
                
                
                {this.state.dataReturned === true && this.state.exerciseData.errorMessage === undefined
                  ? 
                    <ul> New Exercise Log Created
                      <li>Username: {this.state.exerciseData.userData.username}</li>
                      <li>Entry UID: {this.state.exerciseData.newLog.uid}</li>
                      <li>Description: {this.state.exerciseData.newLog.description}</li>
                      <li>Duration: {this.state.exerciseData.newLog.duration}</li>
                      <li>Date: {this.state.exerciseData.newLog.date}</li>
                    </ul>
                  : null
                }
                {this.state.dataReturned === true && this.state.exerciseData.errorMessage !== undefined
                  ? <DisplayErrors errorMessage = {this.state.exerciseData.errorMessage}/>
                  : null
                }
                {
                  this.state.dataReturned === false
                    ? <Loading />
                    : null
                }
            </div>
          : null
        }   
        
        
      </div>
    )
  }
}



class ActivateLogs extends Component {
  state = {
    buttonClicked: false,
  }
  handleClick = (event) => {
    this.setState({buttonClicked: !this.state.buttonClicked})
  }
  render() {
    return (
      <div className="col4">
        <h1>Find Exercise Logs</h1>
        <button onClick={this.handleClick}>Show/Hide User Logs</button>
        {this.state.buttonClicked === true 
          ? <LogForm /> 
          : null
        }   
      </div>
      
    )
  }
}

class LogForm extends Component {
  
  state = {
    userId: "",
    fromDate: "",
    toDate: "",
    limit: 10,
    skip: 0,
    totalResults: 0,
    dataReturned: null,
    logData: [],
  }

  handleSubmit = async (event) => {
    //If handleSubmit was called by user clicking submit button in form
    if(event) {
      //Prevent default action
      event.preventDefault();
      //Reset skip to 0
      console.log(event.target.type)
      if(event.target.type == undefined) {
        await this.setState({skip: 0});
      }
    }
    // reset data returned state to false:
    this.setState({dataReturned: false})
    console.log(JSON.stringify(this.state), "beforefetch state")

    fetch('/api/exercise/log', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      }, 
      body: JSON.stringify(this.state),
    })
    .then(res => res.json())
    .then(res => {
      console.log(res, "afterfetch state")
      
      // update state with the returned data and set data returned flag to true
      this.setState({logData: res, dataReturned: !this.state.dataReturned, skip: res.skip, prevResults: res.prevResults, totalResults: res.totalResults})
      
     
    })
    .catch(err => console.log(err)
    )
  }
  handlePrevResultsClick = async () => {
    let skip = this.state.skip;
    let limit = this.state.limit;
    let newSkip = skip - limit

    console.log("prev results clicked");

    await this.setState({skip: newSkip, prevResults: true});
    this.handleSubmit();
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
            <h3>Find By User Id: {this.state.userId}</h3>
            <input id="uid" type="text" name="userId" placeholder="User Id"/>
            <input id="from" type="text" name="fromDate" placeholder="From date (yyyy/mm/dd)"/>
            <input id="to" type="text" name="toDate" placeholder="To date (yyyy/mm/dd)"/>
            <input type="submit" name="submitButton" value="Submit"/>
          </form>
          {this.state.dataReturned===true && this.state.logData.errorMessage === undefined
            ? <LogResults userData = {this.state.logData.userData} handlePrev = {this.handlePrevResultsClick} callBackend = {this.handleSubmit} /> 
            : null
          }
          {this.state.logData.errorMessage !== undefined
            
            ? <DisplayErrors errorMessage = {this.state.logData.errorMessage} />
            : null
          }
          {this.state.dataReturned === false
            ? <Loading />
            : null
          }
        </div>

    )
  }
}

function LogResults(props) {
  let username = props.userData.username;
  let count = props.userData.exerciseCount;
  let exerciseLogs = props.userData.exerciseLogs
  // create a jsx list of items containing all user data
  const listItems = exerciseLogs.map((item, index) => {
    return <ul key={index}>
      {/* Return username and id for each user as list items*/}
      <li>Log Id: {item._id}</li>
      <li>Log Description: {item.description}</li>
      <li>Exercise Duration (minutes): {item.duration}</li>
      <li>Date of Exercise: {item.date}</li>
    </ul>
  })
  return (
    <div>
     <h3>All Exercise logs for {username}:</h3>
      <h4>Number of entries: {count}</h4>
      {listItems}
      <button type="button" onClick={props.callBackend}>More Results</button>
      <button type="button" onClick={props.handlePrev}>Prev Results</button>
    </div>
  )
}


//Component to handle loading states when fetching data:
class Loading extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      text: 'Loading'
      };
  }
  componentDidMount() {
      const stopper = this.state.text + '...';
      this.interval = window.setInterval(() => {
      this.state.text === stopper
          ? this.setState(() => ({ text: 'Loading' }))
          : this.setState((prevState) => ({ text: prevState.text + '.' }))
      }, 300)
  }
  componentWillUnmount() {
      window.clearInterval(this.interval);
  }
  render() {
      return (
      <p>
          {this.state.text}
      </p>
      )
  }
}

function DisplayErrors(props) {
  
    return (
      <p>
        {props.errorMessage}
      </p>
    )
  
}

export default App;
