import React, { Component } from "react";
import { Button } from "@material-ui/core";

class MatchButton extends Component {
  state = {
    movies: []
  };

  fetchMovie = () => {
    fetch("http://localhost:4001/movies/tt0075314")
      .then(res => res.json())
      .then(response => {
        this.setState({ movies: response });
        console.log(response);
      });
  };

  render() {
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={this.fetchMovie}
        >
          Fetch Movie
        </Button>
      </div>
    );
  }
}

export default MatchButton;
