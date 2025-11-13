
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default function RefundPolicyPage() {
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
            <BreadcrumbPage>Refund & Return Policy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="prose max-w-none text-muted-foreground dark:prose-invert">
        <h1>Refund & Return Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>Thanks for shopping at BlueCart. If you are not entirely satisfied with your purchase, we're here to help.</p>
        
        <h2>Returns</h2>
        <p>You have 30 calendar days to return an item from the date you received it.</p>
        <p>To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.</p>
        <p>Your item needs to have the receipt or proof of purchase.</p>
        
        <h2>Refunds</h2>
        <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.</p>
        <p>If your return is approved, we will initiate a refund to your original method of payment. You will receive the credit within a certain amount of days, depending on your card issuer's policies.</p>
        
        <h2>Shipping</h2>
        <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions on how to return your item to us, contact us.</p>
      </div>
    </div>
  );
}
