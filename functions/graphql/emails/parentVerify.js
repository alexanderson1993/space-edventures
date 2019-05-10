module.exports = function parentVerify({ id, email }) {
  return `<p>Hi there!</p>
        
<p>We recently got a registration on our site for your child with the email address "${email}". We noticed that your child is under the age of 13. To comply with the Children's Online Privacy Protection Act, you must verify your permission for the child to use this site.

</p><p>Space EdVentures allows your child to track their flight hours and rank at the many Space EdVentures centers. Participants can receive discounts or awards for reaching certain ranks.

</p><p>If you would like to verify your permission for SpaceEdVentures.org, use the following personalized link:

</p><p><a href="https://spaceedventures.org/parentVerify?id=${id}">https://spaceedventures.org/parentVerify?id=${id}</a>

</p><p>If you don't want your child to use this site, you don't have to do anything! We'll delete any information we collected from your child in 30 days.

</p><p>If you have any additional questions, feel free to reach out by replying to this email.

</p><p>Thanks!

</p><p>Space EdVentures</p>
`;
};
