import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
export const metadata = {
    title: 'Terms and Conditions for Clients | LionCity Tutors',
    description: 'Terms and Conditions',
    openGraph: {
      images: [DEFAULT_OG_IMAGE],
      title: 'Terms and Conditions for Clients | LionCity Tutors',
      description: 'Terms and Conditions for Clients of LionCity Tutors.',
      url: 'https://www.lioncitytutors.com/terms-and-conditions-for-clients',
      type: 'website',
    }
};

export default function TermsAndConditionsForClients(){
    return(
        <main>
            <div className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-center text-blue-700 mb-7">Terms and Conditions for Clients</h1>
                <h2 className="text-2xl font-semibold mt-10 mb-4">Consent on Collection, Usage & Disclosure of Personal Data</h2>
                <p>
                    By submitting your contact details to LionCity Tutors via our request form or any communication mode, you agree that LionCity Tutors may collect, use, and disclose your personal data for the following purposes in accordance with the Personal Data Protection Act 2012:
                </p>
                <ul className="list-disc pl-6 mb-4">
                    <li>To contact you via any messaging platform or phone call regarding your tuition request</li>
                    <li>To use your data in the administrative process of a tutor search</li>
                    <li>To provide your data to the respective tutor upon confirmation of a tuition lesson</li>
                    <li>To send you tuition-related marketing messages via e-mail or messaging platforms (including but not limited to SMS/WhatsApp/Telegram)</li>
                </ul>
                <p className="mb-8">
                    If you wish to withdraw your consent to the collection of this data at any time, please email us at <a className="text-blue-700 underline" href="mailto:admin@lioncitytutors.com">admin@lioncitytutors.com</a> or WhatsApp us at +65 8870 1152.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Acceptance of Terms and Conditions</h2>
                <p className="mb-8">
                    By engaging a tutor from LionCity Tutors, you accept the Terms and Conditions listed below regarding the tuition service provided. The engagement is formalized when a Confirmation Note has been sent to you via WhatsApp/SMS/Email, or/and when the tutor has conducted the first tuition lesson as arranged in the respective correspondence with the client.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Payment and Commission</h2>
                <p>
                    LionCity Tutors’ matching services are free-of-charge for the client as commission fees are levied upon the tutor. Upon completion of 2 weeks of lessons (or as otherwise stated in the Confirmation Note) with the tutor, the client is to make payment for 2 weeks of lesson fees (or otherwise advised amount) to LionCity Tutors. Payment may be made via Bank Transfer, PayNow, PayLah, or Cheque. This payment represents the commission collected from LionCity Tutors, which is levied upon the tutor.
                </p>
                <p>
                    Subsequent payments may be made directly to the tutors in a payment method and frequency decided between the client and tutor. Any additional tuition services, such as an additional subject or teaching of the student’s siblings, must be disclosed to LionCity Tutors and will also be liable for commission, which will similarly be charged to the tutor.
                </p>
                <p className="mb-8">
                    In the case of an extreme short-term assignment (4 or fewer lessons), a client may agree to bear the commission on behalf of the tutor to increase the chances of securing a suitable tutor. This arrangement is non-exchangeable with the usual case (where the tutor bears the commission). Even if the client decides to take more than the agreed number of lessons, the commission will not be transferred to the tutor.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Tutor Reassignment or Cancellation</h2>
                <p>
                    If the client is unsatisfied or uncomfortable with the tutor arranged within the first 4 weeks, the client may request a change in tutor at any time after the first conducted lesson. The client is only required to pay for all lessons conducted so far, and no further fees. The general guideline is a commitment period of 1 month before deciding whether the tuition services are suitable for the student.
                </p>
                <p>
                    For cancellations by the client before 4 full weeks of lessons are completed, LionCity Tutors will split 50% of the total lesson fees with the tutor. The client is required to pay LionCity Tutors the amount reflected in the invoice issued, which is 50% of the total lesson fees conducted. Regarding the tutor’s fees, clients may pay the tutor directly or request LionCity Tutors to transfer the fees on their behalf. Cancellations due to last-minute emergencies will be considered on a case-by-case basis.
                </p>
                <p className="mb-8">
                    In the rare case of a cancellation of the tuition assignment by the tutor, the lessons carried out by the tutor will generally still have to be paid for. LionCity Tutors will consider these reasons on a case-by-case basis to determine if full payment by the client for the lessons conducted is required. By accepting these Terms & Conditions, you agree to respect and adhere to the final decisions made by LionCity Tutors on these matters.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Last Minute Cancellations & Postponement of First Lesson</h2>
                <p className="mb-8">
                    If a postponement or cancellation of the first lesson is required, the client must inform LionCity Tutors or the tutor at least 4 hours in advance. If this condition is not met, clients are liable to pay for 50% of the 1st lesson fees as compensation for the tutor’s time and transport costs, and the service rendered by LionCity Tutors. This amount will be split 50% between LionCity Tutors and the tutor. Cancellations due to last-minute emergencies will be considered on a case-by-case basis.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Late Payment Charges</h2>
                <p>
                    LionCity Tutors reserves the right to impose a late-payment fee for overdue fees of 1 month or more. The late-payment fee after 1 month will be $50 per 2 weeks (14 days) of overdue payment after the 1st month of grace period. Other administrative fees may also be charged depending on the resources/time taken to recover the debt, judged on a case-by-case basis.
                </p>
                <p className="mb-8">
                    <strong>Example:</strong> If a client fails to make payment after the grace period, late-payment charges will be imposed for every 2 weeks of non-payment until the final order of the court is given. LionCity Tutors also reserves the right to file with the Small Claims Tribunal or take legal action for any debt deemed necessary.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Qualifications & Authentication of Tutor Profiles/Documents</h2>
                <p>
                    Clients may request the educational certifications of tutors to authenticate their qualifications and credibility. LionCity Tutors will request these documents on the client’s behalf and forward them if the tutor agrees to share them.
                </p>
                <p className="mb-8">
                    LionCity Tutors is not liable for falsehoods or untruths provided by tutors in their applications. While we have internal vetting systems, it is not possible to verify every piece of information. If a client discovers a fraudulent tutor, please inform LionCity Tutors and we will assist in making a police report.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Tuition Rates and Schedule</h2>
                <p className="mb-8">
                    The schedule of tuition is open to rearrangement with the tutor directly after the first lesson. Future tuition rates may also be renegotiated when the student advances to a higher academic level.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Location of Tuition</h2>
                <p className="mb-8">
                    Tuition will be carried out at the location provided by the client unless otherwise arranged or specified.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Collusion & Fraud</h2>
                <p className="mb-8">
                    Any attempts to avoid the commission payable to LionCity Tutors are considered illegal. We do not tolerate such fraudulent and unethical actions. A police report will be made immediately, and civil actions will be commenced to recover lost monies.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Quality of Service</h2>
                <p className="mb-8">
                    LionCity Tutors does not guarantee that tutoring services will result in improved academic grades. We strive to provide the best and most suitable tutor possible within the client’s requests and budget. Once lessons have been carried out, clients are liable to pay tuition fees for lessons attended, regardless of satisfaction. Tutoring services may be cancelled at any time if deemed unsatisfactory by the client. Feedback is appreciated.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Disclaimer</h2>
                <p className="mb-8">
                    LionCity Tutors will make every effort to create the most suitable match between clients and tutors. In case of conflict, LionCity Tutors may step in to resolve issues but will not hold responsibility for the actions of either party. LionCity Tutors holds no legal liability for issues and disputes that may arise. We reserve the right to withhold information and terminate or deny services to any party, unless legally instructed.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">Amendment to Terms & Conditions</h2>
                <p className="mb-8">
                    LionCity Tutors reserves the right to amend our Terms & Conditions at any time without prior notice.
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
    )
}