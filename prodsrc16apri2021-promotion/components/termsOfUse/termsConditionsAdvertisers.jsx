import React from 'react';

const TermsConditionsAdvertisers = (props) => {
    return ( 
        <div>
            <h2>Subscription of CCAR.my Account</h2>
            <p>The CCAR.my advertiser subscription is a personal account (“Subscription”) and can only be used by one Advertiser (as defined below) at a time. The account is strictly non-transferable.</p>
            <p>The Advertiser must be either an Individual or Corporate Entity as defined herein below, posting any advertisement and listing of any items for sale on the Site.</p>
            <p><b>'Individual'</b> - The Services are available only to individuals who are 18 years or above of age and are capable of entering into a legally binding agreement under Malaysian law.</p>
            <p><b>'Corporate Entity'</b> - The Services are available to companies and/or business entities. Any person using the Services on behalf of such corporate entities represents that he or she has the authority to bind the corporate entity to the terms and conditions set out in the Agreement.</p>
            <p>Advertisement placed must be for the benefit of the Advertiser, and not for a third party.</p>
        
            <h2>Billing & Subscription Confirmation</h2>
            <p>Subscription will only be activated once the contract has been signed and 1st payment made and cleared by CCAR.my. Activation will occur within 1 working day of receipt of payment. For cheque payments, proof of postage will not be accepted as proof of receipt. Receipt is only deemed to have occurred upon clearance of funds. CCAR.my is not responsible for any loss or damage of cheque during postage delivery. Advertisers will be billed for any fee or costs incurred if the cheque bounces.</p>
            <p>Should the Subscription be discontinued at any point within the stipulated period, the Advertiser will still be liable to pay in full the committed amount. Should payment cease, CCAR.my shall reserve the right to take down all advertisements posted as well as suspend the Advertisers account at its sole discretion.</p>
            <p><b>CCAR.my</b> reserves the right to revise advertising rates upon giving written notice at any time.</p>
            <p>CCAR.my, will upon the User’s request and subject to the restrictions described below, provide a refund of a similar value of the amount paid by the User for the product/serviced procured.</p>
            
            <h2>Display of Advertisements</h2>
            <p>Advertiser acknowledges that the positioning and presentation of advertisements is at the discretion of <b>CCAR.my</b> and may be altered from time to time. <b>CCAR.my</b> may also display Advertiser’s advertisements on other websites without explicit permission from the Advertiser.</p>
            <p><b>CCAR.my</b>, its employees or agents will not be liable for errors in the publication, or omission of any advertisement, the content thereof and/or any damage however provided by the Advertiser for the purpose of or in connection with any advertisement.</p>
            
            <h2>Advertisement & Content Guidelines</h2>
            <p> By submitting the Subscription, the Advertiser agrees to abide by the Advertisement and Content Guidelines set by <b>CCAR.my</b> (see full guidelines at <a>https://www.ccar.my/help</a>). Without limiting the foregoing, the following advertisements are prohibited and can be removed by <b>CCAR.my</b> without notice :</p>
            <ul>
            <li>any advertisement that has content that is not related to the car being advertised – especially photos or videos of other than the car; any car advertisement with false information;</li>
            <li>any dealer profile information that violates the content & subscription rules; specifically any reference to more than one dealer per account is not allowed;</li>
            <li>those that promotes illegal business practices;</li>
            <li>those with content that, in <b>CCAR.my</b>’s sole and absolute judgment, is inappropriate;</li>
            <li>those that violate any applicable law, regulation or third party rights, particularly the provisions of the Personal Data Protection Act 2010; and</li>
            <li>any advertisement that <b>CCAR.my</b> determines could result in legal liability or adverse publicity to <b>CCAR.my</b> such as offensive, inaccurate, defamatory, libellous or slanderous material or material which is potentially infringing on another party’s intellectual property rights.</li>
            </ul>
            
            <h2>Use of CCOIN</h2>
            <p>Transactions relating to single premier products offered through <b>CCAR.my</b> services are to be paid in the form of online credits ("CCOIN").</p>
            <p>All CCOIN purchased by the Advertiser are strictly non-refundable.</p>
            <p>CCOIN cannot be utilised/transferred for subscription based premier products offered by <b>CCAR.my</b></p>
            
            <h2>Limitation on Liability</h2>
            <p><b>CCAR.my</b> shall not be liable for any (1) content or quality of advertisement, (2) disruptions or interruptions in the Internet which affect the Advertiser’s advertisement, (3) errors or delays in providing its advertisement services, (4) loss of Advertisers’ data, (5) any delay or failure in performance due to or caused by any events beyond the reasonable control of <b>CCAR.my</b>.</p>
            <p>In consideration of publication of an advertisement, the Advertiser, if such is a party to this agreement, jointly and severally agree to fully indemnify and hold harmless <b>CCAR.my</b>, its officers, agents and employees in respect of all or any costs, expenses, loss, damages, claims, actions, proceedings or other charges arising out of, resulting from or in relation to the publishing of the Advertiser’s advertisement including but is not limited to legal actions or threatened legal actions arising from the publication of any advertisement together with any and all other losses resulting from the publication of any advertisement by <b>CCAR.my</b>, any claims or actions in respect of libel, slander, violation of any rights of privacy, copyright infringement, violation of trademark or any other intellectual property rights.</p>
            
            <h2>General</h2>
            <p>The Terms and Conditions herein, the <b onClick={()=>props.setIndexProps(3)}><a>Terms and Conditions of Use</a></b> and <b onClick={()=>props.setIndexProps(2)}><a>The Personal Data Protection</a></b> Notice (collectively, the “Terms”) constitute the entire understanding between the parties and supersede any prior agreements, discussions and representations between the parties, whether written or oral, regarding the subject matter contained herein. All orders/Subscription shall be subject to <b>CCAR.my</b>’s then-current Terms, which may be revised by <b>CCAR.my</b> without notice at any time. The Terms shall be governed by and constructed in accordance with the laws of Malaysia.</p>
            

        </div>
     );
}
 
export default TermsConditionsAdvertisers;
