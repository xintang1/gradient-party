import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const loaderIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const LoadingOverlay = ({ children, isLoading }) => {
  return (
    <Spin tip="Loading..." indicator={loaderIcon} spinning={isLoading}>
      {children}
    </Spin>
  );
};

export default LoadingOverlay;