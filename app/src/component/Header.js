import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      <div className='header'>
        <div className='site-info'></div>
        <h1 className='site-info__name'>Dotted-Dice Save Share App</h1>
        <h2 className='site-info__title'>Save for later and Share your file</h2>
        <h5 className='site-info__slogan'>Fast, Safe and Secure</h5>
      </div>
    );
  }
}

export default Header;
