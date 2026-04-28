import banner from "@/assets/home-banner.png";
import logo from "@/assets/full-logo.png";
import ScrollToTop from "@/components/ScrollToTop";

export default function Privacy() {
  return (
    <div className="pb-20">
            <ScrollToTop />
      <div className="relative w-full h-79.75 md:h-full">
        <img
          src={banner}
          alt="banner"
          className="w-full h-full object-cover md:object-fill"
        />
        <img
          src={logo}
          alt="logo"
          className="absolute top-4 xl:top-6 2xl:top-6 left-1/2 -translate-x-1/2 w-40 h-7 xl:w-60 xl:h-13 2xl:w-60 2xl:h-13"
        />
      </div>

    <div className="xl:w-[1198px] 2xl:w-[1834px] mx-auto px-4 xl:px-6 2xl:px-6 py-4 xl:py-6 2xl:py-6 leading-relaxed text-[#14110F]">
    <div className="relative px-4 xl:px-6 2xl:px-6 py-4 xl:py-6 2xl:py-6 leading-relaxed text-center items-center justify-center mx-auto">
        <h1 className="text-[20px] xl:text-[48px] 2xl:text-[48px] font-inter font-bold pb-2">
          Privacy Policy in accordance with the Personal Data Protection Act (PDPA)
        </h1>

        <p className="text:[18px] xl:text-[28px] 2xl:text-[32px] font-inter font-normal">
          The web application Your Shade ("the Company" or "we") recognizes the importance of protecting users' personal data ("you") and is committed to complying with the Personal Data Protection Act B.E. 2562 (2019) (PDPA). This Privacy Policy explains how we collect, use, disclose, and protect your personal data.
        </p>
    </div>

    <div className="relative px-4 xl:px-6 2xl:px-6 py-4 xl:py-6 2xl:py-6 leading-relaxed mx-auto">
        <h2 className="text-[18px] xl:text-[36px] 2xl:text-[48px] font-inter font-bold pb-2">1. Personal Data We Collect</h2>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-2">We may collect the following personal data:</p>
        <ul className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal list-disc pl-5 pb-2">
            <li>Face Image obtained through the system, which is used for temporary processing only and is not stored</li>
            <li>Usage Data, such as interactions with features within the web application</li>
        </ul>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-4">We collect only the data necessary for the specified purposes.</p>


        <h2 className="text-[18px] xl:text-[36px] 2xl:text-[48px] font-inter font-bold pb-2">2. Purposes of Data Processing</h2>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-2">We collect and use your personal data for the following purposes:</p>
        <ul className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal list-disc pl-5 pb-4">
            <li>To analyze skin tone and provide Personal Color Analysis</li>
            <li>To display results and personalized recommendations</li>
            <li>To improve and enhance the performance of the web application</li>
        </ul>


        <h2 className="text-[18px] xl:text-[36px] 2xl:text-[48px] font-inter font-bold pb-2">3. Legal Basis for Processing</h2>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-2">We process your personal data based on the following legal grounds:</p>
        <ul className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal list-disc pl-5 pb-2">
            <li>Your consent (Consent)</li>
            <li>Contractual necessity to provide services requested by you</li>
        </ul>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-4">You have the right to withdraw your consent at any time, without affecting the lawfulness of processing carried out prior to such withdrawal.</p>


        <h2 className="text-[18px] xl:text-[36px] 2xl:text-[48px] font-inter font-bold pb-2">4. Processing of Face Image (Sensitive Personal Data)</h2>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-2">Face images are considered sensitive personal data under applicable law. We therefore implement the following measures:</p>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-2">We do not store face image data. The face images provided by users are used solely for Personal Color Analysis and are processed temporarily (Temporary Processing) within the system. Such data is not stored, recorded, or retained in any database (No Storage / No Retention) and is permanently deleted immediately after processing is completed.</p>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-4">Such processing is carried out based on your explicit consent.</p>


        <h2 className="text-[18px] xl:text-[36px] 2xl:text-[48px] font-inter font-bold pb-2">5. Disclosure of Personal Data</h2>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-2">We will not disclose your personal data to third parties, except in the following cases:</p>
        <ul className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal list-disc pl-5 pb-4">
            <li>With your consent</li>
            <li>As required by law or by orders of competent authorities</li>
        </ul>
 

        <h2 className="text-[18px] xl:text-[36px] 2xl:text-[48px] font-inter font-bold pb-2">6. Data Retention Period</h2>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-2">We retain personal data only for as long as necessary to fulfill the stated purposes.</p>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-4">For face images, no data is retained after processing is completed.</p>


        <h2 className="text-[18px] xl:text-[36px] 2xl:text-[48px] font-inter font-bold pb-2">7. Data Security Measures</h2>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-4">We implement appropriate technical and organizational measures to protect personal data against unauthorized access, use, disclosure, loss, or destruction.</p>


        <h2 className="text-[18px] xl:text-[36px] 2xl:text-[48px] font-inter font-bold pb-2">8. Your Rights as a Data Subject</h2>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-2">Under the PDPA, you have the following rights:</p>
        <ul className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal list-disc pl-5 pb-2">
            <li>Right of Access</li>
            <li>Right to Rectification</li>
            <li>Right to Erasure</li>
            <li>Right to Object</li>
            <li>Right to Withdraw Consent</li>
            <li>Right to Restriction of Processing</li>
        </ul>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-4">You may exercise these rights by contacting us through the channels provided below.</p>


        <h2 className="text-[18px] xl:text-[36px] 2xl:text-[48px] font-inter font-bold pb-2">9. Changes to This Privacy Policy</h2>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-4">We may update this Privacy Policy from time to time to comply with legal requirements or improve our services. Any significant changes will be communicated through appropriate channels.</p>


        <h2 className="text-[18px] xl:text-[36px] 2xl:text-[48px] font-inter font-bold pb-2">10. Data Controller</h2>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-4">If you have any inquiries, suggestions, or requests regarding the collection, use, and/or disclosure of your personal data, or wish to exercise your rights under this policy, you may contact us via the following channels:</p>
    </div>

    <div className="relative px-4 xl:px-6 2xl:px-6 py-4 xl:py-6 2xl:py-6 leading-relaxed mx-auto">
        <h2 className="text-[18px] xl:text-[36px] 2xl:text-[48px] font-inter font-bold pb-2">Data Controller:</h2>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-4">Your Shade</p>

        <h2 className="text-[18px] xl:text-[36px] 2xl:text-[48px] font-inter font-bold pb-2">Contact Information:</h2>
        <p className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal pb-2">Email:</p>
        <ul className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-inter font-normal list-disc pl-5 pb-4">
            <li>b.supichakorn@gmail.com (Supichakorn Boonkasem)</li>
            <li>praewpwr@gmail.com (Praewwarin Khaoluang)</li>
            <li>parichartpluangklang@gmail.com (Parichart Pluangklang)</li>
        </ul>
    </div>

    </div>
    </div>
  );
}
