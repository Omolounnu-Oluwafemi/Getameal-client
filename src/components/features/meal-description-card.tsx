export function MealDescriptionCard({ description }: { description: string }) {
  return (
    <section className="rounded-[20px] border-[0.73px] border-[#EDEDED] bg-white p-5 shadow-[0px_4px_20px_0px_#0000000D]">
      <h2 className="font-inter text-base font-semibold leading-5.5 text-black">
        What&apos;s included
      </h2>
      <p className="font-poppins mt-2.5 text-sm font-normal leading-5.5 text-[#5C5C5C]">{description}</p>
    </section>
  );
}
