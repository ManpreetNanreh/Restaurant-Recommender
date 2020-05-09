import React, { Component } from 'react';
import '../App.css';

class SearchBar extends Component {

  constructor(props){
    super(props);

    //Store the user input in the state variable.
    this.state = {
      submitQuery1: '',
      submitQuery2: ''
    };

    //Bind the appropriate functions.
    this.handleInput1 = this.handleInput1.bind(this);
    this.handleInput2 = this.handleInput2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //Function responsible for taking the user input1(city name) and storing it in the state.
  handleInput1(e){
    this.setState({submitQuery1: e.target.value.trim()});
  }

  //Function responsible for taking the user input2(province name) and storing it in the state.
  handleInput2(e){
    this.setState({submitQuery2: e.target.value.trim()});
  }

  //Function responsible for submitting the user inputs.
  handleSubmit(e){
    e.preventDefault();
    this.props.onSubmitRequest(this.state.submitQuery1, this.state.submitQuery2);
  }

  render() {
    return (
      //Search bar using Bootstrap layout.
      <div className="SearchBar">
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <h1 className="navbar-brand" >{this.props.searchTitle}</h1>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <form className="form-inline mt-2 mt-md-0" onSubmit={this.handleSubmit}>
              <input className="form-control mr-sm-2" placeholder={this.props.searchPlaceHolder1} aria-label="Search" type="text" onChange={this.handleInput1}/>
              <input className="form-control mr-sm-2" placeholder={this.props.searchPlaceHolder2} aria-label="Search" type="text" onChange={this.handleInput2}/>
              <button className="btn btn-outline-success my-2 my-sm-0" >Search</button>
            </form>
          </div>
        </nav>
      </div>
    );
  }
}

export default SearchBar;