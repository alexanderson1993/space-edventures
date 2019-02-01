// See Server-Side version: https://firebase.google.com/docs/auth/admin/manage-users#create_a_user
// See Client-Side version: https://firebase.google.com/docs/auth/web/manage-users#delete_a_user
module.exports = function addFirebaseUsers(admin) {
  // I couldn't figure out out how to use the client-side to delete all the users, and the
  // server-side code didn't work because our cloud functions account doesn't have the right permissions
  // So these were added on the online portal, and the ids are just hard-coded here
  // Password are all Test1234
  return [
    // =====================================================================
    // Directors
    // =====================================================================
    {
      email: "directora@example.com",
      uid: "ykR3TSwRYAXcvqgYGaNR2G3Px2w2",
      firstName: "DirectorA",
      lastName: "LastNameA"
    },
    {
      email: "directorb@example.com",
      uid: "xGF5XDGdq0MPvHheBA52PAXdeOh2",
      firstName: "DirectorB",
      lastName: "LastNameB"
    },
    // =====================================================================
    // participants
    // =====================================================================
    {
      uid: "msQzvFPNxtah56oz5CMV9A8vFnB2",
      firstName: "ParticipantA",
      lastName: "LastNameA",
      displayName: "Star Fox",
      email: "participanta@example.com"
    },
    {
      uid: "gMW11QlWslO1KlEhw2PCY6IrLKm2",
      firstName: "ParticipantB",
      lastName: "LastNameB",
      displayName: "Star Duck",
      email: "participantb@example.com"
    },
    {
      uid: "tAyTJnSSSvXUzqZEuimVmaqfipb2",
      firstName: "ParticipantC",
      lastName: "LastNameC",
      displayName: "Star Bear",
      email: "participantc@example.com"
    },
    {
      uid: "Vt9VfgbVxUOCfURwVBlTGheqp9j2",
      firstName: "ParticipantD",
      lastName: "LastNameD",
      displayName: "Star Fish",
      email: "participantd@example.com"
    },
    {
      uid: "cRZ0lYnv64e8TfcAW50QwLLzXOu2",
      firstName: "ParticipantE",
      lastName: "LastNameE",
      displayName: "Star Lord",
      email: "participante@example.com"
    }
  ];
};
