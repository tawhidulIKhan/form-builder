import React from "react";
import { Layout, Typography, Space } from "antd";
import { GithubFilled } from "@ant-design/icons";

const { Footer } = Layout;
const { Text, Link } = Typography;

export default function FormBuilderFooter() {
  return (
    <Footer style={{ textAlign: "center", background: "#fff", borderTop: "1px solid #f0f0f0", marginTop: "24px" }}>
      <Space direction="vertical" size="small">
        <Text type="secondary">
          Form Builder v1.0.0
        </Text>
        <Text type="secondary">
          <Link href="https://github.com/tawhidulIKhan/form-builder" target="_blank" rel="noopener noreferrer">
            <GithubFilled /> View on GitHub
          </Link>
        </Text>
      </Space>
    </Footer>
  );
}
