import React, { Component } from "react";

//import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
import axios from "axios";
// import { Redirect } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errors: {}
    };
    this.login = this.login.bind(this);
  }
  login = event => {
    event.preventDefault();

    const email = this.state.email;
    const password = this.state.password;
    var loginobj = {
      email: email,
      password: password
    };
    //alert(JSON.stringify(process.env));
    axios({
      method: "post",
      url: process.env.REACT_APP_BASE_URL + "/login",
      data: loginobj,
      config: { headers: { "Content-Type": "application/json" } }
    })
      .then(response => {
        //handle success
        console.log(response.data);
        if (response.data.code === 200) {
          // console.log(JSON.stringify(response.data));
          localStorage.setItem("token", response.data.token);
          axios.defaults.headers.common["token"] = response.data.token;
          window.location.href = "/#/dashboard";
        } else {
          console.log(response.data.msg);
          var errors = {};
          errors["login"] = response.data.msg;

          this.setState({ errors: errors });
        }
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };
  handleChange = event => {
    const target = event.target;
    const field = target.name;
    const value = target.value;

    //const errors = runValidationRules(target, this.state.errors);

    this.setState({
      [field]: value
    });
  };
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.login}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          name="email"
                          value={this.state.email || ""}
                          onChange={this.handleChange}
                          id="email"
                          placeholder="Enter your email address."
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          name="password"
                          value={this.state.password || ""}
                          onChange={this.handleChange}
                          id="password"
                          placeholder="Enter your password."
                        />
                      </InputGroup>
                      <InputGroup className="mb-4" style={{ color: "red" }}>
                        {this.state.errors.login}
                      </InputGroup>

                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4">
                            Login
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
