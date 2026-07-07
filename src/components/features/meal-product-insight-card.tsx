import { CalendarIcon, TotalOrdersIcon } from '@/components/icons';

interface MealProductInsightCardProps {
  totalOrders: number;
  listedDate: string;
}

export function MealProductInsightCard({ totalOrders, listedDate }: MealProductInsightCardProps) {
  return (
    <section className="rounded-[20px] border-[0.73px] border-[#EDEDED] bg-white px-5 py-6 shadow-[0px_4px_20px_0px_#0000000D]">
      <h2 className="font-inter mb-4 text-base leading-5.5 font-semibold text-black">
        Product insight
      </h2>
      <div className="space-y-6">
        <div className="font-inter flex items-center gap-4 text-sm leading-none font-medium text-black">
          <TotalOrdersIcon />
          Total orders
          <span className="ml-auto">{totalOrders} Orders</span>
        </div>
        <div className="font-inter flex items-center gap-4 text-sm leading-none font-medium text-black">
          <CalendarIcon />
          Listed date
          <span className="ml-auto">{listedDate}</span>
        </div>
      </div>
    </section>
  );
}
