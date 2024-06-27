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

module.exports = {
  getInfoData,
  getSelectData,
  unSelectData,
};
