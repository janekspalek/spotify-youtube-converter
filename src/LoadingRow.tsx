export default function LoadingRow() {
  return (
    <div className="flex gap-2 items-center">
      <div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-cover rounded-sm shrink-0 bg-gray-200 animate-pulse"></div>
      <div className="w-full flex flex-col gap-2">
        <div className="bg-gray-200 animate-pulse w-[120px] md:w-[150px] h-[1rem] rounded-xs"></div>
        <div className="bg-gray-200 animate-pulse w-[80px] md:w-[100px] h-[1rem] rounded-xs"></div>
      </div>
    </div>
  );
}
