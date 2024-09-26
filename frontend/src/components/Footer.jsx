import {
  LogosGooglePay,
  LogosMastercard,
  LogosAmex,
  LogosDinersclub,
  LogosVisa,
  LogosFacebook,
  SkillIconsInstagram,
  DeviconLinkedin,
  IcBaselineTiktok,
  LogosStripe,
} from "./LogoIcons"; // Adjust the import path as necessary

import { Container, Row, Col } from "react-bootstrap";
import LogoSection from "./LogoSection";

const Footer = () => {
  return (
    <footer
      style={{
        padding: "10px",
        backgroundColor: "#fafafa ",
        marginTop: "5rem",
      }}
    >
      <Container className="container mt-5 mb-5">
        <Row className=" mb-4 justify-content-center">
          <Col md={3}>
            <p>
              <strong>Payment</strong>
            </p>
            <div>
              <LogosGooglePay style={logoStyle} />
            </div>

            <div>
              <LogosVisa style={logoStyle} />
              <LogosMastercard style={logoStyle} />
              <LogosAmex style={logoStyle} />
              <LogosDinersclub style={logoStyle} />
            </div>

            <p className="mt-3" style={{ fontSize: "0.8em" }}>
              Powered By <LogosStripe style={logoStyle} />
            </p>
          </Col>
          <Col md={3}>
            <p>
              <strong>Follow us</strong>
            </p>
            <div
              className="d-flex align-items-center"
              style={{ fontSize: "0.9em" }}
            >
              <LogosFacebook className="me-2" style={socialLogoStyle} />
              Facebook
            </div>

            <div
              className="d-flex align-items-center"
              style={{ fontSize: "0.9em" }}
            >
              <SkillIconsInstagram className="me-2" style={socialLogoStyle} />
              Instagram
            </div>

            <div
              className="d-flex align-items-center"
              style={{ fontSize: "0.9em" }}
            >
              <DeviconLinkedin className="me-2" style={socialLogoStyle} />{" "}
              Linkedin
            </div>

            <div
              className="d-flex align-items-center"
              style={{ fontSize: "0.9em" }}
            >
              <IcBaselineTiktok className="me-2" style={socialLogoStyle} />
              TikTok
            </div>
          </Col>
          <Col md={3}>
            <LogoSection />
          </Col>
        </Row>
        <Row className="justify-content-center text-center">
          {/* <hr></hr> */}
          <div style={{ color: "#2c3e50 ", fontWeight: "300" }}>
            &copy; {new Date().getFullYear()} Uncle Thomas Minimart. All rights
            reserved.
          </div>
          <div
            className="mb-3"
            style={{ color: "#2c3e50 ", fontWeight: "300", fontSize: "0.9em" }}
          >
            Contact us: support@unclethomasminimart.com
          </div>
          <hr></hr>
          <div
            style={{ color: "#2c3e50 ", fontWeight: "300", fontSize: "0.7em" }}
          >
            Designed & Developed by Lawrence Lee
          </div>
          <div>
            <a
              href="https://www.linkedin.com/in/lawrence-mklee/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#0277bd ",
                fontWeight: "300",
                fontSize: "0.7em",
                textDecoration: "none",
              }}
            >
              https://www.linkedin.com/in/lawrence-mklee/
            </a>
          </div>
        </Row>
      </Container>
    </footer>
  );
};

const logoStyle = {
  width: "40px",
  height: "auto",
  marginBottom: "1rem",
  marginRight: "2rem",
};

const socialLogoStyle = {
  width: "25px",
  height: "auto",
  marginBottom: "1rem",
  marginRight: "2rem",
};

export default Footer;
