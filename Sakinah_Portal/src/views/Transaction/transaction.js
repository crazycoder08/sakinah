import React, { Component } from "react";
import axios from "axios";

import Moment from "react-moment";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Col,
  Container,
  Row
} from "reactstrap";

class Transaction extends Component {
  constructor() {
    super();
    this.state = {
      formControls: {
        planName: { value: "" },
        planValidity: { value: "" },
        planPrice: { value: "" },
        planMrp: { value: "" }
      },
      errors: {},
      transactionList: []
    };
    this.intialState = this.state;
    this.toggleModal = this.toggleModal.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  handleValidation() {
    let fields = this.state.formControls;
    let errors = {};
    let formIsValid = true;
    //priority

    //title

    if (fields["planName"].value === "") {
      formIsValid = false;
      errors["planName"] = "cannot be empty";
    }
    if (fields["planValidity"].value === "") {
      formIsValid = false;
      errors["planValidity"] = "cannot be empty";
    } else if (typeof fields["planValidity"].value !== "") {
      if (!fields["planValidity"].value.match(/^[0-9]+$/)) {
        formIsValid = false;
        errors["planValidity"] = "Only Numbers allowed";
      }
    }
    if (fields["planPrice"].value === "") {
      formIsValid = false;
      errors["planPrice"] = "cannot be empty";
    } else if (typeof fields["planPrice"].value !== "") {
      if (!fields["planPrice"].value.match(/^[0-9]+$/)) {
        formIsValid = false;
        errors["planPrice"] = "Only Numbers allowed";
      }
    }
    if (fields["planMrp"].value === "") {
      formIsValid = false;
      errors["planMrp"] = "cannot be empty";
    } else if (typeof fields["planMrp"].value !== "") {
      if (!fields["planMrp"].value.match(/^[0-9]+$/)) {
        formIsValid = false;
        errors["planMrp"] = "Only Numbers allowed";
      }
    }

    console.log(errors);

    this.setState({ errors: errors });

    return formIsValid;
  }
  componentDidMount() {
    axios({
      method: "post",
      url: process.env.REACT_APP_BASE_URL + "/listalltransaction"
    })
      .then(response => {
        if (response.data.code === 200) {
          console.log(response.data.data);
          this.setState({
            transactionList: response.data.data
          });
        } else {
          console.log(response.data.msg);
        }
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  }
  resetState = () => {
    this.setState({ formControls: this.intialState.formControls });
    window.location.reload();
  };
  resetStateWithUpdates(stateUpdates = {}) {
    // Rest operators ensure a new object with merged properties and values.
    // Requires the "transform-object-rest-spread" Babel plugin
    this.setState({ ...this.formControls, ...stateUpdates });

    this.componentDidMount();
  }
  submitHandler = event => {
    event.preventDefault();
    if (this.handleValidation()) {
      var productobj = {
        planName: this.state.formControls.planName.value,
        planValidity: this.state.formControls.planValidity.value,
        planPrice: this.state.formControls.planPrice.value,
        planMRP: this.state.formControls.planMrp.value,
        isEnabled: true,
        currencyUnit: "usd",
        planUnit: "days"
      };
      var self = this;
      axios({
        method: "post",
        url: process.env.REACT_APP_BASE_URL + "/addplan",
        data: productobj,
        config: { headers: { "Content-Type": "application/json" } }
      })
        .then(function(response) {
          //handle success
          if (response.data.code === 200) {
            self.resetState();
          } else {
            console.log(response.data.message);
          }
        })
        .catch(function(response) {
          //handle error
          console.log(response);
        });
    }
  };
  toggleModal() {
    this.setState({
      modal: !this.state.modal,
      progress: 0
    });
  }
  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      formControls: {
        ...this.state.formControls,
        [name]: {
          ...this.state.formControls[name],
          value
        }
      }
    });
  };

  render() {
    const transactionList = this.state.transactionList;
    return (
      <div className="animated fadeIn">
        <Container>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <Row>
                    <Col xl={6}>
                      <i className="fa fa-align-justify"></i> Transaction list
                      List
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th scope="col">Transaction #</th>
                        <th scope="col">User</th>
                        <th scope="col">SubscriptionPlan</th>
                        <th scope="col">Payment Gateway</th>
                        <th scope="col">Transaction Date</th>
                        <th scope="col">Valid From</th>
                        <th scope="col">Valid Till</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionList.map((data, index) => (
                        <tr key={data._id.toString()}>
                          <td>{data._id}</td>
                          <td>
                            {data.userInfo.firstName} {data.userInfo.lastName}
                          </td>
                          <td>{data.subscriptionPlanInfo.planName}</td>
                          <td>{data.paymentGateway}</td>
                          <td>
                            <Moment format="YYYY-MM-DD HH:mm">
                              {data.transactionDate}
                            </Moment>
                          </td>
                          <td>
                            <Moment format="YYYY-MM-DD HH:mm">
                              {data.planValidFrom}
                            </Moment>
                          </td>
                          <td>
                            <Moment format="YYYY-MM-DD HH:mm">
                              {data.planValidTill}
                            </Moment>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Transaction;
