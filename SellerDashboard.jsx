// SellerDashboard.jsx
import React, { useState } from 'react';

function SellerDashboard() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        stock: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });
            if (response.ok) {
                const data = await response.json();
                setProducts([...products, data]);
                setNewProduct({ name: '', price: '', description: '', stock: '' });
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="seller-dashboard">
            <h1>Seller Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Product Name" 
                    value={newProduct.name} 
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
                <input type="number" placeholder="Price" 
                    value={newProduct.price} 
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                />
                <textarea placeholder="Description"
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                ></textarea>
                <input type="number" placeholder="Stock Quantity" 
                    value={newProduct.stock} 
                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                />
                <button type="submit">Add Product</button>
            </form>
            
            <div className="products-list">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>Price: ${product.price}</p>
                        <p>Stock: {product.stock}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SellerDashboard;