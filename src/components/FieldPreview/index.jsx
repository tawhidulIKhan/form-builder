import React from "react";
import { Card, Row, Col } from "antd";
import './FieldPreview.scss';

export default function FieldPreview({ fields }) {
  return (
    <Card title="Preview" size="small" className="field-preview">
      {fields.length === 0 ? (
        <div className="empty-state">
          <div className="empty-text">No fields — add one.</div>
        </div>
      ) : (
        <Row gutter={12} className="preview-grid">
          {fields.map((f) => (
            <Col span={24 / (f.columns || 1)} key={f.id} className="preview-item">
              <Card 
                size="small" 
                className="field-card"
                data-type={f.type}
              >
                <span className="field-label">{f.label}</span>
                <span className="field-type">{f.type}</span>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Card>
  );
}
