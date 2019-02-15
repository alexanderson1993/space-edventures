import React, { useState } from "react";
import { Input, Words, Center, DatePicker } from "../../../components";
import { Blockquote, Loading } from "@arwes/arwes";
import GET_USER from "./getUser.graphql";
import { Query } from "react-apollo";
import css from "@emotion/css";

const GetUser = ({ id, children }) => {
  const [birthDate, setBirthDate] = useState(null);
  const [parentEmail, setParentEmail] = useState("");
  return children({
    user: {
      id: "2Tvmpky2CXZlqONPGGSYpE4p5c32",
      verification: { stripeCustomerId: "asdf" }
    }
  });
  //data.userToVerify });

  return (
    <Query
      query={GET_USER}
      variables={{ id, birthDate, parentEmail }}
      skip={!birthDate || !parentEmail}
    >
      {({ loading, data, error }) => {
        if (loading)
          return (
            <Center>
              <Loading animate />
              <p>Getting user...</p>
            </Center>
          );
        if (error)
          return (
            <Center>
              <h2>Error getting user:</h2>
              <h3>{error.message}</h3>
            </Center>
          );
        if (data && data.userToVerify) {
          return children({ user: data.userToVerify });
        }
        return (
          <form onSubmit={e => e.preventDefault()}>
            <div>
              <h2>
                In compliance with{" "}
                <a
                  css={css`
                    text-decoration: underline !important;
                  `}
                  href="https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  COPPA
                </a>{" "}
                and to protect your child's privacy, we need to collect
                information to verify that you are the child's parent and that
                you consent to your child using our website.
              </h2>
              <p>
                Enter the following information to begin the verification
                process.
              </p>
            </div>

            <div>
              <label htmlFor="parentEmail">Parent's Email: </label>
              <Input
                id="parentEmail"
                type="parentEmail"
                defaultValue={parentEmail}
                block
                onBlur={e => setParentEmail(e.target.value)}
              />
              {error && error.field === "parentEmail" && (
                <Blockquote layer="alert">
                  <Words>{error.message}</Words>
                </Blockquote>
              )}
            </div>
            <div>
              <label>
                <Words>Child's Birth Date: </Words>
                <div>
                  <DatePicker value={birthDate} onChange={setBirthDate} />
                </div>
              </label>
              {error && error.field === "birthdate" && (
                <Blockquote layer="alert">
                  <Words>{error.message}</Words>
                </Blockquote>
              )}
            </div>
            {data && !data.userToVerify && (
              <Blockquote layer="alert">
                <Words>
                  Unable to find user that matches the information you provided.
                  Try again.
                </Words>
              </Blockquote>
            )}
          </form>
        );
      }}
    </Query>
  );
};

export default GetUser;
