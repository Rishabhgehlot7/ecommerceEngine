
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';

const teamMembers = [
    {
        name: 'Jane Doe',
        role: 'Founder & CEO',
        avatar: 'https://i.pravatar.cc/150?u=jane'
    },
    {
        name: 'John Smith',
        role: 'Head of Product',
        avatar: 'https://i.pravatar.cc/150?u=john'
    },
    {
        name: 'Emily White',
        role: 'Marketing Director',
        avatar: 'https://i.pravatar.cc/150?u=emily'
    }
]

export default function AboutUsPage() {
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
            <BreadcrumbPage>About Us</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">About BlueCart</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We are dedicated to bringing you the best products with the best service.
          </p>
        </div>

        <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-96">
            <Image 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                alt="Our Team"
                fill
                className="object-cover"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-primary/10" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            <div>
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="mt-4 text-muted-foreground">
                    Our mission is to provide a seamless and enjoyable shopping experience for our customers. We carefully curate our collection of products to ensure that every item meets our high standards of quality and style. We believe in the power of great products to enhance everyday life, and we are committed to delivering excellence in every package.
                </p>
            </div>
            <div>
                <h2 className="text-3xl font-bold">Our Vision</h2>
                <p className="mt-4 text-muted-foreground">
                    We envision a world where shopping is not just a transaction, but a delightful discovery. We aim to be the most customer-centric online store, where you can find and discover anything you might want to buy. We strive to build a place where people can come to find and discover unique and high-quality products.
                </p>
            </div>
        </div>

        <div>
            <h2 className="text-center text-3xl font-bold">Meet the Team</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map(member => (
                    <Card key={member.name} className="text-center">
                        <CardHeader>
                            <Avatar className="mx-auto h-24 w-24">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-xl">{member.name}</CardTitle>
                            <p className="text-muted-foreground">{member.role}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
