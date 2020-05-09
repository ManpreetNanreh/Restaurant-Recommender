import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import SearchBar from '../Components/SearchBar';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('<SearchBar />', () => {
  it('renders search bar', () => {
    const wrapper = shallow(<SearchBar searchTitle={"Local Restaurants"} searchPlaceHolder1={"City"} searchPlaceHolder2={"Country"}/>);
    expect(wrapper).toMatchSnapshot();
  });

  it('On input change with correct entry', () => {
    const wrapper = mount(<SearchBar searchTitle={"Local Restaurants"} searchPlaceHolder1={"City"} searchPlaceHolder2={"Country"}/>);
    wrapper.find('input').simulate('change', {target: {value: 'mock'}});
    expect(wrapper.state().submitQuery).toEqual('mock');
  });

  it('On input change with empty entry', () => {
    const wrapper = mount(<SearchBar searchTitle={"Local Restaurants"} searchPlaceHolder1={"City"} searchPlaceHolder2={"Country"}/>);
    wrapper.find('input').simulate('change', {target: {value: ''}});
    expect(wrapper.state().submitQuery).toEqual('');
  });

  it('On submit', () => {
    const onSubmit = jest.fn();
    const wrapper = mount(<SearchBar onSubmitRequest={onSubmit} />);
    wrapper.find('form').simulate('submit', {preventDefault() {}});
    expect(onSubmit.mock.calls.length).toBe(1);
  });

  it('On submit with input', () => {
    const onSubmit = jest.fn();
    const wrapper = mount(<SearchBar onSubmitRequest={onSubmit} searchTitle={"Local Restaurants"} searchPlaceHolder1={"City"} searchPlaceHolder2={"Country"}/>);
    wrapper.find('input').simulate('change', {
      target: {value: 'mock'}
    });
    wrapper.find('form').simulate('submit', {preventDefault() {}});
    expect(onSubmit.mock.calls[0][0]).toEqual('mock');
  });
});
