const { firestore } = require("../connectors/firebase");
const { UserInputError } = require("apollo-server-express");
const uuid = require("uuid");
// =============================================================================
// Class for Querying/Mutating space centers
// =============================================================================

module.exports = class Simulator {
  static async createSimulator(name, centerId) {
    const simulatorData = await firestore()
      .collection("simulators")
      .add({
        name,
        centerId
      });
    return new Simulator(simulatorData);
  }
  static async getSimulators(centerId) {
    const simulators = await firestore()
      .collection("simulators")
      .where("centerId", "==", centerId)
      .get();
    return simulators.docs.map(d => ({ ...d.data(), id: d.id }));
  }
  static async getSimulator(id) {
    const simulator = await firestore()
      .collection("simulators")
      .doc(id)
      .get();
    return { ...simulator.data(), id: simulator.id };
  }
  constructor({ id, name, centerId }) {
    this.id = id;
    this.name = name;
    this.centerId = centerId;
  }
  rename(name) {
    this.name = name;
    return firestore()
      .collection("simulators")
      .doc(this.id)
      .update({ name });
  }
  async delete() {
    await firestore()
      .collection("simulators")
      .doc(this.id)
      .delete();
    return true;
    // It will throw an error if there is a problem.
  }
};
