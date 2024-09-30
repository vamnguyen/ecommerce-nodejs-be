"use strict";

const _ = require("lodash");

const getInfoData = ({ field = [], object = {} }) => {
  return _.pick(object, field);
};

// [ 'name', 'email' ] => { name: 1, email: 1 }
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

// [ 'name', 'email' ] => { name: 0, email: 0 }
const unSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]));
};

const removeUndefinedData = (object) => {
  Object.keys(object).forEach((key) => {
    if (object[key] && typeof object[key] === "object") {
      removeUndefinedData(object[key]);
    } else if (object[key] == null || object[key] === undefined) {
      delete object[key];
    }
  });
  return object;
};

const updateNestedObjectParser = (object) => {
  const final = {};
  Object.keys(object || {}).forEach((key) => {
    if (typeof object[key] === "object" && !Array.isArray(object[key])) {
      const response = updateNestedObjectParser(object[key]);
      Object.keys(response || {}).forEach((nestedKey) => {
        final[`${key}.${nestedKey}`] = response[nestedKey];
      });
    } else {
      final[key] = object[key];
    }
  });
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  unSelectData,
  removeUndefinedData,
  updateNestedObjectParser,
};
