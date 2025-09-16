import React from "react";
import { Card, Button, Popconfirm, message } from "antd";
import { DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import './FieldList.scss';
export default function FieldList({ fields, selectedFieldId, setSelectedFieldId, setFields }) {

  const removeField = (id) => {
    setFields(s => s.filter(f => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const copyField = (f) => {
    navigator.clipboard.writeText(JSON.stringify(f))
      .then(() => message.success("Field copied"))
      .catch(() => message.error("Copy failed"));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(fields);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setFields(reordered);
  };

  return (
    <Card title="Fields" size="small" className="field-list">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="fields-list">
          {(provided, snapshot) => (
            <div 
              ref={provided.innerRef} 
              {...provided.droppableProps}
              className="fields-container"
            >
              {fields.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-text">No fields added yet</div>
                </div>
              ) : (
                fields.map((f, index) => (
                  <Draggable key={f.id} draggableId={f.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`field-item ${selectedFieldId === f.id ? 'selected' : ''}`}
                        style={{
                          ...provided.draggableProps.style
                        }}
                      >
                        <div className="field-info">
                          <span className="field-label">{f.label}</span>
                          <div className="field-meta">
                            <span>{f.name}</span>
                            <span>•</span>
                            <span>{f.type}</span>
                          </div>
                        </div>
                        <div className="field-actions">
                          <Button 
                            size="small" 
                            className="edit-btn"
                            onClick={() => setSelectedFieldId(f.id)}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="small" 
                            className="copy-btn"
                            icon={<CopyOutlined />}
                            onClick={() => copyField(f)}
                          >
                            Copy
                          </Button>
                          <Popconfirm 
                            title="Delete this field?" 
                            onConfirm={() => removeField(f.id)}
                            okText="Yes" 
                            cancelText="No"
                          >
                            <Button 
                              danger 
                              size="small" 
                              className="delete-btn"
                              icon={<DeleteOutlined />} 
                            />
                          </Popconfirm>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Card>
  );
}
