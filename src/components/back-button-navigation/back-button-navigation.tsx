import { useRouter } from "next/navigation";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const BackButtonNavigation = ({ className }: { className?: string }) => {
  const router = useRouter();

  return (
    <>
      <MdOutlineKeyboardArrowLeft className={className} onClick={router.back} />
    </>
  );
};

export default BackButtonNavigation;
