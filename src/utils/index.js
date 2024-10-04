"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

/**
 * Convert string to ObjectId Mongodb
 * @param {String} id
 * @returns {ObjectId}
 */
const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

/**
 * Get info data from object
 * @param {Array} field
 * @param {Object} object
 * @returns {Object}
 */
const getInfoData = ({ field = [], object = {} }) => {
  return _.pick(object, field);
};

/**
 * Get select data from array
 * @param {Array} select
 * @example [ 'name', 'email' ] => { name: 1, email: 1 }
 * @returns {Object}
 */
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

/**
 * Unselect data from array
 * @param {Array} select
 * @example [ 'name', 'email' ] => { name: 0, email: 0 }
 * @returns {Object}
 */
const unSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]));
};

/**
 * Remove null or undefined data from object
 * @param {Object} object
 * @returns {Object}
 */
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

/**
 * Update nested object parser
 * @param {Object} object
 * @example { a: { b: 1 } } => { 'a.b': 1 }
 * @returns {Object}
 */
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
  convertToObjectIdMongodb,
};
