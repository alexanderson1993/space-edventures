const {
  ForbiddenError,
  AuthenticationError
} = require("apollo-server-express");
const { Center } = require("../models");

module.exports = async function getCenter(user) {
  if (!user)
    throw new AuthenticationError(
      `You must be logged in to create simulators.`
    );
  const center = await Center.getCenterForUserId(user.id);
  if (!center)
    throw new ForbiddenError(`Insufficient permissions to create simulators.`);
  return center;
};
