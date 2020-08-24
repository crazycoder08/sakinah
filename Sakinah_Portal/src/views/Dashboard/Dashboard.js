import React, { Component } from "react";
import axios from "axios";
import { Col, Card, CardBody, CardFooter, CardHeader, Row } from "reactstrap";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: {},
      songFetched: [],
      revenueGenerated: {}
    };
  }

  componentDidMount() {
    console.log("data-->" + process.env.REACT_APP_BASE_URL);
    axios({
      method: "post",
      url: process.env.REACT_APP_BASE_URL + "/homescreenapi"
    })
      .then(response => {
        if (response.data.code === 200) {
          console.log(response.data.data.revenueDetail);
          this.setState({
            revenueGenerated: response.data.data.revenueDetail[0]
          });
          this.setState({ songFetched: response.data.data.songByMood });
          this.setState({
            dataList: response.data.data
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
    var dataList = this.state.dataList;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>Total User</CardHeader>
              <CardFooter>{dataList.userCount}</CardFooter>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardHeader>Total Revenue Generated Till date</CardHeader>
              <CardFooter>*data is not available</CardFooter>
              {/* <CardFooter>{this.state.revenueGenerated.total}</CardFooter> */}
            </Card>
          </Col>
          <Col>
            <Card>
              <CardHeader>Total Songs</CardHeader>
              <CardBody>
                {this.state.songFetched.map((songs, index) => (
                  <Row key={index}>
                    <Col>{songs._id}</Col>
                    <Col>{songs.count}</Col>
                  </Row>
                ))}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
