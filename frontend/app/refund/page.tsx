export const metadata = {
  title: "Refund Policy — MeetYouLive",
};

export default function RefundPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Refund Policy</h1>
      <p>
        <strong>Last updated:</strong> February 2026
      </p>

      <h2>1. Digital Content</h2>
      <p>
        All purchases on MeetYouLive are for digital content (live streams,
        videos, and virtual gifts). Because digital content is delivered
        instantly upon purchase, payments are generally non-refundable once the
        content has been accessed.
      </p>

      <h2>2. Exceptional Cases</h2>
      <p>We will consider refund requests in the following situations:</p>
      <ul>
        <li>Technical failure that prevented you from accessing paid content.</li>
        <li>
          Duplicate charge caused by a payment processing error.
        </li>
        <li>
          Unauthorised transaction (please also contact your bank or card
          issuer).
        </li>
      </ul>

      <h2>3. How to Request a Refund</h2>
      <p>
        Send an email to{" "}
        <a href="mailto:support@meetyoulive.net">support@meetyoulive.net</a>{" "}
        within <strong>7 days</strong> of the charge, including:
      </p>
      <ul>
        <li>Your registered email address.</li>
        <li>The date and amount of the charge.</li>
        <li>A description of the issue.</li>
      </ul>
      <p>
        We aim to respond within 3 business days. Approved refunds are processed
        through Stripe and may take 5–10 business days to appear on your
        statement.
      </p>

      <h2>4. Contact</h2>
      <p>
        <a href="mailto:support@meetyoulive.net">support@meetyoulive.net</a>
      </p>
    </main>
  );
}
