import React, { Component } from "react";

import axios from "axios";

import ReactTable from "react-table";
import "react-table/react-table.css";

class Users extends Component {
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
      userList: []
    };
    this.intialState = this.state;
  }

  componentDidMount() {
    axios({
      method: "post",
      url: process.env.REACT_APP_BASE_URL + "/listalluser"
    })
      .then(response => {
        if (response.data.code === 200) {
          console.log(response.data.data);
          this.setState({
            userList: response.data.data
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
  render() {
    const userList = this.state.userList;

    return (
      <div className="animated fadeIn">
        {/* <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Users{" "}
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Mobile</th>
                      <th scope="col">Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, index) => (
                      <UserRow key={index} user={user} />
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row> */}
        <ReactTable
          ref={r => (this.reactTable = r)}
          data={userList}
          filterable
          filtered={this.state.filtered}
          // onFilteredChange={(filtered, column, value) => {
          //   this.onFilteredChangeCustom(value, column.id || column.accessor);
          // }}
          getTrProps={(state, rowInfo) => ({
            onClick: () => {
              this.navigateHandler(rowInfo.row._original);
            }
          })}
          defaultFilterMethod={(filter, row, column) => {
            const id = filter.pivotId || filter.id;

            if (typeof filter.value === "object") {
              return row[id] !== undefined
                ? filter.value.indexOf(row[id]) > -1
                : true;
            } else {
              return row[id] !== undefined
                ? // ? String(row[id]).indexOf(filter.value) > -1
                  // : true;
                  String(row[id])
                    .toLowerCase()
                    .startsWith(filter.value.toLowerCase())
                : true;
            }
          }}
          columns={[
            {
              Header: "Sr No.",
              id: "row",
              maxWidth: 50,
              filterable: false,
              Cell: row => {
                return <div>{row.viewIndex + 1}</div>;
              }
            },
            {
              id: "name",
              Header: "Name",
              filterable: false,
              accessor: d => d.firstName + " " + d.lastName
            },
            {
              Header: "Email",
              accessor: "email",
              filterable: false
            },
            {
              Header: "Mobile",
              accessor: "mobile",
              filterable: false
            },
            {
              id: "verified",
              Header: "Verified",
              filterable: false,
              accessor: d => d.isVerified.toString()
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

export default Users;
