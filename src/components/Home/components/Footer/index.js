import React from "react";
import footer from './styles.css';
import styles from '../../../../styles.css';


export default class MainPageFooter extends React.Component {
    render() {
      return (
      <div id="footer" className="{footer.footer}">
          <footer className={footer.footer}>
              <h2 className={styles.SROnly}> Footer </h2>
              <div className={footer.EdGov}>
                  <a href="https://www2.ed.gov/about/offices/list/osers/osep/index.html" target="_blank">
                      <img className={footer.EdGovImg}
                           src="images/IDEA-logo.gif" alt="IDEA Logo" height="50"/>
                  </a>
              </div>
              <div className={footer.FooterText}>
                  The <a href="http://diagramcenter.org/" target="_blank">DIAGRAM Center</a> is a <a
                      href="http://www.benetech.org/"
                      target="_blank">Benetech </a>
                  initiative supported by the U.S. Department of Education, Office of Special Education Programs (Cooperative
                  Agreement
                  #H327B100001). Opinions expressed herein are those of the authors and do not necessarily represent the
                  position of
                  the U.S. Department of Education. Poet™ is a trademark of Beneficent Technology, Inc. This website is
                  copyright ©
                  2012-2017, Beneficent Technology, Inc.
              </div>
              <div className={footer.Benetech}>
                  <a href="https://www.benetech.org/" target="_blank">
                      <img className={footer.BenetechImg}
                           src="images/benetech_logo_transparent.gif" alt="Benetech Logo" height="50"/>
                  </a>
              </div>
          </footer>
      </div>
      );
    }
  }
