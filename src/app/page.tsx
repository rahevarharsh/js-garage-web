'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Car,
  Cog,
  Wrench,
  Gauge,
  Phone,
  Mail,
  MapPin,
  Star,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { useEffect, useState } from 'react';

const bookingFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  email: z.string().email('Please enter a valid email address.'),
  preferredDateTime: z.string().min(1, 'Please select a date and time.'),
  vehicleMake: z.string().min(1, 'Vehicle make is required.'),
  vehicleModel: z.string().min(1, 'Vehicle model is required.'),
  vehicleYear: z
    .number()
    .min(1900, 'Year must be after 1900.')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the distant future.'),
  issueModificationRequest: z
    .string()
    .min(10, 'Please describe the issue in at least 10 characters.'),
  locationPreference: z.boolean().default(false),
});

function BookingForm() {
  const firestore = useFirestore();
  const bookingsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'bookings') : null),
    [firestore]
  );
  const [defaultYear, setDefaultYear] = useState<number | undefined>(undefined);

  useEffect(() => {
    setDefaultYear(new Date().getFullYear());
  }, []);
  
  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      preferredDateTime: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: new Date().getFullYear(),
      issueModificationRequest: '',
      locationPreference: false,
    },
  });

  useEffect(() => {
    if (defaultYear) {
      form.reset({
        name: '',
        phone: '',
        email: '',
        preferredDateTime: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: defaultYear,
        issueModificationRequest: '',
        locationPreference: false,
      });
    }
  }, [defaultYear, form]);


  function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    if (!bookingsCollection) return;
    const bookingData = {
      ...values,
      timestamp: serverTimestamp(),
    };
    addDocumentNonBlocking(bookingsCollection, bookingData);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 8238774296" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferredDateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Date & Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="vehicleMake"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Make</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Toyota" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicleModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Model</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Corolla" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicleYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 2022"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="issueModificationRequest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue / Modification Request</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the issue or the modification you need..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="locationPreference"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  On-Site Service Request
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  I want the mechanic to come to my location.
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full">
          Book My Slot
        </Button>
      </form>
    </Form>
  );
}

function ReviewsCarousel() {
  const firestore = useFirestore();
  const reviewsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'reviews') : null),
    [firestore]
  );
  const { data: reviews, isLoading } = useCollection(reviewsCollection);

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < rating ? 'text-orange-500 fill-orange-500' : 'text-gray-400'
          }`}
        />
      ));
  };

  if (isLoading) return <p>Loading reviews...</p>;

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {reviews?.map((review) => (
          <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="h-full bg-neutral-800 border-neutral-700 text-white flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/8.x/initials/svg?seed=${review.name}`}
                      />
                      <AvatarFallback>
                        {review.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <p className="text-sm text-neutral-400">
                        {review.carType}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-neutral-300 italic">
                    &ldquo;{review.testimonial}&rdquo;
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="text-white bg-neutral-800 hover:bg-neutral-700" />
      <CarouselNext className="text-white bg-neutral-800 hover:bg-neutral-700" />
    </Carousel>
  );
}

const services = [
  {
    icon: Cog,
    title: 'Mechanical & CNG Kit',
    description: 'Expert diagnostics and repairs for all mechanical issues & CNG kit fittings.',
  },
  {
    icon: Car,
    title: 'Accident Work',
    description: 'Complete bodywork and accident repair services.',
  },
  {
    icon: Wrench,
    title: 'Electrical Work',
    description: 'Advanced electrical diagnosis and repair.',
  },
  {
    icon: Gauge,
    title: 'Breakdown Service',
    description: 'On-site assistance for vehicle breakdowns.',
  },
];

const galleryImages = [
  {
    id: 'tools',
    src: 'https://picsum.photos/seed/tools/600/400',
    alt: 'Mechanic tools hanging on a wall',
    hint: 'mechanic tools',
  },
  {
    id: 'lift',
    src: 'https://picsum.photos/seed/lift/600/400',
    alt: 'Car on a hydraulic lift in a garage',
    hint: 'car lift',
  },
  {
    id: 'modified-car',
    src: 'https://picsum.photos/seed/modcar/600/400',
    alt: 'A heavily modified sports car',
    hint: 'modified car',
  },
  {
    id: 'engine-bay',
    src: 'https://picsum.photos/seed/engine/600/400',
    alt: 'Close up of a clean and powerful engine bay',
    hint: 'car engine',
  },
  {
    id: 'welding',
    src: 'https://picsum.photos/seed/welding/600/400',
    alt: 'Sparks flying from a welder working on a car frame',
    hint: 'welding metal',
  },
  {
    id: 'tires',
    src: 'https://picsum.photos/seed/tires/600/400',
    alt: 'A stack of high-performance tires',
    hint: 'car tires',
  },
];

function JSGaragePage() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-sm text-neutral-400 border-b border-neutral-800">
            <div className="flex items-center gap-4">
              <a
                href="tel:8238774296"
                className="flex items-center gap-2 hover:text-orange-500 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+91 8238774296</span>
              </a>
              <a
                href="mailto:contact@jsgarage.com"
                className="flex items-center gap-2 hover:text-orange-500 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>contact@jsgarage.com</span>
              </a>
            </div>
          </div>
          <div className="flex justify-between items-center py-4">
            <Link
              href="/"
              className="text-2xl font-bold text-white tracking-wider"
            >
              J.S. <span className="text-orange-500">CAR SERVICE</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="#home"
                className="hover:text-orange-500 transition-colors"
              >
                Home
              </Link>
              <Link
                href="#services"
                className="hover:text-orange-500 transition-colors"
              >
                Services
              </Link>
              <Link
                href="#our-work"
                className="hover:text-orange-500 transition-colors"
              >
                Our Work
              </Link>
              <Link
                href="#contact"
                className="hover:text-orange-500 transition-colors"
              >
                Contact
              </Link>
              <Link
                href="#book-now"
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                Book Now
              </Link>
            </nav>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="bg-black border-neutral-800 text-white"
                >
                  <div className="flex flex-col gap-6 p-6">
                    <Link
                      href="/"
                      className="text-2xl font-bold text-white tracking-wider"
                    >
                      J.S. <span className="text-orange-500">CAR SERVICE</span>
                    </Link>
                    <nav className="flex flex-col gap-4 text-lg font-medium">
                      <SheetClose asChild>
                        <Link
                          href="#home"
                          className="hover:text-orange-500 transition-colors"
                        >
                          Home
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="#services"
                          className="hover:text-orange-500 transition-colors"
                        >
                          Services
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="#our-work"
                          className="hover:text-orange-500 transition-colors"
                        >
                          Our Work
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="#contact"
                          className="hover:text-orange-500 transition-colors"
                        >
                          Contact
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="#book-now"
                          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors text-center"
                        >
                          Book Now
                        </Link>
                      </SheetClose>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center overflow-hidden"
        >
          <Image
            src="https://picsum.photos/seed/hero/1920/1080"
            alt="Mechanic working on a car"
            fill
            quality={80}
            priority
            className="object-cover opacity-30"
            data-ai-hint="mechanic garage"
          />
          <div className="relative z-10 px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
              Expert Car Repairs & Mods
              <br />
              <span className="text-orange-500">
                On-Site or At Our Garage
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-300 mb-8">
              Quality service you can trust, with the convenience you need.
            </p>
            <Link
              href="#book-now"
              className="bg-orange-500 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-orange-600 transition-transform transform hover:scale-105"
            >
              Book a Slot
            </Link>
          </div>
        </section>

        <section id="services" className="py-20 bg-neutral-950">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-2">Our Services</h2>
            <p className="text-neutral-400 mb-12 max-w-2xl mx-auto">
              From routine maintenance to full-scale custom builds, we handle it
              all with precision and care.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-orange-500/10 p-4 rounded-full">
                      <service.icon className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-neutral-400">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="book-now" className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-neutral-800 border-neutral-700 text-white shadow-2xl shadow-orange-500/10">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-orange-500">
                    Book an Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="our-work" className="py-20 bg-neutral-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Work</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-20">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-video rounded-lg overflow-hidden group"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    data-ai-hint={image.hint}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                </div>
              ))}
            </div>

            <h3 className="text-2xl font-bold text-center mb-8">
              What Our Customers Say
            </h3>
            <ReviewsCarousel />
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Get In Touch
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-8">
                <div className="flex items-center gap-4 text-xl">
                  <div className="bg-orange-500/10 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Virendrasinh Rana</h4>
                    <a
                      href="tel:8238774296"
                      className="text-neutral-300 hover:text-orange-500 transition-colors"
                    >
                      +91 8238774296
                    </a>
                  </div>
                </div>
                 <div className="flex items-center gap-4 text-xl">
                  <div className="bg-orange-500/10 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Niteshbhai</h4>
                    <a
                      href="tel:9724373656"
                      className="text-neutral-300 hover:text-orange-500 transition-colors"
                    >
                      +91 9724373656
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xl">
                  <div className="bg-orange-500/10 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <a
                      href="mailto:contact@jsgarage.com"
                      className="text-neutral-300 hover:text-orange-500 transition-colors"
                    >
                      contact@jsgarage.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-xl">
                  <div className="bg-orange-500/10 p-3 rounded-full mt-1">
                    <MapPin className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-neutral-300">
                      Yamuna Park Society, Opp. Royal Hotel, 
                      <br />
                      S.P. Ring Road, Odhav, Ahmedabad - 15
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full h-80 rounded-lg overflow-hidden border-2 border-orange-500">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3671.643231336155!2d72.6664719759353!3d23.03693991599879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjPCsDAwJzU1LjEiTiA3MsKwNDAnMDguNiJF!5e0!3m2!1sen!2sin!4v1716382577663!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-neutral-950 border-t border-neutral-800 py-8">
        <div className="container mx-auto px-4 text-center text-neutral-400">
          <p>&copy; {year} J.S. Car Service. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <FirebaseClientProvider>
      <JSGaragePage />
    </FirebaseClientProvider>
  );
}

    