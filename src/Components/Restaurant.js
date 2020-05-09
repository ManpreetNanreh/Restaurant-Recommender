import React, { Component } from 'react';
import '../App.css';

class Restaurant extends Component {
    render() {
        return(
            //Restaurant block using Bootstrap layout.
            <div className="col-md-3">
              <div className="card mb-3 shadow-sm border border-dark">
                <img className="card-img-top" alt="Restaurant" src={this.props.thumbURL} data-holder-rendered="true" />
                <div className="card-body">
                    <h5 className="font-weight-bold">{this.props.name}</h5>
                    <p className="card-text">Cuisine Type: {this.props.cuisines}</p>
                    <p className="card-text">Rating: {this.props.rating}</p>
                    <a className="btn btn-sm btn-outline-success" href={this.props.url}>More info</a>
                </div>
              </div>
            </div>
        );
    }
}

export default Restaurant;