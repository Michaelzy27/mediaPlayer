import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  notification,
  Row,
  Spin,
} from 'antd';
import BackLink from 'components/common/BackLink';
import ResponsiveContainer from 'components/common/ResponsiveContainer';
import SubmitCancelButtons from 'components/common/SubmitCancelButtons';
import { useSettings } from 'hooks/useSettings';
import { useCallback, useMemo, useState } from 'react';
import './user.less';

interface INotificationSettings {
  code: string;
  title: string;
  defaultValue: any;
}

const NotificationSettings = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formChanged, setFormChanged] = useState<boolean>(false);
  const { settings, updatingSettings, updateSettings } = useSettings();

  const [form] = Form.useForm();

  const notificationSettingValues: INotificationSettings[] = [
    {
      code: 'R00',
      title: 'Random Setting',
      defaultValue: 0,
    },
  ];
  const initialSettingValues = useMemo(
    () =>
      settings?.notificationSettings.reduce((acc, current) => {
        acc[current.code] = current.value;
        return acc;
      }, {} as Record<string, any>),
    [settings]
  );

  const edit = () => {
    setEditMode(true);
  };
  const onCancel = () => {
    form.resetFields();
    setFormChanged(false);
    setEditMode(false);
  };
  const onSubmit = useCallback(async () => {
    try {
      await form.validateFields();

      if (formChanged) {
        /// pass all check
        const values = form.getFieldsValue();

        updateSettings(values, () => {
          setEditMode(false);
        });
      } else {
        notification['error']({
          message: 'Error',
          description: 'No changes made',
        });
      }
    } catch (err) {
      // Errors in the fields
    }
  }, [form, formChanged, updateSettings]);

  const onFormChanged = () => {
    setFormChanged(true);
  };

  return (
    <>
      <ResponsiveContainer className="my-6">
        <BackLink text="Back" />
        <h2>Notification settings</h2>
        <Card title="Email notifications" className="mb-6">
          {!notificationSettingValues && (
            <div>
              <Spin />
            </div>
          )}
          {!editMode && (
            <>
              {notificationSettingValues?.map((value) => {
                const isSelected =
                  initialSettingValues?.[value.code] ?? value.defaultValue;
                return (
                  <Row
                    role="heading"
                    aria-label={`${value.title} - ${isSelected ? 'On' : 'Off'}`}
                    className="mb-2"
                  >
                    <Col className="w-16">
                      {isSelected ? (
                        <CheckCircleFilled
                          className={`text-sm primary-color`}
                        />
                      ) : (
                        <CloseCircleOutlined
                          className={`text-sm secondary-color`}
                        />
                      )}
                      <span className="ml-2">{isSelected ? 'On' : 'Off'}</span>
                    </Col>
                    <Col>{value.title}</Col>
                  </Row>
                );
              })}
              <Button
                type="link"
                aria-label="Edit email notification settings"
                onClick={() => edit()}
                className="p-0"
              >
                Edit
              </Button>
            </>
          )}
          {editMode && (
            <>
              <Form
                layout="vertical"
                initialValues={initialSettingValues}
                form={form}
                onFinish={onSubmit}
                onChange={onFormChanged}
                className="w-full"
              >
                {notificationSettingValues?.map((value) => {
                  return (
                    <Form.Item
                      name={value.code}
                      className="mb-0"
                      valuePropName="checked"
                    >
                      <Checkbox>{value.title}</Checkbox>
                    </Form.Item>
                  );
                })}
              </Form>
              <div className="mt-4">
                <SubmitCancelButtons
                  order="reverse"
                  justify="start"
                  cancelText="Cancel"
                  submitText="Save changes"
                  onCancel={onCancel}
                  onSubmit={onSubmit}
                  submitting={updatingSettings}
                  disabled={!formChanged}
                />
              </div>
            </>
          )}
        </Card>
      </ResponsiveContainer>
    </>
  );
};

export default NotificationSettings;
