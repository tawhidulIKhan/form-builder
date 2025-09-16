# React Form Builder

A dynamic, customizable form builder built with React and Ant Design that allows users to create, preview, edit, and export forms with validation, conditional logic, and reusable designs.

![React Form Builder](https://img.shields.io/badge/React-18.2.0-blue) ![Ant Design](https://img.shields.io/badge/Ant%20Design-5.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Drag-and-drop form field management** (add, select, remove fields)
- **Multiple Field Types**: Input, Number, Select, Checkbox, Textarea, Date
- **Validation Rules**: Required, Min, Max, Regex Pattern, Custom Error Messages
- **Conditional Logic**: Show/hide fields based on other field values
- **Column Layout Support**: 1–3 columns per field
- **Save and Load Designs**: Persist designs locally using `localStorage`
- **Import/Export**: Import JSON form designs, generate React code
- **Responsive Layout**: Built with Ant Design Grid system
- **Modern UI**: Elegant, professional interface with intuitive workflow

## 🚀 Live Demo

*[Add your live demo link here when deployed]*

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/tawhidulIKhan/form-builder.git
cd form-builder
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```


## 🎯 Usage

### Adding a Field

Click **Add Field** in the toolbar, then select the field in the **Field List** to edit its properties.

### Editing a Field

In the **Field Editor**, you can customize:

- **Name** (internal identifier)
- **Label** (visible to users)
- **Type** (Input, Number, Select, etc.)
- **Options** (for Select fields)
- **Columns** (1-3 layout options)
- **Validation settings** and **Conditional Logic** in collapsible panels

### Previewing Fields

The **Field Preview** section shows a live form layout as you build it.

### Saving and Generating Code

- Click **Save Design** to store the form locally
- Click **Generate** to export React code for your form

### Importing Designs

Click **Import** to load a saved JSON design into the builder.


## 💾 Data Persistence

The application uses localStorage with the following keys:

- `formBuilder_fields_v2` → Stores current form fields
- `formBuilder_saves_v2` → Stores saved form designs

## 🛠️ Dependencies

- [React](https://reactjs.org/) (^18.2.0)
- [Ant Design](https://ant.design/) (^5.0)
- [uuid](https://www.npmjs.com/package/uuid) (^9.0.0)
- [@ant-design/icons](https://ant.design/components/icon/) (^5.0)


## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tawhidul Islam Khan**  
- GitHub: [@tawhidulIKhan](https://github.com/tawhidulIKhan)

---

*⭐ Star this repo if you find it useful!*
