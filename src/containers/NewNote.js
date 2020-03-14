import React, { Component } from "react";
import { Form } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { invokeApig, s3Upload } from "../libs/awsLib";
import config from "../config";
import "./NewNote.css";

export default class NewNote extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      content: "",
      cityname: ""
    };
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  createNote(note) {
    return invokeApig({
      path: "/notes",
      method: "POST",
      body: note
    });
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
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert("Please pick a file smaller than 5MB");
      return;
    }

    this.setState({ isLoading: true });

    try {
      const uploadedFilename = this.file
        ? (await s3Upload(this.file)).Location
        : null;

      await this.createNote({
        content: this.state.content,
        cityname: this.state.cityname,
        attachment: uploadedFilename
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div className="NewNote">
        <form onSubmit={this.handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              onChange={this.handleChange}
              value={this.state.content}
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
          <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
            <Form.Control onChange={this.handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}
