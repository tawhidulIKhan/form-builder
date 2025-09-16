import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Button, Space, Tooltip, Card, Divider, Typography } from "antd";
import { PlusOutlined, UploadOutlined, CodeOutlined, SaveOutlined, AppstoreOutlined, GithubFilled } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

import FieldList from "./FieldList";
import FieldPreview from "./FieldPreview";
import FieldEditor from "./FieldEditor";
import DesignsDrawer from "./DesignsDrawer";
import GenerateCodeModal from "./GenerateCodeModal";
import ImportCodeModal from "./ImportCodeModal";
import FormBuilderFooter from "./FormBuilderFooter";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function FormBuilderContent() {
  const LOCAL_KEY_FIELDS = "formBuilder_fields_v2";
  const LOCAL_KEY_DESIGNS = "formBuilder_saves_v2";

  const defaultField = () => ({
    id: uuidv4(),
    name: `field_${Math.random().toString(36).slice(2, 8)}`,
    label: "New Field",
    type: "input",
    options: ["Option 1", "Option 2"],
    validation: { required: false, min: null, max: null, pattern: "", customMessage: "", crossField: null },
    conditions: [],
    visibleWhen: null,
    group: null,
    columns: 1,
  });

  // Load fields from localStorage
  const [fields, setFields] = useState(() => {
    const saved = localStorage.getItem(LOCAL_KEY_FIELDS);
    return saved ? JSON.parse(saved) : [defaultField()];
  });

  const [selectedFieldId, setSelectedFieldId] = useState(fields[0]?.id || null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [designs, setDesigns] = useState(() => {
    const raw = localStorage.getItem(LOCAL_KEY_DESIGNS);
    return raw ? JSON.parse(raw) : [];
  });

  // Toolbar actions
  const addField = () => {
    const f = defaultField();
    setFields((s) => [...s, f]);
    setSelectedFieldId(f.id);
  };

  const saveDesign = (name) => {
    const payload = {
      id: uuidv4(),
      name: name || `Design ${new Date().toLocaleString()}`,
      createdAt: new Date().toISOString(),
      fields,
    };
    setDesigns((s) => [payload, ...s]);
  };

  // Persist fields & designs
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_FIELDS, JSON.stringify(fields));
  }, [fields]);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_DESIGNS, JSON.stringify(designs));
  }, [designs]);

  return (
    <Layout style={{ height: "100vh", background: "#f0f2f5" }}>
      {/* Header with site title */}
      <Header 
        style={{ 
          background: "#fff", 
          padding: "0 24px", 
          boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
          Form Builder Pro
        </Title>
        <div>
          <Button 
            type="text" 
            icon={<GithubFilled size={26} />} 
            onClick={() => { window.open("https://github.com/tawhidulIKhan/form-builder", "_blank"); }}
            style={{ marginRight: 8, fontSize: 26 }}
          />
        </div>
      </Header>

      <Content style={{ padding: "24px", overflow: "auto" }}>
        {/* Toolbar */}
        <Card 
          style={{ marginBottom: 24, borderRadius: 8 }}
          bodyStyle={{ padding: "16px 24px" }}
        >
          <Row gutter={[12, 12]}>
            <Col flex="auto">
              <Space wrap>
                <Tooltip title="Add a new field">
                  <Button 
                    icon={<PlusOutlined />} 
                    onClick={addField}
                    type="primary"
                  >
                    Add Field
                  </Button>
                </Tooltip>
                <Tooltip title="Import fields or design">
                  <Button icon={<UploadOutlined />} onClick={() => setImportModal(true)}>
                    Import
                  </Button>
                </Tooltip>
                <Tooltip title="Save current design">
                  <Button 
                    icon={<SaveOutlined />} 
                    onClick={() => saveDesign()}
                    style={{ background: "#52c41a", color: "white", borderColor: "#52c41a" }}
                  >
                    Save Design
                  </Button>
                </Tooltip>
              </Space>
            </Col>
            <Col>
              <Space wrap>
                <Tooltip title="Generate React code for this form">
                  <Button 
                    type="primary" 
                    icon={<CodeOutlined />} 
                    onClick={() => setShowGenerate(true)}
                    style={{ background: "#722ed1", borderColor: "#722ed1" }}
                  >
                    Generate Code
                  </Button>
                </Tooltip>
                <Tooltip title="View saved designs">
                  <Button 
                    icon={<AppstoreOutlined />} 
                    onClick={() => setDrawerOpen(true)}
                  >
                    Designs ({designs.length})
                  </Button>
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Main 3-column layout */}
        <Row gutter={[16, 16]}>
          {/* Field List */}
          <Col xs={24} sm={12} md={7}>
              <FieldList
                fields={fields}
                selectedFieldId={selectedFieldId}
                setSelectedFieldId={setSelectedFieldId}
                setFields={setFields}
              />
          </Col>

          {/* Field Preview */}
          <Col xs={24} sm={12} md={7}>
              <FieldPreview fields={fields} />
          </Col>

          {/* Field Editor */}
          <Col xs={24} sm={24} md={10}>
              <FieldEditor
                fields={fields}
                selectedFieldId={selectedFieldId}
                setFields={setFields}
              />
          </Col>
        </Row>

        {/* Drawers & Modals */}
        <DesignsDrawer
          open={drawerOpen}
          setOpen={setDrawerOpen}
          designs={designs}
          setDesigns={setDesigns}
          setFields={setFields}
        />
        <GenerateCodeModal
          open={showGenerate}
          setOpen={setShowGenerate}
          fields={fields}
        />
        <ImportCodeModal
          open={importModal}
          setOpen={setImportModal}
          setFields={setFields}
        />
        <FormBuilderFooter />
      </Content>
    </Layout>
  );
}
