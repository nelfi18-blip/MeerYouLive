export const metadata = {
  title: "Terms and Conditions — MeetYouLive",
};

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Terms and Conditions</h1>
      <p>
        <strong>Last updated:</strong> February 2026
      </p>

      <h2>1. Use of the Platform</h2>
      <p>
        By accessing MeetYouLive you agree to use the platform only for lawful
        purposes. You must not upload, share, or transmit any content that is
        illegal, harmful, abusive, defamatory, or infringes any third-party
        rights.
      </p>

      <h2>2. User Content</h2>
      <p>
        You retain ownership of the content you upload. By publishing content on
        MeetYouLive you grant us a non-exclusive, royalty-free licence to
        display and distribute that content on the platform.
      </p>

      <h2>3. Payments</h2>
      <p>
        All payments are processed securely by Stripe. Except where required by
        law, payments for digital content are non-refundable once the content has
        been accessed. See our{" "}
        <a href="/refund">Refund Policy</a> for details.
      </p>

      <h2>4. Prohibited Content</h2>
      <p>
        You must not upload any illegal content, including but not limited to
        content that violates copyright, depicts minors inappropriately, or
        promotes violence or discrimination. Violations will result in immediate
        account termination.
      </p>

      <h2>5. Changes to these Terms</h2>
      <p>
        We may update these terms at any time. Continued use of the platform
        after changes are published constitutes your acceptance of the new terms.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions? Email us at{" "}
        <a href="mailto:support@meetyoulive.net">support@meetyoulive.net</a>.
      </p>
    </main>
  );
}
