import React, { Component } from "react";
import Header from "../component/Header";
import HomeForm from "../component/HomeForm";
class App extends Component {
  render() {
    return (
      <div className='app-layout'>
        <div className='container'>
          <Header />
          <HomeForm />
        </div>
      </div>
    );
  }
}

export default App;
