export default function createActiveTrade(token, data) {
  return global
    .fetch(`${process.env.REACT_APP_API_SERVER}/trade`, {
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
