import React from "react";

const TermsAndConditions = () => {
  return (
    <div>
      <h1>Terms and Conditions</h1>
      <p>
        <strong>Effective Date: July 25, 2024</strong>
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By using the App, you agree to these Terms, as well as our Privacy
        Policy. If you do not agree with these Terms, please do not use the App.
      </p>

      <h2>2. Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. Any changes will
        be effective immediately upon posting the updated Terms on our website.
        Your continued use of the App following the posting of changes
        constitutes your acceptance of such changes.
      </p>

      <h2>3. User Accounts</h2>
      <p>
        To use certain features of the App, such as converting playlists, you
        may need to create an account and link your Spotify and YouTube
        accounts. You agree to provide accurate, current, and complete
        information during the registration process and to update such
        information to keep it accurate, current, and complete.
      </p>

      <h2>4. Privacy Policy</h2>
      <p>
        Our Privacy Policy explains how we collect, use, and protect your
        personal information. By using the App, you consent to our Privacy
        Policy, which is incorporated into these Terms by reference.
      </p>

      <h2>5. Google API Access</h2>
      <p>The App uses Google API services, including:</p>
      <ul>
        <li>
          <code>.../auth/userinfo.email</code> - We access your primary Google
          Account email address.
        </li>
        <li>
          <code>.../auth/userinfo.profile</code> - We view your personal info,
          including any personal info you have made publicly available.
        </li>
        <li>
          <code>.../auth/youtube</code> - We manage your YouTube account,
          including accessing and managing your YouTube content.
        </li>
      </ul>
      <p>
        You can review Google's API Services User Data Policy{" "}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>

      <h2>6. Spotify API Access</h2>
      <p>The App uses Spotify API services, including:</p>
      <ul>
        <li>
          <code>playlist-read-private</code> - We access your private playlists.
        </li>
        <li>
          <code>playlist-read-collaborative</code> - We access collaborative
          playlists you have access to.
        </li>
      </ul>
      <p>
        You can review Spotify's API Terms of Service{" "}
        <a
          href="https://developer.spotify.com/terms/"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>

      <h2>7. User Data</h2>
      <p>
        We may collect and store data related to your use of the App. This
        includes data necessary to provide our services and improve user
        experience. Your data will not be shared with third parties without your
        consent, except as required by law.
      </p>

      <h2>8. Prohibited Conduct</h2>
      <p>
        You agree not to use the App for any unlawful purposes or in any manner
        that could damage, disable, overburden, or impair the App. You also
        agree not to interfere with any other party's use and enjoyment of the
        App.
      </p>

      <h2>9. Intellectual Property</h2>
      <p>
        All content, trademarks, and other intellectual property rights related
        to the App are owned by [Your Company Name] or its licensors. You may
        not use any content from the App without express written permission from
        [Your Company Name].
      </p>

      <h2>10. Disclaimers</h2>
      <p>
        The App is provided "as is" and "as available," without any warranties
        of any kind. [Your Company Name] does not warrant that the App will be
        uninterrupted or error-free.
      </p>

      <h2>11. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, [Your Company Name] will not be
        liable for any indirect, incidental, special, consequential, or punitive
        damages arising from or related to your use of the App.
      </p>

      <h2>12. Governing Law</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of
        [Your State/Country], without regard to its conflict of law principles.
      </p>

      <h2>13. Contact Us</h2>
      <p>
        If you have any questions or concerns about these Terms, please contact
        us at:
      </p>
      <p>
        Email:{" "}
        <a href="mailto:Ranasiaclark010@gmail.com">Ranasiaclark010@gmail.com</a>
      </p>

      <p>Thank you for using SpotieTub!</p>
    </div>
  );
};

export default TermsAndConditions;
