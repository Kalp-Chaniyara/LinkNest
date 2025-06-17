import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Collection and Usage</h2>
        <p className="mb-4">
          Our application uses Google Calendar API and Google Account authentication to provide you with a seamless calendar management experience. We want to be transparent about how we handle your data:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>We only access your calendar data that you explicitly authorize</li>
          <li>Your Google account information is used solely for authentication purposes</li>
          <li>We do not store your calendar data on our servers</li>
          <li>We do not share your personal information with any third parties</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
        <p className="mb-4">
          We take your privacy seriously and implement appropriate security measures to protect your information:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>All data transmission is encrypted using industry-standard protocols</li>
          <li>We use secure authentication methods provided by Google</li>
          <li>We regularly review and update our security practices</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
        <p className="mb-4">
          You have complete control over your data:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>You can revoke access to your Google Calendar at any time</li>
          <li>You can delete your account and associated data</li>
          <li>You can request information about what data we have stored</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>
          If you have any questions about our privacy policy or how we handle your data, please contact us at kalpking1406@gmail.com
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy; 