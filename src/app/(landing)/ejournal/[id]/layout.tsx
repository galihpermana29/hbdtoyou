import JournalLayout from '../view/JournalLayout';
import EntryDetail from './page';

const LayoutEntry = () => {
  return (
    <div>
      <JournalLayout>
        <EntryDetail />
      </JournalLayout>
    </div>
  );
};

export default LayoutEntry;
