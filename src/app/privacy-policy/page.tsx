
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="prose max-w-none text-muted-foreground dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
        
        <h2>Interpretation and Definitions</h2>
        <h3>Interpretation</h3>
        <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
        
        <h3>Definitions</h3>
        <p>For the purposes of this Privacy Policy:</p>
        <ul>
          <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
          <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to BlueCart.</li>
          <li><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</li>
          <li><strong>Country</strong> refers to: California, United States</li>
          <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
          <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
        </ul>

        <h2>Collecting and Using Your Personal Data</h2>
        <h3>Types of Data Collected</h3>
        <h4>Personal Data</h4>
        <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
        <ul>
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Address, State, Province, ZIP/Postal code, City</li>
        </ul>
        
        <h3>Use of Your Personal Data</h3>
        <p>The Company may use Personal Data for the following purposes:</p>
        <ul>
          <li>To provide and maintain our Service, including to monitor the usage of our Service.</li>
          <li>To manage Your Account: to manage Your registration as a user of the Service.</li>
          <li>For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased.</li>
        </ul>
        
        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, You can contact us by email.</p>
      </div>
    </div>
  );
}
