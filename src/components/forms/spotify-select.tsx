'use client';

import { // Select replaced with FixedSelect} from 'antd';

const SpotifySelect = ({ name, ...props }: { name: string }) => {
  return (
    <Form.Item
      className=" w-full flex-1 !my-0"
      {...props}
      name={[name]}
      rules={[{ required: true, message: 'Please input a song name!' }]}>
      {/* <Input placeholder="Search a song" size="large" /> */}
      <FixedSelect
        size="large"
        showSearch
        placeholder="Search a song"
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={[
          { value: '1', label: 'Jack' },
          { value: '2', label: 'Lucy' },
          { value: '3', label: 'Tom' },
        ]}
      />
    </Form.Item>
  );
};

export default SpotifySelect;
