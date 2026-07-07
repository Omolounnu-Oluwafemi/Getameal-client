import { redirect } from 'next/navigation';

// The kitchen page is the entry point — redirect to the demo kitchen.
// In production each cook shares their own /:kitchenId URL.
export default function HomePage() {
  redirect('/sandra-kitchen');
}
