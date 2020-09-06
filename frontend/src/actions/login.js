import types from "./index";
import store from "src/store";

export default function userLogin(token) {
  store.dispatch({
    type: types.user.LOGIN,
    token,
  });
}
