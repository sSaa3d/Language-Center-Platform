import React from "react";

const TermsAndConditions = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold mb-6 text-center">
      Terms and Conditions
    </h1>
    <div className="prose max-w-none">
      <p>
        Welcome to our educational platform. By using this application, you
        agree to the following terms and conditions. Please read them carefully
        before proceeding with registration or use of our services.
      </p>
      <ol className="list-decimal pl-6 space-y-2">
        <li>
          <strong>Purpose of Use:</strong> This platform is intended solely for
          educational purposes. You agree to use the services and resources
          provided only for lawful, academic, and non-commercial activities.
        </li>
        <li>
          <strong>Data Collection and Storage:</strong> By registering or
          enrolling in courses, you consent to the collection and storage of
          your personal information (such as name, email, phone number, and
          academic data) strictly for educational administration, communication,
          and improvement of our services. Your data will not be sold or shared
          with third parties for marketing purposes.
        </li>
        <li>
          <strong>Consent to Contact:</strong> You agree that the platform and
          its administrators may contact you via email, phone, or other provided
          contact details regarding your enrollment, course updates, feedback,
          or other educational matters.
        </li>
        <li>
          <strong>Account Responsibility:</strong> You are responsible for
          maintaining the confidentiality of your account credentials and for
          all activities that occur under your account.
        </li>
        <li>
          <strong>Respectful Conduct:</strong> Users must treat instructors,
          staff, and fellow students with respect. Harassment, discrimination,
          or disruptive behavior will not be tolerated and may result in
          suspension or removal from the platform.
        </li>
        <li>
          <strong>Intellectual Property:</strong> All course materials, content,
          and resources are the intellectual property of the platform or its
          partners. You may not reproduce, distribute, or use these materials
          for commercial purposes without explicit permission.
        </li>
        <li>
          <strong>Changes to Terms:</strong> The platform reserves the right to
          update these terms and conditions at any time. Continued use of the
          platform after changes constitutes acceptance of the new terms.
        </li>
        <li>
          <strong>Termination:</strong> Violation of these terms may result in
          suspension or termination of your access to the platform and its
          services.
        </li>
        <li>
          <strong>Contact:</strong> For any questions regarding these terms,
          please contact our support team at support@aui.ma.
        </li>
      </ol>
      <p>
        By using this platform, you acknowledge that you have read, understood,
        and agree to abide by these terms and conditions.
      </p>
    </div>
  </div>
);

export default TermsAndConditions;
