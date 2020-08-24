import React, { Component } from "react";
import axios from "axios";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { storage } from "../../fire";
import {
  Col,
  Button,
  Card,
  CardFooter,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  Input,
  InputGroup,
  Container,
  Label
} from "reactstrap";
import Switch from "react-switch";
import { confirmAlert } from "react-confirm-alert";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class Songs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songsList: [],
      moodsList: [],
      modal: false,
      moodsId: null,
      errors: {},
      song: {},
      fileUrl: null,
      songTitle: null,
      selectedMoodId: "",
      loading: false,
      songsformControls: {
        moodId: { value: "" },
        songUrl: { value: "" },
        isPreview: { value: false }
      },
      progress: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.listSongbymood = this.listSongbymood.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.deleteSong = this.deleteSong.bind(this);
  }
  toggleModal() {
    this.setState({
      modal: !this.state.modal,
      progress: 0
    });
  }
  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(event.target.value);
    this.setState({ errors: {} });
    this.setState({
      songsformControls: {
        ...this.state.songsformControls,
        [name]: {
          ...this.state.songsformControls[name],
          value
        }
      }
    });
  };
  confirmDelete = val => {
    confirmAlert({
      title: "Are you Sure",
      message: "Proceed to delete.",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.deleteSong(val)
        },
        {
          label: "No",
          onClick: () => {}
        }
      ]
    });
  };
  deleteSong(val) {
    console.log(val);
    axios({
      method: "post",
      url: process.env.REACT_APP_BASE_URL + "/deletesong",
      data: { songId: val },
      config: {
        headers: { "Content-Type": "application/json" }
      }
    })
      .then(response => {
        console.log(response.data);
        //handle success
        if (response.data.code === 200) {
          axios({
            method: "post",
            data: { moodId: this.state.selectedMoodId },
            url: process.env.REACT_APP_BASE_URL + "/listsongbymood"
          })
            .then(response => {
              if (response.data.code === 200) {
                console.log(response.data);
                this.setState({
                  songsList: response.data.data
                });
              } else {
                console.log(response.data.message);
              }
            })
            .catch(function(response) {
              //handle error
              console.log(response);
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
  handleChange = e => {
    this.setState({ errors: {} });
    if (e.target.files[0]) {
      const song = e.target.files[0];
      console.log(song);
      this.setState({ song: song, loading: true });
      const uploadTask = storage.ref(`songs/${song.name}`).put(song);
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
            .ref("songs")
            .child(song.name)
            .getDownloadURL()
            .then(url => {
              console.log(url);
              this.setState({
                fileUrl: url,
                songTitle: song.name,
                loading: false
              });
            });
        }
      );
    }
  };
  listSongbymood = event => {
    console.log(event.target.value);
    this.setState({ selectedMoodId: event.target.value });

    axios({
      method: "post",
      data: { moodId: event.target.value },
      url: process.env.REACT_APP_BASE_URL + "/listsongbymood"
    })
      .then(response => {
        if (response.data.code === 200) {
          console.log(response.data.data);
          this.setState({
            songsList: response.data.data
          });
        } else {
          console.log(response.data.message);
        }
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };
  componentDidMount() {
    const moodId = this.props.location.search.replace("?", "");
    if (moodId) {
      axios({
        method: "post",
        data: { moodId: this.props.location.search.replace("?", "") },
        url: process.env.REACT_APP_BASE_URL + "/listsongbymood"
      })
        .then(response => {
          if (response.data.code === 200) {
            this.setState({
              songsList: response.data.data
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
    axios({
      method: "post",
      url: process.env.REACT_APP_BASE_URL + "/listallmood"
    })
      .then(response => {
        if (response.data.code === 200) {
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
      search: mood.moodsId
    });
  }
  updateSongStatus(checked, id) {
    console.log(JSON.stringify(checked) + id);
    axios({
      method: "post",
      url: process.env.REACT_APP_BASE_URL + "/updatesongstatus",
      data: { isPreview: checked, songId: id },
      config: { headers: { "Content-Type": "application/json" } }
    })
      .then(response => {
        //handle success
        if (response.data.code === 200) {
          console.log(response.data.msg);
          //  this.componentDidMount();
          axios({
            method: "post",
            data: { moodId: this.state.selectedMoodId },
            url: process.env.REACT_APP_BASE_URL + "/listsongbymood"
          })
            .then(response => {
              if (response.data.code === 200) {
                console.log(response.data);
                this.setState({
                  songsList: response.data.data
                });
              } else {
                console.log(response.data.message);
              }
            })
            .catch(function(response) {
              //handle error
              console.log(response);
            });
        } else {
          console.log(response.data.msg);
        }
      })
      .catch(response => {
        //handle error
        console.log(response);
      });
  }
  handleValidation() {
    let fields = this.state.songsformControls;
    let errors = {};
    let formIsValid = true;
    //priority
    console.log(this.state.song);
    //title
    if (fields["moodId"].value === "xyw" || fields["moodId"].value === "") {
      formIsValid = false;
      errors["moodId"] = "Select a mood";
    }
    if (!this.state.song.name) {
      formIsValid = false;
      errors["songUrl"] = "Select a song";
    } else if (this.state.song.name && this.state.song.type !== "audio/mpeg") {
      formIsValid = false;
      errors["songUrl"] = "Select a valid song";
    }
    console.log(errors);

    this.setState({ errors: errors });

    return formIsValid;
  }
  submitHandler(event) {
    event.preventDefault();
    if (this.handleValidation()) {
      console.log("mood song upload");
      // var bodyFormData = new FormData();
      // bodyFormData.set("moodId", this.state.songsformControls.moodId.value);
      // bodyFormData.set(
      //   "isPreview",
      //   this.state.songsformControls.isPreview.value
      // );
      // bodyFormData.append("song", this.state.song);
      var bodyFormData = {
        moodId: this.state.songsformControls.moodId.value,
        isPreview: this.state.songsformControls.isPreview.value,
        songUrl: this.state.fileUrl,
        songTitle: this.state.songTitle
      };
      console.log(JSON.stringify(bodyFormData));
      axios({
        method: "post",
        url: process.env.REACT_APP_BASE_URL + "/uploadmoodsong",
        data: bodyFormData,
        config: {
          headers: { "Content-Type": "application/json" }
        }
      })
        .then(response => {
          console.log(response.data);
          bodyFormData = {};
          //handle success
          if (response.data.code === 200) {
            console.log(JSON.stringify(response.data));
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
    var songsList = this.state.songsList;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <InputGroup className="mb-12">
              <Input
                type="select"
                name="moodId"
                value={this.state.selectedMoodId}
                onChange={this.listSongbymood}
                id="select"
              >
                <option value="xyw" key="xyw">
                  Select mood
                </option>
                {this.state.moodsList.map((mood, index) => (
                  <option value={mood._id} key={mood._id}>
                    {mood.moodName}
                  </option>
                ))}
              </Input>
              <span style={{ color: "red" }}>{this.state.errors.moodId}</span>
            </InputGroup>
          </Col>
          <Col>
            <Button block outline color="primary" onClick={this.toggleModal}>
              Add Song
            </Button>
          </Col>
        </Row>
        <Row>
          {songsList.map((songs, index) => (
            <Col xl={4} key={index}>
              <Card>
                <AudioPlayer
                  src={songs.songUrl}

                  // other props here
                />
                <CardFooter>
                  <Row>
                    <Col>{songs.title}</Col>
                    <Col>
                      <Label htmlFor="normal-switch">
                        <span>Free</span>
                        <Switch
                          onChange={() =>
                            this.updateSongStatus(!songs.isPreview, songs._id)
                          }
                          checked={songs.isPreview}
                          className="react-switch"
                          id="normal-switch"
                        />
                      </Label>
                    </Col>
                    <Col xl={2}>
                      <i
                        className="icon-trash icons"
                        onClick={() => this.confirmDelete(songs._id)}
                      ></i>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className={this.props.className}
        >
          <Form onSubmit={this.submitHandler}>
            <Container>
              <ModalHeader toggle={this.toggleModal}>Add Songs</ModalHeader>
              <ModalBody>
                <InputGroup style={{ margin: "1.5% 0%" }} className="mb-12">
                  <Input
                    type="select"
                    name="moodId"
                    value={this.state.songsformControls.moodId.value}
                    onChange={this.changeHandler}
                    id="select"
                  >
                    <option value="xyw" key="xyw">
                      Select mood
                    </option>
                    {this.state.moodsList.map((mood, index) => (
                      <option value={mood._id} key={mood._id}>
                        {mood.moodName}
                      </option>
                    ))}
                  </Input>
                  <span style={{ color: "red" }}>
                    {this.state.errors.moodId}
                  </span>
                </InputGroup>
                <InputGroup style={{ margin: "1.5% 0%" }} className="mb-12">
                  <Input
                    type="file"
                    name="songUrl"
                    placeholder="Upload Song"
                    accept="audio/mp3"
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
                    {this.state.errors.songUrl}
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
      </div>
    );
  }
}

export default Songs;
