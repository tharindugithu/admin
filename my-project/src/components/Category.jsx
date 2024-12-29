import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, Table, Image, Upload, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../libs/axiosInstance';

function Category() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileList, setFileList] = useState([]); // State for file list
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showAddCategoryModal = () => {
    setEditCategory(null);
    setImageFile(null);
    setFileList([]); // Reset file list for new category
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditCategoryModal = (category) => {
    setEditCategory(category);
    form.setFieldsValue({
      ...category,
      isActive: category.is_active, // Map data if necessary
    });
    setImageFile(null); // Reset file to allow re-upload
    // Show existing image if available
    setFileList(category.image ? [{ url: category.image }] : []);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setEditCategory(null);
    setIsModalVisible(false);
    setImageFile(null); // Reset file on close
    setFileList([]); // Clear file list
    form.resetFields();
  };

  const handleFinish = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('isActive', values.isActive);
    if (imageFile) {
      formData.append('image', imageFile.file); // Append the image file if uploaded
    }
    try {
      if (editCategory) {
        // Update category
        formData.append('id', editCategory.id);
        await axiosInstance.put(`/categories/${editCategory._id}`, formData);
        alert('Category updated successfully!');
      } else {
        // Add new category
        await axiosInstance.post('/categories', formData);
        alert('Category added successfully!');
      }
      fetchCategories(); // Refresh the categories list
      setIsModalVisible(false);
    } catch (err) {
      console.error('Error saving category:', err);
      alert('An error occurred while saving the category.');
    }
  };

  const handleImageUpload = (info) => {
    console.log(info)
    setFileList([info.file]); // Update fileList with the new file
    setImageFile(info); // Set the image file for submission
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <Image width={50} src={image} alt="Category" />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => showEditCategoryModal(record)}
            color="primary" variant="outlined"
            className='mr-2'
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => {
              axiosInstance.delete('/categories/' + record._id).then(() => {
                alert("Successfully deleted!");
                fetchCategories();
              }).catch((err) => {
                alert("Something went wrong");
              });
            }}
            onCancel={() => { }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  return (
    <div style={{ width: '70%', margin: '20px auto', textAlign: 'center' }}>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left">
        Category
      </h1>
      <div className='float-right'>
        <Button type="primary" onClick={showAddCategoryModal} className="mb-4">
          Add Category
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editCategory ? 'Edit Category' : 'Add Category'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ isActive: true }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={editCategory ? "Update Image" : "Image"}
            rules={[{ required: !editCategory, message: 'Please upload an image' }]}
          >
            <Upload
              listType="picture-card"
              beforeUpload={(file) => {
                handleImageUpload({ file });
                return false; // Prevent auto-upload
              }}
              maxCount={1} // Restrict to one image
              fileList={fileList} // Bind the controlled fileList state
              onChange={handleChange}
            >
              {fileList.length === 0 && ( // Show the upload button if no file is uploaded
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>

            {editCategory && editCategory.image && !imageFile && (
              <Image
                width={50}
                src={editCategory.image}
                alt="Existing Category"
                style={{ marginTop: 10 }}
              />
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editCategory ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Category;
