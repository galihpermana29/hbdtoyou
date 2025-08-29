// 'use client';
// import {
//   Button,
//   Checkbox,
//   DatePicker,
//   Divider,
//   Form,
//   Image,
//   Input,
//   InputNumber,
//   message,
//   Select,
//   Switch,
//   Upload,
// } from 'antd';
// import TextArea from 'antd/es/input/TextArea';
// import { useState } from 'react';
// import type { GetProp, UploadFile, UploadProps } from 'antd';
// import {
//   LoadingOutlined,
//   MinusCircleOutlined,
//   PlusOutlined,
// } from '@ant-design/icons';
// import { useForm } from 'antd/es/form/Form';
// import { useMemoifyProfile } from '@/app/session-provider';
// import { createContent } from '@/action/user-api';
// import f1Teams from '@/lib/f1Data';
// import dayjs from 'dayjs';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/lib/store';
// import {
//   removeCollectionOfImages,
//   reset,
//   setCollectionOfImages,
// } from '@/lib/uploadSlice';
// type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

// const Formula1Form = ({
//   loading,
//   setLoading,
//   modalState,
//   setModalState,
//   selectedTemplate,
//   openNotification,
//   handleCompleteCreation,
// }: {
//   loading: boolean;
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   modalState: {
//     visible: boolean;
//     data: string;
//   };
//   setModalState: React.Dispatch<
//     React.SetStateAction<{
//       visible: boolean;
//       data: any;
//       type?: any;
//     }>
//   >;
//   selectedTemplate: {
//     id: string;
//     route: string;
//   };
//   openNotification: (progress: number, key: any) => void;
//   handleCompleteCreation: () => void;
// }) => {
//   const [customDriver, setCustomDriver] = useState<{
//     driver1: boolean;
//     driver2: boolean;
//   }>({
//     driver1: false,
//     driver2: false,
//   });

//   const [driver1Image, setDriver1Image] = useState<string>();
//   const [driver2Image, setDriver2Image] = useState<string>();

//   const [uploadLoading, setUploadLoading] = useState(false);

//   const profile = useMemoifyProfile();

//   const [form] = useForm();

//   const collectionOfImages = useSelector(
//     (state: RootState) => state.uploadSlice.collectionOfImages
//   );

//   const dispatch = useDispatch();

//   const handleSetCollectionImagesURI = (
//     payload: { uri: string; uid: string },
//     formName: string
//   ) => {
//     dispatch(setCollectionOfImages([{ ...payload, url: payload.uri }]));
//   };

//   const handleRemoveCollectionImage = (uid: string) => {
//     dispatch(removeCollectionOfImages(uid));
//     const images = collectionOfImages.filter((item) => item.uid !== uid);
//     form.setFieldValue('images', images?.length > 0 ? images : undefined);
//   };

//   const handleSetDriver1ImageURI = (
//     payload: { uri: string; uid: string },
//     formName: string
//   ) => {
//     form.setFieldValue(formName, payload);
//     setDriver1Image(payload.uri);
//   };

//   const handleSetDriver2ImageURI = (
//     payload: { uri: string; uid: string },
//     formName: string
//   ) => {
//     form.setFieldValue(formName, payload);
//     setDriver2Image(payload.uri);
//   };

//   const uploadButton = (
//     <button style={{ border: 0, background: 'none' }} type="button">
//       {loading ? <LoadingOutlined /> : <PlusOutlined />}
//       <div style={{ marginTop: 8 }}>Upload</div>
//     </button>
//   );

//   const handleSubmit = async (val: any) => {
//     const json_text = {
//       title: val.title,
//       teamName: val.teamName,
//       teamDescription: val.teamDescription,
//       teamBase: val.teamBase,
//       teamFirstDate: dayjs(val.teamFirstDate).format('DD MMM YYYY'),

//       secondDriverNumber: val.secondDriverNumber,
//       secondDriverName: val.secondDriverName,
//       driver2: customDriver?.driver2 ? driver2Image : val.driver2?.uri,

//       firstDriverNumber: val.firstDriverNumber,
//       firstDriverName: val.firstDriverName,
//       driver1: customDriver?.driver1 ? driver1Image : val.driver1?.uri,

//       fallingFirst: val.fallingFirst,
//       mostJealous: val.mostJealous,
//       mostFunny: val.mostFunny,
//       mostRomantic: val.mostRomantic,
//       images:
//         collectionOfImages.length > 0
//           ? collectionOfImages.map((dx) => dx.uri)
//           : null,
//       episodes: val.episodes?.map((dx: any) => ({
//         ...dx,
//         year: dayjs(dx.year).format('YYYY'),
//       })),
//       isPublic: val.isPublic,
//     };

//     const payload = {
//       template_id: selectedTemplate.id,
//       detail_content_json_text: JSON.stringify(json_text),
//       title: val?.title2 ? val?.title2 : '',
//       caption: val?.caption ? val?.caption : '',
//     };

//     const res = await createContent(payload);
//     if (res.success) {
//       const userLink = selectedTemplate.route + '/' + res.data;
//       message.success('Successfully created!');

//       // Clear form fields
//       form.resetFields();

//       // Reset Redux state for collection of images
//       dispatch(reset());

//       setModalState({
//         visible: true,
//         data: userLink as string,
//       });
//       handleCompleteCreation();
//     } else {
//       message.error(res.message);
//     }
//   };

//   const allDrivers = f1Teams.flatMap((team) =>
//     team.drivers.map((driver) => ({
//       ...driver,
//       team: team.teamName, // Add team name for reference
//     }))
//   );

//   return (
//     <div>
//       <Form
//         disabled={loading}
//         form={form}
//         layout="vertical"
//         onFinish={(val) => handleSubmit(val)}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
//           <div>
//             {customDriver.driver1 ? (
//               <div>
//                 <h1 className="mb-[8px]">First Driver</h1>
//                 <div className="w-full overflow-hidden h-[200px]">
//                   <img
//                     src={driver1Image}
//                     alt="avatar"
//                     className="w-full object-cover object-top"
//                   />
//                 </div>
//               </div>
//             ) : (
//               <Form.Item
//                 rules={[
//                   {
//                     required: true,
//                     message: 'Please input image!',
//                   },
//                 ]}
//                 name={'driver1'}
//                 className="!my-0"
//                 label="First Driver">
//                 <Upload
//                   accept=".jpg, .jpeg, .png"
//                   name="avatar"
//                   listType="picture-card"
//                   className="avatar-uploader"
//                   showUploadList={false}
//                   beforeUpload={async (file) => {
//                     setUploadLoading(true);
//                     await beforeUpload(
//                       file,
//                       profile
//                         ? ['premium', 'pending'].includes(profile.type as any)
//                           ? 'premium'
//                           : 'free'
//                         : 'free',
//                       openNotification,
//                       handleSetDriver1ImageURI,
//                       'driver1'
//                     );
//                     setUploadLoading(true);
//                   }}>
//                   {driver1Image ? (
//                     <img
//                       src={driver1Image}
//                       alt="avatar"
//                       style={{ width: '100%' }}
//                       className="object-top"
//                     />
//                   ) : (
//                     uploadButton
//                   )}
//                 </Upload>
//               </Form.Item>
//             )}

//             <Form.Item
//               className="!mt-[12px] !mb-2"
//               rules={[
//                 { required: true, message: 'Please input racing number!' },
//               ]}
//               name={'firstDriverNumber'}
//               label="First Driver Number">
//               <InputNumber
//                 className="!w-full"
//                 size="large"
//                 placeholder="Write your racing number"
//               />
//             </Form.Item>
//             <Form.Item
//               className="!mt-[12px] !mb-2"
//               rules={[{ required: true, message: 'Please input driver name!' }]}
//               name={'firstDriverName'}
//               label="First Driver Name">
//               {customDriver.driver1 ? (
//                 <Select
//                   onChange={(value, option) => {
//                     setDriver1Image((option as any)!.image!);
//                   }}
//                   virtual={false}
//                   options={allDrivers.map((dx) => ({
//                     label: <div>{dx.name}</div>,
//                     value: dx.name,
//                     ...dx,
//                   }))}
//                   size="large"
//                   placeholder="Select an F1 Driver"
//                 />
//               ) : (
//                 <Input
//                   size="large"
//                   placeholder="Write you name as an F1 Driver"
//                 />
//               )}
//             </Form.Item>
//             <Checkbox
//               disabled={profile?.type === 'free'}
//               onChange={(e) => {
//                 setDriver1Image('');
//                 setCustomDriver({ ...customDriver, driver1: e.target.checked });
//               }}>
//               <div>
//                 <h1> Use Formula 1 Driver</h1>
//                 <p className="text-[11px] font-bold text-red-500">
//                   Available on Premium Plan
//                 </p>
//               </div>
//             </Checkbox>
//           </div>
//           <div>
//             {customDriver.driver2 ? (
//               <div>
//                 <h1 className="mb-[8px]">Second Driver</h1>
//                 <div className="w-full overflow-hidden h-[200px]">
//                   <img
//                     src={driver2Image}
//                     alt="avatar"
//                     className="w-full object-cover object-top"
//                   />
//                 </div>
//               </div>
//             ) : (
//               <Form.Item
//                 rules={[
//                   {
//                     required: true,
//                     message: 'Please input image!',
//                   },
//                 ]}
//                 name={'driver2'}
//                 className="!my-0"
//                 label="Second Driver">
//                 <Upload
//                   accept=".jpg, .jpeg, .png"
//                   name="avatar"
//                   listType="picture-card"
//                   className="avatar-uploader"
//                   showUploadList={false}
//                   beforeUpload={async (file) => {
//                     setUploadLoading(true);
//                     await beforeUpload(
//                       file,
//                       profile
//                         ? ['premium', 'pending'].includes(profile.type as any)
//                           ? 'premium'
//                           : 'free'
//                         : 'free',
//                       openNotification,
//                       handleSetDriver2ImageURI,
//                       'driver2'
//                     );
//                     setUploadLoading(true);
//                   }}>
//                   {driver2Image ? (
//                     <img
//                       src={driver2Image}
//                       alt="avatar"
//                       style={{ width: '100%' }}
//                       className="object-top object-cover"
//                     />
//                   ) : (
//                     uploadButton
//                   )}
//                 </Upload>
//               </Form.Item>
//             )}

//             <Form.Item
//               className="!mt-[12px] !mb-2"
//               rules={[
//                 { required: true, message: 'Please input racing number!' },
//               ]}
//               name={'secondDriverNumber'}
//               label="Second Driver Number">
//               <InputNumber
//                 className="!w-full"
//                 size="large"
//                 placeholder="Write your racing number"
//               />
//             </Form.Item>
//             <Form.Item
//               className="!mt-[12px] !mb-2"
//               rules={[{ required: true, message: 'Please input driver name!' }]}
//               name={'secondDriverName'}
//               label="Second Driver Name">
//               {customDriver.driver2 ? (
//                 <Select
//                   onChange={(value, option) => {
//                     setDriver2Image((option as any)!.image!);
//                   }}
//                   virtual={false}
//                   options={allDrivers.map((dx) => ({
//                     label: <div>{dx.name}</div>,
//                     value: dx.name,
//                     ...dx,
//                   }))}
//                   size="large"
//                   placeholder="Select an F1 Driver"
//                 />
//               ) : (
//                 <Input
//                   size="large"
//                   placeholder="Write you name as an F1 Driver"
//                 />
//               )}
//             </Form.Item>
//             <Checkbox
//               disabled={profile?.type === 'free'}
//               onChange={(e) => {
//                 setDriver2Image('');
//                 setCustomDriver({ ...customDriver, driver2: e.target.checked });
//               }}>
//               <div>
//                 <h1> Use Formula 1 Driver</h1>
//                 <p className="text-[11px] font-bold text-red-500">
//                   Available on Premium Plan
//                 </p>
//               </div>
//             </Checkbox>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Form.Item
//             rules={[{ required: true, message: 'Please input title!' }]}
//             name={'title'}
//             initialValue={'Gift for Our Valentine'}
//             label="Website Title">
//             <Input size="large" placeholder="Gift for Our Valentine" />
//           </Form.Item>
//           <div>
//             <Form.Item
//               className="!mb-1"
//               rules={[{ required: true, message: 'Please input title!' }]}
//               name={'teamName'}
//               label="Team Name">
//               <Select
//                 virtual={false}
//                 options={f1Teams.map((dx) => ({
//                   label: <div>{dx.teamName}</div>,
//                   value: dx.teamName,
//                   ...dx,
//                 }))}
//                 size="large"
//                 placeholder="Select an F1 Team"
//               />
//             </Form.Item>
//           </div>
//         </div>
//         <Form.Item
//           rules={[{ required: true, message: 'Please input subtitle!' }]}
//           name={'teamDescription'}
//           initialValue={
//             'Since our journey began in 2019, our love story has been an incredible ride. Through ups and downs, laughter and tears, we ve built something truly special. Every moment together is a podium finish, and every challenge we face makes us stronger. From silly jokes to heartfelt conversations, we continue to race forward, hand in hand, towards a lifetime of happiness.'
//           }
//           label="Team Description">
//           <TextArea
//             size="large"
//             placeholder="Since our journey began in 2019, our love story has been an incredible ride. Through ups and downs, laughter and tears, we ve built something truly special. Every moment together is a podium finish, and every challenge we face makes us stronger. From silly jokes to heartfelt conversations, we continue to race forward, hand in hand, towards a lifetime of happiness."
//           />
//         </Form.Item>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Form.Item
//             rules={[{ required: true, message: 'Please input title!' }]}
//             name={'teamBase'}
//             label="Team Home Base">
//             <Input size="large" placeholder="Where is your team based" />
//           </Form.Item>
//           <Form.Item
//             rules={[{ required: true, message: 'Please input title!' }]}
//             name={'mostJealous'}
//             label="Who is The Most Jealous">
//             <Input size="large" placeholder="Who is the most jealous" />
//           </Form.Item>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Form.Item
//             rules={[{ required: true, message: 'Please input title!' }]}
//             name={'fallingFirst'}
//             label="Who is Falling in Love First">
//             <Input size="large" placeholder="Who is falling in love first" />
//           </Form.Item>
//           <Form.Item
//             rules={[{ required: true, message: 'Please input title!' }]}
//             name={'teamFirstDate'}
//             label="First Date">
//             <DatePicker
//               format={'DD MMM YYYY'}
//               className="!w-full"
//               size="large"
//               placeholder="Your first date"
//             />
//           </Form.Item>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Form.Item
//             rules={[{ required: true, message: 'Please input title!' }]}
//             name={'mostFunny'}
//             label="Who is The Most Funny">
//             <Input size="large" placeholder="Who is The Most Funny" />
//           </Form.Item>
//           <Form.Item
//             rules={[{ required: true, message: 'Please input title!' }]}
//             name={'mostRomantic'}
//             label="Who is The Most Romantic">
//             <Input size="large" placeholder="Who is The Most Romantic" />
//           </Form.Item>
//         </div>
//         <Form.List name="episodes">
//           {(fields, { add, remove }) => (
//             <>
//               <div className="mt-[10px] mb-[5px]">
//                 <h3 className="text-[15px] font-semibold">
//                   Year of Relationship Journey
//                 </h3>

//                 <p className="text-[13px] text-gray-600 max-w-[400px]">
//                   Throwbacks to your loved ones, memories, and laughter on year
//                   retrospective
//                 </p>
//               </div>
//               <div className="flex flex-wrap gap-[10px] ">
//                 {fields.map(({ key, name, fieldKey, ...restField }, index) => (
//                   <div key={key} className="flex gap-[8px] items-start w-full">
//                     <div className="w-full">
//                       <Form.Item
//                         {...restField}
//                         className="!my-2"
//                         name={[name, 'year']}
//                         rules={[
//                           {
//                             required: true,
//                             message: 'Please select a year!',
//                           },
//                         ]}>
//                         <DatePicker
//                           picker="year"
//                           format={'YYYY'}
//                           className="!w-full"
//                           placeholder="Select a Year"
//                         />
//                       </Form.Item>
//                       <Form.Item
//                         {...restField}
//                         initialValue={
//                           'This year marks another lap in our love story. More memories, more laughter, and more dreams to achieve together. The best is yet to come!'
//                         }
//                         name={[name, 'desc']}
//                         rules={[
//                           {
//                             required: true,
//                             message: 'Please input the desc!',
//                           },
//                         ]}>
//                         <TextArea placeholder="This year marks another lap in our love story. More memories, more laughter, and more dreams to achieve together. The best is yet to come!" />
//                       </Form.Item>
//                       <Button
//                         danger
//                         type="default"
//                         onClick={() => remove(name)}
//                         icon={<MinusCircleOutlined />}>
//                         Remove
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <Button
//                 size="large"
//                 type="primary"
//                 onClick={() => {
//                   if (profile?.quota === 0) {
//                     if (fields.length <= 1) {
//                       add();
//                     } else {
//                       message.error('You can only add 2 moments');
//                     }
//                   } else {
//                     if (fields.length <= 15) {
//                       add();
//                     } else {
//                       message.error('Limit reached');
//                     }
//                   }
//                 }}
//                 icon={<PlusOutlined />}
//                 className="!rounded-[50px] !bg-black !text-white my-[12px] !text-[13px]">
//                 Add Moment
//               </Button>

//               <p className="text-[13px] text-gray-600 max-w-[400px]">
//                 Account with <span className="font-bold">free</span> plan can
//                 only add 2 moment of episode. To add up to 16 moment of episode,
//                 upgrade to <span className="font-bold">premium</span> plan.
//               </p>
//             </>
//           )}
//         </Form.List>

//         <Form.Item
//           name={'images'}
//           label={
//             <div className="mt-[10px] mb-[5px]">
//               <h3 className="text-[15px] font-semibold">
//                 Collection of images
//               </h3>

//               <p className="text-[13px] text-gray-600 max-w-[400px]">
//                 Account with <span className="font-bold">free</span> plan can
//                 only add 1 images. To add up to 15 images, upgrade to{' '}
//                 <span className="font-bold">premium</span> plan.
//               </p>
//             </div>
//           }>
//           <Upload
//             customRequest={({ onSuccess }) => {
//               setTimeout(() => {
//                 onSuccess?.('ok', undefined);
//               }, 0);
//             }}
//             accept=".jpg, .jpeg, .png"
//             multiple={true}
//             maxCount={profile?.type === 'free' ? 1 : 15}
//             listType="picture-card"
//             onRemove={(file) => handleRemoveCollectionImage(file.uid)}
//             beforeUpload={async (file, fileList) => {
//               if (fileList.length > 5) {
//                 // Find the index of the current file in the list
//                 const fileIndex = fileList.findIndex((f) => f.uid === file.uid);

//                 // Only process the first 5 files, ignore the rest
//                 if (fileIndex >= 5) {
//                   return Upload.LIST_IGNORE;
//                 }
//               }
//               // setUploadLoading(true);
//               await beforeUpload(
//                 file as FileType,
//                 profile
//                   ? ['premium', 'pending'].includes(profile.type as any)
//                     ? 'premium'
//                     : 'free'
//                   : 'free',
//                 openNotification,
//                 handleSetCollectionImagesURI,
//                 'images'
//               );
//               // setUploadLoading(false);
//             }}>
//             {collectionOfImages.length >= 1 && profile?.type === 'free'
//               ? null
//               : collectionOfImages.length >= 15 && profile?.type !== 'free'
//               ? null
//               : uploadButton}
//           </Upload>
//         </Form.Item>

//         <Form.Item
//           name={'isPublic'}
//           label={
//             <div className="mt-[10px] mb-[5px]">
//               <h3 className="text-[15px] font-semibold">
//                 Show on Inspiration Page
//               </h3>

//               <p className="text-[13px] text-gray-600 max-w-[400px]">
//                 In free plan your website will be shown on the Inspiration page.
//                 You can change this option to hide it on premium plan.
//               </p>
//             </div>
//           }
//           initialValue={true}>
//           <Switch disabled={profile?.type === 'free'} />
//         </Form.Item>
//         <Divider />
//         <Form.Item
//           rules={[{ required: true, message: 'Please input title!' }]}
//           name={'title2'}
//           className="!my-[10px]"
//           label="Inspiration title">
//           <Input size="large" placeholder="Your inspiration title" />
//         </Form.Item>
//         <Form.Item
//           rules={[{ required: true, message: 'Please input caption!' }]}
//           name={'caption'}
//           className="!my-[10px]"
//           label="Inspiration caption">
//           <TextArea size="large" placeholder="Your inspiration caption" />
//         </Form.Item>
//         <div className="flex justify-end ">
//           <Button
//             className="!bg-black"
//             loading={loading || uploadLoading}
//             type="primary"
//             htmlType="submit"
//             size="large">
//             Create
//           </Button>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default Formula1Form;
