import {fromJS} from 'immutable';

import INITIAL_STATE from './INITIAL_STATE';
import {getUserLocation} from '../libs/location';
import {getTripsForRoute, getTripsForLocation} from './data';

const SET_PAGE = 'instabus/ui/SET_PAGE';
const SET_USER_LAT_LNG = 'instabus/ui/SET_USER_LAT_LNG';
const SET_TRIPS_FOR_LOCATION_LOADING = 'instabus/ui/SET_TRIPS_FOR_LOCATION_LOADING';
const SET_TRIPS_FOR_ROUTE_LOADING = 'instabus/ui/SET_TRIPS_FOR_ROUTE_LOADING';
const SET_ERROR_MESSAGE = 'instabus/ui/SET_ERROR_MESSAGE';
const SET_ROUTE = 'instabus/ui/SET_ROUTE';

export default function reducer(state = INITIAL_STATE.get('ui'), action = {}) {
  switch (action.type) {
  case SET_PAGE:
    return state.set('page', action.payload);
  case SET_TRIPS_FOR_LOCATION_LOADING:
    return state.set('tripsForLocationLoading', action.payload);
  case SET_TRIPS_FOR_ROUTE_LOADING:
    return state.set('tripsForRouteLoading', action.payload);
  case SET_USER_LAT_LNG:
    return state.set('userLatLng', fromJS(action.payload));
  case SET_ERROR_MESSAGE:
    return state.set('errorMessage', action.payload);
  case SET_ROUTE:
    return state.set('route', action.payload);
  default:
    return state;
  }
}

export function setTripsForLocationLoading(loading) {
  return {
    type: SET_TRIPS_FOR_LOCATION_LOADING,
    payload: loading,
  };
}

export function setTripsForRouteLoading(loading) {
  return {
    type: SET_TRIPS_FOR_ROUTE_LOADING,
    payload: loading,
  };
}

export function setPage(page) {
  return {
    type: SET_PAGE,
    payload: page,
  };
}

export function setErrorMessage(errorMessage) {
  return {
    type: SET_ERROR_MESSAGE,
    payload: errorMessage,
  };
}

export function setRoute(routeId) {
  return (dispatch) => {
    dispatch({
      type: SET_ROUTE,
      payload: routeId,
    });

    dispatch(getTripsForRoute(routeId));
  };
}

export function setUserLatLng(latLng) {
  return {
    type: SET_USER_LAT_LNG,
    payload: latLng,
  };
}

export function getUserLatLng() {
  return (dispatch) => {
    // FIXME: i'm not sure where the right place to dispatch getTripsForLocation is

    getUserLocation()
      .then(latLng => {
        dispatch(setUserLatLng(latLng));
        dispatch(getTripsForLocation(latLng));
      })
      .catch(err => setErrorMessage(err.toString()));
  };
}
