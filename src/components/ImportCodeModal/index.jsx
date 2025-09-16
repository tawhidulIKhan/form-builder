import React, { useState } from "react";
import { Modal, Input, message } from "antd";
import { v4 as uuidv4 } from "uuid";

export default function ImportCodeModal({ open, setOpen, setFields }) {
  const [importCode, setImportCode] = useState("");

  const parseCodeToFields = (code) => {
    const nameRegex = /name\s*=\s*(?:"([\w_-]+)"|'([\w_-]+)'|\{\s*"([\w_-]+)"\s*\})/g;
    const foundNames = new Set();
    let m;
    while ((m = nameRegex.exec(code))) {
      const n = m[1] || m[2] || m[3];
      if (n) foundNames.add(n);
    }
    return Array.from(foundNames).map(n => ({
      id: uuidv4(),
      name: n,
      label: n.replace(/[_-]/g, " ").replace(/\b\w/g, s => s.toUpperCase()),
      type: "input",
      options: ["Option 1"],
      validation: { required: false, min: null, max: null, pattern: "", customMessage: "", crossField: null },
      conditions: [],
      group: null,
      columns: 1,
    }));
  };

  const importFromCodeAction = () => {
    const parsed = parseCodeToFields(importCode);
    if (parsed.length === 0) {
      message.warn("No recognizable fields found");
      return;
    }
    setFields(parsed);
    setOpen(false);
    message.success(`Imported ${parsed.length} fields`);
  };

  return (
    <Modal open={open} title="Import component" onCancel={() => setOpen(false)} onOk={importFromCodeAction} okText="Import">
      <Input.TextArea rows={12} value={importCode} onChange={(e) => setImportCode(e.target.value)} />
    </Modal>
  );
}
