import { redirect } from 'next/navigation';

// Any unmatched or notFound()-triggered route bounces straight to the main
// site — no interstitial page, no button to tap.
export default function NotFound() {
  redirect('https://getameal.app/');
}
