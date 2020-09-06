export default function instantTradeApi(token, data) {
  return global
    .fetch(`${global._env_.REACT_APP_API_SERVER}/trade/instant`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }

      throw res;
    });
}
