import { ILatestContentResponse } from '@/action/interfaces';
import { getLatestInspiration } from '@/action/user-api';
import NavigationBar from '@/components/ui/navbar';
import Link from 'next/link';

const getData = async () => {
  const data = await getLatestInspiration();

  return data.success ? data.data : [];
};

const InspirationPage = async () => {
  const data: null | ILatestContentResponse =
    (await getData()) as ILatestContentResponse;
  return (
    <div>
      <NavigationBar />
      <div className="py-[30px] px-[13px] lg:px-[40px]">
        <h1 className="text-center font-bold text-[22px] lg:text-[30px] mb-[30px]">
          Inspiration from Others
        </h1>
        <div className="mx-auto flex justify-center items-center">
          <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-[10px]  justify-items-center lg:max-w-[90%]">
            {data
              ? data?.contents?.map((show, idx) => {
                  const jsonContent = JSON.parse(show.detail_content_json_text);

                  const handleJumbotron = () => {
                    if (
                      show.template_name.includes('magazinev1') ||
                      show.template_name.includes('spotifyv1') ||
                      show.template_name.includes('magazinev1')
                    ) {
                      return Array.isArray(jsonContent.momentOfYou)
                        ? jsonContent.momentOfYou.length > 0
                          ? jsonContent.momentOfYou[0]
                          : null
                        : null;
                    }

                    if (
                      show.template_name.includes('netflixv1') ||
                      show.template_name.includes('disneyplusv1') ||
                      show.template_name.includes('newspaperv3') ||
                      show.template_name.includes('newspaperv1')
                    ) {
                      return jsonContent.jumbotronImage;
                    }
                  };

                  if (show.user_name === 'Ghina Rhoudotul Jannah') return;
                  if (!handleJumbotron()) return;

                  if (
                    Object.prototype.hasOwnProperty.call(
                      jsonContent,
                      'isPublic'
                    ) &&
                    jsonContent?.isPublic === false
                  )
                    return;

                  return (
                    <Link
                      key={idx}
                      href={`/${
                        show.template_name.split('-')[1].split(' ')[1]
                      }/${show.id}`}>
                      <div className="bg-[#181818] p-3 md:p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group max-w-[400px] ">
                        <div className="mb-4 relative">
                          <img
                            src={handleJumbotron()}
                            alt={jsonContent.title}
                            className="w-full aspect-video object-cover rounded-md"
                          />
                        </div>
                        <h3 className="font-semibold text-white mb-1 line-clamp-1">
                          {show.template_name.split('-')[0]}
                        </h3>
                      </div>
                    </Link>
                  );
                })
              : 'No data'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspirationPage;
