import Image from 'next/image';

import jollofImg from '../../../public/images/kitchen/spicy-smoky-jollof.png';
import stewImg from '../../../public/images/kitchen/stew-and-sauce.png';
import friedRiceImg from '../../../public/images/kitchen/fried-rice-special.png';

interface EmptyMealsStateProps {
  heading: string;
  subtext: string;
}

/** Shared "no dishes to show" illustration — used both when a kitchen has
 * published nothing yet and when a category/search filter comes up empty. */
export function EmptyMealsState({ heading, subtext }: EmptyMealsStateProps) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="relative flex h-32 w-44 items-center justify-center">
        <div className="absolute inset-x-0 bottom-0 mx-auto h-32 w-56">
          <div className="absolute left-0 h-24 w-24 rounded-full bg-[#FE4141]/20 blur-2xl" />
          <div className="absolute right-0 h-24 w-24 rounded-full bg-[#209D01]/20 blur-2xl" />
        </div>
        <div className="absolute h-19 w-18 -translate-x-7.5 -translate-y-2.5 rotate-[-16deg] overflow-hidden rounded-2xl border-4 border-white shadow-[0px_4px_15px_0px_#00000026]">
          <Image src={stewImg} alt="" fill className="object-cover" sizes="72px" />
        </div>
        <div className="absolute h-19 w-18 translate-x-7.5 -translate-y-2.5 rotate-16 overflow-hidden rounded-2xl border-4 border-white shadow-[0px_4px_15px_0px_#00000026]">
          <Image src={friedRiceImg} alt="" fill className="object-cover" sizes="72px" />
        </div>
        <div className="absolute h-24 w-20 translate-y-2 overflow-hidden rounded-2xl border-4 border-white shadow-[0px_4px_15px_0px_#00000026]">
          <Image src={jollofImg} alt="" fill className="object-cover" sizes="80px" />
        </div>
      </div>
      <p className="mt-4 text-base font-semibold text-black">{heading}</p>
      <p className="mt-1 max-w-64 text-sm text-neutral-500">{subtext}</p>
    </div>
  );
}
