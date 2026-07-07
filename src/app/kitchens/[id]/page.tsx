import { redirect } from 'next/navigation';

// Old route kept for backwards compat — new canonical URL is /:kitchenId
export default async function KitchenRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/${id}`);
}
