import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Layout,
  Button,
  Modal,
  Input,
  Select,
  Card,
  Row,
  Col,
  Space,
  Drawer,
  Switch,
  InputNumber,
  Tooltip,
  List,
  Popconfirm,
  message,
} from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

export default function FormBuilderStarter() {
  const LOCAL_KEY = "formBuilder_saves_v1";

  const defaultField = () => ({
    id: uuidv4(),
    name: `field_${Math.random().toString(36).slice(2, 8)}`,
    label: "New Field",
    type: "input",
    options: ["Option 1", "Option 2"],
    validation: { required: false, min: null, max: null, pattern: "" },
    visibleWhen: null,
    group: null,
    columns: 1,
  });

  const [fields, setFields] = useState([defaultField()]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [importCode, setImportCode] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      try {
        setDesigns(JSON.parse(raw));
      } catch (e) {
        console.warn("failed to load designs", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(designs));
  }, [designs]);

  function addField() {
    const f = defaultField();
    setFields((s) => [...s, f]);
    setSelectedFieldId(f.id);
  }

  function updateField(id, patch) {
    setFields((s) => s.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  function removeField(id) {
    setFields((s) => s.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  }

  function saveDesign(name) {
    const payload = {
      id: uuidv4(),
      name:
        name || `Design ${new Date().toLocaleString()}`,
      createdAt: new Date().toISOString(),
      fields,
    };
    setDesigns((s) => [payload, ...s]);
    message.success("Design saved");
  }

  function loadDesign(id) {
    const d = designs.find((x) => x.id === id);
    if (d) {
      setFields(d.fields);
      message.success(`Loaded: ${d.name}`);
    }
  }

  function deleteDesign(id) {
    setDesigns((s) => s.filter((x) => x.id !== id));
    message.success("Deleted");
  }

  function parseCodeToFields(code) {
    const nameRegex =
      /name\s*=\s*(?:"([\w_-]+)"|'([\w_-]+)'|\{\s*"([\w_-]+)"\s*\})/g;
    const typeRegex =
      /<(?:Input|InputNumber|Select|Checkbox|Radio|TextArea|DatePicker|Switch)\b/gi;

    const foundNames = new Set();
    let m;
    while ((m = nameRegex.exec(code))) {
      const n = m[1] || m[2] || m[3];
      if (n) foundNames.add(n);
    }

    const detectedFields = Array.from(foundNames).map((n) => ({
      id: uuidv4(),
      name: n,
      label: n
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (s) => s.toUpperCase()),
      type: "input",
      options: ["Option 1"],
      validation: { required: false, min: null, max: null, pattern: "" },
      visibleWhen: null,
      group: null,
      columns: 1,
    }));

    if (typeRegex.test(code)) {
      if (/InputNumber/.test(code)) {
        detectedFields.forEach((f) => (f.type = "number"));
      }
    }

    return detectedFields;
  }

  function importFromCodeAction() {
    const parsed = parseCodeToFields(importCode);
    if (parsed.length === 0) {
      message.warn(
        "No recognizable fields found in the provided code."
      );
      return;
    }
    setFields(parsed);
    setImportModal(false);
    message.success(`Imported ${parsed.length} fields`);
  }

  function generateCodeString() {
    function yupForField(f) {
      let s = "yup.mixed()";
      if (f.type === "number") s = "yup.number()";
      else if (f.type === "date") s = "yup.date()";
      else if (f.type === "checkbox") s = "yup.boolean()";
      else s = "yup.string()";

      if (f.validation?.required) s += ".required('Required')";
      if (f.validation?.min != null)
        s += `.min(${f.validation.min}, 'Too small')`;
      if (f.validation?.max != null)
        s += `.max(${f.validation.max}, 'Too large')`;
      if (f.validation?.pattern)
        s += `.matches(new RegExp(${JSON.stringify(
          f.validation.pattern
        )}),'Invalid format')`;
      return s;
    }

    const imports = `import React from 'react';\nimport { Formik, Form, Field } from 'formik';\nimport * as yup from 'yup';\nimport { Input, InputNumber, Select, Checkbox, DatePicker, Button } from 'antd';\n`;

    const initialParts = fields
      .map(
        (f) =>
          `    ${f.name}: ${
            f.type === "checkbox" ? "false" : "''"
          }`
      )
      .join(",\n");

    const yupParts = fields
      .map((f) => `  ${f.name}: ${yupForField(f)}`)
      .join(",\n");

    const formItems = fields
      .map((f) => {
        const fieldRender = (() => {
          switch (f.type) {
            case "number":
              return `<Field name="${f.name}">{({ field, form }) => (<InputNumber {...field} onChange={(v) => form.setFieldValue('${f.name}', v)} />)}</Field>`;
            case "select":
              return `<Field name="${f.name}">{({ field, form }) => (<Select value={field.value} onChange={(v)=>form.setFieldValue('${f.name}', v)}>${f.options
                .map(
                  (o) =>
                    `<Select.Option key={o} value={o}>${o}</Select.Option>`
                )
                .join("")}</Select>)}</Field>`;
            case "checkbox":
              return `<Field type="checkbox" name="${f.name}">{({ field }) => (<Checkbox {...field} checked={field.value} />)}</Field>`;
            case "date":
              return `<Field name="${f.name}">{({ field, form }) => (<DatePicker value={field.value} onChange={(date, dateString)=>form.setFieldValue('${f.name}', dateString)} />)}</Field>`;
            default:
              return `<Field name="${f.name}">{({ field }) => (<Input {...field} />)}</Field>`;
          }
        })();

        return `      <div style={{ marginBottom: 12 }} key="${f.name}">\n        <label style={{ display:'block', marginBottom:6 }}>${f.label}</label>\n        ${fieldRender}\n      </div>`;
      })
      .join("\n");

    const code = `${imports}\nconst validationSchema = yup.object().shape({\n${yupParts}\n});\n\nexport default function GeneratedForm(props){\n  return (\n    <Formik\n      initialValues={{\n${initialParts}\n      }}\n      validationSchema={validationSchema}\n      onSubmit={(values)=>{ console.log('submit', values); }}\n    >\n      {({ handleSubmit }) => (\n        <Form onSubmit={handleSubmit}>\n${formItems}\n          <Button type="primary" htmlType="submit">Submit</Button>\n        </Form>\n      )}\n    </Formik>\n  );\n}\n`;

    return code;
  }

  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => message.success("Copied to clipboard"))
      .catch(() => message.error("Copy failed"));
  }

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  return (
    <Layout style={{ height: "100%", padding: 16 }}>
      <Row gutter={12} style={{ marginBottom: 12 }}>
        <Col flex="500px">
          <Space>
            <Button icon={<PlusOutlined />} onClick={addField}>
              Add field
            </Button>
            <Button onClick={() => setDrawerOpen(true)}>
              Designs ({designs.length})
            </Button>
            <Button
              icon={<UploadOutlined />}
              onClick={() => setImportModal(true)}
            >
              Import existing component
            </Button>
            <Button type="primary" onClick={() => setShowGenerate(true)}>
              Generate code
            </Button>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <small>
            Light starter — save designs and import naive components
          </small>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col span={8}>
          <Card title="Fields" size="small">
            <List
              size="small"
              bordered
              dataSource={fields}
              renderItem={(f) => (
                <List.Item
                  actions={[
                    <Tooltip title="Select to edit" key="e">
                      <Button
                        size="small"
                        onClick={() => setSelectedFieldId(f.id)}
                      >
                        Edit
                      </Button>
                    </Tooltip>,
                    <Popconfirm
                      key="d"
                      title="Delete field?"
                      onConfirm={() => removeField(f.id)}
                    >
                      <Button danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    title={f.label}
                    description={`${f.name} • ${f.type}`}
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card size="small" style={{ marginTop: 12 }}>
            <Button block onClick={() => saveDesign()}>
              Save current design
            </Button>
          </Card>
        </Col>

        <Col span={10}>
          <Card title="Preview" size="small">
            <div>
              {fields.length === 0 && (
                <div style={{ padding: 16 }}>No fields — add one.</div>
              )}
              <Row gutter={12}>
                {fields.map((f) => (
                  <Col span={24 / (f.columns || 1)} key={f.id}>
                    <Card size="small" style={{ marginBottom: 8 }}>
                      <strong>{f.label}</strong>
                      <div style={{ marginTop: 8 }}>{`[${f.type}]`}</div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Editor" size="small">
            {!selectedField && <div>Select a field to edit</div>}
            {selectedField && (
              <div>
                <div style={{ marginBottom: 8 }}>
                  <label>Name</label>
                  <Input
                    value={selectedField.name}
                    onChange={(e) =>
                      updateField(selectedField.id, { name: e.target.value })
                    }
                  />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label>Label</label>
                  <Input
                    value={selectedField.label}
                    onChange={(e) =>
                      updateField(selectedField.id, { label: e.target.value })
                    }
                  />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label>Type</label>
                  <Select
                    value={selectedField.type}
                    onChange={(v) =>
                      updateField(selectedField.id, { type: v })
                    }
                    style={{ width: "100%" }}
                  >
                    <Select.Option value="input">Input</Select.Option>
                    <Select.Option value="number">Number</Select.Option>
                    <Select.Option value="select">Select</Select.Option>
                    <Select.Option value="checkbox">Checkbox</Select.Option>
                    <Select.Option value="textarea">Textarea</Select.Option>
                    <Select.Option value="date">Date</Select.Option>
                  </Select>
                </div>

                {selectedField.type === "select" && (
                  <div style={{ marginBottom: 8 }}>
                    <label>Options (comma separated)</label>
                    <Input
                      value={selectedField.options.join(",")}
                      onChange={(e) =>
                        updateField(selectedField.id, {
                          options: e.target.value
                            .split(",")
                            .map((s) => s.trim()),
                        })
                      }
                    />
                  </div>
                )}

                <div style={{ marginBottom: 8 }}>
                  <label>Columns (1-3)</label>
                  <InputNumber
                    min={1}
                    max={3}
                    value={selectedField.columns}
                    onChange={(v) =>
                      updateField(selectedField.id, { columns: v })
                    }
                    style={{ width: "100%" }}
                  />
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label>Validation: required</label>
                  <div>
                    <Switch
                      checked={!!selectedField.validation?.required}
                      onChange={(v) =>
                        updateField(selectedField.id, {
                          validation: {
                            ...selectedField.validation,
                            required: v,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label>Visible when (render logic)</label>
                  <Select
                    allowClear
                    placeholder="Field name"
                    value={
                      selectedField.visibleWhen?.fieldName || undefined
                    }
                    onChange={(val) =>
                      updateField(selectedField.id, {
                        visibleWhen: val
                          ? { fieldName: val, operator: "==", value: "" }
                          : null,
                      })
                    }
                    style={{ width: "100%" }}
                  >
                    {fields
                      .filter((f) => f.id !== selectedField.id)
                      .map((f) => (
                        <Select.Option key={f.name} value={f.name}>
                          {f.label}
                        </Select.Option>
                      ))}
                  </Select>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label>Group</label>
                  <Input
                    value={selectedField.group || ""}
                    onChange={(e) =>
                      updateField(selectedField.id, {
                        group: e.target.value || null,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        open={showGenerate}
        title="Generated React component"
        onCancel={() => setShowGenerate(false)}
        footer={null}
        width={900}
      >
        <div style={{ marginBottom: 8 }}>
          <Button
            onClick={() => copyToClipboard(generateCodeString())}
            icon={<CopyOutlined />}
          >
            Copy code
          </Button>
        </div>
        <pre
          style={{
            maxHeight: "60vh",
            overflow: "auto",
            background: "#fafafa",
            padding: 12,
          }}
        >
          {generateCodeString()}
        </pre>
      </Modal>

      <Drawer
        title="Saved designs"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={420}
      >
        <List
          dataSource={designs}
          renderItem={(d) => (
            <List.Item
              actions={[
                <Button onClick={() => loadDesign(d.id)} key="l">
                  Load
                </Button>,
                <Popconfirm
                  key="del"
                  title="Delete design?"
                  onConfirm={() => deleteDesign(d.id)}
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={d.name}
                description={new Date(d.createdAt).toLocaleString()}
              />
            </List.Item>
          )}
        />
      </Drawer>

      <Modal
        open={importModal}
        title="Import existing component (naive parser)"
        onCancel={() => setImportModal(false)}
        onOk={importFromCodeAction}
        okText="Import"
      >
        <p>
          Paste your React component code that contains recognizable
          Form.Item / name attributes. This is a best-effort parser and
          not guaranteed to work for complex code.
        </p>
        <Input.TextArea
          rows={12}
          value={importCode}
          onChange={(e) => setImportCode(e.target.value)}
        />
      </Modal>
    </Layout>
  );
}
