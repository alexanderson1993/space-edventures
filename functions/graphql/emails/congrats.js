module.exports = function congrats({
  stationName,
  flightType,
  date,
  simulator,
  badges = []
}) {
  const mission = badges.find(b => b.type === "mission");
  const regularBadges = badges.filter(b => b.type !== "mission");

  return `<p>Hi there!</p>
        
<p>Congratulations! Your recent flight has been recorded in <a href="https://spaceedventures.org">Space EdVentures</a>. The hours you earned have been added to your rank total.

</p><p>Here are the details of your flight:

</p><p><b>Date: </b>${date.toLocaleDateString()}

</p><p><b>Flight Type: </b>${flightType.name}
</p><p><b>Flight Hours: </b>${flightType.flightHours}
</p><p><b>Class Hours: </b>${flightType.classHours}
</p><p><b>Simulator: </b>${simulator.name}
</p><p><b>Station: </b>${stationName}
${mission && `</p><p><b>Mission: </b>${mission.name}`}
${regularBadges.length > 0 &&
  `</p><p><b>Badges:</b> <ul>${regularBadges
    .map(b => `<li>${b.name}</li>`)
    .join("")}</ul>`}

</p><p>Check out your new <a href="https://spaceedventures.org/user/certificate">rank certificate.</a>

</p><p>Thanks!

</p><p>Space EdVentures</p>
`;
};
