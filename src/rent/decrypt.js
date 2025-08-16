const config = {
  "algorithm": "AES-GCM",
  "keyLength": 128,
  "ivLength": 12,
  "tagLength": 128
}

function toBuffer(encoded) {
  const str = atob(encoded);
  const buffer_array = new Uint8Array(str.length);
  for (let r = 0; r < str.length; r++)
    buffer_array[r] = str.charCodeAt(r);
  return buffer_array.buffer
}

function decodeText(str) {
  const t = atob(str);
  const n = new Uint8Array(t.length);
  for (let i = 0; i < t.length; i++)
    n[i] = t.charCodeAt(i);
  return new TextDecoder().decode(n)
}

function mergeBuffer(buffer, tag) {
  const n = new Uint8Array(buffer.byteLength + tag.byteLength);
  n.set(new Uint8Array(buffer), 0);
  n.set(new Uint8Array(tag), buffer.byteLength);
  return n.buffer;
}

export default async function decrypt(text) {
  // extract key
  const key_str_len = config.keyLength / 4;
  const key_str = text.slice(0, key_str_len);
  text = text.slice(key_str_len + 6);

  // extract tag, iv
  const cipher_range_len = Number.parseInt(text.slice(0, 4));
  const [start, end] = decodeText(text.slice(-cipher_range_len)).split("-").map(Number);
  text = text.slice(4, -cipher_range_len);

  const tag_str = text.slice(0, start);
  const iv_str = text.slice(-end);
  text = text.slice(start, -end);

  // Create decrypt key
  const key_buffer = new Uint8Array(key_str.length / 2);
  for (let n = 0; n < key_str.length; n += 2)
    key_buffer[n / 2] = Number.parseInt(key_str.slice(n, n + 2), 16);
  const key = await crypto.subtle.importKey("raw", key_buffer, {
    name: config.algorithm,
    length: config.keyLength
  }, true, ["decrypt"]);

  // decrypt
  const iv = toBuffer(iv_str)
  const tag = toBuffer(tag_str);
  const buffer = toBuffer(text);
  const result = await crypto.subtle.decrypt({
    name: config.algorithm,
    iv: iv,
    tagLength: config.tagLength
  }, key, mergeBuffer(buffer, tag))

  return JSON.parse(new TextDecoder("utf-8").decode(new Uint8Array(result)));
}