import { redirect } from 'next/navigation';

// The app has no homepage — each cook shares their own /:kitchenId link.
// Direct visits go to the GetaMeal site.
export default function HomePage() {
  redirect('https://getameal.app/');
}
