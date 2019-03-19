import React, { Component } from 'react';
import './App.css';


function UserList(props) {
  const listItems = props.userData.map((item, index) => {
    return <ul key={index}>
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
    data: [],
    hasData: false,
  };

  componentDidMount() {
    //Get data from the backend api server
    this.callBackendApi()
      //Update the state data with the new data 
      .then(res => {
        let returnArr = res.map(val => {
          return val;
        });
        console.log(returnArr);
        this.setState({data: returnArr});
        this.setState({hasData: true});
        //console.log(this.state.data[0].username)
      })
      //try setstate > data: JSON.parse(res.users)
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
        {this.state.hasData === false 
          ? <p>No data yet</p>
          : <UserList userData = {this.state.data}/>
        }
      </div>
    );
  }
}

export default App;
