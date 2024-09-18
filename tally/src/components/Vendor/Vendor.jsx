import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidePanel from '../Purchase/Sidepanel';

const Vendor = () => {
    const [vendors, setVendors] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false); // State to toggle checkboxes

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/vendor');
            if (response.data) {
                setVendors(response.data);
                setDataLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching vendor data:', error.response ? error.response.data : error.message);
        }
    };

    const handleCheckboxChange = (vendorId) => {
        setSelectedVendors(prevSelected =>
            prevSelected.includes(vendorId)
                ? prevSelected.filter(id => id !== vendorId)
                : [...prevSelected, vendorId]
        );
    };

    const handleDelete = async () => {
        if (selectedVendors.length <= 0) return;

        try {
            await axios.delete('http://localhost:3001/api/vendor', { data: { ids: selectedVendors } });
            fetchVendors();  // Refresh vendor list after deletion
            setSelectedVendors([]);  // Clear selected vendors
            setShowCheckboxes(false); // Hide checkboxes after deletion
        } catch (error) {
            console.error('Error deleting vendors:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="flex">
            <div className="w-1/5">
                <SidePanel />
            </div>
            <div className="w-4/5 p-6 mt-[4%] mr-[10%]">
                <h1 className="text-xl font-bold mb-4">Vendor List</h1>

                <div className="flex justify-between mb-4">
                    <Link
                        to="/dashboard/purchase/vendors/form"
                        className="inline-block px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add Vendor
                    </Link>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowCheckboxes(!showCheckboxes)} // Toggle checkboxes
                            className={`inline-block px-5 py-2 rounded text-white ${showCheckboxes ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {showCheckboxes ? 'Cancel' : 'Delete Vendors'}
                        </button>
                        {showCheckboxes && selectedVendors.length > 0 && (
                            <button
                                onClick={handleDelete}
                                className="inline-block px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 border-b"></th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Company</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">GST Number</th>
                                <th className="py-2 px-4 border-b">Phone</th>
                                <th className="py-2 px-4 border-b">Amount to be Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!dataLoaded ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        Loading vendors...
                                    </td>
                                </tr>
                            ) : vendors.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        No vendors found
                                    </td>
                                </tr>
                            ) : (
                                vendors.map((vendor, index) => (
                                    <tr key={vendor.id || index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">
                                            {showCheckboxes && (
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox"
                                                    onChange={() => handleCheckboxChange(vendor.sno)}
                                                    checked={selectedVendors.includes(vendor.sno)}
                                                />
                                            )}
                                        </td>

                                        <td className="py-2 px-4 text-center border-b">
                                            <Link to={`/dashboard/purchase/vendors/${vendor.sno}`} className="text-blue-500 hover:underline">
                                                {vendor.dispname}
                                            </Link>
                                        </td>
                                        <td className="py-2 px-4 text-center border-b">{vendor.company}</td>
                                        <td className="py-2 px-4 text-center border-b">{vendor.mail}</td>
                                        <td className="py-2 px-4 text-center border-b">{vendor.gstno}</td>
                                        <td className="py-2 px-4 text-center border-b">{vendor.workphone}</td>
                                        <td className="py-2 px-4 text-center border-b">{vendor.openingbalance}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Vendor;
