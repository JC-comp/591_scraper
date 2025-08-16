const { saltLength, algorithm, chunkSize, key } = {
  key: "5f0d5ff448",
  algorithm: "SHA-256",
  saltLength: 16,
  chunkSize: 8
};

function splitBySize(str, size) {
  const e = [];
  for (let n = 0; n < str.length; n += size)
    e.push(str.slice(n, n + size));
  return e;
}

export default async function getSign(params) {
  // Generate random salt
  const random_bytes = new Uint8Array(saltLength / 2);
  crypto.getRandomValues(random_bytes);
  const salt = Array.from(random_bytes).map(e => e.toString(16).padStart(2, "0")).join("");

  // Create query from param
  params['___salt___'] = salt;
  const param_str = Object.keys(params)
    .sort((t, e) => t < e ? 1 : t > e ? -1 : 0).map(t => `${t}=${params[t]}`).join("&")

  // Hash query
  const hashed_buffer = await crypto.subtle.digest(algorithm, new TextEncoder().encode(param_str));
  const hashed_params = Array.from(new Uint8Array(hashed_buffer)).map(s => s.toString(16).padStart(2, "0")).join("");

  const chunck_num = salt.length / chunkSize;
  // Split salt into chunks
  const splitted_salt = [];
  for (let n = 0; n < salt.length; n += chunck_num)
    splitted_salt.push(salt.slice(n, n + chunck_num));

  // Generate random positions
  let positions = new Set;
  while (positions.size < chunkSize)
    positions.add(Math.floor(Math.random() * hashed_params.length));
  positions = Array.from(positions).sort((n, a) => n - a);
  // Insert salt into hashed result
  let encoded_hash = hashed_params.split("");
  positions.forEach((position, index) => {
    encoded_hash.splice(position + index, 0, splitted_salt[index])
  });
  encoded_hash = encoded_hash.join("");

  const encoded_position = positions.map(w => w.toString().padStart(2, "0")).join("");
  const [p, y] = splitBySize(encoded_position, encoded_position.length / 2)
  const [m, S] = splitBySize(key, key.length / 2);
  return m + p + encoded_hash + y + S;
}