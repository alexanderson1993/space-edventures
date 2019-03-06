import React, { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Words } from "../../components";
import ProfileContext from "../../helpers/profileContext";
import { withStyles, Loading } from "@arwes/arwes";
import Printable from "../../helpers/printable";
import { ReactComponent as Logo } from "../../assets/img/logo.svg";
import { sentenceCase } from "change-case";
import css from "@emotion/css";
import "./certificate.css";

const Container = styled("div")`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: white;
  color: black;
  font-family: "Electrolize", "sans-serif";
  svg {
    g path {
      fill: black !important;
    }
  }
  h1,
  h2,
  h3,
  h4 {
    color: black;
  }
  h2 {
    font-size: 30px;
  }
  h3 {
    font-size: 24px;
  }
  p {
    font-size: 20px;
  }
  textPath {
    font-family: "Diploma", display;
    font-size: 31px;
  }
  svg {
    height: 100%;
    width: 100%;
  }
  @media print {
    height: 99vh;
    textPath {
      background: black;
      fill: black;
    }
  }
`;

const Certificate = ({ theme, numberToWords, QrCode }) => {
  const { user } = useContext(ProfileContext);
  const [qrCode, setQrCode] = useState(null);
  useEffect(() => {
    if (!qrCode && user.token) {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      QrCode.toDataURL(canvas, user.token).then(res => setQrCode(res));
    }
  }, [QrCode, qrCode, user.token]);
  if (user.loading) return <Loading animate />;
  return (
    <Printable preview>
      <Container theme={theme}>
        <div
          css={css`
            width: 100%;
            height: 50%;
            position: absolute;
            left: 0;
            top: 0;
          `}
          dangerouslySetInnerHTML={{
            __html: `<svg viewBox="0 0 500 185">
          <path
            id="curve"
            d="M73.2,100C77.2,93.9 138.7,51.8 251.8,53C363.1,54.2 422.6,93.3 426.9,100"
            fill="transparent"
          />
          <text width="500">
            <textPath xlink:href="#curve">Certificate of Rank Advancement</textPath>
          </text>
        </svg>`
          }}
        />
        <div
          css={css`
            position: absolute;
            width: 30%;
            top: 20%;
          `}
        >
          <Logo />
        </div>
        <div
          css={css`
            margin-top: 30%;
            @media print {
              margin-top: 15%;
            }
            max-width: 60%;
          `}
        >
          <p>
            <Words>This certifies that</Words>
          </p>
          <h2>
            <Words>{user.profile.displayName || user.profile.name || ""}</Words>
          </h2>
          <p>
            <Words>
              Has been found worthy in Character, Experience, and Citizenship
              and has completed the necessary requirements to earn the rank of
            </Words>
          </p>
          <h3>
            <Words>{user.profile.rank && user.profile.rank.name}</Words>
          </h3>
          <p>
            <Words>
              and is entitled to all the rights and privileges pertaining
              thereto.
            </Words>
          </p>
          <p>
            Dated this {numberToWords.toWordsOrdinal(new Date().getDate())} day
            of {new Date().toLocaleString("en-us", { month: "long" })},{" "}
            {sentenceCase(
              numberToWords.toWords(new Date().getFullYear()).replace(",", "")
            )}
          </p>
          <p>
            <small>Confirmation Code: {user.token}</small>
          </p>
          <img
            css={css`
              position: absolute;
              right: 0;
              bottom: 0;
            `}
            src={console.log(qrCode) || qrCode}
            alt="qr code"
          />
        </div>
      </Container>
    </Printable>
  );
};

// Load these modules async so we don't overload our bundle.
const numberToWordsPromise = import("number-to-words");
const QrCodePromise = import("qrcode");

const WrappedCertificate = withStyles(() => {})(Certificate);
const ModuleLoader = props => {
  const [module, setModule] = useState(false);
  const [module2, setModule2] = useState(false);
  useEffect(() => {
    numberToWordsPromise.then(res => setModule(res));
    QrCodePromise.then(res => setModule2(res));
  }, []);
  if (!module || !module2) return <Loading animate />;
  return (
    <WrappedCertificate {...props} numberToWords={module} QrCode={module2} />
  );
};

export default ModuleLoader;
