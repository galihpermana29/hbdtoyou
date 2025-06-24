import CardTemplate from '@/components/newlanding/card-template/CardTemplate';
import CardTemplateTag from '@/components/newlanding/card-template/CardTemplateTag';

export const TemplateGridSection = ({
  title,
  templates,
  onTemplateClick,
}: {
  title: string;
  templates: any[];
  onTemplateClick: (template: any) => void;
}) => {
  return (
    <div className="mt-[40px] first:mt-0">
      <h1 className="text-[#1B1B1B] font-[600] text-[22px] mb-[12px]">
        {title}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] justify-items-center">
        {templates?.length ? (
          templates.map((template, idx) => (
            <div
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTemplateClick(template);
              }}>
              <CardTemplateTag data={template} type="creation" />
            </div>
          ))
        ) : (
          <p>No templates</p>
        )}
      </div>
    </div>
  );
};
