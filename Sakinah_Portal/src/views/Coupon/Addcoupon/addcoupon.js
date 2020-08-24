import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  // CardGroup,
  CardHeader,
  Label,
  Col,
  Container,
  Form,
  FormGroup,
  Badge,
  CardFooter,
  FormText,

  //  Label,
  Input

  // InputGroupAddon,
  // InputGroupText,
} from "reactstrap";
//import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";

// const options = {
//   tooltips: {
//     enabled: false,
//     custom: CustomTooltips
//   },
//   maintainAspectRatio: false
// };

class Addcoupon extends Component {
  constructor() {
    super();
    this.state = {
      formControls: {
        coupon_code: { value: "" },
        discount: { value: "" },
        isActive: { value: "" },
        is_user_based: { value: Boolean },
        is_time_based: { value: Boolean },
        start_date: { value: "" },
        end_date: { value: "" },
        max_discount: { value: "" },
        is_expired: { value: Boolean }
      },
      productList: []
    };
    this.intialState = this.state;
  }
  resetState = () => {
    this.setState({ formControls: this.intialState.formControls });
    window.location.reload();
  };
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
  submitHandler = event => {
    event.preventDefault();
    console.log(JSON.stringify(this.state.formControls));
    var couponobj = {
      coupon_code: this.state.formControls.coupon_code.value,
      discount: this.state.formControls.discount.value,
      is_user_based: this.state.formControls.is_user_based.value,
      is_time_based: this.state.formControls.is_time_based.value,
      start_date: this.state.formControls.start_date.value,
      end_date: this.state.formControls.end_date.value,
      max_discount: this.state.formControls.max_discount.value,
      isActive: true,
      is_expired: false
    };
    var self = this;
    axios({
      method: "post",
      url: "http://localhost:3001/coupan/addNewCoupan",
      data: couponobj,
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
  };
  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>Coupon Creation Form</strong>
          </CardHeader>
          <CardBody>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Coupon Code</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input
                    type="text"
                    id="text-input"
                    name="coupon_code"
                    placeholder="Coupon Code"
                    value={this.state.formControls.coupon_code.value}
                    onChange={this.changeHandler}
                  />
                  <FormText color="muted">This data should be unique</FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="email-input">Discount %</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input
                    type="number"
                    id="discount"
                    name="discount"
                    placeholder="Enter discount"
                    value={this.state.formControls.discount.value}
                    onChange={this.changeHandler}
                  />
                  <FormText className="help-block">
                    Enter discount to be availed on this coupon
                  </FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="password-input">Max Amount</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input
                    type="number"
                    id="max_discount"
                    name="max_discount"
                    placeholder="maximum amount"
                    value={this.state.formControls.max_discount.value}
                    onChange={this.changeHandler}
                  />
                  <FormText className="help-block">
                    Please enter a maximum amount to be availed
                  </FormText>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label>Time Bound</Label>
                </Col>
                <Col md="9">
                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="inline-radio1"
                      name="is_time_based"
                      value="true"
                      onChange={this.changeHandler}
                    />
                    <Label
                      className="form-check-label"
                      check
                      htmlFor="inline-radio1"
                    >
                      Limited
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="inline-radio2"
                      name="is_time_based"
                      value="false"
                      onChange={this.changeHandler}
                    />
                    <Label
                      className="form-check-label"
                      check
                      htmlFor="inline-radio2"
                    >
                      Forever
                    </Label>
                  </FormGroup>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="date-input">Valid from</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input
                    type="date"
                    id="date-input"
                    name="start_date"
                    placeholder="Start date"
                    value={this.state.formControls.start_date.value}
                    onChange={this.changeHandler}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="date-input">Valid till</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input
                    type="date"
                    id="end-date-input"
                    name="end_date"
                    placeholder="End date"
                    value={this.state.formControls.end_date.value}
                    onChange={this.changeHandler}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label>Applicable for</Label>
                </Col>
                <Col md="9">
                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="applicable"
                      name="is_user_based"
                      value="false"
                      onChange={this.changeHandler}
                    />
                    <Label
                      className="form-check-label"
                      check
                      htmlFor="applicable"
                    >
                      General
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="applicable1"
                      name="is_user_based"
                      value="true"
                      onChange={this.changeHandler}
                    />
                    <Label
                      className="form-check-label"
                      check
                      htmlFor="applicable1"
                    >
                      User Specific
                    </Label>
                  </FormGroup>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
          <CardFooter>
            <Button
              type="submit"
              size="sm"
              color="primary"
              onClick={this.submitHandler}
            >
              <i className="fa fa-dot-circle-o"></i> Submit
            </Button>
            <Button type="reset" size="sm" color="danger">
              <i className="fa fa-ban"></i> Reset
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

export default Addcoupon;
