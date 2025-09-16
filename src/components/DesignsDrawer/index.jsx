import React from "react";
import { Drawer, List, Button, Popconfirm, message, Typography, Empty } from "antd";
import { FolderOpenOutlined, DeleteOutlined, FieldNumberOutlined, CalendarOutlined } from "@ant-design/icons";
import "./DesignsDrawer.scss";

const { Text } = Typography;

export default function DesignsDrawer({ open, setOpen, designs, setDesigns, setFields }) {
  const loadDesign = (id) => {
    const d = designs.find(x => x.id === id);
    if (d) {
      setFields(d.fields);
      message.success(`Loaded: ${d.name}`);
      setOpen(false);
    }
  };

  const deleteDesign = (id) => {
    setDesigns(s => s.filter(x => x.id !== id));
    message.success("Design deleted");
  };

  return (
    <Drawer 
      title="Saved Designs" 
      placement="right" 
      onClose={() => setOpen(false)} 
      open={open} 
      width={420}
      className="designs-drawer"
    >
      <List
        className="designs-list"
        dataSource={designs}
        locale={{
          emptyText: (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <div className="empty-text">No saved designs yet</div>
              <div className="empty-subtext">Create and save your first form design</div>
            </div>
          )
        }}
        renderItem={d => (
          <List.Item className="design-item">
            <div style={{ width: '100%' }}>
              <List.Item.Meta 
                title={d.name}
                description={
                  <div>
                    <Text type="secondary">{new Date(d.createdAt).toLocaleString()}</Text>
                    <div className="design-stats">
                      <span className="stat-badge fields-count">
                        <FieldNumberOutlined /> {d.fields?.length || 0} fields
                      </span>
                      <span className="stat-badge date">
                        <CalendarOutlined /> {new Date(d.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                }
              />
              <div className="design-actions">
                <Button 
                  className="load-btn"
                  icon={<FolderOpenOutlined />}
                  onClick={() => loadDesign(d.id)}
                >
                  Load
                </Button>
                <Popconfirm 
                  title="Delete this design?"
                  description="This action cannot be undone."
                  onConfirm={() => deleteDesign(d.id)}
                  okText="Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <Button 
                    className="delete-btn"
                    icon={<DeleteOutlined />}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Drawer>
  );
}
