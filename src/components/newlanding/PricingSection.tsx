'use client';

import { getListPackages } from '@/action/user-api';
import { useMemoifySession } from '@/app/session-provider';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, List, Row } from 'antd';
import { CircleCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Pricing / plans section shared across marketing pages.
 *
 * Self-contained: fetches the available packages itself and wires each plan's
 * CTA to the create/payment flow (or Google sign-in when logged out). Render it
 * with no props on any landing page that should show the same plans.
 */
export default function PricingSection() {
  const router = useRouter();
  const session = useMemoifySession();

  const { data: packages, isFetching } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const data = await getListPackages();
      return data.data;
    },
  });

  return (
    <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-[20px] py-[90px]">
      <h1 className="mb-[20px] text-center text-[#1B1B1B] font-[700] text-[30px] md:text-[36px]">
        Pricing plans
      </h1>
      <p className="text-[#7b7b7b] text-[16px] md:text-[20px] font-[400] text-center mb-[35px]">
        Simple, transparent pricing that grows with you. Try any plan free for
        30 days.
      </p>

      <Row gutter={[24, 24]} justify="center">
        {!isFetching &&
          packages?.map((dx) => {
            return (
              <Col xs={24} sm={8} key={dx.id}>
                <Card className=" flex flex-col justify-between">
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h1 className="text-[#1B1B1B] font-[700] text-[36px]">
                      IDR {dx.price}
                    </h1>
                    <p className="mt-[16px] text-[20px] font-[600]">{dx.name}</p>
                    <p className="text-[#7B7B7B] text-[16px] font-[400]">
                      {dx.description}
                    </p>
                  </div>
                  <List
                    bordered={false}
                    itemLayout="horizontal"
                    dataSource={dx.features || []}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<CircleCheck color="#079455" />}
                          title={item}
                        />
                      </List.Item>
                    )}
                  />

                  <div className="flex justify-center items-end">
                    <Button
                      onClick={() => {
                        if (session.accessToken) {
                          if (dx.name === 'Free Plan') {
                            router.push('/create');
                          }

                          if (dx.name === 'Premium Plan') {
                            router.push(
                              `/payment?type=premium&plan_id=${dx.id}`
                            );
                          }

                          if (dx.name === 'Advanced Plan') {
                            router.push(
                              `/payment?type=advanced&plan_id=${dx.id}`
                            );
                          }
                        } else {
                          signIn('google');
                        }
                      }}
                      iconPosition="end"
                      size="large"
                      className="!border-[1px] !h-[48px] !bg-[#E34013] !text-[#fff] !font-[400] mt-[40px] !w-[90%] !text-[16px]">
                      {session?.accessToken ? 'Try now' : 'Sign in with Google'}
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
      </Row>
    </div>
  );
}
