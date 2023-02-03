import {SET_FROM_ROUTE, SET_ROUTE_CARD} from './actions';

const initialState = {
  fromroute: '',
  routecard: {},
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FROM_ROUTE:
      return {...state, fromroute: action.payload};
    case SET_ROUTE_CARD:
      return {...state, routecard: action.payload};
    default:
      return state;
  }
}

export default userReducer;
