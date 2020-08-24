import React, { Component } from "react";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
//import fire from "../../fire";
import { storage } from "../../fire";
import {
  Col,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  Input,
  InputGroup,
  Container,
  CardImg,
  Label
} from "reactstrap";
import Switch from "react-switch";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class Moods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moodsList: [],
      modal: false,
      editmodal: false,
      moodsId: null,
      errors: {},
      image: {},
      updateimage: null,
      fileUrl: null,
      updatefileUrl: null,
      loading: false,
      moodsformControls: {
        moodName: { value: "" },
        moodImage: { value: "" }
      },
      updatemoodsformControls: {
        moodName: { value: "" },
        moodImage: { value: "" },
        moodId: { value: "" }
      },
      progress: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleSetEditModal = this.toggleSetEditModal.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.deleteMood = this.deleteMood.bind(this);
    this.submitUpdateHandler = this.submitUpdateHandler.bind(this);
    this.updatechangeHandler = this.updatechangeHandler.bind(this);
    // this.navigateHandler = this.navigateHandler.bind(this);
  }
  toggleModal() {
    this.setState({
      modal: !this.state.modal,
      progress: 0
    });
  }
  toggleSetEditModal(moodId) {
    const Mood = this.state.moodsList.find(mood => mood._id === moodId);

    this.setState({
      updatemoodsformControls: {
        moodName: { value: Mood.moodName },

        moodId: { value: moodId }
      },
      progress: 0
    });
    this.setState({
      editmodal: !this.state.editmodal,
      progress: 0
    });
  }
  toggleEditModal() {
    this.setState({
      editmodal: !this.state.editmodal,
      progress: 0
    });
  }
  confirmDelete = val => {
    confirmAlert({
      title: "Are you Sure",
      message: "Proceed to delete.",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.deleteMood(val)
        },
        {
          label: "No",
          onClick: () => {}
        }
      ]
    });
  };
  deleteMood(val) {
    console.log(val);
    axios({
      method: "post",
      url: process.env.REACT_APP_BASE_URL + "/deletemood",
      data: { moodId: val },
      config: {
        headers: { "Content-Type": "application/json" }
      }
    })
      .then(response => {
        console.log(response.data);
        //handle success
        if (response.data.code === 200) {
          this.componentDidMount();
        } else {
          console.log(response.data.msg);
        }
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  }
  updatechangeHandler = event => {
    console.log(event.target);
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      updatemoodsformControls: {
        ...this.state.updatemoodsformControls,
        [name]: {
          ...this.state.updatemoodsformControls[name],
          value
        }
      }
    });
  };
  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      moodsformControls: {
        ...this.state.moodsformControls,
        [name]: {
          ...this.state.moodsformControls[name],
          value
        }
      }
    });
  };
  handleChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      console.log(image);
      this.setState({ image: image, loading: true });
      const uploadTask = storage.ref(`moods/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        snapshot => {
          // progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        error => {
          // Error function ...
          console.log(error);
        },
        () => {
          // complete function ...
          storage
            .ref("moods")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
              console.log(url);
              this.setState({ fileUrl: url, loading: false });
            });
        }
      );
    }
  };
  handleUpdateChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      console.log(image);
      this.setState({ updateimage: image, loading: true });
      const uploadTask = storage.ref(`moods/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        snapshot => {
          // progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        error => {
          // Error function ...
          console.log(error);
        },
        () => {
          // complete function ...
          storage
            .ref("moods")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
              console.log(url);
              this.setState({ updatefileUrl: url, loading: false });
            });
        }
      );
    }
  };
  componentDidMount() {
    console.log("data-->" + process.env.REACT_APP_BASE_URL);
    axios({
      method: "post",
      url: process.env.REACT_APP_BASE_URL + "/listallmood"
    })
      .then(response => {
        if (response.data.code === 200) {
          console.log(response.data.data);
          this.setState({
            moodsList: response.data.data
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
  navigateHandler(mood) {
    this.props.history.push({
      pathname: "/songslist",
      search: mood._id
    });
  }
  handleValidation() {
    console.log(this.state.image.name);
    let fields = this.state.moodsformControls;
    let errors = {};
    let formIsValid = true;
    //priority

    //title
    if (fields["moodName"].value === "") {
      formIsValid = false;
      errors["moodName"] = "Cannot be empty";
    }
    if (!this.state.image.name) {
      formIsValid = false;
      errors["moodImage"] = "Select mood image";
    }
    console.log(errors);

    this.setState({ errors: errors });

    return formIsValid;
  }
  handleUpdateValidation() {
    let fields = this.state.updatemoodsformControls;
    let errors = {};
    let formIsValid = true;
    //priority

    //title
    if (fields["moodName"].value === "") {
      formIsValid = false;
      errors["updatemoodName"] = "Cannot be empty";
    }

    console.log(errors);

    this.setState({ errors: errors });

    return formIsValid;
  }

  // submitHandler(event) {
  //   event.preventDefault();
  //   if (this.handleValidation()) {
  //     var bodyFormData = new FormData();
  //     bodyFormData.set("moodId", this.state.moodsformControls.moodName.value);
  //     bodyFormData.append("moodPic", this.state.image);
  //     axios({
  //       method: "post",
  //       url: process.env.REACT_APP_BASE_URL + "/addmood",
  //       data: bodyFormData,
  //       config: {
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" }
  //       }
  //     })
  //       .then(response => {
  //         console.log(response.data);
  //         bodyFormData = {};
  //         //handle success
  //         if (response.data.code === 200) {
  //           this.toggleModal();
  //           this.componentDidMount();
  //         } else {
  //           console.log(response.data.msg);
  //         }
  //       })
  //       .catch(function(response) {
  //         //handle error
  //         console.log(response);
  //       });
  //   }
  //   return false;
  // }
  submitHandler(event) {
    event.preventDefault();
    if (this.handleValidation()) {
      // var bodyFormData = new FormData();
      // bodyFormData.set("moodId", this.state.moodsformControls.moodName.value);
      // bodyFormData.append("moodPic", this.state.image);
      var requestObj = {
        moodName: this.state.moodsformControls.moodName.value,
        fileUrl: this.state.fileUrl
      };
      axios({
        method: "post",
        url: process.env.REACT_APP_BASE_URL + "/addmoodwithurl",
        data: requestObj,
        config: {
          headers: { "Content-Type": "application/json" }
        }
      })
        .then(response => {
          console.log(response.data);
          //      bodyFormData = {};
          //handle success
          if (response.data.code === 200) {
            this.toggleModal();
            this.componentDidMount();
          } else {
            console.log(response.data.msg);
          }
        })
        .catch(function(response) {
          //handle error
          console.log(response);
        });
    }
    return false;
  }
  submitUpdateHandler(event) {
    event.preventDefault();
    console.log(this.state.updateimage);
    if (this.handleUpdateValidation() && this.state.updateimage) {
      console.log("insde if");
      // var bodyFormData = new FormData();
      // bodyFormData.set(
      //   "moodId",
      //   this.state.updatemoodsformControls.moodId.value
      // );
      // bodyFormData.set(
      //   "moodName",
      //   this.state.updatemoodsformControls.moodName.value
      // );
      // bodyFormData.append("moodPic", this.state.updateimage);
      var bodyFormData = {
        moodId: this.state.updatemoodsformControls.moodId.value,
        moodName: this.state.updatemoodsformControls.moodName.value,
        moodPic: this.state.updatefileUrl
      };
      axios({
        method: "post",
        url: process.env.REACT_APP_BASE_URL + "/updatemoodwithimage",
        data: bodyFormData,
        config: {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }
      })
        .then(response => {
          console.log(response.data);
          bodyFormData = {};
          //handle success
          if (response.data.code === 200) {
            this.toggleEditModal();
            this.componentDidMount();
          } else {
            console.log(response.data.msg);
          }
        })
        .catch(function(response) {
          //handle error
          console.log(response);
        });
    } else if (this.handleUpdateValidation() && !this.state.updateimage) {
      console.log("inside else");
      var moodObj = {
        moodId: this.state.updatemoodsformControls.moodId.value,
        moodName: this.state.updatemoodsformControls.moodName.value
      };
      axios({
        method: "post",
        url: process.env.REACT_APP_BASE_URL + "/updatemood",
        data: moodObj,
        config: {
          headers: { "Content-Type": "application/json" }
        }
      })
        .then(response => {
          console.log(response.data);
          bodyFormData = {};
          //handle success
          if (response.data.code === 200) {
            this.toggleEditModal();
            this.componentDidMount();
          } else {
            console.log(response.data.msg);
          }
        })
        .catch(function(response) {
          //handle error
          console.log(response);
        });
    }
    return false;
  }
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
    var moodsList = this.state.moodsList;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Button block outline color="primary" onClick={this.toggleModal}>
              New Mood
            </Button>
          </Col>
        </Row>
        <Row>
          {moodsList.map((moods, index) => (
            <Col xl={4} key={index}>
              <Card>
                <CardImg
                  src={moods.moodImage}
                  alt="Not found"
                  width="25%"
                  height="auto"
                />
                <CardFooter>
                  <Row>
                    <Col xl={8}>{moods.moodName}</Col>
                    <Col xl={2}>
                      <i
                        className="icon-trash icons"
                        onClick={() => this.confirmDelete(moods._id)}
                      ></i>
                    </Col>
                    <Col xl={2}>
                      <i
                        className="icon-wrench icons"
                        onClick={() => this.toggleSetEditModal(moods._id)}
                      ></i>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <Form onSubmit={this.submitHandler}>
            <Container>
              <ModalHeader toggle={this.toggleModal}>Add Moods</ModalHeader>
              <ModalBody>
                <InputGroup style={{ margin: "1.5% 0%" }} className="mb-12">
                  <Input
                    type="text"
                    name="moodName"
                    placeholder="Moods name"
                    value={this.state.moodsformControls.moodName.value}
                    onChange={this.changeHandler}
                  />
                  <span style={{ color: "red" }}>
                    {this.state.errors.moodName}
                  </span>
                </InputGroup>
                <InputGroup style={{ margin: "1.5% 0%" }} className="mb-12">
                  <Input
                    type="file"
                    name="moodImage"
                    onChange={this.handleChange}
                  />
                  {(() => {
                    if (this.state.progress) {
                      return (
                        // <span style={{ color: "green" }}>
                        //   {this.state.progress}%
                        // </span>
                        <progress
                          value={this.state.progress}
                          max="100"
                          className="progress"
                        />
                      );
                    }
                  })()}
                  {this.state.loading ? (
                    <Loader
                      type="Puff"
                      color="#00BFFF"
                      height={100}
                      width={100}
                      timeout={30000} //3 secs
                    />
                  ) : (
                    <div></div>
                  )}
                  <span style={{ color: "red" }}>
                    {this.state.errors.moodImage}
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
            </Container>
          </Form>
        </Modal>
        <Modal isOpen={this.state.editmodal} toggle={this.toggleEditModal}>
          <Form onSubmit={this.submitUpdateHandler}>
            <Container>
              <ModalHeader toggle={this.toggleEditModal}>
                Update Moods
              </ModalHeader>
              <ModalBody>
                <InputGroup style={{ margin: "1.5% 0%" }} className="mb-12">
                  <Input
                    type="text"
                    name="moodName"
                    placeholder="Moods name"
                    value={this.state.updatemoodsformControls.moodName.value}
                    onChange={this.updatechangeHandler}
                  />
                  <span style={{ color: "red" }}>
                    {this.state.errors.updatemoodName}
                  </span>
                </InputGroup>
                <InputGroup style={{ margin: "1.5% 0%" }} className="mb-12">
                  <Input
                    type="file"
                    name="moodImage"
                    onChange={this.handleUpdateChange}
                  />
                  {(() => {
                    if (this.state.progress) {
                      return (
                        // <span style={{ color: "green" }}>
                        //   {this.state.progress}%
                        // </span>
                        <progress
                          value={this.state.progress}
                          max="100"
                          className="progress"
                        />
                      );
                    }
                  })()}

                  <span style={{ color: "red" }}>
                    {this.state.errors.moodImage}
                  </span>
                </InputGroup>
              </ModalBody>

              <ModalFooter>
                <Button outline color="success">
                  Update
                </Button>
                <Button color="secondary" onClick={this.toggleEditModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Container>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Moods;
