const fmt = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

interface MealPriceCardProps {
  price: number;
  unit: string;
  name: string;
}

export function MealPriceCard({ price, unit, name }: MealPriceCardProps) {
  return (
    <div className="rounded-[20px] bg-white">
      <p className="text-4xl font-bold text-[#000000]">
        {fmt(price)} <span className="text-2xl font-bold text-[#000000]">/1 {unit}</span>
      </p>
      <h1 className="mt-2 text-xl font-bold text-[#000000]">{name}</h1>
    </div>
  );
}
