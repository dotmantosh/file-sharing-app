import React, { Component } from 'react'
import propTypes from 'prop-types'
import _ from 'lodash'
import betterNumber from '../helpers/betterNumber'
class HomeUploading extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      loaded: 0,
      total: 0,
      percentage: 0
    }
  }

  componentDidMount() {
    const { data } = this.props;
    this.setState({
      data: data
    })
  }

  componentWillReceiveProps(nextProps) {
    const { event } = nextProps;
    if (event.type === 'onUploadProgress') {
      let loaded = _.get(event, 'payload.loaded', 0)
      let total = _.get(event, 'payload.total', 0)
      let percentage = total !== 0 ? (loaded / total) * 100 : 0

      this.setState({
        loaded: loaded,
        total: total,
        percentage: percentage
      })
    }

    this.setState = {
      event: event
    }
  }

  render() {
    let { percentage, data, total, loaded } = this.state;
    const totalFile = _.get(data, 'files', []).length;

    return (
      <div className='card card__uploading'>

        <div className='card__content'>
          <div className='card__content--inner'>
            <div className='home-uploading'>
              <div className='home-uploading__icon'>
                <i className='icon-upload-cloud' />
                <h2>sending...</h2>
              </div>

              <div className='upload-files-total'>Uploading {totalFile} files</div>
              <div className='progress'>
                <span style={{ width: `${percentage}%` }} className='progress__bar'></span>
              </div>
              <div className='upload-stat'>
                <div className='upload-stat__left'>{betterNumber(loaded)}/{betterNumber(total)}</div>
                <div className='upload-stat__right'>450K/s</div>
              </div>
              <div className='upload-cancel-action'>
                <button className='app-btn' type='button'>Cancle</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

HomeUploading.propTypes = {
  data: propTypes.object,
  event: propTypes.object
}

export default HomeUploading