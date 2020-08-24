import React, { Component } from "react";
import axios from "axios";
import Moment from "react-moment";
import { Card, CardBody, Row, Label } from "reactstrap";
import Switch from "@material-ui/core/Switch";
class Listcoupon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couponList: [],
      vendorId: null
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(checked, id) {
    console.log(JSON.stringify(checked) + id);
    axios({
      method: "post",
      url: "http://localhost:3001/coupan/activateCoupon",
      data: { isActive: checked, _id: id },
      config: { headers: { "Content-Type": "application/json" } }
    })
      .then(function(response) {
        //handle success
        if (response.data.code === 200) {
          console.log(response.data.message);
          window.location.reload();
        } else {
          console.log(response.data.message);
        }
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  }
  componentDidMount() {
    axios({
      method: "get",
      url: "http://localhost:3001/coupon/listAllCoupan"
    })
      .then(response => {
        console.log(JSON.stringify(response));
        if (response.data.code === 200) {
          console.log(response.data.data);
          this.setState({
            couponList: response.data.data
          });
        } else {
          console.log(response.data.message);
        }
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  }
  render() {
    const couponList = this.state.couponList;
    return (
      <div className="animated fadeIn">
        {couponList.map((coupon, index) => (
          <Row xs="12" sm="6" lg="3" key={coupon._id}>
            <Card className="text-white bg-info">
              <Switch
                checked={coupon.isActive}
                onChange={() => this.handleChange(!coupon.isActive, coupon._id)}
                value="checkedB"
                color="primary"
                inputProps={{ "aria-label": "primary checkbox" }}
                key={coupon._id}
              />

              <CardBody className="pb-0">
                {coupon.couponCode}
                <br></br>
                <Label>Discount Percentage : </Label>
                &nbsp; {coupon.discount}&#37;
                <br></br>
                <Label>Max Discount : </Label>
                &nbsp;&#8377;{coupon.maxDiscount}
                <br></br>
                <Label>Valid From :</Label>
                <Moment>{coupon.startDate}</Moment> <br></br>
                <Label>Valid Till :</Label>
                <Moment>{coupon.endDate}</Moment> <br></br>
              </CardBody>
            </Card>
          </Row>
        ))}
      </div>
    );
  }
}

export default Listcoupon;
