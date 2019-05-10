const { firestore } = require("../connectors/firebase");
const uploadFile = require("../helpers/uploadFile");
// =============================================================================
// Class for Querying/Mutating Badges
// =============================================================================

module.exports = class Badge {
  static async createBadge(
    { name, description, type, image, simulatorIds },
    centerId
  ) {
    console.log(simulatorIds);
    const badgeData = await firestore()
      .collection("badges")
      .add({
        name,
        type,
        description,
        simulatorIds: simulatorIds || [],
        centerId
      });
    let file = null;
    if (image) {
      file = await uploadFile(image, `badges/${badgeData.id}`);
      await firestore()
        .collection("badges")
        .doc(badgeData.id)
        .update({ image: file.metadata.mediaLink });
    }
    const actualBadgeData = await badgeData.get();

    return new Badge({
      ...actualBadgeData.data(),
      id: actualBadgeData.id,
      image: file && file.metadata.mediaLink
    });
  }
  static async getBadges(type, centerId) {
    let ref = firestore().collection("badges");
    if (type) {
      ref = ref.where("type", "==", type);
    }
    if (centerId) {
      ref = ref.where("centerId", "==", centerId);
    }

    const badges = await ref.get();
    return badges.docs.map(d => new Badge({ ...d.data(), id: d.id }));
  }
  static async getBadge(id) {
    const badge = await firestore()
      .collection("badges")
      .doc(id)
      .get();

    // If this isn't an actual badge from the database, return false
    if (!badge.exists) {
      return false;
    }

    return new Badge({ ...badge.data(), id: badge.id });
  }
  static async badgeCount(centerId, type) {
    const docs = await firestore()
      .collection("badges")
      .where("centerId", "==", centerId)
      .where("type", "==", type)
      .get();
    return docs.size;
  }
  constructor({ id, name, type, description, image, centerId, simulatorIds }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.description = description;
    this.image = image;
    this.centerId = centerId;
    this.simulatorIds = simulatorIds;
  }
  async rename(name) {
    this.name = name;
    await firestore()
      .collection("badges")
      .doc(this.id)
      .update({ name });
    return this;
  }
  async changeDescription(description) {
    this.description = description;
    await firestore()
      .collection("badges")
      .doc(this.id)
      .update({ description });
    return this;
  }
  async changeImage(image) {
    const path = `badges/${this.id}/image`;
    const file = await uploadFile(image, path);
    await firestore()
      .collection("badges")
      .doc(this.id)
      .update({ image: file.metadata.mediaLink });
    this.image = file.metadata.mediaLink;
    return this;
  }
  async changeSimulators(simulatorIds) {
    this.simulatorIds = simulatorIds;
    await firestore()
      .collection("badges")
      .doc(this.id)
      .update({ simulatorIds });
    return this;
  }
  async delete() {
    await firestore()
      .collection("badges")
      .doc(this.id)
      .delete();
    return true;
    // It will throw an error if there is a problem.
  }
};
