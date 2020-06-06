import YT from "yandex-translate";

const { translate } = YT(
  "trnsl.1.1.20191024T065420Z.b1864d8992684387.41b0675c02ee20c3e71c53077224b1bfdaea19bd"
);

export function fetchTranslation(text) {
  const promise = new Promise((resolve, reject) => {
    translate(
      text,
      {
        to: "vi"
      },
      (err, res) => {
        if (err) reject(err);
        else resolve(res.text);
      }
    );
  });

  return wrapPromise(promise);
}

function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    r => {
      status = "success";
      result = r;
    },
    e => {
      status = "error";
      result = e;
    }
  );

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}
