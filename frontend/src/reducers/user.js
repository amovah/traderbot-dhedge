import actionTypes from "src/actions";

export default (state = { status: false, key: "" }, action) => {
  switch (action.type) {
    case actionTypes.user.LOGIN: {
      return {
        status: true,
        token: action.token,
      };
    }

    default: {
      return state;
    }
  }
};
