import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
import GuideSchema from '@/components/seo/GuideSchema';

export const metadata = {
    title: 'Terms and Conditions for Tutors | LionCity Tutors',
    description: 'Terms and Conditions for Tutors',
    openGraph: {
      images: [DEFAULT_OG_IMAGE],
      title: 'Terms and Conditions for Tutors | LionCity Tutors',
      description: 'Terms and Conditions for Tutors of LionCity Tutors.',
      url: 'https://www.lioncitytutors.com/terms-and-conditions-for-tutors',
      type: 'website',
    },
    alternates: {
      canonical: 'https://www.lioncitytutors.com/terms-and-conditions-for-tutors',
    },
};

export default function TermsAndConditionsForTutors() {
    return (
        <>
        <GuideSchema
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'Terms and Conditions for Tutors', url: '/terms-and-conditions-for-tutors' },
          ]}
        />
        <main>
            <div className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-center text-blue-700 mb-7">Terms and Conditions for Tutors</h1>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Consent on Collection, Usage & Disclosure of Personal Data</h2>
                <p>
                    By registering as a tutor with LionCity Tutors, you agree that LionCity Tutors may collect, use, and disclose your personal data for the following purposes in accordance with the Personal Data Protection Act 2012:
                </p>
                <ul className="list-disc pl-6 mb-4">
                    <li>To receive available tuition assignments via any mode of telecommunication (including WhatsApp, SMS, Telegram, Email)</li>
                    <li>To provide your data to the respective client upon confirmation of a tuition lesson</li>
                    <li>To receive tutor-related marketing messages via e-mail or messaging platforms (including WhatsApp, SMS, Telegram, Email)</li>
                </ul>
                <p className="mb-8">
                    If you wish to withdraw your consent to the collection of this data at any time, please email us at <a className="text-blue-700 underline" href="mailto:admin@lioncitytutors.com">admin@lioncitytutors.com</a> or WhatsApp us at +65 8870 1152.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Acceptance of Terms and Conditions</h2>
                <p className="mb-8">
                    By registering as a tutor with LionCity Tutors, or accepting a tuition assignment from LionCity Tutors, you accept the Terms and Conditions listed below regarding the tuition matching service provided. The engagement is formalized when a Confirmation Note has been sent to you via WhatsApp/SMS/Email, or/and when you have conducted the first tuition lesson as arranged in the respective correspondence with the client.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Registration</h2>
                <p className="mb-8">
                    All tutors registering with LionCity Tutors must be a minimum of 16 years old and have passed their GCE “O” Levels or equivalent academic qualification.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Qualifications and Authentication of Documents</h2>
                <p className="mb-8">
                    All tutors are required to provide accurate information on academic certifications and personal particulars. Clients reserve the right to request for these certifications to be presented for verification at any point in time. Tutors who attempt to deceive clients with fake qualifications and certifications will be reported to the Police.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">General Terms for Lesson Conduct</h2>
                <ul className="list-disc pl-6 mb-4">
                    <li>Keep to the agreed rates and timeslots. Any changes must be mutually agreed with the client. If a change of timing is required, provide at least 48 hours’ notice. In cases of sudden illness, an MC may be requested by the client.</li>
                    <li>Be aware of and agreeable to the full address/location of lessons, and plan transport accordingly before accepting an assignment.</li>
                    <li>Conduct lessons personally; do not send a representative or substitute.</li>
                    <li>Practice punctuality and do not short-change lesson timing.</li>
                    <li>No physical or verbal abuse towards students or parents will be tolerated.</li>
                    <li>Commit to assignments for a long-term basis (generally at least 3 months unless otherwise stated).</li>
                    <li>Communicate regularly with parents about the student’s progress.</li>
                </ul>
                <p className="mb-8">
                    Any breach of these terms without a valid reason may result in a permanent mark on our records, and if necessary, a complete blacklist from all LionCity Tutors platforms.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Commitment of Tutoring Period</h2>
                <p className="mb-8">
                    Unless otherwise stated, tutors are expected to commit to the assignment for a long-term basis (generally at least 3 months). If you are unable to fulfill the commitment due to special reasons or circumstances, you are required to inform LionCity Tutors to avoid misunderstanding and prevent blacklisting for future assignments.
                </p>
                <p className="mb-8">
                    After the first conducted lesson, tutors are expected to make arrangements directly with the client for subsequent lessons. Any personal, payment, or cancellation terms should be clearly communicated to the client after the first lesson.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Commission and Payment of Tutor Fees</h2>
                <p className="mb-8">
                    A confirmation note & invoice will be sent upon the successful confirmation of each tuition assignment. Upon completion of the first 2 weeks of lessons, clients are required to make payment for the first 2 weeks’ fees to LionCity Tutors. Future payments may be made directly to the tutor. If the client is unwilling or unable to transfer LionCity Tutors the commission, the tutor may be required to collect it on our behalf and transfer it to LionCity Tutors as soon as possible.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Commission Amount</h2>
                <p className="mb-8">
                    LionCity Tutors collects a one-time commission equivalent to the first 2 weeks of lessons from its tutors. The commission will be collected directly from the client and there will be no further action on the tutor’s part. If there are any additional tuition services added during the first month (e.g., tuition for siblings or additional subjects), this must be made known to LionCity Tutors and will also be due for commission.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Short-Term Assignments</h2>
                <p className="mb-8">
                    Assignments spanning 11 weeks or less are considered Short-Term Assignments. The general commission taken will be 25% of the total lesson fees, subject to a cap based on the total lessons conducted:
                </p>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Tier 1:</strong> 16 lessons or less → capped at 2 lessons commission</li>
                    <li><strong>Tier 2:</strong> 17 to 24 lessons → capped at 3 lessons commission</li>
                    <li><strong>Tier 3:</strong> 25 lessons or more → capped at 4 lessons commission</li>
                </ul>
                <p className="mb-8">
                    LionCity Tutors will state in the assignment details whether the assignment is deemed a Short-Term Assignment. Any assignment not stated as such is considered a Long-Term Assignment by default.
                </p>
                <p className="mb-8">
                    If a Short-Term Assignment is discontinued, LionCity Tutors will collect 25% of the total lesson fees (subject to the above caps) and the tutor will receive 75%. If a tutor cancels the assignment without a valid reason, they may not be entitled to any tuition fees for lessons conducted, and LionCity Tutors reserves the right to bill the tutor for 25% of the intended total lesson fees.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Tutor Cancellation</h2>
                <p className="mb-8">
                    The client has the right to request a change in tutor at any time. If tuition is cancelled or changed within the first 4 weeks by the client, LionCity Tutors will collect 50% of the tuition rates involved; the remaining 50% will be paid directly to the tutor.
                </p>
                <p className="mb-8">
                    Tutors may not be entitled to their share of 50% of the fees in cases such as:
                </p>
                <ul className="list-decimal pl-6 mb-4">
                    <li>Cancellation of assignment by the tutor</li>
                    <li>Failure to conduct lessons to a reasonable standard</li>
                    <li>False or inaccurate information in the tutoring profile</li>
                    <li>Inability to provide supporting documents for information listed in the profile</li>
                </ul>
                <p className="mb-8">
                    LionCity Tutors will assess each case individually and reserves the right to make the final decision.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Tuition Rates</h2>
                <p className="mb-8">
                    The agreed tuition rates should not be changed after lesson confirmation. However, tutors may increase the rate if the student advances to a higher academic level.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Length of Commitment, Postponement of Lessons, and Last Minute Cancellations</h2>
                <p className="mb-8">
                    Once confirmation has been received, the tutor is expected to complete at least 4 weeks of lessons. Irresponsible behaviour may result in blacklisting. If postponement is necessary, inform the client at least 2 days in advance. In cases of sudden illness, an MC may be required.
                </p>
                <p className="mb-8">
                    For last-minute cancellations of the first arranged lesson, if a client cancels less than 2 hours before the scheduled time, they will be liable to pay 50% of the lesson fees as compensation for the tutor’s transport cost and time.
                </p>
                <p className="mb-8">
                    For cancellations of subsequent lessons, tutors should communicate their personal cancellation policies to the client directly.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Location of Lessons</h2>
                <p className="mb-8">
                    Tuition lessons will be conducted at the designated address listed in the assignment.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Collusion & Fraud</h2>
                <p className="mb-8">
                    Any attempts to avoid the commission payable to LionCity Tutors are considered illegal. We do not tolerate such fraudulent and unethical actions. A police report will be made immediately, and civil actions will be commenced to recover lost monies.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Disclaimer</h2>
                <p className="mb-8">
                    LionCity Tutors reserves the right to amend the Terms and Conditions at any time without prior notice.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Privacy Policy (For Tutors and Clients)</h2>
                <p>
                    LionCity Tutors values the privacy of both tutors and clients and treats personal information with confidentiality and respect. By visiting LionCity Tutors, you endorse the practices described in this policy.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-2">Confidentiality</h3>
                <p>
                    LionCity Tutors will not rent, sell, or share personal information except to provide services you have requested. We will not publicly reveal private information such as NRIC, uploaded certifications, handphone number, or full addresses, except when necessary to provide services.
                </p>
                <p><strong>Client:</strong> Information provided by the client (location, subject, lesson frequency, etc.) may be broadcasted to tutors to fulfill the search for a tutor. Only after a lesson is confirmed will LionCity Tutors reveal the full address and contact number of the client.</p>
                <p><strong>Tutor:</strong> General information relevant to tuition assignments (qualifications, gender, experience, etc.) may be revealed to clients. Personal information such as contact number or full name/NRIC will not be revealed until the lesson is confirmed.</p>

                <h3 className="text-xl font-semibold mt-8 mb-2">Computer Information</h3>
                <p>
                    LionCity Tutors may collect personal information when a client or tutor registers. We may receive and record information from your browser, including IP address, session ID, pages visited, and visit times. This information may be used for research or to improve user experience.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-2">Legal Disclaimer</h3>
                <p>
                    If legally required, LionCity Tutors will comply with requests to disclose personal information.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-2">Assignment Application System</h3>
                <p>
                    Our Assignment Application System requires verification of phone number and date of birth for tutor access. By registering as a tutor, you agree to grant access and display of your tutoring information through this method.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-2">Changes to This Privacy Policy</h3>
                <p>
                    This policy may be updated or changed without prior notice. If you have any questions regarding our privacy policy, please contact us at <a className="text-blue-700 underline" href="mailto:admin@lioncitytutors.com">admin@lioncitytutors.com</a>.
                </p>
            </div>
        </main>
        </>
    );
}
