export default function getActiveTrades(token) {
  return global
    .fetch(`${process.env.REACT_APP_API_SERVER}/trade/active`, {
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
