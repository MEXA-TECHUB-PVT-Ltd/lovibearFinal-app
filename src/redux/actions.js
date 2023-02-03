export const SET_FROM_ROUTE = 'SET_FROM_ROUTE';
export const SET_ROUTE_CARD = 'SET_ROUTE_CARD';

export const setFromRoute = fromroute => dispatch => {
  dispatch({
    type: SET_FROM_ROUTE,
    payload: fromroute,
  });
};
export const setRouteCard = routecard => dispatch => {
  dispatch({
    type: SET_ROUTE_CARD,
    payload: routecard,
  });
};
