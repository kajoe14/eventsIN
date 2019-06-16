import React, { Component } from "react";
import Search from "./search.js";
import Input from "./input.js";
import Header from "./header.js";
import Cards from "./cards.js";
import ControlledCarousel from "./carousel.js";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Event from "./event.js";
import Links from "./links.js";
import FooterPagePro from "./Footer.js";
import "../style/search.css";
import "../style/display.css";
import "../style/carousel.css";
import "../style/carousel.css";



class Display extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      tags:[],
      searchIndex: 0,
      eventList: [],
      isloaded: false,
      singleEvent: false,
      eventId: 0
    };
  }
  nextResults() {
    if (this.state.searchIndex > 80) {
      return console.log("no more items");
    } else {
      this.setState({
        searchIndex: this.state.searchIndex + 9,
        isloaded: true
      });
      this.renderData();
    }
  }
  prevResults() {
    this.setState({
      searchIndex: this.state.searchIndex - 9
    });
    if (this.state.searchIndex < 0) {
      return console.log("no more items");
    } else {
      this.renderData();
    }
  }
  moreDetails = id => {
    this.setState({
      singleEvent: true,
      eventId: id
    });
  };
  renderData() {
    console.log("old: " + this.state.searchIndex);
    let data = this.state.data.data.slice(
      this.state.searchIndex,
      this.state.searchIndex + 9
    );
    this.setState({
      eventList: data
    });
  }
  componentDidUpdate() {
    console.log("new: " + this.state.searchIndex);
    window.scrollTo(0, 0);
  }
  fetchTag = e => {
    let tag = e.target.value;
    console.log("react " + e.target.value);
    fetch(`http://localhost:3030/tags?tag=${tag}`)
    .then(response => response.json())
    .then(data => {
      this.setState({ data: data });
      this.renderData();
    })
    .catch(error => console.log(error));
  };

  fetchAllEvents = () => {
    fetch("http://localhost:3030/")
    .then(response => response.json())
    .then(data => {
      this.setState({ data: data, tags:Object.values(data.tags) });
    })
    .catch(error => console.log(error));
  };

  componentDidMount() {
    this.fetchAllEvents();

  }
  render() {
    var carousels = [];
    var events = [];
    var tagArray =[];
    console.log(this.state.tags);
    if (this.state.singleEvent === false) {
      if (
        typeof this.state.eventList !== "undefined" &&
        this.state.eventList.length > 0
      ) {
        events = this.state.eventList.map((event, index) => {
          return (
            <div>
            <Cards key={index} event={event} moreDetails={this.moreDetails} />
            </div>
          );
        });
      }
    } else {
      if (
        typeof this.state.data.data !== "undefined" &&
        this.state.data.data.length > 0
      ) {
        let eventS = this.state.data.data.filter(obj => {
          return obj.id === this.state.eventId;
        });
        console.log(eventS);
        events = <Event data={eventS[0]} />;
      }
    }
    if (
      typeof this.state.data.data !== "undefined" &&
      this.state.data.data.length > 0
    ) {
      carousels = this.state.data.data.slice(0, 3);
    }
    if (
      typeof this.state.tags !== "undefined" &&
      this.state.tags.length > 0
    ) {
      tagArray = this.state.tags;
      return (
        <div className="wrapper">
        <Header />
        
        <Input id="event" placeholder="Select an Event" options={tagArray} handleChange={this.fetchTag}/>
        <Links handleClick={this.fetchTag} handleAll={() => this.nextResults()} />
        <div className="mt-4">
          <Row>
            <Col md={12}>
              <h1 className="main-header">Are you in search of activities or events to particpate in?</h1>
            </Col>
          </Row>
          <div className="flex-container"> {events} </div>
          {this.state.isloaded ? (
            <Row className="justify-content-center">
            <Search
            className="bbtn"
            label="Back"
            handleClick={() => this.prevResults()}
            />
            <Search
            label="Next"
            className="bbtn"
            handleClick={() => this.nextResults()}
            />
            </Row>
          ) : (
            <div className="carousel">
            <ControlledCarousel carouselItems={carousels} />
            </div>
          )}
        </div>
        <FooterPagePro />
        </div>
      );
    }
    return <div />;
  }
}
export default Display;
