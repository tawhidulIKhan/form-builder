import React from "react";
import { Card, Input, Select, InputNumber, Switch, Row, Col, Button, Collapse, Typography } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import "./FieldEditor.scss";

const { Panel } = Collapse;
const { Text } = Typography;

export default function FieldEditor({ fields, selectedFieldId, setFields }) {
  const selectedField = fields.find(f => f.id === selectedFieldId);
  if (!selectedField)
    return (
      <Card title="Editor" size="small" className="field-editor">
        <div>Select a field to edit</div>
      </Card>
    );

  const updateField = (patch) => {
    setFields(s => s.map(f => f.id === selectedField.id ? { ...f, ...patch } : f));
  };

  return (
    <Card title="Editor" size="small" className="field-editor">
      {/* Field Basic Info */}
      <Row gutter={12}>
        <Col span={12}>
          <div className="form-control">
            <label>Name</label>
            <Input
              placeholder="Unique field identifier, e.g., first_name"
              value={selectedField.name}
              onChange={(e) => updateField({ name: e.target.value })}
            />
            <Text type="secondary">Internal unique identifier for form data.</Text>
          </div>
        </Col>
        <Col span={12}>
          <div className="form-control">
            <label>Label</label>
            <Input
              placeholder="Label shown to users, e.g., First Name"
              value={selectedField.label}
              onChange={(e) => updateField({ label: e.target.value })}
            />
            <Text type="secondary">Text displayed above the input field.</Text>
          </div>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col span={12}>
          <div className="form-control">
            <label>Type</label>
            <Select
              value={selectedField.type}
              onChange={(v) => updateField({ type: v })}
              style={{ width: "100%" }}
            >
              <Select.Option value="input">Input</Select.Option>
              <Select.Option value="number">Number</Select.Option>
              <Select.Option value="select">Select</Select.Option>
              <Select.Option value="checkbox">Checkbox</Select.Option>
              <Select.Option value="textarea">Textarea</Select.Option>
              <Select.Option value="date">Date</Select.Option>
            </Select>
            <Text type="secondary">Choose the input type for this field.</Text>
          </div>
        </Col>
        <Col span={12}>
          <div className="form-control">
            <label>Columns</label>
            <InputNumber
              min={1} max={3}
              value={selectedField.columns}
              onChange={(v) => updateField({ columns: v })}
              style={{ width: "100%" }}
            />
            <Text type="secondary">Number of columns this field spans (1-3).</Text>
          </div>
        </Col>
      </Row>

      {selectedField.type === "select" && (
        <div className="form-control">
          <label>Options (comma separated)</label>
          <Input
            placeholder="Option1, Option2, Option3"
            value={selectedField.options.join(",")}
            onChange={(e) => updateField({ options: e.target.value.split(",").map(s => s.trim()) })}
          />
          <Text type="secondary">Define dropdown options.</Text>
        </div>
      )}

      {/* Validation and Conditional Logic */}
      <Collapse defaultActiveKey={[]} style={{ marginTop: 12 }}>
        <Panel header="Validation" key="validation">
          <Row gutter={12}>
            <Col span={12}>
              <div className="form-control">
                <label>Required</label>
                <Switch
                  checked={!!selectedField.validation?.required}
                  onChange={(v) => updateField({ validation: { ...selectedField.validation, required: v } })}
                />
                <Text type="secondary">Make this field mandatory.</Text>
              </div>
            </Col>
            <Col span={6}>
              <div className="form-control">
                <label>Min</label>
                <InputNumber
                  placeholder="Min value/length"
                  value={selectedField.validation?.min}
                  onChange={(v) => updateField({ validation: { ...selectedField.validation, min: v } })}
                  style={{ width: "100%" }}
                />
                <Text type="secondary">Minimum value/length.</Text>
              </div>
            </Col>
            <Col span={6}>
              <div className="form-control">
                <label>Max</label>
                <InputNumber
                  placeholder="Max value/length"
                  value={selectedField.validation?.max}
                  onChange={(v) => updateField({ validation: { ...selectedField.validation, max: v } })}
                  style={{ width: "100%" }}
                />
                <Text type="secondary">Maximum value/length.</Text>
              </div>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <div className="form-control">
                <label>Regex Pattern</label>
                <Input
                  placeholder="e.g., ^[A-Za-z]+$"
                  value={selectedField.validation?.pattern}
                  onChange={(e) => updateField({ validation: { ...selectedField.validation, pattern: e.target.value } })}
                />
                <Text type="secondary">Custom regex for validation.</Text>
              </div>
            </Col>
            <Col span={12}>
              <div className="form-control">
                <label>Custom Error Message</label>
                <Input
                  placeholder="Message shown if validation fails"
                  value={selectedField.validation?.customMessage}
                  onChange={(e) => updateField({ validation: { ...selectedField.validation, customMessage: e.target.value } })}
                />
                <Text type="secondary">Message displayed to the user on validation error.</Text>
              </div>
            </Col>
          </Row>
        </Panel>

        <Panel header="Conditional Logic" key="conditions" className="conditional-section">
          {(selectedField.conditions || []).length === 0 ? (
            <div className="no-conditions">
              <span className="empty-icon">⚡</span>
              <div>No conditions — always visible</div>
              <Text type="secondary">Add conditions to show/hide this field based on other field values</Text>
            </div>
          ) : (
            (selectedField.conditions || []).map((cond, idx) => (
              <div key={idx} className="condition-card">
                <div className="condition-header">
                  <span className="condition-number">Condition {idx + 1}</span>
                  <span 
                    className="delete-condition"
                    onClick={() => {
                      const newConds = selectedField.conditions.filter((_, i) => i !== idx);
                      updateField({ conditions: newConds });
                    }}
                  >
                    <DeleteOutlined /> Remove
                  </span>
                </div>
                
                <div className="condition-content">
                  <div className="condition-row">
                    <span className="condition-label">Logic Operator</span>
                    <Select
                      value={cond.logic || "AND"}
                      onChange={(v) => {
                        const newConds = [...selectedField.conditions];
                        newConds[idx].logic = v;
                        updateField({ conditions: newConds });
                      }}
                    >
                      <Select.Option value="AND">AND</Select.Option>
                      <Select.Option value="OR">OR</Select.Option>
                    </Select>
                  </div>

                  <div className="condition-row">
                    <span className="condition-label">Field to Compare</span>
                    <Select
                      value={cond.field}
                      onChange={(v) => {
                        const newConds = [...selectedField.conditions];
                        newConds[idx].field = v;
                        updateField({ conditions: newConds });
                      }}
                    >
                      {fields.filter(f => f.id !== selectedField.id).map(f => (
                        <Select.Option key={f.name} value={f.name}>{f.label}</Select.Option>
                      ))}
                    </Select>
                  </div>

                  <div className="condition-row">
                    <span className="condition-label">Comparison Operator</span>
                    <Select
                      value={cond.operator}
                      onChange={(v) => {
                        const newConds = [...selectedField.conditions];
                        newConds[idx].operator = v;
                        updateField({ conditions: newConds });
                      }}
                    >
                      <Select.Option value="==">Equals (==)</Select.Option>
                      <Select.Option value="!=">Not Equals (!=)</Select.Option>
                      <Select.Option value=">">Greater Than (&gt;)</Select.Option>
                      <Select.Option value="<">Less Than (&lt;)</Select.Option>
                      <Select.Option value="contains">Contains</Select.Option>
                    </Select>
                  </div>

                  <div className="condition-row">
                    <span className="condition-label">Comparison Value</span>
                    <Input
                      placeholder="Value to compare against"
                      value={cond.value}
                      onChange={(e) => {
                        const newConds = [...selectedField.conditions];
                        newConds[idx].value = e.target.value;
                        updateField({ conditions: newConds });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}

          <Button 
            type="dashed" 
            block 
            className="add-condition-btn"
            icon={<PlusOutlined />}
            onClick={() => {
              const newConds = [...(selectedField.conditions || []), { logic: "AND", field: "", operator: "==", value: "" }];
              updateField({ conditions: newConds });
            }}
          >
            Add Condition
          </Button>
        </Panel>
      </Collapse>
    </Card>
  );
}
