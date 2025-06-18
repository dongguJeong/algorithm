// { "a": [1, 2, { "b": 3 }] }
// { "key": [1, 2, 3] }
// { "key": [1, 2, 3 }
// {"a":{"b":[]},"c":{}}

const fs = require("fs");
const input = fs.readFileSync("json-parser.txt").toString().trim();
const eraseSpace = input.replaceAll(" ", "");

function isValidObject(obj) {
  console.log("test obj", obj);
  if (obj[0] !== "{" || obj[obj.length - 1] !== "}") {
    console.log("INVALID {}");
    process.exit(1);
  }

  // {} 제거
  const contents = obj.substring(1, obj.length - 1).trim();
  console.log("contents", contents);

  // 빈 객체는 return true
  if (contents.length === 0) {
    return true;
  }

  // , 기준으로 자르고
  const items = splitComma(contents);

  // key value로 나누고
  for (let i = 0; i < items.length; i++) {
    const { key, value } = splitKeyValue(items[i]);
    console.log("key : ", key, " value : ", value);
    isValidKey(key);
    isValidValue(value);
  }
  return true;
}

function splitComma(str) {
  const res = [];
  let depth = 0;
  let temp = "";

  for (let i = 0; i < str.length; i++) {
    if (str[i] === "," && depth === 0) {
      res.push(temp);
      temp = "";
    } else if (str[i] === "{" || str[i] === "[") {
      temp += str[i];
      depth += 1;
    } else if (str[i] === "}" || str[i] === "]") {
      temp += str[i];
      depth -= 1;
    } else {
      temp += str[i];
    }
  }
  res.push(temp);
  console.log("comma", res);
  return res;
}

function splitKeyValue(str) {
  let key = "";
  let value = "";
  let doubleQuoteCount = 0;

  for (let i = 0; i < str.length; i++) {
    if (doubleQuoteCount === 2 && str[i] === ":") {
      doubleQuoteCount += 1;
    } else if (doubleQuoteCount <= 2) {
      key += str[i];
      if (str[i] === '"') {
        doubleQuoteCount += 1;
      }
    } else {
      value += str[i];
    }
  }

  return { key, value };
}

function isValidKey(key) {
  if (key[0] !== '"' || key[key.length - 1] !== '"' || key.length < 3) {
    console.log("INVALID KEY");
    process.exit(1);
  }
  return true;
}

function isValidValue(value) {
  if (value[0] === "{") {
    if (isValidObject(value)) return true;
    else {
      console.log("INVALID object value");
      process.exit(1);
    }
  } else if (value[0] === "[") {
    if (isValidArray(value)) {
      return true;
    } else {
      console.log("INVALID array value");
      process.exit(1);
    }
  } else {
    if (isNubmerOrBooleanOrStringOrNull(value)) {
      return true;
    } else {
      console.log("INVALID value");
      process.exit(1);
    }
  }
}

function isValidArray(array) {
  if (array[0] !== "[" || array[array.length - 1] !== "]") {
    console.log("INVALID array []");
    process.exit(1);
  }

  // 빈 배열이면 return true
  if (array.length === 2) {
    return true;
  }

  const contents = array.substring(1, array.length - 1);
  const items = splitComma(contents);

  for (let i = 0; i < items.length; i++) {
    const target = items[i];

    if (target[0] === "[") {
      isValidArray(target);
    } else if (target[0] === "{") {
      isValidObject(target);
    } else {
      if (isNubmerOrBooleanOrStringOrNull(target)) continue;
      else {
        console.log("INVALID array value");
        process.exit(1);
      }
    }
  }

  return true;
}

function isNubmerOrBooleanOrStringOrNull(value) {
  console.log("이것저것 검사 ", value);
  if (
    value === "null" ||
    !isNaN(Number(value)) ||
    value === "true" ||
    value === "false"
  ) {
    return true;
  }

  if (value[0] === '"' && value[value.length - 1] === '"') {
    return true;
  }

  if (value[0] === "'" && value[value.length - 1] === "'") {
    return true;
  }
  return false;
}

isValidObject(eraseSpace);

console.log("VALIDATE");
