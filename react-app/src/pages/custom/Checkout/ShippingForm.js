import React, { useState, useEffect } from 'react';
import './CheckoutForms.css';
import { API_BASE_URL } from '../../../utils/config';

const BASE_URL = API_BASE_URL;

const ShippingForm = ({ initialData, onSave, sameAsShipping, onSameAsShippingChange }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    shippingMethod: 'standard',
    novaposhtaRegion: '',
    novaposhtaCity: '',
    novaposhtaWarehouse: '',
    ...initialData
  });
  
  const [errors, setErrors] = useState({});
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouseInfo, setSelectedWarehouseInfo] = useState(null);
  const [loading, setLoading] = useState({
    regions: false,
    cities: false,
    warehouses: false
  });
  
  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
    }
    
    // Load regions when component mounts
    fetchRegions();
  }, [initialData]);
  
  useEffect(() => {
    // Reset city and warehouse when region changes
    if (formData.novaposhtaRegion) {
      setFormData(prevData => ({
        ...prevData,
        novaposhtaCity: '',
        novaposhtaWarehouse: ''
      }));
      fetchCities(formData.novaposhtaRegion);
    } else {
      setCities([]);
      setWarehouses([]);
    }
  }, [formData.novaposhtaRegion]);
  
  useEffect(() => {
    // Reset warehouse when city changes
    if (formData.novaposhtaCity) {
      setFormData(prevData => ({
        ...prevData,
        novaposhtaWarehouse: ''
      }));
      fetchWarehouses(formData.novaposhtaCity);
    } else {
      setWarehouses([]);
    }
  }, [formData.novaposhtaCity]);
  
  useEffect(() => {
    // Set warehouse info when warehouse changes
    if (formData.novaposhtaWarehouse && warehouses.warehouses) {
      const warehouseInfo = warehouses.warehouses.find(
        w => w.Ref === formData.novaposhtaWarehouse
      );
      setSelectedWarehouseInfo(warehouseInfo);
    } else {
      setSelectedWarehouseInfo(null);
    }
  }, [formData.novaposhtaWarehouse, warehouses]);
  
  const fetchRegions = async () => {
    try {
      setLoading(prev => ({ ...prev, regions: true }));
      const response = await fetch(`${API_BASE_URL}/api/novaposhta/regions?_format=json`);
      if (!response.ok) throw new Error('Failed to fetch regions');
      const data = await response.json();
      setRegions(data);
    } catch (error) {
      console.error('Error fetching regions:', error);
    } finally {
      setLoading(prev => ({ ...prev, regions: false }));
    }
  };
  
  const fetchCities = async (regionRef) => {
    try {
      setLoading(prev => ({ ...prev, cities: true }));
      const response = await fetch(`${API_BASE_URL}/api/novaposhta/cities/${regionRef}?_format=json`);
      if (!response.ok) throw new Error('Failed to fetch cities');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(prev => ({ ...prev, cities: false }));
    }
  };
  
  const fetchWarehouses = async (cityRef) => {
    try {
      setLoading(prev => ({ ...prev, warehouses: true }));
      const response = await fetch(`${API_BASE_URL}/api/novaposhta/warehouses/${cityRef}?_format=json`);
      if (!response.ok) throw new Error('Failed to fetch warehouses');
      const data = await response.json();
      setWarehouses(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    } finally {
      setLoading(prev => ({ ...prev, warehouses: false }));
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error for this field when it changes
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'novaposhtaRegion', 'novaposhtaCity', 'novaposhtaWarehouse'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (basic format)
    if (formData.phone && !/^\+?[0-9\s\-()]{10,20}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.field-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Initialize form with novaposhta as default shipping method
  useEffect(() => {
    if (!formData.shippingMethod) {
      setFormData(prevData => ({
        ...prevData,
        shippingMethod: 'novaposhta'
      }));
    }
  }, []);
  
  return (
    <div className="checkout-form shipping-form">
      <h2>Shipping Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <div className="field-error">{errors.firstName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <div className="field-error">{errors.lastName}</div>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email Address*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number*</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>
        </div>
        
        <div className="form-row">
         
        </div>

        <div className="form-section">
          <h3>Shipping Method</h3>
          <div className="shipping-methods">
            <div className="shipping-method selected">
              <input
                type="radio"
                id="shipping-novaposhta"
                name="shippingMethod"
                value="novaposhta"
                checked={true}
                readOnly
              />
              <div className="shipping-method-label">
                <div className="method-name">Novaposhta Delivery</div>
                <div className="method-description">2-3 business days</div>
              </div>
              <div className="shipping-method-price">$8.99</div>
            </div>
          </div>
        </div>
        
        <div className="form-section novaposhta-section">
          <h3>Novaposhta Delivery Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="novaposhtaRegion">Region*</label>
              <select
                id="novaposhtaRegion"
                name="novaposhtaRegion"
                value={formData.novaposhtaRegion}
                onChange={handleChange}
                className={errors.novaposhtaRegion ? 'error' : ''}
                disabled={loading.regions}
              >
                <option value="">Select Region</option>
                {regions.options && Object.entries(regions.options).map(([ref, name]) => (
                  <option key={ref} value={ref}>{name}</option>
                ))}
              </select>
              {loading.regions && <div className="loading-indicator">Loading regions...</div>}
              {errors.novaposhtaRegion && <div className="field-error">{errors.novaposhtaRegion}</div>}
            </div>
          </div>
          
          {formData.novaposhtaRegion && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="novaposhtaCity">City*</label>
                <select
                  id="novaposhtaCity"
                  name="novaposhtaCity"
                  value={formData.novaposhtaCity}
                  onChange={handleChange}
                  className={errors.novaposhtaCity ? 'error' : ''}
                  disabled={loading.cities}
                >
                  <option value="">Select City</option>
                  {cities.options && Object.entries(cities.options).map(([ref, name]) => (
                    <option key={ref} value={ref}>{name}</option>
                  ))}
                </select>
                {loading.cities && <div className="loading-indicator">Loading cities...</div>}
                {errors.novaposhtaCity && <div className="field-error">{errors.novaposhtaCity}</div>}
              </div>
            </div>
          )}
          
          {formData.novaposhtaCity && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="novaposhtaWarehouse">Delivery Point*</label>
                <select
                  id="novaposhtaWarehouse"
                  name="novaposhtaWarehouse"
                  value={formData.novaposhtaWarehouse}
                  onChange={handleChange}
                  className={errors.novaposhtaWarehouse ? 'error' : ''}
                  disabled={loading.warehouses}
                >
                  <option value="">Select Delivery Point</option>
                  {warehouses.options && Object.entries(warehouses.options).map(([ref, name]) => (
                    <option key={ref} value={ref}>{name}</option>
                  ))}
                </select>
                {loading.warehouses && <div className="loading-indicator">Loading delivery points...</div>}
                {errors.novaposhtaWarehouse && <div className="field-error">{errors.novaposhtaWarehouse}</div>}
              </div>
            </div>
          )}
          
          {selectedWarehouseInfo && (
            <div className="warehouse-details">
              <h4>Delivery Point Details</h4>
              <div className="warehouse-info">
                <p><strong>Address:</strong> {selectedWarehouseInfo.ShortAddress}</p>
                <p><strong>Phone:</strong> {selectedWarehouseInfo.Phone}</p>
                <div className="warehouse-schedule">
                  <p><strong>Working Hours:</strong></p>
                  <ul>
                    {Object.entries(selectedWarehouseInfo.Schedule).map(([day, hours]) => (
                      <li key={day}>
                        <span>{day}:</span> <span>{hours === "-" ? "Closed" : hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <div></div> {/* Empty div for spacing */}
          <button type="submit" className="btn primary">Continue to Payment</button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm; 