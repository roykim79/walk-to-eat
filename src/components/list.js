import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import geodist from 'geodist'

class List extends Component {
  renderListItems() {
    const newListFormat = []

    this.props.restaurants.forEach(item => {
      if (item.position && item.vicinity && item.category.includes("food")) {
        let lat = item.position[0]
        let lon = item.position[1]
        item.distance = geodist({
          lat: lat,
          lon: lon
        }, {
          lat: this.props.currentLocation.latitude,
          lon: this.props.currentLocation.longitude
        })
        item.caloriesAvailable = (item.distance * 2) * 100
        item.address = item.vicinity.split('<br/>').join(' ');

        newListFormat.push(item);
        //sort and slice here. Map newList
      }
    })

    let categorizedList = newListFormat.filter(function(item) {
      if(item.distance >1){
        return item;
      }
    })

    categorizedList.sort((a, b) => {
      if (a.distance > b.distance) {
        return -1;
      }
      if (a.distance < b.distance) {
        return 1;
      }
      return 0;
    });

    return categorizedList.map(item => {
      return (
      //TODO VALIDATION
      <li className='list-group-item' key={item.id}>{item.title} --- {item.address} --- {item.distance} Miles
      </li>);
    });
  }

  render() {
    if (this.props.restaurants) {
      return (<div>
        <h3>Choices below:</h3>
        <ul className='list-group'>
          {this.renderListItems()}
        </ul>
      </div>);
    }

    return (<h1>
      Please Search a Restaurant :)
    </h1>)
  }
}

function mapStateToProps({restaurants, currentLocation}) {
  return {restaurants, currentLocation}
}

export default connect(mapStateToProps)(List);
