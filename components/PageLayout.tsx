import React, { useState } from 'react'
import { Layout, Button } from 'antd'
import { BulbOutlined, CloudOutlined } from '@ant-design/icons'
// import Navbar from './navbar'
// import Footer from './footer'

const { Header, Content, Sider } = Layout;

export default function PageLayout({ children }) {
  const [ siderTheme, setSiderTheme ] = useState<"light"|"dark">('dark')

  const changeSiderTheme = () => {
    siderTheme == 'light'? setSiderTheme('dark'):setSiderTheme('light')
  }

  return (
    <Layout className="layout-container">
      <Sider theme={siderTheme}>
        test?
        <Button onClick={changeSiderTheme}>
          {siderTheme === 'light'? <BulbOutlined />:  <CloudOutlined />}
        </Button>
      </Sider>
      <Content className="content-container">
        {children}
      </Content>
    </Layout>
  )
}