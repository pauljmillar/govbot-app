import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Panel, ListGroupItem } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Alert, Form, Button, FormGroup, FormControl, ControlLabel, Checkbox } from "react-bootstrap";
import { invokeApig } from '../libs/awsLib';
import "./Home.css";

const alertInstance = (
  <Alert bsStyle="success">
    <strong>Update saved!</strong>
  </Alert>
);


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      govs: [],
      govId: "",
      cityphone: "",
      cityname: "",
      createdAt: "",
      updatedAt: "",
      cityemail: "",
      violationofficehours: "",
      violationpay: "",
      violationcontest: "",
      violationmissed: "",
      violationlost: "",
      gethours: "",
      goodbye: "",
      reportgraffiti: "",
      reportstreetlight: "",
      reportpothole: "",
      waterservicestart: "",
      waterservicestop: "",
      waterservicepay: "",
      waterservicedetails: "",
      howareyou: "",
      intromessage: "",
      showsaved: false
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    var results;
    try {
      console.log('right before usergovresult');
      var usergovresult = await this.usergov();

      console.log('usergovresult'+usergovresult.govId);

      if (!usergovresult.govId){
        console.log('govId not found');

        //create new
        results = await this.newgov();
        this.setState({ govId: results.govId });

        usergovresult = await this.newusergov();
      } else {
        console.log('govId found');
        this.setState({ govId: usergovresult.govId });
        //var results = await this.govs();

      //this.setState({ govId: usergovresult.govId });

      results = await this.govs();


      //if no record exists, create an empty insert that will have a cust id at least
      //alert('before check'+ results.length);
      /**if (results.length < 1){
        //alert('results.length < 1'+ results.length);

        //create new
        results = await this.newgov();
        //now fetch
        results = await this.govs();
      }**/

      this.setState({ govs: results,
                    cityphone: results.cityphone ? results.cityphone : '',
                    cityname: results.cityname ? results.cityname : '',
                    cityemail: results.cityemail ? results.cityemail : '',
                    sourceurl: results.sourceurl ? results.sourceurl : '',
                    createdAt: results.createdAt ? results.createdAt : '',
                    updatedAt: results.updatedAt ? results.updatedAt : '',
                    //govId: results[0].govId,
                    violationofficehours: results.violationofficehours ? results.violationofficehours : '',
                    violationpay: results.violationpay ? results.violationpay : '',
                    violationcontest: results.violationcontest ? results.violationcontest : '',
                    violationmissed: results.violationmissed ? results.violationmissed : '',
                    violationlost: results.violationlost ? results.violationlost : '',
                    //intro
                    howareyou: results.howareyou ? results.howareyou : '',
                    intromessage: results.intromessage ? results.intromessage : '',
                    gethours: results.gethours ? results.gethours : '',
                    goodbye: results.goodbye ? results.goodbye : '',
                    reportgraffiti: results.reportgraffiti ? results.reportgraffiti : '',
                    reportstreetlight: results.reportstreetlight ? results.reportstreetlight : '',
                    reportpothole: results.reportpothole ? results.reportpothole : '',
                    waterservicestart: results.waterservicestart ? results.waterservicestart : '',
                    waterservicestop: results.waterservicestop ? results.waterservicestop : '',
                    waterservicepay: results.waterservicepay ? results.waterservicepay : '',
                    waterservicedetails: results.waterservicedetails ? results.waterservicedetails : ''

                    });
      }
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  govs() {
    return invokeApig({ path: `/govs/${this.state.govId}` });
  }

  usergov() {
    return invokeApig({ path: "/usergov/1" });
  }

  newgov() {
    //return invokeApig({ path: "/govs/new" });
      return invokeApig({
      path: "/govs",
      method: "POST",
      body: {"cityname": " ", "cityemail": " "}
    });
  }

    newusergov() {
    //return invokeApig({ path: "/govs/new" });
      return invokeApig({
      path: "/usergov",
      method: "POST",
      body: {"govId": `${this.state.govId}`}
    });
  }

  savegov(gov) {
    return invokeApig({
      path: `/govs/${this.state.govId}`,
      method: "PUT",
      body: gov
    });
  }


  handlegovClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

   handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {

      await this.savegov({
        govId: this.state.govId,
        cityphone: this.state.cityphone,
        cityemail: this.state.cityemail,
        sourceurl: this.state.sourceurl,
        cityname: this.state.cityname,
        violationofficehours: this.state.violationofficehours,
        violationpay: this.state.violationpay,
        violationcontest: this.state.violationcontest,
        violationmissed: this.state.violationmissed,
        violationlost: this.state.violationlost,
        howareyou: this.state.howareyou,
        intromessage: this.state.intromessage,
        gethours: this.state.gethours,
        goodbye: this.state.goodbye,
        reportgraffiti: this.state.reportgraffiti,
        reportstreetlight: this.state.reportstreetlight,
        reportpothole: this.state.reportpothole,
        waterservicestart: this.state.waterservicestart,
        waterservicestop: this.state.waterservicestop,
        waterservicepay: this.state.waterservicepay,
        waterservicedetails: this.state.waterservicedetails

      });
      this.props.history.push("/");
      this.setState({ showsaved: true });

    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
      showsaved: false
    });
  }



  rendergovsList2(govs) {

    if (govs.length > 0) {
      return (
           <ListGroupItem
              key={govs[0].govId}
              href={`/govs/${govs[0].govId}`}
              onClick={this.handlegovClick}
              //header={gov.cityphone.trim().split("\n")[0]}
              header={govs[0].cityphone}
            >
              {"Created: " + new Date(govs[0].createdAt).toLocaleString()}
           </ListGroupItem>
    );
    } else {
      return (
        <ListGroupItem
              key="new"
              href="/govs/new"
              onClick={this.handlegovClick}
            >
              <h4>
                <b>{"\uFF0B"}</b> Create a new gov
              </h4>
        </ListGroupItem>
    );

  }
}

  rendergovsList(govs) {
    return [{}].concat(govs).map(
      (gov, i) =>
        i !== 0
          ? <ListGroupItem
              key={gov.govId}
              href={`/govs/${gov.govId}`}
              onClick={this.handlegovClick}
              header={gov.cityphone.trim().split("\n")[0]}
            >
              {"Created: " + new Date(gov.createdAt).toLocaleString()}
            </ListGroupItem>
          : <ListGroupItem
              key="new"
              href="/govs/new"
              onClick={this.handlegovClick}
            >
              <h4>
                <b>{"\uFF0B"}</b> Create a new gov
              </h4>
            </ListGroupItem>
    );
  }

  renderLander() {
      this.props.history.push("/login");

    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A pretty simple gov taking app</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  rendergovs() {
    return (
      <div className="govs">
        <h1>Your Bot Config</h1>
        <Panel header={<div><h4>This is your key: {this.state.govId}.</h4></div>}>
<p>Copy and paste the following code snippet into the body of your html page:</p>
<code>&lt;div id="govbot"&gt;&lt;/div&gt;</code><br/>
<code>&lt;script src="http://dev.getgovbot.com/govbot.prod.js"&gt;&lt;/script&gt;</code><br/>
<code>&lt;script&gt;</code><br/>
<code>&nbsp;&nbsp;var myGovbot = BotLib.GB.new();</code><br/>
<code>&nbsp;&nbsp;myGovbot.render&#40;&#123; govId &#58; &#34;{this.state.govId}&#34; &#125;&#41;&#59;</code><br/>
<code>&lt;/script&gt;</code>
        </Panel>


        { this.state.showsaved ? alertInstance : null }


  <Panel  header="Municipal Profile Info"  defaultExpanded={true}>
  <form horizontal="true" onSubmit={this.handleSubmit}>
    <FormGroup controlId="cityname">
    <ControlLabel>cityname</ControlLabel>
      <Col sm={10}>
        <FormControl type="input" placeholder="Chicago" onChange={this.handleChange} value={this.state.cityname} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup controlId="cityphone">
    <ControlLabel>cityphone</ControlLabel>
      <Col sm={10}>
        <FormControl type="input" placeholder="111-222-3333" onChange={this.handleChange} value={this.state.cityphone} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup controlId="cityemail">
      <ControlLabel>cityemail</ControlLabel>
      <Col sm={10}>
        <FormControl type="input" placeholder="admin@city.gov" onChange={this.handleChange} value={this.state.cityemail} componentClass="input"/>
      </Col>
    </FormGroup>



    <FormGroup controlId="gethours">
    <ControlLabel>gethours</ControlLabel>
      <Col sm={10}>
        <FormControl type="input" placeholder="city.gov" onChange={this.handleChange} value={this.state.gethours} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup>
    <Checkbox defaultChecked >
      Remember Me
    </Checkbox>
    </FormGroup>

    <FormGroup>
      <Col smOffset={2} sm={10}>
        <Button type="submit">
          Update
        </Button>
              {"Updated: " + new Date(this.state.updatedAt).toLocaleString()}

      </Col>
    </FormGroup>
  </form>
  </Panel>


  <Panel  header="About your bot" >
  <form horizontal="true" onSubmit={this.handleSubmit}>
    <FormGroup controlId="howareyou">
    <ControlLabel>howareyou</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="Hello. How can I help you today?" onChange={this.handleChange} value={this.state.howareyou} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup controlId="intromessage">
    <ControlLabel>intromessage</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="111-222-3333" onChange={this.handleChange} value={this.state.intromessage} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup controlId="goodbye">
    <ControlLabel>goodbye</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="111-222-3333" onChange={this.handleChange} value={this.state.goodbye} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup>
      <Col smOffset={2} sm={10}>
        <Button type="submit">
          Save
        </Button>

      </Col>
    </FormGroup>
  </form>
  </Panel>


  <Panel header="Parking" >
  <form horizontal="true" onSubmit={this.handleSubmit}>
    <FormGroup controlId="violationofficehours">
    <ControlLabel>violationofficehours</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="111-222-3333" onChange={this.handleChange} value={this.state.violationofficehours} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup controlId="violationpay">
    <ControlLabel>violationpay</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="111-222-3333" onChange={this.handleChange} value={this.state.violationpay} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup controlId="violationcontest">
    <ControlLabel>violationcontest</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="111-222-3333" onChange={this.handleChange} value={this.state.violationcontest} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup controlId="violationlost">
    <ControlLabel>violationlost</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="111-222-3333" onChange={this.handleChange} value={this.state.violationlost} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup controlId="violationmissed">
    <ControlLabel>violationmissed</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="111-222-3333" onChange={this.handleChange} value={this.state.violationmissed} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup>
    <Checkbox defaultChecked >
      Checkbox
    </Checkbox>
    </FormGroup>

    <FormGroup>
      <Col smOffset={2} sm={10}>
        <Button type="submit">
          Save
        </Button>

      </Col>
    </FormGroup>
  </form>
  </Panel>

  <Panel  header="Water Service and Billing Questions"  >
  <form horizontal="true" onSubmit={this.handleSubmit}>
    <FormGroup controlId="waterservicestart">
    <ControlLabel>waterservicestart</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="Chicago" onChange={this.handleChange} value={this.state.waterservicestart} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup controlId="waterservicestop">
    <ControlLabel>waterservicestop</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="You can request a stop to your.." onChange={this.handleChange} value={this.state.waterservicestop} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup controlId="waterservicepay">
    <ControlLabel>waterservicepay</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="admin@city.gov" onChange={this.handleChange} value={this.state.waterservicepay} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup controlId="waterservicedetails">
    <ControlLabel>waterservicedetails</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="city.gov" onChange={this.handleChange} value={this.state.waterservicedetails} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup>
      <Col smOffset={2} sm={10}>
        <Button type="submit">
          Update
        </Button>
              {"Updated: " + new Date(this.state.updatedAt).toLocaleString()}

      </Col>
    </FormGroup>
  </form>
  </Panel>



  <Panel header="Things to Report"  >
  <form horizontal="true" onSubmit={this.handleSubmit}>
    <FormGroup controlId="reportpothole">
    <ControlLabel>reportpothole</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="Chicago" onChange={this.handleChange} value={this.state.reportpothole} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup controlId="reportstreetlight">
    <ControlLabel>reportstreetlight</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="You can request a stop to your.." onChange={this.handleChange} value={this.state.reportstreetlight} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup controlId="reportgraffiti">
    <ControlLabel>reportgraffiti</ControlLabel>

      <Col sm={10}>
        <FormControl type="input" placeholder="admin@city.gov" onChange={this.handleChange} value={this.state.reportgraffiti} componentClass="input"/>
      </Col>
    </FormGroup>

    <FormGroup>
      <Col smOffset={2} sm={10}>
        <Button type="submit">
          Update
        </Button>
              {"Updated: " + new Date(this.state.updatedAt).toLocaleString()}

      </Col>
    </FormGroup>
  </form>
  </Panel>

      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.rendergovs() : this.renderLander()}
      </div>
    );
  }
}
