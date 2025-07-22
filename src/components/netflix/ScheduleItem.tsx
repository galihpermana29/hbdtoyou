'use client';

interface ScheduleItemProps {
  eventName: string;
  eventTime: string;
  familyOnly?: boolean;
}

/**
 * A reusable component for displaying wedding schedule items in a Netflix-styled UI
 * @param eventName - The name of the event (e.g., "Akad Nikah")
 * @param eventTime - The time of the event (e.g., "07:00 - 09:00 WIB")
 * @param familyOnly - Whether the event is for family members only
 */
const ScheduleItem = ({ eventName, eventTime, familyOnly = false }: ScheduleItemProps) => {
  return (
    <div className="flex flex-col w-full gap-y-1 items-start p-3 bg-[#18181B]/50 rounded-sm">
      <span className="text-base font-medium geist-font">
        {eventName}
        {familyOnly && <span className="text-[#9CA3AF]">{' '}(Family Only)</span>}
      </span>
      <span className="text-base text-[#D1D5DB] geist-font">{eventTime}</span>
    </div>
  );
};

export default ScheduleItem;