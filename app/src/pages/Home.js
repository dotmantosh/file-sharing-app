import React, { Component } from 'react'
import Header from '../component/Header'
import HomeForm from '../component/HomeForm'
import HomeUploading from '../component/HomeUploading'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      componentName: 'HomeForm',
      data: null,
      uploadEvent: null
    }

    this.renderComponent = this.renderComponent.bind(this)
  }


  renderComponent() {
    const { componentName, data, uploadEvent } = this.state
    switch (componentName) {
      case 'HomeUploading':
        return <HomeUploading event={uploadEvent} data={data} />

      default:
        return <HomeForm
          onUploadEvent={(event) => {
            this.setState({
              uploadEvent: event
            })
          }}
          onUploadBegin={(data) => {
            this.setState({
              data: data,
              componentName: 'HomeUploading'
            })
          }} />
    }
  }

  render() {
    return (
      <div className='container'>
        <Header />
        <div className='content'>
          {this.renderComponent()}
        </div>
      </div>

    )
  }
}

export default Home