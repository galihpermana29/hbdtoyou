import { IAllTemplateResponse } from '@/action/interfaces';
import { getAllTemplates } from '@/action/user-api';
import NewInspirationPage from '@/components/newlanding/NewInspiration';
import NavigationBar from '@/components/ui/navbar';

const getData = async () => {
  const data = await getAllTemplates();
  return data.success ? data.data : [];
};

const InspirationPage = async () => {
  const data: null | IAllTemplateResponse[] =
    (await getData()) as IAllTemplateResponse[];

  return (
    <div>
      <NavigationBar />
      <NewInspirationPage templates={data} />
    </div>
  );
};

export default InspirationPage;
