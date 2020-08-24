import React, { Component } from "react";
import axios from "axios";
import Switch from "react-switch";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row
} from "reactstrap";

class Subscriptionplan extends Component {
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
      subscriptionPlanList: []
    };
    this.intialState = this.state;
    this.updatePlanStatus = this.updatePlanStatus.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }
  updatePlanStatus(checked, id) {
    console.log(JSON.stringify(checked) + id);
    axios({
      method: "post",
      url: process.env.REACT_APP_BASE_URL + "/updateplanstatus",
      data: { isEnabled: checked, planId: id },
      config: { headers: { "Content-Type": "application/json" } }
    })
      .then(response => {
        //handle success
        if (response.data.code === 200) {
          console.log(response.data.msg);
          this.componentDidMount();
        } else {
          console.log(response.data.message);
        }
      })
      .catch(response => {
        //handle error
        console.log(response);
      });
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
    // if (fields["planMrp"].value === "") {
    //   formIsValid = false;
    //   errors["planMrp"] = "cannot be empty";
    // } else if (typeof fields["planMrp"].value !== "") {
    //   if (!fields["planMrp"].value.match(/^[0-9]+$/)) {
    //     formIsValid = false;
    //     errors["planMrp"] = "Only Numbers allowed";
    //   }
    // }

    console.log(errors);

    this.setState({ errors: errors });

    return formIsValid;
  }
  componentDidMount() {
    axios({
      method: "post",
      url: process.env.REACT_APP_BASE_URL + "/listallplan"
    })
      .then(response => {
        if (response.data.code === 200) {
          console.log(response.data.data);
          this.setState({
            subscriptionPlanList: response.data.data
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
        planMRP: this.state.formControls.planPrice.value,
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
  getBadge(status) {
    return status === true
      ? "success"
      : status === false
      ? "secondary"
      : status === "Pending"
      ? "warning"
      : status === "Banned"
      ? "danger"
      : "primary";
  }

  render() {
    const subscriptionPlanList = this.state.subscriptionPlanList;
    return (
      <div className="animated fadeIn">
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className={this.props.className}
        >
          <Form onSubmit={this.submitHandler}>
            <ModalHeader toggle={this.toggleModal}>
              Add Subscription Plan
            </ModalHeader>
            <ModalBody>
              <InputGroup className="mb-3">
                <Input
                  type="text"
                  name="planName"
                  placeholder="Plan Name"
                  value={this.state.formControls.planName.value}
                  onChange={this.changeHandler}
                />
                <span style={{ color: "red" }}>
                  {this.state.errors.planName}
                </span>
              </InputGroup>
              <InputGroup className="mb-3">
                <Input
                  type="text"
                  name="planValidity"
                  placeholder="Validity in days"
                  value={this.state.formControls.planValidity.value}
                  onChange={this.changeHandler}
                />
                <span style={{ color: "red" }}>
                  {this.state.errors.planValidity}
                </span>
              </InputGroup>
              <InputGroup className="mb-3">
                {/* <Input
                  type="number"
                  name="planMrp"
                  placeholder="MRP"
                  value={this.state.formControls.planMrp.value}
                  onChange={this.changeHandler}
                />
                <span style={{ color: "red" }}>
                  {this.state.errors.planMrp}
                </span> */}
                <Input
                  type="number"
                  name="planPrice"
                  placeholder="Buyers price"
                  value={this.state.formControls.planPrice.value}
                  onChange={this.changeHandler}
                />
                <span style={{ color: "red" }}>
                  {this.state.errors.planPrice}
                </span>
              </InputGroup>
            </ModalBody>

            <ModalFooter>
              <Button outline color="success">
                Add
              </Button>
              <Button color="secondary" onClick={this.toggleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
        <Container>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <Row>
                    <Col xl={6}>
                      <i className="fa fa-align-justify"></i> Subscription Plan
                      List
                    </Col>
                    <Col xl={6}>
                      <Button
                        block
                        outline
                        color="primary"
                        onClick={this.toggleModal}
                      >
                        New Plan
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th scope="col">Plan Name</th>
                        <th scope="col">Validity</th>

                        <th scope="col">Plan Price</th>
                        <th scope="col">Active/Inactive</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionPlanList.map((plan, index) => (
                        <tr key={plan._id.toString()}>
                          <td>{plan.planName}</td>
                          <td>
                            {plan.planValidity} {plan.planUnit}
                          </td>

                          <td>&#36;{plan.planPrice}</td>

                          <td>
                            <Switch
                              onChange={() =>
                                this.updatePlanStatus(!plan.isEnabled, plan._id)
                              }
                              checked={plan.isEnabled}
                            />
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

export default Subscriptionplan;
