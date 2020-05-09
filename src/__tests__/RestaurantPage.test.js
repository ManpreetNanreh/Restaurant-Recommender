import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import RestaurantPage, {handleInitialSearch} from '../Pages/RestaurantPage';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('RestaurantPage', () => {

  window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
    status: 200,
    json: () => Promise.resolve({
      "results_found": "1",
      "results_start": "0",
      "results_shown": "1",
      "restaurants": [
        {
          "id": "0",
          "name": "Mock Restaurant",
          "user_rating": {
            "aggregate_rating": "5.0"
          },
          "cuisines": "Cafe"
        }
      ]
    })
  }));

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<RestaurantPage />);
  })

  it('calls fetch with correct data', () => {
    wrapper.instance().handleInitialSearch('mock');
    expect(window.fetch).toHaveBeenCalledWith('https://developers.zomato.com/api/v2.1/search?q=mock&start=0',
    {'headers': {'Accept': 'application/json',
     'Content-Type': 'application/json',
     'user-key': 'bea3c0fc3f25d27bfd32ed09a01c9ada',
      },
      'method': 'GET'
    });
  })

  it('calls fetch with empty data', () => {
    wrapper.instance().handleInitialSearch('');
    expect(window.fetch).toHaveBeenCalledWith('https://developers.zomato.com/api/v2.1/search?q=&start=0',
    {'headers': {'Accept': 'application/json',
     'Content-Type': 'application/json',
     'user-key': 'bea3c0fc3f25d27bfd32ed09a01c9ada',
      },
      'method': 'GET'
    });
  })

  it('reset totalFound in state after fetch call with correct data', () => {
    new Promise((resolve) => {resolve(wrapper.instance().handleInitialSearch('mock'))
    }).then(() => {wrapper.update()}).then(() => {
      expect(wrapper.state('totalFound')).toEqual("1")
    })
  })

  it('reset restaurantList in state after fetch call with correct data', () => {
    new Promise((resolve) => {resolve(wrapper.instance().handleInitialSearch('mock'))
    }).then(() => {wrapper.update()}).then(() => {
      expect(wrapper.state('restaurantList')).toEqual([
        {
          "id": "0",
          "name": "Mock Restaurant",
          "user_rating": {
            "aggregate_rating": "5.0"
          },
          "cuisines": "Cafe"
        }
      ])
    })
  })

  it('set an error when the fetch call fails', () => {
    window.fetch = jest.fn().mockImplementationOnce(() =>
      new Promise((resolve, reject) => {reject(new Error('failed'))}
    ))

    new Promise((resolve) => {
      resolve(wrapper.instance().handleInitialSearch('mock'))
    }).then(() => {wrapper.update()}).then(() => {wrapper.update()}).then(() => {
      expect(wrapper.state('error')).toEqual('Request failed, Error: failed')
    })
  })
})
