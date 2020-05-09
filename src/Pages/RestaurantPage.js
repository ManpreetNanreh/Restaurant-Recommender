import React, { Component } from 'react';
import SearchBar from '../Components/SearchBar';
import Restaurant from '../Components/Restaurant';
import '../App.css';

//Using the Zomato API
const ZomatoApiKey = '';
const baseUrl = 'https://developers.zomato.com/api/v2.1/';
const headerVals = {'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'user-key': ZomatoApiKey
                };

class RestaurantPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      cityName: null,
      cityID: null,
      restaurantList: [],
      startPoint: 0,
      totalFound: -1,
      showMore: false,
      error: null
    };

    this.handleInitialSearch = this.handleInitialSearch.bind(this);
    this.handlePaginatedSearch = this.handlePaginatedSearch.bind(this);
    this.fetchCityID = this.fetchCityID.bind(this);
    this.fetchRestaurantByCityID = this.fetchRestaurantByCityID.bind(this);
    this.fetchRestaurantByCityName = this.fetchRestaurantByCityName.bind(this);
    this.setRestaurants = this.setRestaurants.bind(this);
    this.renderRestaurants = this.renderRestaurants.bind(this);
    this.renderShowMoreButton = this.renderShowMoreButton.bind(this);
  }

  //When the user first time searches for restaurants.
  //Each request to the Zomato Api gives 20 results upto a total of 100.
  handleInitialSearch(city, province){
    //Reset all state variables whenever an initial search is made.
    this.setState({
      cityName: null,
      cityID: null,
      restaurantList: [],
      startPoint: 0,
      totalFound: -1,
      showMore: false,
      error: null
    });

    //Check if either of the input requested is empty.
    //Only fetch restaurants if both inputs are provided.
    if(city && province){
      //Attempt to fetch city id.
      this.fetchCityID(city.toLowerCase(), province.toLowerCase()).then(response => {
        //means city id was found and proceed to fetch restaurants by city id.
        if(response){
          this.fetchRestaurantByCityID(response, 0);
        } else {
          //Otherwise attempt to fetch restaurants by city name.
          this.fetchRestaurantByCityName(city.toLowerCase(), 0);
        }
      });
    }
  }

  //If show more button is clicked then get more restaurants either using city id or city name.
  //Each request to the Zomato Api gives 20 results upto a total of 100.
  handlePaginatedSearch(){
    //Indicates that previous search was done using city id because either
    // city id or city name can be initialized at a time.
    if(this.state.cityID !== null){
      this.fetchRestaurantByCityID(this.state.cityID, this.state.startPoint + 20);
    } else if (this.state.cityName !== null){
    //Indicates that previous search was done using city name.
      this.fetchRestaurantByCityName(this.state.cityName, this.state.startPoint + 20);
    } else {
      //If something out of ordinary is going on, then don't allow user
      // to show more.
      this.setState({showMore: false});
    }
  }

  //Attempt to fetch the city's id from the Zomato API.
  //This method returns a promise, so check it properly.
  fetchCityID(city, province){
    //Create the url to fetch city id and carry on the fetching process.
    let url = baseUrl + '/cities?q=' + city;
    let cID = null;

    return fetch(url, {
      method: 'GET',
      headers: headerVals
    })
      .then(response => response.json())
      .then(responseJson => {
        //Once the list of locations is provided, find the one we want depending
        //on the user provided city name and province.
        responseJson.location_suggestions.forEach(element => {
          //If the city is found, then store the cityID.
          if(element.state_name.toLowerCase() === province && element.name.split(",")[0].toLowerCase() === city){
            cID = element.id;
          }
        });

        return(cID);
      })
      .catch(error => {
        this.setState({error: 'Request failed, ' + error})
      })
  }

  //Fetch the restaurant list using the city ID from Zomato API.
  fetchRestaurantByCityID(cID, sPoint){
    let url = baseUrl + 'search?entity_id=' + cID + '&entity_type=city&start=' + sPoint + '&sort=rating&order=desc';

    fetch(url, {
      method: 'GET',
      headers: headerVals
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({cityID: cID});
        this.setRestaurants(responseJson.restaurants, responseJson.results_found, sPoint);
      })
      .catch(error => {
        this.setState({error: 'Request failed, ' + error});
      })
  }

  //Fetch the restaurant list using the city name from Zomato API.
  fetchRestaurantByCityName(cName, sPoint){
    let url = baseUrl + 'search?entity_type=city&q=' + cName + '&start=' + sPoint + '&sort=rating&order=desc';

    fetch(url, {
      method: 'GET',
      headers: headerVals
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setRestaurants(responseJson.restaurants, responseJson.results_found, sPoint);
      })
      .catch(error => {
        this.setState({error: 'Request failed, ' + error});
      })
  }

  //Store the restaurants, start point and total number of restaurants in the state.
  setRestaurants(result, resFound, sPoint){
    //If the user is doing an initial search for a specific city.
    if(sPoint === 0){
      this.setState({
        restaurantList: result,
        startPoint: sPoint,
        totalFound: resFound
      });
    }else{
      //When the user clicks show more then append the new list to the previous list.
      this.setState({
        restaurantList: [...this.state.restaurantList, ...result],
        startPoint: sPoint
      });
    }

    //If there are no more restaurants to show then set marker to false.
    if(this.state.restaurantList.length > resFound || this.state.restaurantList.length === 100){
      this.setState({showMore: false});
    }else if (this.state.restaurantList.length < resFound){
      //If there are more restaurants to be shown then set the marker to true.
      this.setState({showMore: true});
    }
  }

  //This button allows the user to get more local restaurants if there are more available.
  renderShowMoreButton(){
    //Only show the button if more restaurants are available.
    if(!this.state.showMore) return null;
    return(<button type="button" className="btn btn-secondary btn-sm" onClick={this.handlePaginatedSearch}>Show more</button>);
  }

  //Render the restaurant list retrieved from the API.
  //If empty, then inform the user.
  renderRestaurants(){
    if(this.state.totalFound > 0){
      const list = this.state.restaurantList.map((r) => 
        <Restaurant key={r.restaurant.id} name={r.restaurant.name} cuisines={r.restaurant.cuisines}
          rating={r.restaurant.user_rating.aggregate_rating} thumbURL={r.restaurant.thumb} url={r.restaurant.url}/>
      );
      return(<div className="row">{list}</div>);
    }else if(this.state.totalFound === 0){
      return(<h2>No results found!</h2>);
    }
  }

  render() {
    return (
      <div className="RestaurantPage">
        <SearchBar onSubmitRequest={this.handleInitialSearch} searchTitle={"Local Restaurants"} searchPlaceHolder1={"City"} searchPlaceHolder2={"Province"}/>
        {this.renderRestaurants()}
        {this.renderShowMoreButton()}
      </div>
    );
  }
}

export default RestaurantPage;
