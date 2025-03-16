import { useState } from 'react';

interface TruncateTextProps {
  text: string;
  maxLength?: number;
  showSeeMore?: boolean;
}

const TruncateText: React.FC<TruncateTextProps> = ({
  text,
  maxLength = 100,
  showSeeMore = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div>
      {isExpanded ? text : `${text.slice(0, maxLength)}... `}
      {text.length > maxLength && showSeeMore && (
        <button
          onClick={toggleExpanded}
          className="text-[#E34013] hover:underline">
          {isExpanded ? 'See Less' : 'See More'}
        </button>
      )}
    </div>
  );
};

export default TruncateText;
