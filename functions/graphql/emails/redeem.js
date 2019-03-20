module.exports = function redeem({
  stationName,
  flightType,
  date,
  simulator,
  token,
  badges = []
}) {
  const mission = badges.find(b => b.type === "mission");
  const regularBadges = badges.filter(b => b.type !== "mission");

  return `<p>Hi there!</p>
        
<p>You are receiving this email because you requested a token for your recent <a href="https://spaceedventures.org">Space EdVentures</a> flight.

</p><p>If you want to track your flight hours and earn ranks, you will have to <a href="">create a new account</a>.
</p><p>Then, go to the <a href="">redemption page</a> and enter the following redemption token:

</p><br/><p>${token}


</p><br/><p>Here are the details of your flight:

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

</p><p>Thanks!

</p><p>Space EdVentures</p>
`;
};
