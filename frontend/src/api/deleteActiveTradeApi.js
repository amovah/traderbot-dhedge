export default function deleteActiveTradeApi(token, id) {
  return global
    .fetch(`${process.env.REACT_APP_API_SERVER}/trade/${id}`, {
      method: "DELETE",
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
