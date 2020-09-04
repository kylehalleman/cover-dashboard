export default function fetcher<ResType>(
  url: string,
  authToken: string
): Promise<ResType | undefined> {
  return window
    .fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw Error("Oops");
      }
    })
    .catch(e => {
      console.log(e);
    });
}
