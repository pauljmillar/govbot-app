import React, { Component } from "react";
import { Form } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { invokeApig, s3Upload } from "../libs/awsLib";
import config from "../config";
import "./Notes.css";

export default class Notes extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      note: null,
      cityphone: "",
      cityname: ""
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getNote();
      this.setState({
        note: results,
        cityphone: results.cityphone,
        cityname: results.cityname
      });
    } catch (e) {
      alert(e);
    }
  }

  getNote() {
    return invokeApig({ path: `/notes/${this.props.match.params.id}` });
  }

  deleteNote() {
    return invokeApig({
      path: `/notes/${this.props.match.params.id}`,
      method: "DELETE"
    });
  }

  saveNote(note) {
    return invokeApig({
      path: `/notes/${this.props.match.params.id}`,
      method: "PUT",
      body: note
    });
  }

  validateForm() {
    return true; //this.state.content.length > 0;
  }

  formatFilename(str) {
    return str.length < 50
      ? str
      : str.substr(0, 20) + "..." + str.substr(str.length - 20, str.length);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  handleSubmit = async event => {
    let uploadedFilename;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert("Please pick a file smaller than 5MB");
      return;
    }

    this.setState({ isLoading: true });

    try {
      if (this.file) {
        uploadedFilename = (await s3Upload(this.file))
          .Location;
      }

      await this.saveNote({
        ...this.state.note,
        cityphone: this.state.cityphone,
        cityname: this.state.cityname,
        attachment: uploadedFilename || this.state.note.attachment
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteNote();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    return (
      <div className="Notes">
        {this.state.note &&
          <form onSubmit={this.handleSubmit}>
            <Form.Group controlId="cityphone">
              <Form.Control
                onChange={this.handleChange}
                value={this.state.cityphone}
                componentClass="textarea"
              />
            </Form.Group>
          <Form.Group controlId="cityname">
            <Form.Control
              onChange={this.handleChange}
              value={this.state.cityname}
              componentClass="input"
            />
            </Form.Group>
            {this.state.note.attachment}
              <Form.Group>
              <Form.Label>Attachment</Form.Label>
                <Form.Control.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.note.attachment}
                  >
                    {this.formatFilename(this.state.note.attachment)}
                  </a>
                </Form.Control.Static>
              </Form.Group>}
            <Form.Group controlId="file">
            <Form>
              {!this.state.note.attachment}
                <Form.Label>Attachment</Form.Label>
              <Form.Control onChange={this.handleFileChange} type="file" />
              </Form>
            </Form.Group>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>}
      </div>
    );
  }
}
