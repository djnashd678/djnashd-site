import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How NASH.D handles information when you visit djnashd.com.",
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  return (
    <>
      <main className="privacy-page shell">
        <header className="privacy-header">
          <Link className="privacy-brand" href="/" aria-label="NASH.D home">
            NASH<span>.</span>D
          </Link>
          <h1>Privacy, clearly stated.</h1>
          <p className="privacy-updated">Last updated 11 August 2026</p>
        </header>

        <div className="privacy-content">
          <h2>Privacy notice</h2>
          <div>
            <section className="privacy-section">
              <p className="privacy-intro">
                This website is operated by NASH.D. This notice explains the limited information
                processed when you visit djnashd.com or contact us.
              </p>
            </section>

            <section className="privacy-section">
              <h3>Information processed when you visit</h3>
              <p>
                Like most websites, the site and its hosting infrastructure may process technical
                information needed to deliver and protect the service. This can include your IP
                address, user agent, requested page, request time, response status, and related
                security or diagnostic metadata.
              </p>
              <p>
                We use this information for website delivery, security, troubleshooting, and abuse
                prevention—not to build advertising profiles.
              </p>
            </section>

            <section className="privacy-section">
              <h3>Hosting and service providers</h3>
              <p>
                The website is hosted on Vercel, which provides infrastructure, content delivery,
                request handling, and operational logs. Vercel may process technical request data
                on our behalf in the locations where it operates. Service-provider processing can
                therefore involve data being handled outside Singapore, subject to the provider&apos;s
                safeguards and applicable terms.
              </p>
            </section>

            <section className="privacy-section">
              <h3>Temporary password gate</h3>
              <p>
                While the website is a work in progress, access is protected by a password gate.
                Passwords are checked on the server and are not stored in browser storage or written
                to application logs by this website.
              </p>
              <p>
                To limit repeated failed attempts, the server temporarily keeps an IP address,
                failure count, and reset time in memory. This record lasts for up to approximately
                15 minutes, may disappear sooner when a server instance ends, and is cleared after a
                successful login.
              </p>
            </section>

            <section className="privacy-section">
              <h3>Cookies</h3>
              <p>
                The current work-in-progress site uses one first-party, strictly necessary cookie:
                <strong> nashd_site_session</strong>. It remembers successful password-gate
                authentication for seven days so visitors do not need to enter the password on every
                page. It is HttpOnly, is used for authentication and security, and contains a signed
                session value—not the password.
              </p>
              <p>
                No optional analytics, advertising, or marketing cookies are currently used. There
                is therefore no optional cookie-consent banner. When the password gate is removed
                for public launch, this authentication cookie will no longer be set during ordinary
                visits unless the implementation changes.
              </p>
            </section>

            <section className="privacy-section">
              <h3>No advertising or analytics tracking</h3>
              <p>
                The site currently uses no Google Analytics, Google Tag Manager, Meta Pixel, TikTok
                Pixel, Vercel Analytics, or equivalent visitor-tracking technology. It does not set
                analytics or advertising cookies.
              </p>
            </section>

            <section className="privacy-section">
              <h3>Third-party links</h3>
              <p>
                The site links to services including Instagram, TikTok, Spotify, and Mixcloud. These
                are ordinary outbound links rather than embedded players or social widgets. Those
                services receive information under their own privacy practices only when you choose
                to visit them.
              </p>
            </section>

            <section className="privacy-section">
              <h3>Enquiries</h3>
              <p>
                If you email us, we receive the information you voluntarily include, such as your
                name, email address, enquiry, and any event or booking details. We use it to respond,
                manage the enquiry, and maintain appropriate business records. Please avoid sending
                sensitive information that is not needed for your request.
              </p>
            </section>

            <section className="privacy-section">
              <h3>Retention and your choices</h3>
              <p>
                We keep information only for as long as reasonably needed for the purposes described
                above, including security, operational, enquiry, and legal record-keeping needs.
                Retention can also depend on service-provider settings and applicable requirements.
              </p>
              <p>
                You may contact us to ask about personal information connected with you, request a
                correction, or raise a privacy concern. Whether a particular request can be fulfilled
                depends on the information involved and applicable requirements.
              </p>
              <p>
                Privacy and booking enquiries: <a href="mailto:hello@djnashd.com">hello@djnashd.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
