import JournalLayout from '../view/JournalLayout';

const LayoutEntry = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <JournalLayout>{children}</JournalLayout>
    </div>
  );
};

export default LayoutEntry;
