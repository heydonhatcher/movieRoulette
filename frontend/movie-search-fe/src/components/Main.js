import React, { Component } from "react";

class Main extends Component {
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
        <button onClick={this.fetchMovie}>Fetch Movie</button>
        {this.state.movies[0]}
      </div>
    );
  }
}

export default Main;
