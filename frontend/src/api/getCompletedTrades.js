export default function getCompletedTrades(token) {
  return global
    .fetch(`${process.env.REACT_APP_API_SERVER}/trade/fullfied`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }

      throw new Error("Permission Denied");
    });
}
