export const metadata = {
  title: "Privacy Policy — MeetYouLive",
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Privacy Policy</h1>
      <p>
        <strong>Last updated:</strong> February 2026
      </p>

      <h2>1. Data We Collect</h2>
      <p>
        When you create an account we collect your email address and, if you
        choose Google Sign-In, your public Google profile information (name and
        profile picture). Payment details (card numbers) are handled entirely by
        Stripe and are never stored on our servers.
      </p>

      <h2>2. How We Use Your Data</h2>
      <p>
        We use your data solely to operate the platform: authenticating you,
        processing payments, and communicating service updates. We do not sell or
        share your data with third parties for marketing purposes.
      </p>

      <h2>3. Cookies</h2>
      <p>
        MeetYouLive uses essential cookies and local-storage tokens to keep you
        logged in. We do not use advertising or tracking cookies.
      </p>

      <h2>4. Third-Party Services</h2>
      <ul>
        <li>
          <strong>Stripe</strong> — payment processing.{" "}
          <a
            href="https://stripe.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stripe Privacy Policy
          </a>
        </li>
        <li>
          <strong>Google OAuth</strong> — optional sign-in.{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Privacy Policy
          </a>
        </li>
      </ul>

      <h2>5. Data Retention</h2>
      <p>
        We retain your account data for as long as your account is active. You
        may request deletion of your account and associated data by contacting
        us.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions? Email us at{" "}
        <a href="mailto:support@meetyoulive.net">support@meetyoulive.net</a>.
      </p>
    </main>
  );
}
