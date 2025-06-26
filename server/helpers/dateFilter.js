const moment = require("moment");

const SUPPORTED_FILTERS = ["today", "yesterday", "this_week"]; // Easily extendable

/**
 * Returns a MongoDB filter for `timeIn` and/or `timeOut` fields
 * based on the given filterDate string.
 */
function getDateRangeFilter(filterDate) {
  if (!filterDate || !SUPPORTED_FILTERS.includes(filterDate)) return {};

  let startDate, endDate;

  switch (filterDate) {
    case "today":
      startDate = moment().startOf("day").toDate();
      endDate = moment().endOf("day").toDate();
      break;

    case "yesterday":
      startDate = moment().subtract(1, "days").startOf("day").toDate();
      endDate = moment().subtract(1, "days").endOf("day").toDate();
      break;

    case "this_week":
      startDate = moment().startOf("week").toDate();
      endDate = moment().endOf("week").toDate();
      break;

    default:
      return {}; // Fallback if something slips through
  }

  return {
    $or: [
      {
        timeIn: {
          $gte: startDate,
          $lte: endDate,
        },
      },
      {
        timeOut: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    ],
  };
}

module.exports = {
  getDateRangeFilter,
  SUPPORTED_FILTERS,
};
