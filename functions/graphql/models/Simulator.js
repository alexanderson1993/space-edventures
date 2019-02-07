const { firestore } = require("../connectors/firebase");

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
    return simulators.docs.map(d => new Simulator({ ...d.data(), id: d.id }));
  }
  static async getSimulator(id) {
    const simulator = await firestore()
      .collection("simulators")
      .doc(id)
      .get();
    return new Simulator({ ...simulator.data(), id: simulator.id });
  }
  constructor({ id, name, centerId }) {
    this.id = id;
    this.name = name;
    this.centerId = centerId;
  }
  async rename(name) {
    this.name = name;
    await firestore()
      .collection("simulators")
      .doc(this.id)
      .update({ name });
    return this;
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
