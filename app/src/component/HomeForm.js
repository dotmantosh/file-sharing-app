import React, { Component } from "react";
import _ from "lodash";
import classNames from "classnames";
import { upload } from "../helpers/upload"
import propTypes from "prop-types"

class HomeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        files: [],
        to: "",
        from: "",
        message: ""
      },
      errors: {
        files: null,
        to: null,
        from: null,
        message: null
      }
    };

    this.onTextChange = this.onTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.formValidation = this.formValidation.bind(this);
    this.onFileAdded = this.onFileAdded.bind(this);
    this.onFileRemove = this.onFileRemove.bind(this);
  }

  isEmail(emailAddress) {
    const emailRejex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    return emailRejex.test(emailAddress);
  }

  formValidation(fields = [], callback = () => { }) {
    let { form, errors } = this.state;

    const validations = {
      from: [
        {
          errorMessage: "Email is required",
          isValid: () => {
            return form.from.length;
          }
        },
        {
          errorMessage: "Email is not valid",
          isValid: () => {
            return this.isEmail(form.from);
          }
        }
      ],

      to: [
        {
          errorMessage: "Email is required",
          isValid: () => {
            return form.to.length;
          }
        },
        {
          errorMessage: "Email is not valid",
          isValid: () => {
            return this.isEmail(form.to);
          }
        }
      ],
      files: [
        {
          errorMessage: "Email is required",
          isValid: () => {
            return form.files.length;
          }
        },
        {
          errorMessage: "Email is not valid",
          isValid: () => {
            return form.files;
          }
        }
      ]
    };

    _.each(fields, field => {
      let fieldValidations = _.get(validations, field, []);
      errors[field] = null;

      _.each(fieldValidations, fieldValidation => {
        const isValid = fieldValidation.isValid();

        if (!isValid) {
          errors[field] = fieldValidation.errorMessage;
        }
      });
    });

    this.setState(errors, () => {
      let isValid = true;
      _.each(errors, err => {
        if (err !== null) {
          isValid = false;
        }
      });
      return callback(isValid);
    });
  }

  onFileAdded(event) {
    let files = [];

    _.each(_.get(event, "target.files", []), file => {
      files.push(file);
    });
    //Object.assign(this.State.form, {files})
    this.setState(
      {
        form: {
          ...this.state.form,
          files: files
        }
      },
      () => {
        this.formValidation(["files"], isValid => { });
      }
    );
  }

  onFileRemove(key) {
    let { files } = this.state.form;
    files.splice(key, 1);

    this.setState({
      form: {
        ...this.state.form,
        files
      }
    });
  }
  onSubmit(event) {
    event.preventDefault();
    this.formValidation(["from", "to", "files"], isValid => {

      if (isValid) {
        if (this.props.onUploadBegin) {
          this.props.onUploadBegin(this.state.form)
        }
        upload(this.state.form, (event) => {
          if (this.props.onUploadEvent) {
            this.props.onUploadEvent(event);
          }
        })
      }
    });
  }

  onTextChange(event) {
    let { form } = this.state;

    const inputName = event.target.name;
    const inputValue = event.target.value;

    form[inputName] = inputValue;
    this.setState({ form });
  }

  render() {
    const { form, errors } = this.state;
    const { files } = form;
    return (
      <div className='content'>
        <div className='card'>
          <form onSubmit={this.onSubmit}>
            <div className='card__header'>
              <div className='card__header--inner'>
                {files.length ? (
                  <div className='selected-files'>
                    {files.map((file, index) => {
                      return (
                        <div key={index} className='selected-files__item'>
                          <div className='filename'>{file.name}</div>
                          <div className='file-action'>
                            <button
                              onClick={() => this.onFileRemove(index)}
                              type='button'
                              className='file-remove'
                            >
                              x
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
                <div
                  className={classNames("select-file", {
                    "error": _.get(errors, "files")
                  })}
                >
                  <label htmlFor='input-file'>
                    <input
                      onChange={this.onFileAdded}
                      type='file'
                      id='input-file'
                      multiple={true}
                    ></input>
                    {files.length ? (
                      <span className='upload-description text-uppercase'>
                        Add more files
                      </span>
                    ) : (
                        <span>
                          <span className='upload-icon'><i className='icon-picture-streamline' /></span>
                          <span className='upload-description'>
                            Drag and drop your files or click here
                        </span>
                        </span>
                      )}
                  </label>
                </div>
              </div>
            </div>

            <div className='card__content'>
              <div className='card__content--inner'>
                <div className={classNames('app-form-item', { 'error': _.get(errors, 'to') })}>
                  <label htmlFor='to'>Send to</label>
                  <input
                    type='text'
                    id='to'
                    name='to'
                    value={form.to}
                    placeholder={_.get(errors, 'from') ? _.get(errors, 'from') : 'Email address'}
                    onChange={this.onTextChange}
                  />
                </div>
                <div className={classNames('app-form-item', { 'error': _.get(errors, 'from') })}>
                  <label htmlFor='from'>Send from</label>
                  <input
                    type='text'
                    id='from'
                    name='from'
                    placeholder={_.get(errors, 'from') ? _.get(errors, 'from') : 'Your email address'}
                    value={form.from}
                    onChange={this.onTextChange}
                  />
                </div>
                <div className='app-form-item'>
                  <label htmlFor='message'>Message</label>
                  <textarea
                    id='message'
                    name='message'
                    placeholder='Add a note (optional)'
                    value={form.message}
                    onChange={this.onTextChange}
                  ></textarea>
                </div>
                <div className='app-form-item'>
                  <button type='submit' className='app-btn app-btn__primary'>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

HomeForm.propTypes = {
  onUploadBegin: propTypes.func,
  onUploadEvent: propTypes.func
}
export default HomeForm;
