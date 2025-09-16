import React from "react";
import { Modal, Button, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

export default function GenerateCodeModal({ open, setOpen, fields }) {
  const generateCodeString = () => {
    const indent = (level) => "  ".repeat(level);

    // --- Yup validation generator ---
    const yupForField = (f) => {
      let base =
        f.type === "number"
          ? "yup.number()"
          : f.type === "checkbox"
          ? "yup.boolean()"
          : f.type === "date"
          ? "yup.date()"
          : "yup.string()";

      const v = f.validation || {};

      if (v.required) base += `.required(${v.customMessage ? `"${v.customMessage}"` : "'Required'"})`;
      if (v.min != null) base += `.min(${v.min}, "Value too small")`;
      if (v.max != null) base += `.max(${v.max}, "Value too large")`;
      if (v.pattern) base += `.matches(new RegExp(${JSON.stringify(v.pattern)}), "Invalid format")`;
      if (v.crossField) {
        // Cross-field validation example
        base += `.test("crossField", "Cross-field validation failed", function(value) {
  return value === this.parent.${v.crossField.field};
})`;
      }
      return base;
    };

    // --- Formik field renderer ---
    const renderField = (f) => {
      switch (f.type) {
        case "number":
          return `<Field name="${f.name}">{({ field, form }) => (
  <InputNumber {...field} onChange={(v) => form.setFieldValue('${f.name}', v)} style={{ width: '100%' }} />
)}</Field>`;
        case "select":
          return `<Field name="${f.name}">{({ field, form }) => (
  <Select value={field.value} onChange={(v) => form.setFieldValue('${f.name}', v)} style={{ width: '100%' }}>
    ${f.options?.map((o) => `<Select.Option key="${o}" value="${o}">${o}</Select.Option>`).join("\n    ")}
  </Select>
)}</Field>`;
        case "checkbox":
          return `<Field type="checkbox" name="${f.name}">{({ field }) => (<Checkbox {...field} checked={field.value} />)}</Field>`;
        case "date":
          return `<Field name="${f.name}">{({ field, form }) => (
  <DatePicker value={field.value} onChange={(date, dateString) => form.setFieldValue('${f.name}', dateString)} style={{ width: '100%' }} />
)}</Field>`;
        case "textarea":
          return `<Field name="${f.name}">{({ field }) => (<Input.TextArea {...field} />)}</Field>`;
        default:
          return `<Field name="${f.name}">{({ field }) => (<Input {...field} />)}</Field>`;
      }
    };

    // --- Conditional logic inside JSX ---
    const renderConditional = (f) => {
      if (!f.conditions || f.conditions.length === 0) return renderField(f);

      const conditionExpr = f.conditions
        .map((c) => {
          const operator = c.operator === "==" ? "===" : c.operator === "!=" ? "!==" : c.operator;
          return `values.${c.field} ${operator} ${JSON.stringify(c.value)}`;
        })
        .join(" && ");

      return `{${conditionExpr} && (${renderField(f)})}`;
    };

    // --- Form items JSX ---
    const formItems = fields
      .map(
        (f) => `      <div style={{ marginBottom: 12 }} key="${f.name}">
        <label style={{ display:'block', marginBottom:6 }}>${f.label}</label>
        ${renderConditional(f)}
      </div>`
      )
      .join("\n");

    // --- Initial values ---
    const initialValues = fields
      .map((f) => `    ${f.name}: ${f.type === "checkbox" ? "false" : "''"}`)
      .join(",\n");

    // --- Yup schema ---
    const validationSchema = fields
      .map((f) => `  ${f.name}: ${yupForField(f)}`)
      .join(",\n");

    return `import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { Input, InputNumber, Select, Checkbox, DatePicker, Button } from 'antd';

const validationSchema = yup.object().shape({
${validationSchema}
});

export default function GeneratedForm() {
  return (
    <Formik
      initialValues={{
${initialValues}
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => console.log('submit', values)}
    >
      {({ handleSubmit, values }) => (
        <Form onSubmit={handleSubmit}>
${formItems}
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => message.success("Copied to clipboard"))
      .catch(() => message.error("Copy failed"));
  };

  return (
    <Modal
      open={open}
      title="Generated React component"
      onCancel={() => setOpen(false)}
      footer={null}
      width={900}
    >
      <div style={{ marginBottom: 8 }}>
        <Button onClick={() => copyToClipboard(generateCodeString())} icon={<CopyOutlined />}>
          Copy code
        </Button>
      </div>
      <pre style={{ maxHeight: "60vh", overflow: "auto", background: "#fafafa", padding: 12 }}>
        {generateCodeString()}
      </pre>
    </Modal>
  );
}
