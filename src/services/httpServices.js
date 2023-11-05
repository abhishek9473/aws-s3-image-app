export const get = (url) =>
  new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
          reject(data.error); // Reject the promise in case of an error
        } else {
          resolve(data); // Resolve the promise with the retrieved data
        }
      })
      .catch((error) => {
        console.error("Error retrieving the product:", error);
        reject(error); // Reject the promise in case of a network error
      });
  });

export const post = (url, data) => {
  return new Promise((resolve, reject) => {
    // Return a Promise
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.error) {
          console.log(responseData.error);
          reject(responseData.error); // Reject the promise in case of an error
        } else {
          resolve(responseData); // Resolve the promise with the response data
        }
      })
      .catch((error) => {
        console.error("Error adding the product:", error);
        reject(error); // Reject the promise in case of a network error
      });
  });
};
