module.exports = function childConsent(id) {
  return `<p>Hi there!</p>
        
<p>There was a problem verifying your consent for your child to use our Space EdVentures. We most likely weren't able to view or verify the images you uploaded.

</p><p>In compliance with COPPA laws, we have locked your child's account until you properly complete verification.

</p><p>To restart the verification process, use the following personalized link:

</p><p><a href="https://spaceedventures.org/parentVerify?id=${id}">https://spaceedventures.org/parentVerify?id=${id}</a>

</p><p>If you have any additional questions or think this action is in error, feel free to reach out by replying to this email. 

</p><p>Thanks!

</p><p>Space EdVentures</p>
`;
};
