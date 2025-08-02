'use client';

import { Button, DatePicker, Form, Input, Select, Spin, Upload, message } from 'antd';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Genre, fetchMovieGenres } from '@/services/tmdb';
import { generateGraduationStory } from '@/services/gemini';

const CreateGraduationNetflixPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Use React Query to fetch movie genres
  const { data: genres = [], isLoading: genreLoading } = useQuery({
    queryKey: ['movieGenres'],
    queryFn: async () => {
      try {
        return await fetchMovieGenres();
      } catch (error) {
        message.error('Failed to load movie genres');
        return [];
      }
    }
  });

  const genreOptions = genres.map((genre: Genre, index: number) => ({
    value: genre.id,
    label: genre.name
  }));

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const onFinish = async (values: any) => {
    setLoading(true);
    setGenerating(true);
    try {
      // Format the dates to strings
      const formattedValues = {
        ...values,
        graduationDate: values.graduationDate?.format('YYYY-MM-DD'),
        photo: values.photo?.fileList?.map((file: any) => file.originFileObj)
      };

      message.info('Generating your graduation story...');

      // Generate graduation story using Gemini
      const generatedData = await generateGraduationStory({
        name: values.name,
        university: values.university,
        graduationDate: formattedValues.graduationDate,
        movieGenre: values.movieGenre
      });

      // Store the generated data in localStorage for the destination page to use
      localStorage.setItem('graduationData', JSON.stringify(generatedData));

      message.success('Graduation page created successfully!');

      // Navigate to the graduation page with query params
      router.push(`/album/graduation/filmv1?name=${encodeURIComponent(values.name)}`);
    } catch (error) {
      message.error('Failed to create graduation page');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto h-full">
        <div className="flex items-center gap-3 mb-8">
          <Image
            src="/Nikahfix.svg"
            width={20}
            height={36}
            alt="netflix logo"
          />
          <h1 className="text-xl md:text-3xl font-bold geist-font">Create Your Graduation Story</h1>
        </div>

        <div className="bg-[#18181B] p-6 rounded-md h-full">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="text-white"
          >
            <Form.Item
              name="name"
              label={<span className="text-white geist-font">Name</span>}
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input
                placeholder="Enter your name"
                className="bg-[#27272A] border-[#3F3F46] text-white"
              />
            </Form.Item>

            <Form.Item
              name="university"
              label={<span className="text-white geist-font">University</span>}
              rules={[{ required: true, message: 'Please enter your university' }]}
            >
              <Input
                placeholder="Enter your university"
                className="bg-[#27272A] border-[#3F3F46] text-white"
              />
            </Form.Item>

            <Form.Item
              name="graduationDate"
              label={<span className="text-white geist-font">Graduation Date</span>}
              rules={[{ required: true, message: 'Please select your graduation date' }]}
            >
              <DatePicker
                className="w-full bg-[#27272A] border-[#3F3F46] text-white"
                placeholder="Select your graduation date"
              />
            </Form.Item>

            <Form.Item
              name="photo"
              label={<span className="text-white geist-font">Upload 10 - 20 photos</span>}
              rules={[{ required: true, message: 'Please upload your photos' }]}
            >
              <Upload
                listType="picture"
                multiple
                maxCount={20}
                beforeUpload={() => false} // Prevent auto upload
                accept="image/*"
              >
                <Button
                  icon={<UploadOutlined />}
                  className="bg-[#27272A] border-[#3F3F46] text-white w-full h-24 flex items-center justify-center"
                >
                  <span className="text-blue-500 text-sm">Upload</span>
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="movieGenre"
              label={<span className="text-white geist-font">If your journey to get bachelor degree was a movie, what genre would it be?</span>}
              rules={[{ required: true, message: 'Please select a movie genre' }]}
            >
              <Select
                placeholder="Select a movie genre"
                className="bg-[#27272A] border-[#3F3F46] text-white"
                getPopupContainer={trigger => trigger}
                options={genreOptions}
                showSearch
                filterOption={(input, option) => option?.label?.toLowerCase().includes(input.toLowerCase())}
              />
            </Form.Item>

            <Form.Item className="mt-8">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={generating}
                className="bg-[#E50914] hover:bg-[#B81D24] border-none text-white font-medium h-12 w-full"
              >
                {generating ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spin indicator={antIcon} />
                    <span className="geist-font text-white">Generating Your Story...</span>
                  </div>
                ) : (
                  'Create Graduation Page'
                )}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateGraduationNetflixPage;