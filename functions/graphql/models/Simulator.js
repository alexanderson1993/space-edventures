const { firestore } = require("../connectors/firebase");

// =============================================================================
// Class for Querying/Mutating space centers
// =============================================================================

module.exports = class Simulator {
  constructor({ id, name, stations, centerId }) {
    this.id = id;
    this.name = name;
    this.centerId = centerId;
    this.stations = stations;
  }
  static async createSimulator(name, stations, centerId) {
    const simulatorData = await firestore()
      .collection("simulators")
      .add({
        name,
        stations,
        centerId
      });
    return new Simulator({ id: simulatorData.id, name, stations, centerId });
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

    if (!simulator.exists) {
      return false;
    }

    return new Simulator({ ...simulator.data(), id: simulator.id });
  }
  static async centerCount(centerId) {
    const docs = await firestore()
      .collection("simulators")
      .where("centerId", "==", centerId)
      .get();
    return docs.size;
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
