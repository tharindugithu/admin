import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axiosInstance from '../libs/axiosInstance';
import { Table, Button, Pagination, Spin } from 'antd'; // Using Ant Design components

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sellerCount, setSellerCount] = useState(0);
  const [buyerCount, setBuyerCount] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCounts, setLoadingCounts] = useState(false);

  const fetchUsers = async (page = 1) => {
    setLoadingUsers(true);
    try {
      const { data } = await axiosInstance.get(`/users?page=${page}&limit=10`);
      setUserData(data.users);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchCounts = async () => {
    setLoadingCounts(true);
    try {
      const { data } = await axiosInstance.get('/users/count');
      setSellerCount(data.sellers);
      setBuyerCount(data.buyers);
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setLoadingCounts(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCounts();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  const data = {
    labels: ['Sellers', 'Buyers'],
    datasets: [
      {
        label: 'User Count',
        data: [sellerCount, buyerCount],
        backgroundColor: ['#4CAF50', '#FF5733'],
        borderColor: ['#388E3C', '#C70039'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Seller and Buyer Counts',
      },
    },
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) => avatar ? <img src={avatar} alt="Avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} /> : 'No Avatar',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'WhatsApp Number',
      dataIndex: 'whatsappNumber',
      key: 'whatsappNumber',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Zip Code',
      dataIndex: 'zipCode',
      key: 'zipCode',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
  ];
  

  return (
    <div style={{ width: '80%', margin: '20px auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
        Dashboard
      </h1>
      {loadingCounts ? (
        <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />
      ) : (
        <Bar data={data} options={options} />
      )}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
          User List
        </h2>
        {loadingUsers ? (
          <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />
        ) : (
          <Table
            columns={columns}
            dataSource={userData}
            rowKey={(record) => record._id}
            pagination={false}
          />
        )}
        <Pagination
          style={{ marginTop: '20px', textAlign: 'center' }}
          current={currentPage}
          total={totalPages * 10} // Assuming 10 items per page
          pageSize={10}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Dashboard;
